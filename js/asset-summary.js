import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
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

const tableBody = document.getElementById("assetSummaryTableBody");
const typeFilter = document.getElementById("typeFilter");

let summaryData = {}; // { headset: { total: 4, allocated: 2, available: 2 }, ... }

// ✅ Fetch and build summary
async function loadAssetSummary() {
  const snapshot = await getDocs(collection(db, "assets"));
  summaryData = {};

  snapshot.forEach(doc => {
    const asset = doc.data();
    const type = asset.type?.toLowerCase() || "unknown";
    const status = asset.status?.toLowerCase();

    if (!summaryData[type]) {
      summaryData[type] = {
        total: 0,
        allocated: 0,
        available: 0
      };
    }

    summaryData[type].total += 1;
    if (status === "allocated") {
      summaryData[type].allocated += 1;
    } else {
      summaryData[type].available += 1;
    }
  });

  populateDropdown(); // Fill dropdown based on types
  renderTable();       // Render full list
}

// ✅ Populate dropdown options from asset types
function populateDropdown() {
  const types = Object.keys(summaryData).sort();
  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeFilter.appendChild(option);
  });
}

// ✅ Render table based on dropdown filter
function renderTable() {
  const selectedType = typeFilter.value;
  tableBody.innerHTML = "";

  const filteredTypes = selectedType === "all" ? Object.keys(summaryData) : [selectedType];

  filteredTypes.forEach(type => {
    const data = summaryData[type];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2 capitalize">${type}</td>
      <td class="border px-4 py-2 text-center">${data.total}</td>
      <td class="border px-4 py-2 text-center">${data.allocated}</td>
      <td class="border px-4 py-2 text-center">${data.available}</td>
    `;
    tableBody.appendChild(row);
  });
}

// ✅ Handle dropdown change
typeFilter.addEventListener("change", renderTable);

// 🚀 Load summary on page load
loadAssetSummary();
