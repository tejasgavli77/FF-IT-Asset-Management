import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const assetsCol = collection(db, "assets");

let allAssets = [], currentPage = 1, rowsPerPage = 25;

const tableBody = document.getElementById("tableBody");
const paginationDiv = document.getElementById("pagination");

const searchInput = document.getElementById("searchInput");
const typeFilter = new TomSelect("#typeFilter", { placeholder: "Filter by Type" });
const statusFilter = document.getElementById("statusFilter");
const resetBtn = document.getElementById("resetFilters");

async function loadAssets() {
  const snap = await getDocs(assetsCol);
  allAssets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  populateTypeFilter();
  applyFilters();
}

function populateTypeFilter() {
  const options = Array.from(new Set(allAssets.map(a => a.type))).sort();
  typeFilter.clearOptions();
  typeFilter.addOption({ value: "", text: "All Types" });
  options.forEach(o => typeFilter.addOption({ value: o.toLowerCase(), text: o }));
}

function applyFilters() {
  let filtered = allAssets;
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.getValue();
  const status = statusFilter.value.toLowerCase();

  filtered = filtered.filter(a => {
    return (!search ||
        a.assetId.toLowerCase().includes(search) ||
        a.model.toLowerCase().includes(search) ||
        a.serialNumber.toLowerCase().includes(search)) &&
      (!type || a.type.toLowerCase() === type) &&
      (!status || a.status.toLowerCase() === status);
  });

  currentPage = 1;
  render(filtered);
}

function render(data) {
  tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const chunk = data.slice(start, start + rowsPerPage);

  chunk.forEach((a, i) => {
    tableBody.insertAdjacentHTML("beforeend", `
      <tr>
        <td class="p-2 border">${start + i + 1}</td>
        <td class="p-2 border">${a.assetId || "-"}</td>
        <td class="p-2 border">${a.type || "-"}</td>
        <td class="p-2 border">${a.model || "-"}</td>
        <td class="p-2 border">${a.serialNumber || "-"}</td>
        <td class="p-2 border">${a.AllocatedTo || "-"}</td>
        <td class="p-2 border">${a.allocationDate || "-"}</td>
        <td class="p-2 border">${a.purchaseDate || "-"}</td>
        <td class="p-2 border">${a.status || "-"}</td>
        <td class="p-2 border">...</td>
      </tr>`);
  });

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;

  paginationDiv.innerHTML = `
    <button ${currentPage===1?'disabled':''} onclick="goPage(${currentPage-1})" class="px-4 py-2 bg-gray-200 rounded">Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage===totalPages?'disabled':''} onclick="goPage(${currentPage+1})" class="px-4 py-2 bg-gray-200 rounded">Next</button>
  `;
}

window.goPage = (page) => {
  const filtered = allAssets; 
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  render(filtered);
};

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
typeFilter.on('change', applyFilters);
resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "";
  typeFilter.clear();
  applyFilters();
});

loadAssets();
