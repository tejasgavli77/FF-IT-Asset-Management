import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.appspot.com",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const assetsCollection = collection(db, "assets");

document.addEventListener('DOMContentLoaded', async function () {
  const assetDropdown = document.getElementById('assetSelect');
  const assignForm = document.getElementById('assignForm'); // Form element
  
  assetDropdown.innerHTML = `<option value="">-- Select an Asset --</option>`;

  try {
    const snapshot = await getDocs(assetsCollection);

    snapshot.forEach(docSnap => {
      const asset = docSnap.data();
      if (asset.status && asset.status.toLowerCase() === 'available') {
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = `${asset.type || "Unknown Type"} (${asset.model || "Unknown Model"})`;
        assetDropdown.appendChild(option);
      }
    });

    if (assetDropdown.options.length === 1) {
      assetDropdown.innerHTML = '<option value="">No available assets</option>';
    }

  } catch (error) {
    console.error("Error fetching assets:", error);
    alert("Failed to load available assets.");
  }

  // ✅ ADD form submit event
  assignForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // ❗ prevent page reload

    const selectedAssetId = assetDropdown.value;

    if (!selectedAssetId) {
      alert("Please select an asset to allocate.");
      return;
    }

    try {
      const assetRef = doc(db, "assets", selectedAssetId);

      // Update the status to Allocated
      await updateDoc(assetRef, {
        status: "Allocated"
      });

      alert("Asset allocated successfully!");

      // Optionally reload the page to refresh dropdown
      window.location.reload();
    } catch (error) {
      console.error("Error allocating asset:", error);
      alert("Failed to allocate asset. Please try again.");
    }
  });

});
