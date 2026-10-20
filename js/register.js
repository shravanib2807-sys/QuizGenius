import { registerStudent } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorBox = document.getElementById("errorMessage");
  const submitBtn = document.getElementById("submitBtn");

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  }

  function hideError() {
    if (!errorBox) return;
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const branch = document.getElementById("branch").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation
    if (!fullName) {
      showError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      showError("Please enter a valid email address.");
      return;
    }
    if (!branch) {
      showError("Please select your engineering branch.");
      return;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match. Please verify.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Creating student profile...";

      await registerStudent(fullName, email, password, branch);

      // Save branch preference
      localStorage.setItem("quizgenius_preferred_branch", branch);

      // Smooth redirect
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Registration error:", err);
      showError(err.message || "Failed to create account. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register & Go to Dashboard";
    }
  });
});
