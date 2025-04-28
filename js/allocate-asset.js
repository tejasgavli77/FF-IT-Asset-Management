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
    showToast("Failed to load available assets.");
  }

  // ✅ ADD form submit event
  assignForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // ❗ prevent page reload

    const selectedAssetId = assetDropdown.value;

    if (!selectedAssetId) {
      showToast("Please select an asset to allocate.");
      return;
    }

    try {
      const assetRef = doc(db, "assets", selectedAssetId);

      // Update the status to Allocated
      await updateDoc(assetRef, {
        status: "Allocated"
      });

      showToast("Asset assigned successfully!");

      // Optionally reload the page to refresh dropdown
      window.location.reload();
    } catch (error) {
      console.error("Error allocating asset:", error);
      showToast("Failed to allocate asset. Please try again.");
    }
  });

});
// Toast function
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `px-4 py-2 rounded shadow-md text-white ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;
  toast.textContent = message;

  const container = document.getElementById("toastContainer");
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000); // Remove after 3 seconds
}
