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
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('addAssetForm');

  if (!form) {
    console.error("Form with id 'addAssetForm' not found!");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const assetType = document.getElementById('assetType').value.trim();
    const assetModel = document.getElementById('assetModel').value.trim();
    const assetSerialNumber = document.getElementById('assetSerialNumber').value.trim();
    const purchaseDate = document.getElementById('purchaseDate')?.value.trim() || "";
    const status = "available";

    const randomAssetId = Math.floor(1000 + Math.random() * 9000);

    // ✅ Before adding, show in console
    console.log("Saving asset:", {
      assetId: randomAssetId,
      type: assetType,
      model: assetModel,
      serialNumber: assetSerialNumber,
      purchaseDate: purchaseDate,
      status: status,
      action: "Asset Added",
      date: new Date().toISOString(),
      details: "Initial registration"
    });

    try {
      await addDoc(assetsCollection, {
        assetId: randomAssetId,
        type: assetType,
        model: assetModel,
        serialNumber: assetSerialNumber,
        purchaseDate: purchaseDate,
        status: status,
        action: "Asset Added",
        date: new Date().toISOString(),
        details: "Initial registration"
      });

      alert('Asset added successfully!');
      window.location.reload();
    } catch (error) {
      console.error("Error adding asset:", error);
      alert('Failed to add asset.');
    }
  });
});
