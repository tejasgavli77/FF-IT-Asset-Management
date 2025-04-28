import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
            <div class="flex justify-center gap-2">
              <button onclick="editAsset('${docSnap.id}')" class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">✏️ Edit</button>
              <button onclick="viewHistory('${docSnap.id}')" class="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded">📜 View History</button>
              <button onclick="confirmDelete('${docSnap.id}')" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">🗑️ Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows || '<tr><td colspan="6" class="text-center py-4">No assets found.</td></tr>';

  } catch (error) {
    console.error("Error loading assets:", error);
    showToast("Error loading assets!", "error");
  }
}

// Show Edit Asset Popup
function editAsset(assetId) {
  const assetRef = doc(db, "assets", assetId);

  // Fetch asset details
  getDocs(assetRef).then(snapshot => {
    const asset = snapshot.data();

    // Create popup HTML
    const editPopup = document.createElement("div");
    editPopup.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";
    editPopup.innerHTML = `
      <div class="bg-white p-6 rounded shadow-lg text-center">
        <h2 class="text-lg font-semibold mb-4">Edit Asset</h2>
        <form id="editAssetForm">
          <label for="model" class="block mb-2">Model:</label>
          <input type="text" id="model" value="${asset.model || ''}" class="mb-4 p-2 border rounded w-full">

          <label for="serialNumber" class="block mb-2">Serial Number:</label>
          <input type="text" id="serialNumber" value="${asset.serialNumber || ''}" class="mb-4 p-2 border rounded w-full">

          <label for="status" class="block mb-2">Status:</label>
          <input type="text" id="status" value="${asset.status || ''}" class="mb-4 p-2 border rounded w-full">

          <div class="flex justify-center gap-4">
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" id="cancelEdit" class="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(editPopup);

    // Close the popup if Cancel is clicked
    document.getElementById("cancelEdit").addEventListener("click", () => {
      editPopup.remove();
    });

    // Handle Save functionality
    document.getElementById("editAssetForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedData = {
        model: document.getElementById("model").value,
        serialNumber: document.getElementById("serialNumber").value,
        status: document.getElementById("status").value,
      };

      try {
        await updateDoc(assetRef, updatedData);
        showToast("Asset updated successfully!", "success");
        editPopup.remove();
        loadAssets(); // Reload assets after update
      } catch (error) {
        console.error("Error updating asset:", error);
        showToast("Error updating asset!", "error");
      }
    });
  });
}

// View History (Placeholder for now)
function viewHistory(assetId) {
  alert(`Viewing history for asset ID: ${assetId}`);
  // Later you can implement a method to fetch and show the asset history from Firestore
}

// Confirm before deletion
function confirmDelete(assetId) {
  const confirmation = confirm("Are you sure you want to delete this asset?");
  if (confirmation) {
    deleteAsset(assetId);
  }
}

// Delete asset function
async function deleteAsset(assetId) {
  try {
    const assetRef = doc(db, "assets", assetId);
    await deleteDoc(assetRef);
    console.log(`Asset with ID ${assetId} deleted successfully.`);
    showToast("Asset deleted successfully!", "success");
    loadAssets(); // Reload assets after deletion
  } catch (error) {
    console.error("Error deleting asset: ", error);
    showToast("Error deleting asset!", "error");
  }
}

// Toast Notification (success or error)
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `
    fixed bottom-5 right-5 
    ${type === "success"
