// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
  const tableBody = document.getElementById('assetTableBody');
  tableBody.innerHTML = '';

  const snapshot = await getDocs(assetsCollection);

  allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
renderTable(allAssets);

  document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('resetFilters').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';
  renderTable(allAssets);
});


    const assetId = asset.assetId || 'N/A'; // Show Asset ID or fallback N/A
    console.log("Loaded Asset: ", assetId);  // Debugging: Check Asset ID in console

    const row = document.createElement('tr');
    row.classList.add('border-b');

    row.innerHTML = `
      <td class="border px-4 py-2">${docSnap.id}</td>
  <td class="border px-4 py-2">${asset.type || 'N/A'}</td>
  <td class="border px-4 py-2">${asset.model || 'N/A'}</td>
  <td class="border px-4 py-2">${asset.serialNumber || 'N/A'}</td>
  <td class="border px-4 py-2">${asset.status || 'N/A'}</td>
  <td class="border px-4 py-2 space-x-2 text-center">
    <button onclick="editAsset('${docSnap.id}')" class="text-blue-500 hover:text-blue-700" title="Edit"><i class="bi bi-pencil-square"></i></button>
    <button onclick="openAllocateModal('${docSnap.id}')" class="text-green-500 hover:text-green-700" title="Allocate"><i class="bi bi-arrow-left-right"></i></button>
    <button onclick="returnAsset('${docSnap.id}')" class="text-yellow-500 hover:text-yellow-700" title="Return"><i class="bi bi-arrow-counterclockwise"></i></button>
    <button onclick="confirmDelete('${docSnap.id}')" class="text-red-500 hover:text-red-700" title="Delete"><i class="bi bi-trash"></i></button>
  </td>
    `;

    tableBody.appendChild(row);
  });
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
async function confirmReturn(assetId) {
  if (confirm("Mark this asset as Available?")) {
    await updateDoc(doc(db, "assets", assetId), { status: "Available" });
    alert("Asset returned successfully!");
    loadAssets();
  }
}

// Edit Asset (Basic popup to update name/type/model)
async function editAsset(assetId) {
  const assetDoc = await getDoc(doc(db, "assets", assetId));
  const assetData = assetDoc.data();

  const newName = prompt("Edit Asset Name:", assetData.name || '');
  const newType = prompt("Edit Asset Type:", assetData.type || '');
  const newModel = prompt("Edit Asset Model:", assetData.model || '');

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

// View History (Placeholder for now)
async function viewHistory(assetId) {
  alert("View History feature coming soon! (for asset ID: " + assetId + ")");
}

// Make functions available globally
window.confirmDelete = confirmDelete;
window.confirmReturn = confirmReturn;
window.editAsset = editAsset;
window.viewHistory = viewHistory;
window.closeEditModal = closeEditModal;

// Load assets on page load
 document.addEventListener('DOMContentLoaded', loadAssets);

function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value.toLowerCase();

  const filtered = allAssets.filter(asset => {
    const matchesSearch = asset.assetId?.toLowerCase().includes(searchTerm) ||
                          asset.model?.toLowerCase().includes(searchTerm);

    const matchesStatus = !status || asset.status?.toLowerCase() === status;

    return matchesSearch && matchesStatus;
  });

  renderTable(filtered);
}

function renderTable(assets) {
  const tableBody = document.querySelector("#assetTable tbody");
  tableBody.innerHTML = '';

  assets.forEach(asset => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${asset.assetId}</td>
      <td>${asset.type}</td>
      <td>${asset.model}</td>
      <td>${asset.serialNumber}</td>
      <td>
        <span class="px-2 py-1 rounded text-white ${
          asset.status?.toLowerCase() === 'available' ? 'bg-green-500' : 'bg-red-500'
        }">${asset.status?.charAt(0).toUpperCase() + asset.status?.slice(1)}</span>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

