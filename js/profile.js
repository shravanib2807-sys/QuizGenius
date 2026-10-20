import { initAuthProtection, updateStudentProfile, logoutStudent, getStudentResults, checkSubscriptionStatus } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuthProtection((student) => {
    // DOM Elements
    const avatarLetter = document.getElementById("avatarLetter");
    const profileNameHeading = document.getElementById("profileNameHeading");
    const profileEmailSubtitle = document.getElementById("profileEmailSubtitle");
    const registeredDateText = document.getElementById("registeredDateText");
    const subStatusBadge = document.getElementById("subStatusBadge");
    const subStatusDescription = document.getElementById("subStatusDescription");
    const subUpgradeBtn = document.getElementById("subUpgradeBtn");
    const profName = document.getElementById("profName");
    const profEmail = document.getElementById("profEmail");
    const profBranch = document.getElementById("profBranch");
    const profileForm = document.getElementById("profileForm");
    const profileMessage = document.getElementById("profileMessage");
    const saveProfBtn = document.getElementById("saveProfBtn");
    const profLogoutBtn = document.getElementById("profLogoutBtn");

    // Subscription & 15-day trial status display
    const sub = checkSubscriptionStatus(student);
    if (subStatusBadge && subStatusDescription) {
      if (sub.status === "active") {
        subStatusBadge.style.background = "#dcfce7";
        subStatusBadge.style.color = "#15803d";
        subStatusBadge.textContent = "Premium Active";
        const endFormatted = new Date(sub.subscriptionEndDate).toLocaleDateString();
        subStatusDescription.textContent = `Your paid subscription is active with unrestricted access until ${endFormatted} (${sub.daysRemaining} days remaining).`;
        if (subUpgradeBtn) subUpgradeBtn.textContent = "Manage Plan →";
      } else if (sub.status === "expired") {
        subStatusBadge.style.background = "#fee2e2";
        subStatusBadge.style.color = "#b91c1c";
        subStatusBadge.textContent = "Trial Expired";
        const endFormatted = sub.subscriptionEndDate ? new Date(sub.subscriptionEndDate).toLocaleDateString() : "recently";
        subStatusDescription.textContent = `Your 15-day free trial concluded on ${endFormatted}. Upgrade to continue accessing GATE and technical assessments.`;
        if (subUpgradeBtn) subUpgradeBtn.textContent = "Upgrade Now →";
      } else {
        subStatusBadge.style.background = "#e0e7ff";
        subStatusBadge.style.color = "#4338ca";
        subStatusBadge.textContent = "15-Day Free Trial";
        const endFormatted = new Date(sub.subscriptionEndDate).toLocaleDateString();
        subStatusDescription.textContent = `Automatic 15-day trial active until ${endFormatted} (${sub.daysRemaining} days remaining). Unrestricted access to all tests.`;
        if (subUpgradeBtn) subUpgradeBtn.textContent = "View Plans →";
      }
    }

    // Metric elements
    const profQuizCount = document.getElementById("profQuizCount");
    const profAptCount = document.getElementById("profAptCount");
    const profAvgScore = document.getElementById("profAvgScore");
    const profHighScore = document.getElementById("profHighScore");

    // Populate data
    const initialLetter = student.name ? student.name.charAt(0).toUpperCase() : "S";
    if (avatarLetter) avatarLetter.textContent = initialLetter;
    if (profileNameHeading) profileNameHeading.textContent = student.name || "Student Profile";
    if (profileEmailSubtitle) profileEmailSubtitle.textContent = student.email || "student@engineering.edu";
    
    if (registeredDateText) {
      const regDate = student.createdAt ? new Date(student.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "September 2026";
      registeredDateText.textContent = regDate;
    }

    if (profName) profName.value = student.name || "";
    if (profEmail) profEmail.value = student.email || "";
    if (profBranch) profBranch.value = student.branch || "Computer Science Engineering";

    // Calculate metrics
    const results = getStudentResults(student.uid);
    const quizzes = results.filter((r) => r.type !== "aptitude");
    const apts = results.filter((r) => r.type === "aptitude");

    let avg = 0;
    let max = 0;
    if (results.length > 0) {
      const sum = results.reduce((acc, r) => acc + (Number(r.percentage) || 0), 0);
      avg = Math.round(sum / results.length);
      max = Math.max(...results.map((r) => Number(r.percentage) || 0));
    }

    if (profQuizCount) profQuizCount.textContent = quizzes.length.toString();
    if (profAptCount) profAptCount.textContent = apts.length.toString();
    if (profAvgScore) profAvgScore.textContent = `${avg}%`;
    if (profHighScore) profHighScore.textContent = `${max}%`;

    // Update profile
    profileForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!profName || !profBranch) return;

      try {
        if (saveProfBtn) {
          saveProfBtn.textContent = "Saving changes...";
          saveProfBtn.disabled = true;
        }

        const updated = await updateStudentProfile(profName.value.trim(), profBranch.value);

        if (profileNameHeading) profileNameHeading.textContent = updated.name;
        if (avatarLetter) avatarLetter.textContent = updated.name.charAt(0).toUpperCase();

        if (profileMessage) {
          profileMessage.style.display = "block";
          profileMessage.style.background = "#dcfce7";
          profileMessage.style.color = "#15803d";
          profileMessage.style.border = "1px solid #86efac";
          profileMessage.textContent = "✓ Profile information and engineering branch updated successfully!";
        }
      } catch (err) {
        if (profileMessage) {
          profileMessage.style.display = "block";
          profileMessage.style.background = "#fee2e2";
          profileMessage.style.color = "#b91c1c";
          profileMessage.style.border = "1px solid #f87171";
          profileMessage.textContent = err.message || "Failed to update profile.";
        }
      } finally {
        if (saveProfBtn) {
          saveProfBtn.textContent = "Save Profile Changes";
          saveProfBtn.disabled = false;
        }
      }
    });

    // Logout handler
    profLogoutBtn?.addEventListener("click", async (e) => {
      e.preventDefault();
      if (profLogoutBtn) {
        profLogoutBtn.textContent = "Signing out...";
        profLogoutBtn.disabled = true;
      }
      await logoutStudent();
    });
  });
});
