// Firebase imports
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

  const assetType = document.getElementById('assetType').value;
  const assetModel = document.getElementById('assetModel').value;
  const assetSerialNumber = document.getElementById('assetSerialNumber').value;
  const status = 'available';

  // Generate random 4-digit Asset ID
  const randomAssetId = Math.floor(1000 + Math.random() * 9000);  // random 4-digit number

  try {
    await addDoc(assetsCollection, {
      assetId: randomAssetId,   // ✅ Save random ID
      type: assetType,
      model: assetModel,
      serialNumber: assetSerialNumber,
      status: status
    });

    alert('Asset added successfully!');
    window.location.reload();
  } catch (error) {
    console.error("Error adding asset:", error);
    alert('Failed to add asset.');
  }
});
