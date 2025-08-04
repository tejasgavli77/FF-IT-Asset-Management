import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase config
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

const typeFilter = document.getElementById("typeFilter");
const tableBody = document.getElementById("summaryTableBody");

let allAssets = [];

async function fetchAssets() {
  const querySnapshot = await getDocs(collection(db, "assets"));
  allAssets = querySnapshot.docs.map(doc => doc.data());
  populateTypeDropdown();
  renderTable("all");
}

// Group assets by type and render table
function renderTable(selectedType = "all") {
  const grouped = {};

  allAssets.forEach(asset => {
    const type = asset.type || "Unknown";
    if (selectedType !== "all" && type !== selectedType) return;

    if (!grouped[type]) {
      grouped[type] = {
        total: 0,
        available: 0,
        allocated: 0
      };
    }

    grouped[type].total += 1;
    if (asset.status === "Available") grouped[type].available += 1;
    if (asset.status === "Allocated") grouped[type].allocated += 1;
  });

  tableBody.innerHTML = "";

  Object.entries(grouped).forEach(([type, counts], index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${index + 1}</td>
      <td class="border px-4 py-2">${type}</td>
      <td class="border px-4 py-2">${counts.total}</td>
      <td class="border px-4 py-2">${counts.available}</td>
      <td class="border px-4 py-2">${counts.allocated}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Populate dropdown with unique types
function populateTypeDropdown() {
  const types = Array.from(new Set(allAssets.map(asset => asset.type || "Unknown")));
  types.sort();

  typeFilter.innerHTML = `<option value="all">All Types</option>`;
  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });

  // Enable Choices.js after options are loaded
  new Choices(typeFilter, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false
  });
}

// Handle dropdown change
typeFilter.addEventListener("change", () => {
  const selected = typeFilter.value;
  renderTable(selected);
});

fetchAssets();
