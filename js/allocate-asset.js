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

// Load available assets into dropdown
async function loadAvailableAssets() {
  const assetDropdown = document.getElementById('assetSelect');

  assetDropdown.innerHTML = `<option value="">-- Select an Asset --</option>`;

  try {
    const snapshot = await getDocs(assetsCollection);

    snapshot.forEach(docSnap => {
      const asset = docSnap.data();

      if (asset.status && asset.status.toLowerCase() === 'available') {
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = `${asset.type || 'Unknown'} (${asset.model || 'Model Unknown'})`;
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
}

// Allocate asset when Assign button is clicked
async function allocateAsset() {
  const assetId = document.getElementById('assetSelect').value;

  if (!assetId) {
    alert("Please select an asset to allocate.");
    return;
  }

  try {
    const assetRef = doc(db, "assets", assetId);
    await updateDoc(assetRef, { status: "Allocated" });

    alert("Asset allocated successfully!");
    await loadAvailableAssets();  // Reload dropdown after allocation
  } catch (error) {
    console.error("Error allocating asset:", error);
    alert("Failed to allocate asset.");
  }
}

// On page load
document.addEventListener('DOMContentLoaded', loadAvailableAssets);

// Export allocateAsset globally for button to access
window.allocateAsset = allocateAsset;
