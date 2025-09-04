// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAj5x6hsWKmy3l0I2j8npj4u2woUXkIEp4",
  authDomain: "asset-inventory-f6b04.firebaseapp.com",
  projectId: "asset-inventory-f6b04",
  storageBucket: "asset-inventory-f6b04.firebasestorage.app",
  messagingSenderId: "988574661528",
  appId: "1:988574661528:web:ec0808edf25cad1ef5c9ed",
  measurementId: "G-JEN1YSKN2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

window.login = function () {
  const usernameInput = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("error");

  // Map username to Firebase email
  const email = usernameInput.toLowerCase() === "asset admin" ? "it@finalfunnel.com" : usernameInput;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "add-asset.html"; // Redirect to main page after login
    })
    .catch((error) => {
      console.error("Login failed:", error);
      errorDiv.textContent = "Login failed: " + error.message;
      errorDiv.classList.remove("hidden");
    });
};

// 🔐 Protect all pages (except login.html)
onAuthStateChanged(auth, (user) => {
  const isLoginPage = window.location.pathname.endsWith("login.html");
  if (!user && !isLoginPage) {
    window.location.href = "login.html";
  }
});

// 🚪 Global logout function (to be called on logout button click)
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
};

/* ===============================
   🕒 Auto Logout After Inactivity
   =============================== */
let lastActivityTime = Date.now();

/* const maxInactivity = 1 * 60 * 1000; // 1 minute */

 const maxInactivity = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
  lastActivityTime = Date.now();
}

// Track user activity
['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => {
  window.addEventListener(event, resetInactivityTimer);
});

// Check every minute
setInterval(() => {
  if (auth.currentUser && (Date.now() - lastActivityTime > maxInactivity)) {
    console.log("Logging out due to inactivity...");
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  }
}, 60 * 1000);

