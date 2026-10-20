import {
  initAuthProtection,
  saveTestResult,
  getQuestionHistoryTexts,
  saveQuestionHistory,
  areQuestionsDuplicate,
  enforceQuizAccess
} from "./auth.js";
import { fetchAptitudeQuestions } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuthProtection((student) => {
    // Check 15-day free trial or active subscription status
    const allowed = enforceQuizAccess("Aptitude Test");
    if (!allowed) return;

    // Selection view vs Test view
    const selectionView = document.getElementById("aptitudeSelectionView");
  const testSessionView = document.getElementById("aptitudeTestSession");
  const aptLoading = document.getElementById("aptLoading");
  const aptActiveCard = document.getElementById("aptActiveCard");

  // Test DOM Elements
  const aptSectionBadge = document.getElementById("aptSectionBadge");
  const aptDiffBadge = document.getElementById("aptDiffBadge");
  const aptTimer = document.getElementById("aptTimer");
  const aptCounter = document.getElementById("aptCounter");
  const aptPercent = document.getElementById("aptPercent");
  const aptBarFill = document.getElementById("aptBarFill");
  const aptTopicTag = document.getElementById("aptTopicTag");
  const aptQuestionText = document.getElementById("aptQuestionText");
  const aptOptionsList = document.getElementById("aptOptionsList");
  const aptExplanationBox = document.getElementById("aptExplanationBox");
  const aptExplanationText = document.getElementById("aptExplanationText");
  const aptFeedbackNotice = document.getElementById("aptFeedbackNotice");
  const aptNextBtn = document.getElementById("aptNextBtn");

  // Tab buttons
  const tabBtns = document.querySelectorAll(".apt-tab-btn");
  const catCards = document.querySelectorAll(".cat-card");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const targetSec = btn.getAttribute("data-section");

      catCards.forEach((card) => {
        if (targetSec === "All" || card.getAttribute("data-cat") === targetSec) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // State
  let questions = [];
  let currentIndex = 0;
  let timeSeconds = 0;
  let timerInterval = null;
  let userAnswers = [];
  let activeSectionName = "Quantitative Aptitude";
  let activeDifficulty = "Medium";

  let currentSessionId = "";

  // Global trigger
  window.startAptitude = async (section, diffSelectId) => {
    activeSectionName = section;
    const sel = document.getElementById(diffSelectId);
    activeDifficulty = sel ? sel.value : "Medium";
    currentSessionId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `apt_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (selectionView) selectionView.style.display = "none";
    if (testSessionView) testSessionView.style.display = "block";
    if (aptLoading) aptLoading.style.display = "block";
    if (aptActiveCard) aptActiveCard.style.display = "none";

    if (aptSectionBadge) aptSectionBadge.textContent = section;
    if (aptDiffBadge) aptDiffBadge.textContent = activeDifficulty;

    // Safely shuffle options while keeping correctIndex 100% synchronized with the correct answer
    function shuffleQuestionOptions(q) {
      if (!q || !Array.isArray(q.options) || q.options.length !== 4) return q;
      const originalOptions = [...q.options];
      const origIndex = typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0;
      const correctText = originalOptions[origIndex];

      const hasPositional = originalOptions.some((opt) =>
        /all of the above|none of the above|both [a-d] and [a-d]/i.test(opt)
      );

      let newOptions;
      if (hasPositional && /all of the above|none of the above/i.test(originalOptions[3])) {
        const top3 = [0, 1, 2];
        for (let i = top3.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [top3[i], top3[j]] = [top3[j], top3[i]];
        }
        newOptions = [originalOptions[top3[0]], originalOptions[top3[1]], originalOptions[top3[2]], originalOptions[3]];
      } else if (!hasPositional) {
        const indices = [0, 1, 2, 3];
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        newOptions = indices.map((i) => originalOptions[i]);
      } else {
        newOptions = [...originalOptions];
      }

      const newCorrectIndex = newOptions.indexOf(correctText);
      return {
        ...q,
        options: newOptions,
        correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : origIndex
      };
    }

    try {
      const studentId = student?.uid || student?.id || "guest";
      const studentBranch = student?.branch || "";
      // Gather previously attempted aptitude questions across all dates to avoid repeats
      const historyTexts = await getQuestionHistoryTexts(studentId, section, activeDifficulty, studentBranch, "aptitude");

      const targetCount = 10;
      let uniqueList = [];
      let fetchAttempts = 0;
      const maxFetchAttempts = 6;

      while (uniqueList.length < targetCount && fetchAttempts < maxFetchAttempts) {
        fetchAttempts++;
        const needed = targetCount - uniqueList.length;
        const currentExclusions = [
          ...historyTexts,
          ...uniqueList.map((u) => u.question)
        ];

        const data = await fetchAptitudeQuestions(
          section,
          "Comprehensive",
          activeDifficulty,
          needed,
          currentExclusions
        );
        const rawQuestions = Array.isArray(data?.questions) ? data.questions : [];

        for (const q of rawQuestions) {
          if (!q || !q.question) continue;

          // Level 2 Check: Compare against previous attempts history
          const isHistoryDup = historyTexts.some((h) => areQuestionsDuplicate(h, q.question));
          if (isHistoryDup) continue;

          // Level 1 Check: Compare against already accepted questions in this test session
          const isBatchDup = uniqueList.some((uq) => areQuestionsDuplicate(uq.question, q.question));
          if (isBatchDup) continue;

          uniqueList.push(shuffleQuestionOptions(q));
          if (uniqueList.length >= targetCount) break;
        }
      }

      questions = uniqueList;

      if (questions.length === 0) {
        throw new Error("Unable to initialize fresh questions. Please click Retry below.");
      }

      if (aptLoading) aptLoading.style.display = "none";
      if (aptActiveCard) aptActiveCard.style.display = "block";

      userAnswers = new Array(questions.length).fill(null);
      timeSeconds = 0;
      if (aptTimer) aptTimer.textContent = "00:00";
      if (timerInterval) clearInterval(timerInterval);

      timerInterval = setInterval(() => {
        timeSeconds++;
        const mins = String(Math.floor(timeSeconds / 60)).padStart(2, "0");
        const secs = String(timeSeconds % 60).padStart(2, "0");
        if (aptTimer) aptTimer.textContent = `${mins}:${secs}`;
      }, 1000);

      renderAptQuestion(0);
    } catch (err) {
      console.error("Aptitude generation error:", err);
      if (aptLoading) {
        aptLoading.innerHTML = `
          <h3 style="color: #ef4444;">Unable to load aptitude questions</h3>
          <p style="color: var(--ink-soft);">${err.message}</p>
          <button onclick="window.startAptitude('${section}', '${diffSelectId}')" class="btn-next" style="display:inline-block; margin-top: 16px;">Retry Loading</button>
        `;
      }
    }
  };

  const aptPrevBtn = document.getElementById("aptPrevBtn");

  function renderAptQuestion(index) {
    currentIndex = index;
    const q = questions[index];
    if (!q) return;

    const currentNum = index + 1;
    const total = questions.length;
    const pct = Math.round((currentNum / total) * 100);

    if (aptCounter) aptCounter.textContent = `Question ${currentNum} of ${total}`;
    if (aptPercent) aptPercent.textContent = `${pct}%`;
    if (aptBarFill) aptBarFill.style.width = `${pct}%`;

    if (aptTopicTag) aptTopicTag.textContent = q.topic || activeSectionName;
    if (aptQuestionText) aptQuestionText.textContent = q.question;

    if (aptPrevBtn) {
      aptPrevBtn.disabled = (currentIndex === 0);
    }
    if (aptNextBtn) {
      aptNextBtn.disabled = false;
      aptNextBtn.textContent = currentNum === total ? "Finish Test & View Analysis →" : "Next Question →";
    }

    const existingAns = userAnswers[index];
    const isAlreadyAnswered = !!(existingAns && existingAns.answered && existingAns.selectedOption !== null && existingAns.selectedOption !== undefined);

    if (isAlreadyAnswered) {
      const isCorrect = existingAns.selectedOption === q.correctIndex;
      if (aptFeedbackNotice) {
        aptFeedbackNotice.textContent = isCorrect ? "✓ Correct Answer!" : "✗ Incorrect Answer";
        aptFeedbackNotice.style.color = isCorrect ? "var(--green)" : "var(--red)";
      }
      if (aptExplanationBox && aptExplanationText) {
        aptExplanationText.textContent = q.explanation || "Step-by-step mathematical reasoning verified.";
        aptExplanationBox.style.display = "block";
      }
    } else {
      if (aptExplanationBox) aptExplanationBox.style.display = "none";
      if (aptFeedbackNotice) aptFeedbackNotice.textContent = "";
    }

    const letters = ["A", "B", "C", "D"];
    if (aptOptionsList) {
      aptOptionsList.innerHTML = q.options.map((opt, optIdx) => {
        let itemClass = "option-item";
        if (isAlreadyAnswered) {
          itemClass += " disabled";
          if (optIdx === existingAns.selectedOption) {
            itemClass += (optIdx === q.correctIndex ? " correct" : " wrong");
          } else if (optIdx === q.correctIndex) {
            itemClass += " correct";
          }
        }
        return `
          <div class="${itemClass}" data-opt-idx="${optIdx}">
            <div class="option-left">
              <span class="option-letter">${letters[optIdx] || optIdx + 1}</span>
              <span class="option-label">${opt}</span>
            </div>
          </div>
        `;
      }).join("");

      const optElements = aptOptionsList.querySelectorAll(".option-item");
      optElements.forEach((el) => {
        el.addEventListener("click", () => handleAptAnswer(el, optElements, q));
      });
    }
  }

  function handleAptAnswer(selectedEl, allOptions, q) {
    if (selectedEl.classList.contains("disabled")) return;
    allOptions.forEach((el) => el.classList.add("disabled"));

    const selectedIdx = parseInt(selectedEl.getAttribute("data-opt-idx") || "0", 10);
    const correctIdx = q.correctIndex;
    const isCorrect = selectedIdx === correctIdx;

    if (isCorrect) {
      selectedEl.classList.add("correct");
      if (aptFeedbackNotice) {
        aptFeedbackNotice.textContent = "✓ Correct Answer!";
        aptFeedbackNotice.style.color = "var(--green)";
      }
    } else {
      selectedEl.classList.add("wrong");
      allOptions.forEach((el) => {
        if (parseInt(el.getAttribute("data-opt-idx") || "-1", 10) === correctIdx) {
          el.classList.add("correct");
        }
      });
      if (aptFeedbackNotice) {
        aptFeedbackNotice.textContent = "✗ Incorrect Answer";
        aptFeedbackNotice.style.color = "var(--red)";
      }
    }

    if (aptExplanationBox && aptExplanationText) {
      aptExplanationText.textContent = q.explanation || "Step-by-step mathematical reasoning verified.";
      aptExplanationBox.style.display = "block";
    }

    userAnswers[currentIndex] = {
      selectedOption: selectedIdx,
      answered: true,
      selectedText: q.options[selectedIdx],
      isCorrect
    };
  }

  // Previous button handler
  aptPrevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      renderAptQuestion(currentIndex - 1);
    }
  });

  // Next / Finish handler
  aptNextBtn?.addEventListener("click", async () => {
    // If student clicks Next without selecting an answer, record as unanswered
    if (!userAnswers[currentIndex]) {
      userAnswers[currentIndex] = {
        selectedOption: null,
        answered: false,
        selectedText: "Unanswered",
        isCorrect: false
      };
    }

    if (currentIndex + 1 < questions.length) {
      renderAptQuestion(currentIndex + 1);
    } else {
      if (timerInterval) clearInterval(timerInterval);
      aptNextBtn.disabled = true;
      aptNextBtn.textContent = "Analyzing performance...";

      let correctAnswers = 0;
      let wrongAnswers = 0;
      let unanswered = 0;

      const finalRecordedAnswers = questions.map((q, idx) => {
        const ans = userAnswers[idx];
        const isAns = !!(ans && ans.answered && ans.selectedOption !== null && ans.selectedOption !== undefined);
        const isCorr = isAns && ans.selectedOption === q.correctIndex;

        if (isCorr) {
          correctAnswers++;
        } else if (isAns) {
          wrongAnswers++;
        } else {
          unanswered++;
        }

        return {
          question: q.question,
          topic: q.topic || activeSectionName,
          selectedOption: isAns ? ans.selectedOption : null,
          selectedText: isAns ? q.options[ans.selectedOption] : "Unanswered",
          correctOption: q.correctIndex,
          correctText: q.options[q.correctIndex],
          isCorrect: isCorr,
          isUnanswered: !isAns,
          explanation: q.explanation
        };
      });

      const totalQuestions = questions.length;
      const score = correctAnswers;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const mins = String(Math.floor(timeSeconds / 60)).padStart(2, "0");
      const secs = String(timeSeconds % 60).padStart(2, "0");
      const timeFormatted = `${mins}:${secs}`;

      const resultPayload = {
        type: "aptitude",
        studentName: student?.name || "Student",
        subject: activeSectionName,
        difficulty: activeDifficulty,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        unanswered,
        score,
        percentage,
        timeTaken: timeFormatted,
        timeTakenSeconds: timeSeconds,
        answers: finalRecordedAnswers
      };

      try {
        await saveTestResult(resultPayload);
        const studentId = student?.uid || student?.id || "guest";
        await saveQuestionHistory({
          userId: studentId,
          quizSessionId: currentSessionId,
          branch: student?.branch || "",
          subject: activeSectionName,
          language: "Aptitude",
          difficulty: activeDifficulty,
          quizType: "aptitude",
          questions
        });
      } catch (e) {
        console.warn("Aptitude save error:", e);
      }

      sessionStorage.setItem("quizgenius_latest_result", JSON.stringify(resultPayload));
      window.location.href = "result.html";
    }
  });
  });
});
