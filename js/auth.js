// auth.js

const USERNAME = "Asset Admin";
const PASSWORD = "@dm!nAsseT";

// Run on login page
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (user === USERNAME && pass === PASSWORD) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "asset-inventory.html"; // Redirect after login
  } else {
    document.getElementById("error").classList.remove("hidden");
  }
}

// Run on protected pages
function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}
