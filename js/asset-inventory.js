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
        showConfirmPopup(assetId);
      });
    });

  } catch (error) {
    console.error("Error loading assets:", error);
    showToast("Error loading assets!", "error");
  }
}

// Show confirm popup
function showConfirmPopup(assetId) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

  // Create modal
  const modal = document.createElement("div");
  modal.className = "bg-white p-6 rounded shadow-lg text-center";
  modal.innerHTML = `
    <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
    <p class="mb-4">Are you sure you want to delete this asset?</p>
    <div class="flex justify-center gap-4">
      <button id="confirmDelete" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Yes</button>
      <button id="cancelDelete" class="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">No</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Handle buttons
  document.getElementById("confirmDelete").addEventListener("click", async () => {
    await deleteAsset(assetId);
    overlay.remove();
  });

  document.getElementById("cancelDelete").addEventListener("click", () => {
    overlay.remove();
  });
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
