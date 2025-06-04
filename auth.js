const USERNAME = "Asset Admin";
const PASSWORD = "@dm!nAsseT";

// Login
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (user === USERNAME && pass === PASSWORD) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "add-asset.html"; // Change if needed
  } else {
    error.classList.remove("hidden");
    error.textContent = "Invalid credentials. Please try again.";
  }
}

// Auth check
function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
  }
}

// Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}
