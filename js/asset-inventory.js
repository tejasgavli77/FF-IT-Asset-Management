
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

let allAssets = [];
let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const typeFilter = document.getElementById("typeFilter");
  const resetBtn = document.getElementById("resetFilters");

  const renderTable = () => {
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const currentAssets = filterAssets().slice(start, end);

    currentAssets.forEach((asset, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-2 py-1">${start + index + 1}</td>
        <td class="border px-2 py-1">${asset.assetId}</td>
        <td class="border px-2 py-1">${asset.type}</td>
        <td class="border px-2 py-1">${asset.model}</td>
        <td class="border px-2 py-1">${asset.serialNumber}</td>
        <td class="border px-2 py-1">${asset.allocatedTo || "-"}</td>
        <td class="border px-2 py-1">${asset.allocationDate || "-"}</td>
        <td class="border px-2 py-1">${asset.purchaseDate || "-"}</td>
        <td class="border px-2 py-1">${asset.status}</td>
        <td class="border px-2 py-1 text-center">
          <button class="text-blue-600 hover:underline" onclick="viewHistory('${asset.id}')">History</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    renderPagination();
  };

  const filterAssets = () => {
    const searchValue = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const typeValue = typeFilter.value;

    return allAssets.filter(asset => {
      const matchesSearch =
        asset.assetId.toLowerCase().includes(searchValue) ||
        asset.model.toLowerCase().includes(searchValue);
      const matchesStatus = statusValue === "" || asset.status === statusValue;
      const matchesType = typeValue === "" || asset.type === typeValue;

      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filterAssets().length / rowsPerPage);
    const pagination = document.getElementById("paginationControls");
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `px-3 py-1 mx-1 rounded ${i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`;
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(btn);
    }
  };

  const loadAssets = async () => {
    const querySnapshot = await getDocs(assetsCollection);
    allAssets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable();
  };

  searchInput.addEventListener("input", renderTable);
  statusFilter.addEventListener("change", renderTable);
  typeFilter.addEventListener("change", renderTable);
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "";
    typeFilter.value = "";
    renderTable();
  });

  window.viewHistory = async (assetId) => {
    const modal = document.getElementById("historyModal");
    const list = document.getElementById("historyList");
    list.innerHTML = "<li>Loading...</li>";

    const docRef = doc(db, "assets", assetId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const history = docSnap.data().history || [];
      list.innerHTML = history.length === 0
        ? "<li>No history available.</li>"
        : history.map(entry => `<li>${entry}</li>`).join("");
    } else {
      list.innerHTML = "<li>No data found.</li>";
    }

    modal.classList.remove("hidden");
  };

  await loadAssets();
});
