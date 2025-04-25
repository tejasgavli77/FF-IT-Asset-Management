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

    snapshot.forEach(doc => {
      const asset = doc.data();

      rows += `
        <tr>
          <td class="px-4 py-2 border-b">${doc.id}</td>
          <td class="px-4 py-2 border-b">${asset.name || 'No Name'}</td>
          <td class="px-4 py-2 border-b">${asset.type || 'No Type'}</td>
          <td class="px-4 py-2 border-b">${asset.status || 'No Status'}</td>
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

// Delete asset function
async function deleteAsset(assetId) {
  console.log("Delete button clicked for asset ID:", assetId);  // Debugging log

  try {
    const assetRef = doc(db, "assets", assetId);
    await deleteDoc(assetRef);
    console.log(`Asset with ID ${assetId} deleted successfully.`);

    // Reload the assets after deletion
    loadAssets();
  } catch (error) {
    console.error("Error deleting asset: ", error);
  }
}

// Load assets when the page loads
document.addEventListener("DOMContentLoaded", loadAssets);
