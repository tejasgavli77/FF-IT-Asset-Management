// Hardcoded credentials
const VALID_USERNAME = "Asset Admin";
const VALID_PASSWORD = "@dm!nAsseT";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem("authenticated", "true");
        window.location.href = "add-asset.html"; // default redirect page after login
      } else {
        document.getElementById("error").textContent = "Invalid credentials.";
      }
    });
  }

  // Protect pages
  const protectedPages = ["add-asset.html", "allocate-asset.html", "asset-inventory.html", "user-asset-overview.html"];
  const path = window.location.pathname.split("/").pop();
  if (protectedPages.includes(path)) {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (!isAuthenticated) {
      window.location.href = "login.html";
    }
  }

  // Handle logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("authenticated");
      window.location.href = "login.html";
    });
  }
});
