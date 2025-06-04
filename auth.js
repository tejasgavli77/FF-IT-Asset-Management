import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.appspot.com",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login handler
window.login = function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error");

  let email = "";

  // ✅ Map username to actual Firebase email
  if (username === "Asset Admin") {
    email = "assetadmin@techstrategy.co";
  } else {
    errorDiv.textContent = "Invalid username.";
    errorDiv.style.display = "block";
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "add-asset.html"; // Redirect on success
    })
    .catch((error) => {
      errorDiv.textContent = "Login failed. " + error.message;
      errorDiv.style.display = "block";
    });
};

// Check auth state on all secure pages
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes("login.html");

  if (!user && !isLoginPage) {
    window.location.href = "login.html";
  }

  if (user && isLoginPage) {
    window.location.href = "add-asset.html";
  }
});

// Logout handler (optional, use in other pages)
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};
