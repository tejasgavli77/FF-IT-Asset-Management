// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  databaseURL: "https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.firebasestorage.app",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);
const assetsCollection = collection(db, "assets");

export { db, assetsCollection };
