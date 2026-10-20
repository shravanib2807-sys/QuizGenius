import {
  initAuthProtection,
  saveTestResult,
  getDailyQuiz,
  saveDailyQuiz,
  getQuestionHistory,
  getQuestionHistoryTexts,
  saveQuestionHistory,
  areQuestionsDuplicate,
  enforceQuizAccess
} from "./auth.js";
import { fetchQuizQuestions } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuthProtection(async (student) => {
    // Check 15-day free trial or active subscription status
    const allowed = enforceQuizAccess("Technical Quiz");
    if (!allowed) return;

    // Unique session ID for every new quiz attempt (Requirement 4)
    const quizSessionId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // URL parameters
    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject") || "Python";
    const rawDiff = params.get("diff") || "Medium";
    // Normalize difficulty to Easy | Medium | Hard
    const difficulty =
      rawDiff.toLowerCase() === "easy" ? "Easy" :
      rawDiff.toLowerCase() === "hard" ? "Hard" : "Medium";
    const count = parseInt(params.get("count") || "10", 10);
    const isDaily = params.get("daily") === "true" || params.get("mode") === "daily";
    const todayDate = new Date().toISOString().split("T")[0];

    // DOM elements
    const loadingScreen = document.getElementById("loadingScreen");
    const quizCard = document.getElementById("quizCard");
    const quizSubjectBadge = document.getElementById("quizSubjectBadge");
    const quizDiffBadge = document.getElementById("quizDiffBadge");
    const timerDisplay = document.getElementById("timerDisplay");
    const questionCounter = document.getElementById("questionCounter");
    const progressPercent = document.getElementById("progressPercent");
    const progressBarFill = document.getElementById("progressBarFill");
    const topicTag = document.getElementById("topicTag");
    const questionText = document.getElementById("questionText");
    const optionsList = document.getElementById("optionsList");
    const explanationBox = document.getElementById("explanationBox");
    const explanationText = document.getElementById("explanationText");
    const feedbackNotice = document.getElementById("feedbackNotice");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const exitQuizBtn = document.getElementById("exitQuizBtn");

    // Exit Modal elements
    const exitConfirmModal = document.getElementById("exitConfirmModal");
    const cancelExitBtn = document.getElementById("cancelExitBtn");
    const confirmExitBtn = document.getElementById("confirmExitBtn");

    // Update header badges
    if (quizSubjectBadge) {
      quizSubjectBadge.textContent = isDaily ? `📅 Daily: ${subject}` : subject;
    }
    if (quizDiffBadge) {
      quizDiffBadge.textContent = difficulty;
    }

    // State
    let questions = [];
    let currentIndex = 0;
    let timeSeconds = 0;
    let timerInterval = null;
    let isTimerRunning = false;
    let userAnswers = [];

    // Timer helpers
    function startTimer() {
      if (isTimerRunning) return;
      isTimerRunning = true;
      timerInterval = setInterval(() => {
        timeSeconds++;
        const mins = String(Math.floor(timeSeconds / 60)).padStart(2, "0");
        const secs = String(timeSeconds % 60).padStart(2, "0");
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
      }, 1000);
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      isTimerRunning = false;
    }

    // Exit confirmation logic
    exitQuizBtn?.addEventListener("click", () => {
      // Pause timer when confirmation dialog opens
      stopTimer();

      if (exitConfirmModal) {
        exitConfirmModal.style.display = "flex";
      } else {
        // Fallback standard browser confirm
        const confirmed = window.confirm("Are you sure you want to exit the quiz? Your current progress will be lost.");
        if (confirmed) {
          // Do NOT save progress
          window.location.href = "dashboard.html";
        } else {
          // Resume timer
          startTimer();
        }
      }
    });

    cancelExitBtn?.addEventListener("click", () => {
      // Hide modal and resume timer
      if (exitConfirmModal) exitConfirmModal.style.display = "none";
      startTimer();
    });

    confirmExitBtn?.addEventListener("click", () => {
      // User explicitly confirmed exit: discard state without saving
      stopTimer();
      if (exitConfirmModal) exitConfirmModal.style.display = "none";
      window.location.href = "dashboard.html";
    });

    // Validate a question candidate
    function isValidQuestion(q) {
      if (!q || typeof q.question !== "string" || !q.question.trim()) return false;
      if (!Array.isArray(q.options) || q.options.length !== 4) return false;
      const allNonEmpty = q.options.every((opt) => typeof opt === "string" && opt.trim().length > 0);
      if (!allNonEmpty) return false;
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) return false;
      return true;
    }

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

    // Load Quiz Questions (AI Generation with Two-Level History Avoidance)
    try {
      const studentId = student?.uid || student?.id || "guest";
      const studentBranch = params.get("branch") || student?.branch || "Computer Science Engineering";

      // Fetch history of previous questions for this student (never reset by date)
      const historyTexts = await getQuestionHistoryTexts(studentId, subject, difficulty, studentBranch, "technical");

      const targetCount = count;
      let validQuestions = [];
      let fetchRounds = 0;
      const maxFetchRounds = 6;
      let totalDuplicatesRemoved = 0;
      let lastApiResponse = null;
      let lastRawQuestions = [];

      // DEBUG LOGS 1 to 4 & 8
      console.log("=== QuizGenius Technical Quiz Flow Debug Trace ===");
      console.log("1. selected subject:", subject);
      console.log("2. selected branch:", studentBranch);
      console.log("3. selected difficulty:", difficulty);
      console.log("4. requested question count:", targetCount);
      console.log("8. previous history count:", historyTexts.length);

      while (validQuestions.length < targetCount && fetchRounds < maxFetchRounds) {
        fetchRounds++;
        const needed = targetCount - validQuestions.length;
        const currentExclusions = [
          ...historyTexts,
          ...validQuestions.map((v) => v.question)
        ];

        // Fetch questions from AI / backend service, informing it of prior questions
        const data = await fetchQuizQuestions(subject, difficulty, needed, currentExclusions, studentBranch);
        lastApiResponse = data;
        const rawQuestions = Array.isArray(data?.questions) ? data.questions : [];
        lastRawQuestions = rawQuestions;

        // LEVEL 1 & LEVEL 2 DUPLICATE PROTECTION:
        // Level 1: Inside current quiz (every question unique, no near-identical duplicates)
        // Level 2: Across previous attempts (no question previously attempted by this student)
        for (const q of rawQuestions) {
          if (!isValidQuestion(q)) continue;

          // BUG 1 FIX: Strictly enforce selected difficulty (Easy -> Easy, Medium -> Medium, Hard -> Hard)
          if (q.difficulty && q.difficulty.toLowerCase().trim() !== difficulty.toLowerCase().trim()) {
            continue;
          }

          // Level 2 Check: Compare against previous attempts history
          const isHistoryDup = historyTexts.some((h) => areQuestionsDuplicate(h, q.question));
          if (isHistoryDup) {
            totalDuplicatesRemoved++;
            continue;
          }

          // Level 1 Check: Compare against already accepted questions in this current quiz session
          const isBatchDup = validQuestions.some((vq) => areQuestionsDuplicate(vq.question, q.question));
          if (isBatchDup) {
            totalDuplicatesRemoved++;
            continue;
          }

          // BUG 2 FIX: Shuffle options to prevent option A bias while keeping correct answer 100% accurate
          const processedQ = shuffleQuestionOptions({
            ...q,
            difficulty // guarantee preserved difficulty
          });
          validQuestions.push(processedQ);
          if (validQuestions.length >= targetCount) break;
        }
      }

      // DEBUG LOGS 5, 6, 7, 9, 10
      console.log("5. API request result:", lastApiResponse);
      console.log("6. raw AI response:", lastRawQuestions);
      console.log("7. parsed questions count:", lastRawQuestions.length);
      console.log("9. duplicate questions removed:", totalDuplicatesRemoved);
      console.log("10. final questions count:", validQuestions.length);
      console.log("==================================================");

      questions = validQuestions;
      userAnswers = new Array(questions.length).fill(null);

      if (questions.length === 0) {
        throw new Error(`Unable to load valid questions for ${subject} (${difficulty}). Please retry.`);
      }

      // Hide loader, show quiz card
      if (loadingScreen) loadingScreen.style.display = "none";
      if (quizCard) quizCard.style.display = "block";

      // Start fresh timer from 0
      timeSeconds = 0;
      if (timerDisplay) timerDisplay.textContent = "00:00";
      startTimer();

      // Render initial question
      renderQuestion(0);
    } catch (err) {
      console.error("Quiz load error:", err);
      stopTimer();
      if (loadingScreen) {
        loadingScreen.innerHTML = `
          <h3 style="color: #ef4444;">Unable to load questions</h3>
          <p style="color: var(--ink-soft); margin-bottom: 20px;">${err.message || "Please check your connection and try again."}</p>
          <button onclick="window.location.reload()" class="btn-next" style="display:inline-block; margin: 0 auto;">Retry</button>
        `;
      }
      return;
    }

    // Render question
    function renderQuestion(index) {
      currentIndex = index;
      const q = questions[index];
      if (!q) return;

      // Update progress tracker
      const currentNum = index + 1;
      const total = questions.length;
      const pct = Math.round((currentNum / total) * 100);

      if (questionCounter) questionCounter.textContent = `Question ${currentNum} of ${total}`;
      if (progressPercent) progressPercent.textContent = `${pct}%`;
      if (progressBarFill) progressBarFill.style.width = `${pct}%`;

      // Question content
      if (topicTag) topicTag.textContent = q.topic || subject;
      if (questionText) questionText.textContent = q.question;

      // Update Previous & Next buttons
      if (prevBtn) {
        prevBtn.disabled = (currentIndex === 0);
      }
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = currentNum === total ? "Finish Quiz & View Results →" : "Next Question →";
      }

      const existingAns = userAnswers[index];
      const isAlreadyAnswered = !!(existingAns && existingAns.answered && existingAns.selectedOption !== null && existingAns.selectedOption !== undefined);

      // Feedback & Explanation box state
      if (isAlreadyAnswered) {
        const isCorrect = existingAns.selectedOption === q.correctIndex;
        if (feedbackNotice) {
          feedbackNotice.textContent = isCorrect ? "✓ Correct Answer!" : "✗ Incorrect Answer";
          feedbackNotice.style.color = isCorrect ? "var(--green)" : "var(--red)";
        }
        if (explanationBox && explanationText) {
          explanationText.textContent = q.explanation || `Verified explanation for ${subject}.`;
          explanationBox.style.display = "block";
        }
      } else {
        if (explanationBox) explanationBox.style.display = "none";
        if (feedbackNotice) feedbackNotice.textContent = "";
      }

      // Render options
      const letters = ["A", "B", "C", "D"];
      if (optionsList) {
        optionsList.innerHTML = q.options.map((opt, optIdx) => {
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
              <span class="opt-status-icon"></span>
            </div>
          `;
        }).join("");

        // Bind click handlers only if not already answered
        const optElements = optionsList.querySelectorAll(".option-item");
        optElements.forEach((el) => {
          el.addEventListener("click", () => handleSelectOption(el, optElements, q));
        });
      }
    }

    // Handle student answer selection
    function handleSelectOption(selectedEl, allOptions, q) {
      if (selectedEl.classList.contains("disabled")) return;

      // Disable all options
      allOptions.forEach((el) => el.classList.add("disabled"));

      const selectedIdx = parseInt(selectedEl.getAttribute("data-opt-idx") || "0", 10);
      const correctIdx = q.correctIndex;
      const isCorrect = selectedIdx === correctIdx;

      // Visual feedback
      if (isCorrect) {
        selectedEl.classList.add("correct");
        if (feedbackNotice) {
          feedbackNotice.textContent = "✓ Correct Answer!";
          feedbackNotice.style.color = "var(--green)";
        }
      } else {
        selectedEl.classList.add("wrong");
        allOptions.forEach((el) => {
          if (parseInt(el.getAttribute("data-opt-idx") || "-1", 10) === correctIdx) {
            el.classList.add("correct");
          }
        });
        if (feedbackNotice) {
          feedbackNotice.textContent = "✗ Incorrect Answer";
          feedbackNotice.style.color = "var(--red)";
        }
      }

      // Show educational explanation
      if (explanationBox && explanationText) {
        explanationText.textContent = q.explanation || `Verified explanation for ${subject}.`;
        explanationBox.style.display = "block";
      }

      // Record answer stably at current question index
      userAnswers[currentIndex] = {
        selectedOption: selectedIdx,
        answered: true,
        selectedText: q.options[selectedIdx],
        isCorrect
      };
    }

    // Previous Question handler
    prevBtn?.addEventListener("click", () => {
      if (currentIndex > 0) {
        renderQuestion(currentIndex - 1);
      }
    });

    // Next Question / Finish handler
    nextBtn?.addEventListener("click", async () => {
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
        renderQuestion(currentIndex + 1);
      } else {
        // Quiz Finished! Stop timer immediately
        stopTimer();
        nextBtn.disabled = true;
        nextBtn.textContent = "Calculating final results...";

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
            topic: q.topic || subject,
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
          type: "quiz",
          studentName: student?.name || "Student",
          subject,
          difficulty,
          isDaily,
          date: todayDate,
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

        // ONLY save results and question history upon completion
        try {
          const studentId = student?.uid || student?.id || "guest";
          await saveTestResult(resultPayload);
          // Append completed questions to student history so future tests won't duplicate them
          await saveQuestionHistory({
            userId: studentId,
            quizSessionId,
            branch: studentBranch,
            subject,
            language: subject,
            difficulty,
            quizType: "technical",
            questions
          });
        } catch (err) {
          console.warn("Result save error:", err);
        }

        // Store in session for immediate Result view
        sessionStorage.setItem("quizgenius_latest_result", JSON.stringify(resultPayload));
        window.location.href = "result.html";
      }
    });
  });
});
