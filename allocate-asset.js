import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

  assetDropdown.innerHTML = `<option value="">-- Select an Asset --</option>`;

  try {
    const snapshot = await getDocs(assetsCollection);

    snapshot.forEach(doc => {
      const asset = doc.data();

      if (asset.status && asset.status.toLowerCase() === 'available') {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${asset.name || asset.type} (${asset.model || 'Model Unknown'})`;
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
});
