import { getCurrentStudent, checkSubscriptionStatus, activateSubscription, logoutStudent } from "./auth.js";

let selectedPlan = {
  id: "monthly",
  price: 399,
  days: 30
};

document.addEventListener("DOMContentLoaded", () => {
  const current = getCurrentStudent();
  const urlParams = new URLSearchParams(window.location.search);
  const reason = urlParams.get("reason");
  const feature = urlParams.get("feature") || "quizzes";

  const trialEyebrow = document.getElementById("trialEyebrow");
  const pricingHeading = document.getElementById("pricingHeading");
  const pricingSubheading = document.getElementById("pricingSubheading");

  const statusBanner = document.getElementById("statusBanner");
  const statusBadge = document.getElementById("statusBadge");
  const statusTitle = document.getElementById("statusTitle");
  const statusDetails = document.getElementById("statusDetails");

  const paymentModal = document.getElementById("paymentModal");
  const modalPlanTitle = document.getElementById("modalPlanTitle");
  const modalPlanDesc = document.getElementById("modalPlanDesc");
  const confirmPayBtn = document.getElementById("confirmPayBtn");
  const cancelPayBtn = document.getElementById("cancelPayBtn");

  // Check subscription status
  const sub = checkSubscriptionStatus(current);

  // If user came from expired redirect or status is expired
  if (reason === "expired" || sub.status === "expired") {
    if (trialEyebrow) {
      trialEyebrow.textContent = "⚠️ Free Trial Expired";
      trialEyebrow.style.background = "#fee2e2";
      trialEyebrow.style.color = "#b91c1c";
    }
    if (pricingHeading) {
      pricingHeading.textContent = "Your 15-Day Free Trial Has Ended";
    }
    if (pricingSubheading) {
      pricingSubheading.textContent = `Continue learning and practicing with QuizGenius by upgrading your plan. Unlock full GATE quizzes, technical subjects, and campus placement tests.`;
    }

    if (statusBanner) statusBanner.className = "trial-status-banner expired";
    if (statusBadge) {
      statusBadge.className = "status-badge expired";
      statusBadge.textContent = "Trial Expired";
    }
    if (statusTitle) {
      statusTitle.textContent = "Your 15-day free trial has expired";
    }
    if (statusDetails) {
      const endFormatted = sub.subscriptionEndDate ? new Date(sub.subscriptionEndDate).toLocaleDateString() : "recently";
      statusDetails.textContent = `Your complimentary 15-day trial period concluded on ${endFormatted}. Select a plan below to continue practicing.`;
    }
  } else if (sub.status === "active") {
    if (statusBadge) {
      statusBadge.className = "status-badge active";
      statusBadge.textContent = "Premium Active";
    }
    if (statusTitle) {
      statusTitle.textContent = "You have an active QuizGenius Premium membership!";
    }
    if (statusDetails) {
      const endFormatted = new Date(sub.subscriptionEndDate).toLocaleDateString();
      statusDetails.textContent = `Your access is fully unlocked through ${endFormatted} (${sub.daysRemaining} days remaining).`;
    }
  } else if (sub.status === "trial") {
    if (statusBadge) {
      statusBadge.className = "status-badge trial";
      statusBadge.textContent = "15-Day Free Trial";
    }
    if (statusTitle) {
      statusTitle.textContent = `${sub.daysRemaining} Day${sub.daysRemaining === 1 ? "" : "s"} Remaining in Your Free Trial`;
    }
    if (statusDetails) {
      const endFormatted = new Date(sub.subscriptionEndDate).toLocaleDateString();
      statusDetails.textContent = `You currently have full unrestricted access to all GATE, Technical, and Aptitude tests until ${endFormatted}.`;
    }
  }

  // Window expose for plan selection
  window.initiateUpgrade = (planId, price, days) => {
    if (!current) {
      window.location.href = "login.html";
      return;
    }

    selectedPlan = { id: planId, price, days };
    const planNames = {
      monthly: "Monthly Pass (30 Days)",
      semester: "Semester Pass (180 Days)",
      annual: "Annual Engineering Pass (365 Days)"
    };

    if (modalPlanTitle) modalPlanTitle.textContent = `Checkout: ${planNames[planId] || planId}`;
    if (modalPlanDesc) modalPlanDesc.textContent = `Total: ₹${price} for ${days} days of unrestricted QuizGenius access.`;

    if (paymentModal) paymentModal.style.display = "flex";
  };

  // Modal Cancel
  cancelPayBtn?.addEventListener("click", () => {
    if (paymentModal) paymentModal.style.display = "none";
  });

  // Modal Confirm & Payment Integration Hook
  confirmPayBtn?.addEventListener("click", async () => {
    try {
      confirmPayBtn.disabled = true;
      confirmPayBtn.textContent = "Processing payment...";

      // ======================================================================
      // PAYMENT GATEWAY HOOK (Razorpay / Stripe)
      // If window.Razorpay or stripe is loaded, it triggers here.
      // If gateway is not currently configured, the structure completes the
      // subscription activation and persists subscriptionStatus="active" to Firestore.
      // ======================================================================
      if (typeof window.Razorpay !== "undefined") {
        // Future production Razorpay Checkout invocation
        console.log("Razorpay checkout initialized for plan:", selectedPlan);
      }

      // Complete real subscription activation in Firestore and session state
      await activateSubscription(current.uid, selectedPlan.id, selectedPlan.days);

      confirmPayBtn.textContent = "✓ Subscription Activated!";
      setTimeout(() => {
        alert("🎉 Congratulations! Your QuizGenius Premium membership is now active. All quizzes and features have been unlocked.");
        window.location.href = "dashboard.html";
      }, 700);
    } catch (err) {
      console.error("Subscription activation error:", err);
      alert("There was an issue processing your subscription. Please try again.");
      confirmPayBtn.disabled = false;
      confirmPayBtn.textContent = "Proceed to Complete Subscription →";
    }
  });
});
