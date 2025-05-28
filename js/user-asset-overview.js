import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
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
const assetRef = collection(db, "assets");

let allAssets = [];

async function loadUserAssets() {
  const snapshot = await getDocs(query(assetRef, where("AllocatedTo", "!=", "")));
  allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  renderUserTable(allAssets);
}

function renderUserTable(data) {
  const grouped = {};
  data.forEach(asset => {
    const user = asset.AllocatedTo || "Unknown";
    if (!grouped[user]) grouped[user] = [];
    grouped[user].push(asset);
  });

  const tbody = document.getElementById("userAssetTableBody");
  tbody.innerHTML = "";

  Object.entries(grouped).forEach(([user, assets]) => {
    const row = document.createElement("tr");

    const assetList = assets.map(asset => `
      <div class="flex justify-between items-center bg-gray-100 p-2 mb-1 rounded">
        <span>${asset.assetId} (${asset.model})</span>
        <button onclick="returnSingleAsset('${asset.id}')" class="text-yellow-600 hover:text-yellow-800" title="Return"><i class="bi bi-arrow-counterclockwise"></i></button>
      </div>
    `).join("");

    row.innerHTML = `
      <td class="border px-4 py-2 align-top font-semibold">${user}</td>
      <td class="border px-4 py-2">
        ${assetList}
      </td>
      <td class="border px-4 py-2 align-top">
        <button onclick="returnAllAssets('${user}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Return All</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function returnAllAssets(user) {
  const userAssets = allAssets.filter(asset => asset.AllocatedTo === user);
  const confirmMsg = `Return all ${userAssets.length} asset(s) assigned to ${user}?`;
  if (!confirm(confirmMsg)) return;

  for (let asset of userAssets) {
    await updateDoc(doc(db, "assets", asset.id), {
      status: "Available",
      AllocatedTo: "",
      allocationDate: ""
    });
  }

  alert("All assets returned for " + user);
  loadUserAssets();
}

window.returnAllAssets = returnAllAssets;

async function returnSingleAsset(assetId) {
  if (!confirm("Return this asset to inventory?")) return;

  await updateDoc(doc(db, "assets", assetId), {
    status: "Available",
    AllocatedTo: "",
    allocationDate: ""
  });

  alert("Asset returned successfully.");
  loadUserAssets();
}

window.returnSingleAsset = returnSingleAsset;

// Search
document.addEventListener("DOMContentLoaded", () => {
  loadUserAssets();

  const searchInput = document.getElementById("searchUser");
  const resetBtn = document.getElementById("resetSearch");

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = allAssets.filter(asset =>
      asset.AllocatedTo?.toLowerCase().includes(keyword)
    );
    renderUserTable(filtered);
  });

  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderUserTable(allAssets);
  });
});
