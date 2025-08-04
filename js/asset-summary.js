import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection
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

const summaryTableBody = document.getElementById("summaryTableBody");
const typeFilter = document.getElementById("typeFilter");

let allAssets = [];

async function loadAssets() {
  const querySnapshot = await getDocs(collection(db, "assets"));
  const assetMap = new Map();

  allAssets = [];

  querySnapshot.forEach(doc => {
    const asset = doc.data();
    allAssets.push(asset);

    const type = asset.type || "Unknown";

    if (!assetMap.has(type)) {
      assetMap.set(type, { total: 0, allocated: 0, available: 0 });
    }

    const counts = assetMap.get(type);
    counts.total++;
    asset.status === "Allocated" ? counts.allocated++ : counts.available++;
  });

  renderTable(assetMap);
  populateDropdown(assetMap);
}

function renderTable(assetMap, filter = "all") {
  summaryTableBody.innerHTML = "";
  let index = 1;

  for (const [type, counts] of assetMap.entries()) {
    if (filter !== "all" && type !== filter) continue;

    const row = `
      <tr>
        <td class="border px-4 py-2 text-center">${index++}</td>
        <td class="border px-4 py-2">${type}</td>
        <td class="border px-4 py-2 text-center">${counts.total}</td>
        <td class="border px-4 py-2 text-center">${counts.allocated}</td>
        <td class="border px-4 py-2 text-center">${counts.available}</td>
      </tr>
    `;
    summaryTableBody.insertAdjacentHTML("beforeend", row);
  }
}

function populateDropdown(assetMap) {
  assetMap.forEach((_, type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });

  // reinit tom-select if needed (but we've done it in HTML)
}

typeFilter.addEventListener("change", () => {
  const selected = typeFilter.value;
  const grouped = groupAssetsByType(allAssets);
  renderTable(grouped, selected);
});

function groupAssetsByType(assets) {
  const assetMap = new Map();

  assets.forEach(asset => {
    const type = asset.type || "Unknown";

    if (!assetMap.has(type)) {
      assetMap.set(type, { total: 0, allocated: 0, available: 0 });
    }

    const counts = assetMap.get(type);
    counts.total++;
    asset.status === "Allocated" ? counts.allocated++ : counts.available++;
  });

  return assetMap;
}

loadAssets();
