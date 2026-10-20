import { initAuthProtection, logoutStudent, getStudentResults, checkSubscriptionStatus } from "./auth.js";
import { fetchBranchRecommendations } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuthProtection(async (student) => {
    // Setup UI elements
    const welcomeGreeting = document.getElementById("welcomeGreeting");
    const studentBranchDisplay = document.getElementById("studentBranchDisplay");
    const subBranchLabel = document.getElementById("subBranchLabel");
    const learningRecommendation = document.getElementById("learningRecommendation");
    const navStudentName = document.getElementById("navStudentName");
    const trialStatusChip = document.getElementById("trialStatusChip");
    const logoutBtn = document.getElementById("logoutBtn");
    const recommendedContainer = document.getElementById("recommendedContainer");

    // Check subscription / 15-day trial status
    const sub = checkSubscriptionStatus(student);
    if (trialStatusChip) {
      if (sub.status === "active") {
        trialStatusChip.style.background = "#dcfce7";
        trialStatusChip.style.color = "#15803d";
        trialStatusChip.textContent = "Premium Active";
      } else if (sub.status === "expired") {
        trialStatusChip.style.background = "#fee2e2";
        trialStatusChip.style.color = "#b91c1c";
        trialStatusChip.textContent = "Trial Expired — Upgrade";
      } else {
        trialStatusChip.style.background = "#e0e7ff";
        trialStatusChip.style.color = "#4338ca";
        trialStatusChip.textContent = `${sub.daysRemaining}d Trial Left`;
      }
    }

    // Stats elements
    const statQuizCount = document.getElementById("statQuizCount");
    const statAptCount = document.getElementById("statAptCount");
    const statAvgScore = document.getElementById("statAvgScore");
    const statBestScore = document.getElementById("statBestScore");
    const activityTableBody = document.getElementById("activityTableBody");

    // Populate student details
    const firstName = student.name ? student.name.split(" ")[0] : "Student";
    if (welcomeGreeting) welcomeGreeting.textContent = `Welcome, ${student.name || "Student"}`;
    if (navStudentName) navStudentName.textContent = firstName;
    if (studentBranchDisplay) studentBranchDisplay.textContent = student.branch || "Computer Science Engineering";
    if (subBranchLabel) subBranchLabel.textContent = student.branch || "your branch";

    // Proper Logout handler: clears Firebase Auth, session, and redirects to login.html
    logoutBtn?.addEventListener("click", async (e) => {
      e.preventDefault();
      if (logoutBtn) {
        logoutBtn.textContent = "Signing out...";
        logoutBtn.disabled = true;
      }
      await logoutStudent();
    });

    // Fetch AI branch recommendations
    try {
      const recs = await fetchBranchRecommendations(student.branch);
      if (learningRecommendation && recs.learningPath) {
        learningRecommendation.textContent = recs.learningPath;
      }

      const primarySubject = (recs.recommendedLanguages && recs.recommendedLanguages[0]) || (recs.recommendedSubjects && recs.recommendedSubjects[0]) || "Python";
      const dailyQuizBannerBtn = document.getElementById("dailyQuizBannerBtn");
      if (dailyQuizBannerBtn) {
        dailyQuizBannerBtn.href = `quiz.html?subject=${encodeURIComponent(primarySubject)}&diff=Medium&branch=${encodeURIComponent(student.branch || "")}&daily=true`;
        dailyQuizBannerBtn.innerHTML = `<span>📅</span> Take Today's Daily Quiz (${primarySubject}) →`;
      }

      if (recommendedContainer) {
        const items = [...(recs.recommendedLanguages || []), ...(recs.recommendedSubjects || [])];
        recommendedContainer.innerHTML = items.map((item, idx) => `
          <div class="lang-chip-card" onclick="window.location.href='quiz.html?subject=${encodeURIComponent(item)}&diff=Medium&branch=${encodeURIComponent(student.branch || "")}'">
            <div class="lang-chip-top">
              <span class="lang-name">${item}</span>
              <span class="lang-badge">${idx < (recs.recommendedLanguages || []).length ? "Language / Tool" : "Core Subject"}</span>
            </div>
            <div class="lang-meta">
              <span>10 MCQs</span>
              <span style="color: var(--blue); font-weight: 700;">Start Quiz →</span>
            </div>
          </div>
        `).join("");
      }
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    }

    // Load progress metrics and recent activity
    const results = getStudentResults(student.uid);
    const quizResults = results.filter((r) => r.type !== "aptitude");
    const aptResults = results.filter((r) => r.type === "aptitude");

    const totalTests = results.length;
    let avgPercentage = 0;
    let maxScore = 0;

    if (totalTests > 0) {
      const sumPct = results.reduce((acc, r) => acc + (Number(r.percentage) || 0), 0);
      avgPercentage = Math.round(sumPct / totalTests);
      maxScore = Math.max(...results.map((r) => Number(r.percentage) || 0));
    }

    if (statQuizCount) statQuizCount.textContent = quizResults.length.toString();
    if (statAptCount) statAptCount.textContent = aptResults.length.toString();
    if (statAvgScore) statAvgScore.textContent = `${avgPercentage}%`;
    if (statBestScore) statBestScore.textContent = `${maxScore}%`;

    // Render recent activity table
    if (activityTableBody) {
      if (results.length === 0) {
        activityTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 32px; color: var(--ink-soft);">
              No tests attempted yet. Take your first <a href="language.html" style="color: var(--purple-deep); font-weight: 600;">Technical Quiz</a> or <a href="aptitude.html" style="color: var(--teal); font-weight: 600;">Aptitude Test</a> to view analytics!
            </td>
          </tr>
        `;
      } else {
        activityTableBody.innerHTML = results.slice(0, 8).map((res, i) => {
          const isApt = res.type === "aptitude";
          const isGate = res.type === "gate";
          const typeLabel = isGate ? "GATE CSE" : isApt ? "Aptitude" : "Technical";
          const badgeClass = isGate ? "badge-quiz" : isApt ? "badge-aptitude" : "badge-quiz";
          const badgeStyle = isGate ? `style="background: #efeafb; color: var(--purple-deep);"` : "";
          const dateStr = res.createdAt ? new Date(res.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent";
          return `
            <tr>
              <td><span class="activity-badge ${badgeClass}" ${badgeStyle}>${typeLabel}</span></td>
              <td><strong>${res.subject || res.topic || "Quiz"}</strong> <span style="font-size: 12px; color: var(--ink-soft);">(${res.difficulty || "Medium"})</span></td>
              <td>${res.score} / ${res.totalQuestions}</td>
              <td><strong style="color: ${res.percentage >= 70 ? "var(--teal)" : res.percentage >= 40 ? "var(--amber)" : "var(--rose)"}">${res.percentage}%</strong></td>
              <td style="font-size: 13px; color: var(--ink-soft);">${dateStr}</td>
              <td><a href="result.html?resId=${i}" style="color: var(--purple-deep); font-weight: 600; font-size: 13.5px;">View Analysis →</a></td>
            </tr>
          `;
        }).join("");
      }
    }
  });
});
