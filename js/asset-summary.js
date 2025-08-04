import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const summaryBody = document.getElementById("summaryTableBody");

let assets = [];

async function fetchAssets() {
  const querySnapshot = await getDocs(collection(db, "assets"));
  assets = querySnapshot.docs.map(doc => doc.data());
  populateTypeDropdown(assets);
  renderSummary(assets);
}

function populateTypeDropdown(assets) {
  const types = [...new Set(assets.map(asset => asset.type))];
  types.sort();

  // Clear previous options except "All Types"
  typeFilter.innerHTML = `<option value="all">All Types</option>`;

  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });

  // ✅ Ensure correct width is applied even after DOM update
typeFilter.classList.add("w-80");

  const choices = new Choices("#typeFilter", {
    searchEnabled: true,
    itemSelectText: "",
    shouldSort: false,
  });

  typeFilter.addEventListener("change", () => {
    const selectedType = typeFilter.value;
    const filtered = selectedType === "all" ? assets : assets.filter(a => a.type === selectedType);
    renderSummary(filtered);
  });
}

function renderSummary(data) {
  summaryBody.innerHTML = "";

  const summaryMap = {};

  data.forEach(asset => {
    const type = asset.type || "Unknown";
    if (!summaryMap[type]) {
      summaryMap[type] = { total: 0, allocated: 0, available: 0 };
    }

    summaryMap[type].total += 1;

    if (asset.status === "Allocated") {
      summaryMap[type].allocated += 1;
    } else {
      summaryMap[type].available += 1;
    }
  });

  Object.entries(summaryMap).forEach(([type, counts], index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${index + 1}</td>
      <td class="border px-4 py-2">${type}</td>
      <td class="border px-4 py-2">${counts.total}</td>
      <td class="border px-4 py-2">${counts.allocated}</td>
      <td class="border px-4 py-2">${counts.available}</td>
    `;
    summaryBody.appendChild(row);
  });
}

fetchAssets();
