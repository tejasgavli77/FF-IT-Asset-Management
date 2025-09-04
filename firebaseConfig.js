// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAj5x6hsWKmy3l0I2j8npj4u2woUXkIEp4",
  authDomain: "asset-inventory-f6b04.firebaseapp.com",
  projectId: "asset-inventory-f6b04",
  storageBucket: "asset-inventory-f6b04.appspot.com",
  messagingSenderId: "988574661528",
  appId: "1:988574661528:web:ec0808edf25cad1ef5c9ed",
  measurementId: "G-JEN1YSKN2L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
