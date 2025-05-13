// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let allAssets = []; // store all assets for filtering

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.appspot.com",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const assetsCollection = collection(db, "assets");

// Load assets into inventory table
async function loadAssets() {
  const snapshot = await getDocs(assetsCollection);
  allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderTable(allAssets); // Initial render

  // Attach filter and reset listeners
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const resetBtn = document.getElementById("resetFilters");

  if (searchInput && statusFilter && resetBtn) {
    searchInput.addEventListener("input", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "";
      renderTable(allAssets);
    });
  }
}

// Apply search and status filter
function applyFilters() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("statusFilter").value.toLowerCase();

  const filtered = allAssets.filter(asset => {
    const matchesSearch =
      asset.assetId?.toLowerCase().includes(searchTerm) ||
      asset.model?.toLowerCase().includes(searchTerm);
    const matchesStatus = !status || asset.status?.toLowerCase() === status;

    return matchesSearch && matchesStatus;
  });

  renderTable(filtered);
}

// Render assets to the table
function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach((asset, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="border px-4 py-2">${index + 1}</td> <!-- ✅ Serial number -->
      <td class="border px-4 py-2">${asset.assetId || "N/A"}</td>
      <td class="border px-4 py-2">${asset.type || "N/A"}</td>
      <td class="border px-4 py-2">${asset.model || "N/A"}</td>
      <td class="border px-4 py-2">${asset.serialNumber || "N/A"}</td>
      <td class="border px-4 py-2">${asset.AllocatedTo || "-"}</td>
      <td class="border px-4 py-2">${asset.allocationDate || "-"}</td>
      <td class="border px-4 py-2">${asset.purchaseDate || "N/A"}</td>
      <td class="border px-4 py-2">
        <span class="px-2 py-1 rounded text-white ${
          asset.status?.toLowerCase() === "Available".toLowerCase()
            ? "bg-green-500"
            : "bg-red-500"
        }">${asset.status || "N/A"}</span>
      </td>
      <td class="border px-4 py-2 space-x-2 text-center">
        <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${asset.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
        <button class="allocate-btn text-green-500 hover:text-green-700" data-id="${asset.id}" title="Allocate"><i class="bi bi-arrow-left-right"></i></button>
        <button class="return-btn text-yellow-500 hover:text-yellow-700" data-id="${asset.id}" title="Return"><i class="bi bi-arrow-counterclockwise"></i></button>
        <button class="delete-btn text-red-500 hover:text-red-700" data-id="${asset.id}" title="Delete"><i class="bi bi-trash"></i></button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  bindEvents(); // ✅ This ensures all existing buttons still work
}


// Delete Asset
async function confirmDelete(assetId) {
  if (confirm("Are you sure you want to delete this asset?")) {
    await deleteDoc(doc(db, "assets", assetId));
    alert("Asset deleted successfully!");
    loadAssets();
  }
}

// Return Asset
async function returnAsset(assetId) {
  if (confirm("Mark this asset as Available?")) {
    await updateDoc(doc(db, "assets", assetId), { status: "Available" });
    alert("Asset returned successfully!");
    loadAssets();
  }
}

// Edit Asset
async function editAsset(assetId) {
  const assetDoc = await getDoc(doc(db, "assets", assetId));
  const assetData = assetDoc.data();

  const newName = prompt("Edit Asset Name:", assetData.name || "");
  const newType = prompt("Edit Asset Type:", assetData.type || "");
  const newModel = prompt("Edit Asset Model:", assetData.model || "");

  if (newName !== null && newType !== null && newModel !== null) {
    await updateDoc(doc(db, "assets", assetId), {
      name: newName,
      type: newType,
      model: newModel
    });
    alert("Asset updated successfully!");
    loadAssets();
  }
}

// View History Placeholder
function viewHistory(assetId) {
  alert("View History feature coming soon! (Asset ID: " + assetId + ")");
}

// Make global
window.confirmDelete = confirmDelete;
window.returnAsset = returnAsset;
window.editAsset = editAsset;
window.viewHistory = viewHistory;
window.openAllocateModal = (id) => {
  alert("Allocate modal for asset ID: " + id);
};

// Load on page ready
document.addEventListener("DOMContentLoaded", loadAssets);
