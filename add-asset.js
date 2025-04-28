import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.appspot.com",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const assetsCollection = collection(db, "assets");

// Handle form submit
document.getElementById('addAssetForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const type = document.getElementById('assetType').value;
  const model = document.getElementById('assetModel').value;
  const serialNumber = document.getElementById('assetSerialNumber').value;
  const status = 'available';

  // Generate random 4-digit Asset ID
  const assetId = Math.floor(1000 + Math.random() * 9000); // between 1000-9999

  try {
    await addDoc(assetsCollection, {
      type,
      model,
      serialNumber,
      status,
      assetId: assetId, // Save the generated Asset ID
      createdAt: new Date()
    });

    alert('Asset added successfully!');
    window.location.reload();
  } catch (error) {
    console.error("Error adding asset:", error);
    alert('Failed to add asset.');
  }
});
