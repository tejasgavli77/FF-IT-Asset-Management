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

let allAssets = [];
let currentPage = 1;
const rowsPerPage = 10;

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

async function loadAssets() {
  const snapshot = await getDocs(assetsCollection);
  allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderTable(allAssets); // ✅ Initial render with pagination

  // Filters
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

function applyFilters() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("statusFilter").value.toLowerCase();

  const filtered = allAssets.filter(asset => {
    const matchesText =
      asset.assetId.toLowerCase().includes(query) ||
      asset.model.toLowerCase().includes(query) ||
      asset.type.toLowerCase().includes(query);
    const matchesStatus =
      !status || asset.status.toLowerCase() === status;
    return matchesText && matchesStatus;
  });

  currentPage = 1;
  renderTable(filtered);
}

function renderTable(data) {
  const tableBody = document.getElementById("assetTableBody");
  const pagination = document.getElementById("pagination");

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginated = data.slice(start, end);

  tableBody.innerHTML = paginated
    .map(asset => {
      return `
      <tr class="border-b">
        <td class="px-4 py-2">${asset.assetId}</td>
        <td class="px-4 py-2">${asset.type}</td>
        <td class="px-4 py-2">${asset.model}</td>
        <td class="px-4 py-2">${asset.serialNumber}</td>
        <td class="px-4 py-2">${asset.status}</td>
        <td class="px-4 py-2 flex gap-2">
          <button onclick="location.href='allocate-asset.html?assetId=${asset.id}'" title="Allocate" class="text-blue-500 hover:text-blue-700">
            <i class="bi bi-arrow-left-right"></i>
          </button>
          <button onclick="viewAsset('${asset.id}')" title="Edit" class="text-green-500 hover:text-green-700">
            <i class="bi bi-pencil"></i>
          </button>
          <button onclick="deleteAsset('${asset.id}')" title="Delete" class="text-red-500 hover:text-red-700">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`;
    })
    .join("");

  // Render Pagination Controls
  const totalPages = Math.ceil(data.length / rowsPerPage);
  pagination.innerHTML = `
    <div class="flex justify-between items-center mt-4 text-sm">
      <button onclick="goToPage(${currentPage - 1})" class="px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button onclick="goToPage(${currentPage + 1})" class="px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    </div>
  `;
}

window.goToPage = function (page) {
  const totalPages = Math.ceil(allAssets.length / rowsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(allAssets);
};

window.deleteAsset = async function (id) {
  if (!confirm("Are you sure you want to delete this asset?")) return;
  await deleteDoc(doc(db, "assets", id));
  loadAssets();
};

window.viewAsset = async function (id) {
  window.location.href = `edit-asset.html?id=${id}`;
};

loadAssets();
