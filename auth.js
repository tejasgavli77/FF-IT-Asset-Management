// auth.js
import { auth } from "./firebaseConfig.js";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ✅ Login
window.login = function () {
  const email = document.getElementById("username").value.trim(); // direct email
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("error");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "add-asset.html"; // redirect after login
    })
    .catch((error) => {
      console.error("Login failed:", error);
      errorDiv.textContent = "Login failed: " + error.message;
      errorDiv.classList.remove("hidden");
    });
};

// ✅ Protect all pages except login
onAuthStateChanged(auth, (user) => {
  const isLoginPage = window.location.pathname.endsWith("login.html");
  if (!user && !isLoginPage) {
    window.location.href = "login.html";
  }
});

// ✅ Logout
window.logout = function () {
  signOut(auth)
    .then(() => (window.location.href = "login.html"))
    .catch((error) => console.error("Logout failed:", error));
};

// ✅ Auto logout on inactivity (30 minutes)
let lastActivityTime = Date.now();
const maxInactivity = 30 * 60 * 1000; // 30 mins

function resetInactivityTimer() {
  lastActivityTime = Date.now();
}
['mousemove','keydown','click','scroll','touchstart'].forEach(evt =>
  window.addEventListener(evt, resetInactivityTimer)
);

setInterval(() => {
  if (auth.currentUser && Date.now() - lastActivityTime > maxInactivity) {
    console.log("Logging out due to inactivity...");
    signOut(auth).then(() => (window.location.href = "login.html"));
  }
}, 60 * 1000);
