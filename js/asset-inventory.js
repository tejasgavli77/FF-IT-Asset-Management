import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
              <button onclick="confirmReturn('${docSnap.id}')" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">🔁 Return</button>
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

// Return Asset Function
async function returnAsset(assetId) {
  try {
    const assetRef = doc(db, "assets", assetId);
    await updateDoc(assetRef, {
      status: "available"
    });
    showToast("Asset returned successfully!", "success");
    loadAssets(); // Reload assets after returning
  } catch (error) {
    console.error("Error returning asset: ", error);
    showToast("Error returning asset!", "error");
  }
}

// Confirm Return
function confirmReturn(assetId) {
  const confirmation = confirm("Are you sure you want to return this asset?");
  if (confirmation) {
    returnAsset(assetId);
  }
}

// Edit Asset Function
async function editAsset(assetId) {
  const assetRef = doc(db, "assets", assetId);
  const asset = (await getDoc(assetRef)).data();

  // Open a modal or a form for editing
  const newModel = prompt("Edit Model:", asset.model);
  const newSerialNumber = prompt("Edit Serial Number:", asset.serialNumber);
  const newType = prompt("Edit Type:", asset.type);
  const newStatus = prompt("Edit Status:", asset.status);

  if (newModel && newSerialNumber && newType && newStatus) {
    try {
      await updateDoc(assetRef, {
        model: newModel,
        serialNumber: newSerialNumber,
        type: newType,
        status: newStatus
      });
      showToast("Asset edited successfully!", "success");
      loadAssets(); // Reload assets after editing
    } catch (error) {
      console.error("Error editing asset: ", error);
      showToast("Error editing asset!", "error");
    }
  }
}

// View History Function (Example)
function viewHistory(assetId) {
  // Placeholder function - display asset allocation/return history in a modal or popup
  alert(`Viewing history for Asset ID: ${assetId}`);
}

// Delete Asset Function
async function deleteAsset(assetId) {
  try {
    const assetRef = doc(db, "assets", assetId);
    await deleteDoc(assetRef);
    showToast("Asset deleted successfully!", "success");
    loadAssets(); // Reload assets after deletion
  } catch (error) {
    console.error("Error deleting asset: ", error);
    showToast("Error deleting asset!", "error");
  }
}

// Confirm Delete
function confirmDelete(assetId) {
  const confirmation = confirm("Are you sure you want to delete this asset?");
  if (confirmation) {
    deleteAsset(assetId);
  }
}

// Toast Notification (success or error)
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `
    fixed bottom-5 right-5 
    ${type === "success" ? "bg-green-500" : "bg-red-500"} 
    text-white px-4 py-2 rounded shadow-lg animate-fade-in-out z-50
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Fade animation for toast
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out forwards;
}
`;
document.head.appendChild(style);

// Load assets on page load
document.addEventListener("DOMContentLoaded", loadAssets);
