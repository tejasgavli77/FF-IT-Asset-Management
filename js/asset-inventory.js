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

// Load and display assets
async function loadAssets() {
  import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

window.deleteAsset = async function (id) {
  const confirmDelete = confirm("Are you sure you want to delete this asset?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "assets", id));
    alert("Asset deleted successfully!");
    loadAssets(); // Refresh the table
  } catch (error) {
    console.error("Error deleting asset:", error);
    alert("Failed to delete asset.");
  }
};
  const tableBody = document.querySelector("#asset-table tbody");

  try {
    const snapshot = await getDocs(assetsCollection);
    let rows = "";

   snapshot.forEach(doc => {
  const asset = doc.data();

  rows += `
    <tr>
      <td class="px-4 py-2 border-b">${doc.id}</td>
      <td class="px-4 py-2 border-b">${asset.name || asset.type}</td>
      <td class="px-4 py-2 border-b">${asset.type}</td>
      <td class="px-4 py-2 border-b">${asset.status}</td>
      <td class="px-4 py-2 border-b text-center">
        <button onclick="deleteAsset('${doc.id}')" class="text-red-500 hover:text-red-700">
          🗑️
        </button>
      </td>
    </tr>
  `;
});

    tableBody.innerHTML = rows || '<tr><td colspan="5">No assets found.</td></tr>';
  } catch (error) {
    console.error("Error loading assets:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAssets);
