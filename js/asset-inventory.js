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

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("tableBody");

let allAssets = [];
let currentPage = 1;
const rowsPerPage = 25;

const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.appspot.com",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const assetsCollection = collection(db, "assets");

const tableBody = document.getElementById("inventoryTableBody");

// Load assets
async function loadAssets() {
  const snapshot = await getDocs(assetsCollection);
  allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderTable(allAssets);

  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const resetBtn = document.getElementById("resetFilters");

  if (searchInput && statusFilter && resetBtn) {
    searchInput.addEventListener("input", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "";
      currentPage = 1;
      renderTable(allAssets);
    });
  }
}

// Filtering
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

  currentPage = 1;
  renderTable(filtered);
}

// Render with pagination
function renderTable(data) {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(start, start + rowsPerPage);

  paginatedData.forEach((asset, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="border px-4 py-2">${start + index + 1}</td>
      <td class="border px-4 py-2">${asset.assetId || "N/A"}</td>
      <td class="border px-4 py-2">${asset.type || "N/A"}</td>
      <td class="border px-4 py-2">${asset.model || "N/A"}</td>
      <td class="border px-4 py-2">${asset.serialNumber || "N/A"}</td>
      <td class="border px-4 py-2">${asset.AllocatedTo || "-"}</td>
      <td class="border px-4 py-2">${asset.allocationDate || "-"}</td>
      <td class="border px-4 py-2">${asset.purchaseDate || "N/A"}</td>
      <td class="border px-4 py-2">
        <span class="px-2 py-1 rounded text-white ${
          asset.status?.toLowerCase() === "available" ? "bg-green-500" : "bg-red-500"
        }">${asset.status || "N/A"}</span>
      </td>
      <td class="border px-4 py-2 space-x-2 text-center">
        <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${asset.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
        <button class="allocate-btn text-green-500 hover:text-green-700" data-assetid="${asset.assetId}" title="Allocate"><i class="bi bi-arrow-left-right"></i></button>
        <button class="return-btn text-yellow-500 hover:text-yellow-700" data-id="${asset.id}" title="Return"><i class="bi bi-arrow-counterclockwise"></i></button>
        <button class="delete-btn text-red-500 hover:text-red-700" data-id="${asset.id}" title="Delete"><i class="bi bi-trash"></i></button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  renderPagination(data);
  bindEvents();
}

// Pagination controls
function renderPagination(data) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(data.length / rowsPerPage);

  pagination.innerHTML = `
    <div class="flex justify-between items-center mt-4">
      <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled class="bg-gray-300 px-3 py-1 rounded"' : 'class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"'}>Prev</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled class="bg-gray-300 px-3 py-1 rounded"' : 'class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"'}>Next</button>
    </div>
  `;
}

window.goToPage = function (page) {
  const totalPages = Math.ceil(allAssets.length / rowsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(allAssets);
};

// Action handlers
async function confirmDelete(assetId) {
  if (confirm("Are you sure you want to delete this asset?")) {
    await deleteDoc(doc(db, "assets", assetId));
    alert("Asset deleted successfully!");
    loadAssets();
  }
}

async function returnAsset(assetId) {
  if (confirm("Mark this asset as Available?")) {
    await updateDoc(doc(db, "assets", assetId), {
      status: "Available",
      AllocatedTo: "",
      allocationDate: ""
    });
    alert("Asset returned successfully!");
    loadAssets();
  }
}

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

function viewHistory(assetId) {
  alert("View History feature coming soon! (Asset ID: " + assetId + ")");
}

window.confirmDelete = confirmDelete;
window.returnAsset = returnAsset;
window.editAsset = editAsset;
window.viewHistory = viewHistory;
window.openAllocateModal = (assetId) => {
  window.location.href = `allocate-asset.html?assetId=${assetId}`;
};

function bindEvents() {
  document.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", () => editAsset(btn.dataset.id))
  );
  document.querySelectorAll(".allocate-btn").forEach(btn =>
    btn.addEventListener("click", () => openAllocateModal(btn.dataset.assetid))
  );
  document.querySelectorAll(".return-btn").forEach(btn =>
    btn.addEventListener("click", () => returnAsset(btn.dataset.id))
  );
  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", () => confirmDelete(btn.dataset.id))
  );
}

document.addEventListener("DOMContentLoaded", loadAssets);
