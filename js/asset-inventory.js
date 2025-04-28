import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
  const tableBody = document.querySelector("#asset-table tbody");

  try {
    const snapshot = await getDocs(assetsCollection);
    let rows = "";

    snapshot.forEach(docSnap => {
      const asset = docSnap.data();

      rows += `
        <tr>
          <td class="px-4 py-2 border-b">${docSnap.id}</td>
          <td class="px-4 py-2 border-b">${asset.type || 'N/A'}</td>
          <td class="px-4 py-2 border-b">${asset.model || 'N/A'}</td>
          <td class="px-4 py-2 border-b">${asset.serialNumber || 'N/A'}</td>
          <td class="px-4 py-2 border-b">${asset.status || 'N/A'}</td>
          <td class="px-4 py-2 border-b text-center">
            <button class="delete-btn text-red-500 hover:text-red-700" data-id="${docSnap.id}">
              🗑️
            </button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows || '<tr><td colspan="6" class="text-center py-4">No assets found.</td></tr>';

    // Bind delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const assetId = event.target.getAttribute("data-id");
        deleteAsset(assetId);
      });
    });

  } catch (error) {
    console.error("Error loading assets:", error);
  }
}

// Delete asset function
async function deleteAsset(assetId) {
  try {
    const assetRef = doc(db, "assets", assetId);
    await deleteDoc(assetRef);
    console.log(`Asset with ID ${assetId} deleted successfully.`);
    loadAssets(); // Reload assets after deletion
  } catch (error) {
    console.error("Error deleting asset: ", error);
  }
}

// Load assets when page loads
document.addEventListener("DOMContentLoaded", loadAssets);
