import { loginStudent } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorBox = document.getElementById("errorMessage");
  const statusNotice = document.getElementById("statusNotice");
  const submitBtn = document.getElementById("submitBtn");
  const demoFillBtn = document.getElementById("demoFillBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Check URL parameters for logout or status message
  const params = new URLSearchParams(window.location.search);
  if (params.get("msg") === "logged_out") {
    if (statusNotice) {
      statusNotice.textContent = "Logged out successfully.";
      statusNotice.style.display = "block";
    }
  }

  function showError(msg) {
    if (statusNotice) statusNotice.style.display = "none";
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  }

  function hideError() {
    if (!errorBox) return;
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }

  // Pre-fill demo credentials
  demoFillBtn?.addEventListener("click", () => {
    if (emailInput && passwordInput) {
      emailInput.value = "shravani@engineering.edu";
      passwordInput.value = "genius2026";
      hideError();
    }
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
      showError("Please provide both email and password.");
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Authenticating...";
      }

      await loginStudent(email, password);

      // Check for redirect param
      const redirect = params.get("redirect");
      window.location.href = redirect || "dashboard.html";
    } catch (err) {
      console.error("Login error:", err);
      showError(err.message || "Invalid credentials. Please verify and try again.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign In to Dashboard";
      }
    }
  });
});
