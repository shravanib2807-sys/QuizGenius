import { initAuthProtection, getStudentResults } from "./auth.js";
import { fetchPerformanceAnalysis } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuthProtection(async (student) => {
    // Load result data
    let resultData = null;
    const params = new URLSearchParams(window.location.search);
    const resId = params.get("resId");

    if (resId !== null) {
      const all = getStudentResults(student?.uid);
      const idx = parseInt(resId, 10);
      if (all[idx]) {
        resultData = all[idx];
      }
    }

    if (!resultData) {
      const raw = sessionStorage.getItem("quizgenius_latest_result");
      if (raw) {
        try {
          resultData = JSON.parse(raw);
        } catch (e) {}
      }
    }

    // If still no result found, check the latest from student results
    if (!resultData) {
      const all = getStudentResults(student?.uid);
      if (all.length > 0) {
        resultData = all[0];
      }
    }

    if (!resultData) {
      window.location.href = "dashboard.html";
      return;
    }

    // Populate Scorecard Elements
    const resPercentage = document.getElementById("resPercentage");
    const meterCircle = document.getElementById("meterCircle");
    const resStudent = document.getElementById("resStudent");
    const resSubject = document.getElementById("resSubject");
    const resTotal = document.getElementById("resTotal");
    const resCorrect = document.getElementById("resCorrect");
    const resWrong = document.getElementById("resWrong");
    const resUnanswered = document.getElementById("resUnanswered");
    const resScore = document.getElementById("resScore");
    const resPercentageMetric = document.getElementById("resPercentageMetric");
    const resTime = document.getElementById("resTime");

    const totalQuestions = resultData.totalQuestions || (Array.isArray(resultData.answers) ? resultData.answers.length : 10);
    const correctCount = resultData.correctAnswers ?? resultData.score ?? 0;
    let unansweredCount = resultData.unanswered;

    if (unansweredCount === undefined && Array.isArray(resultData.answers)) {
      unansweredCount = resultData.answers.filter((a) =>
        a.isUnanswered ||
        a.selectedOption === null ||
        a.selectedOption === undefined ||
        a.selectedText === "Unanswered"
      ).length;
    }
    if (unansweredCount === undefined) unansweredCount = 0;

    let wrongCount = resultData.wrongAnswers;
    if (wrongCount === undefined && Array.isArray(resultData.answers)) {
      wrongCount = resultData.answers.filter((a) =>
        !a.isCorrect &&
        !a.isUnanswered &&
        a.selectedOption !== null &&
        a.selectedOption !== undefined &&
        a.selectedText !== "Unanswered"
      ).length;
    }
    if (wrongCount === undefined) {
      wrongCount = Math.max(0, totalQuestions - correctCount - unansweredCount);
    }

    const finalScore = resultData.score ?? correctCount;
    const pct = resultData.percentage ?? Math.round((correctCount / (totalQuestions || 1)) * 100);

    if (resPercentage) resPercentage.textContent = `${pct}%`;
    if (meterCircle) meterCircle.style.setProperty("--pct", `${pct}%`);
    if (resStudent) resStudent.textContent = resultData.studentName || student?.name || "Student";
    if (resSubject) resSubject.textContent = resultData.subject || "Technical Quiz";
    if (resTotal) resTotal.textContent = String(totalQuestions);
    if (resCorrect) resCorrect.textContent = String(correctCount);
    if (resWrong) resWrong.textContent = String(wrongCount);
    if (resUnanswered) resUnanswered.textContent = String(unansweredCount);
    if (resScore) resScore.textContent = String(finalScore);
    if (resPercentageMetric) resPercentageMetric.textContent = `${pct}%`;
    if (resTime) resTime.textContent = resultData.timeTaken || "00:00";

    // Wire buttons
    const tryAgainBtn = document.getElementById("tryAgainBtn");
    const scrollToAnalysisBtn = document.getElementById("scrollToAnalysisBtn");

    tryAgainBtn?.addEventListener("click", () => {
      if (resultData.type === "aptitude") {
        window.location.href = "aptitude.html";
      } else if (resultData.type === "gate") {
        const branchParam = resultData.branch ? `&branch=${encodeURIComponent(resultData.branch)}` : "";
        window.location.href = `gate.html?subject=${encodeURIComponent(resultData.subject || "Data Structures")}&diff=${encodeURIComponent(resultData.difficulty || "Medium")}${branchParam}`;
      } else {
        const branchParam = resultData.branch ? `&branch=${encodeURIComponent(resultData.branch)}` : "";
        window.location.href = `quiz.html?subject=${encodeURIComponent(resultData.subject || "Python")}&diff=${encodeURIComponent(resultData.difficulty || "Medium")}${branchParam}`;
      }
    });

    scrollToAnalysisBtn?.addEventListener("click", () => {
      document.getElementById("analysisCard")?.scrollIntoView({ behavior: "smooth" });
    });

    // Load AI Analysis
    const strongAreasList = document.getElementById("strongAreasList");
    const needsPracticeList = document.getElementById("needsPracticeList");
    const recommendationText = document.getElementById("recommendationText");

    try {
      const analysis = await fetchPerformanceAnalysis({
        studentName: resultData.studentName || student?.name || "Student",
        subject: resultData.subject || "Technical Subject",
        score: finalScore,
        totalQuestions,
        timeTakenSeconds: resultData.timeTakenSeconds || 180,
        answers: resultData.answers || []
      });

      if (strongAreasList) {
        strongAreasList.innerHTML = (analysis.strongAreas || []).map((area) => `<li>${area}</li>`).join("");
      }
      if (needsPracticeList) {
        needsPracticeList.innerHTML = (analysis.needsPractice || []).map((area) => `<li>${area}</li>`).join("");
      }
      if (recommendationText) {
        recommendationText.textContent = analysis.recommendation || `Focus on practice problem sets for ${resultData.subject}.`;
      }
    } catch (err) {
      console.error("Error loading performance analysis:", err);
    }

    // Render Detailed Question Breakdown
    const reviewList = document.getElementById("reviewList");
    if (reviewList && Array.isArray(resultData.answers) && resultData.answers.length > 0) {
      reviewList.innerHTML = resultData.answers.map((ans, idx) => {
        const isUnanswered = ans.isUnanswered ||
          ans.selectedOption === null ||
          ans.selectedOption === undefined ||
          ans.selectedText === "Unanswered";
        const isCorrect = !isUnanswered && !!ans.isCorrect;

        let badgeHtml = "";
        let itemClass = "item-wrong";

        if (isCorrect) {
          badgeHtml = `<span style="color: var(--green);">✓ Correct (+1)</span>`;
          itemClass = "item-correct";
        } else if (isUnanswered) {
          badgeHtml = `<span style="color: #f59e0b;">⚪ Unanswered (0)</span>`;
          itemClass = "item-unanswered";
        } else {
          badgeHtml = `<span style="color: var(--red);">✗ Incorrect (0)</span>`;
          itemClass = "item-wrong";
        }

        const userAnsText = isUnanswered
          ? `<span style="color: #f59e0b; font-weight: 600;">Unanswered (Skipped)</span>`
          : (ans.selectedText || `Option ${(ans.selectedOption || 0) + 1}`);

        return `
          <div class="review-item ${itemClass}">
            <div class="review-q-num">Question ${idx + 1} • ${badgeHtml}</div>
            <div class="review-q-text">${ans.question}</div>
            <div class="review-ans-grid">
              <div class="review-user-ans">
                <strong>Your Answer:</strong> ${userAnsText}
              </div>
              <div class="review-correct-ans">
                <strong>Correct Answer:</strong> ${ans.correctText || (ans.correctOption !== undefined ? `Option ${ans.correctOption + 1}` : "—")}
              </div>
            </div>
            ${ans.explanation ? `<div class="review-exp"><strong>Explanation:</strong> ${ans.explanation}</div>` : ""}
          </div>
        `;
      }).join("");
    } else if (reviewList) {
      reviewList.innerHTML = `<p style="color: var(--ink-soft);">Detailed answer breakdown available for completed interactive sessions.</p>`;
    }
  });
});
