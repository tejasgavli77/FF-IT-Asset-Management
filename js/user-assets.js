// js/user-assets.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
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

const tableBody = document.getElementById("userTableBody");
const userSearch = document.getElementById("userSearch");

let groupedAssets = {}; // { username: [asset, asset, ...] }

async function loadAssets() {
  const snapshot = await getDocs(assetsCollection);
  const allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Group by user
  groupedAssets = {};
  allAssets.forEach(asset => {
    if (asset.status === "Allocated" && asset.AllocatedTo) {
      if (!groupedAssets[asset.AllocatedTo]) groupedAssets[asset.AllocatedTo] = [];
      groupedAssets[asset.AllocatedTo].push(asset);
    }
  });

  renderTable(groupedAssets);
}

function renderTable(grouped) {
  const searchValue = userSearch.value.toLowerCase();
  tableBody.innerHTML = "";

  const users = Object.keys(grouped).filter(user =>
    user.toLowerCase().includes(searchValue)
  );

  users.forEach((user, index) => {
    const assets = grouped[user];
    const assetList = assets.map(a => `<li>${a.assetId} (${a.model})</li>`).join("");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${index + 1}</td>
      <td class="border px-4 py-2">${user}</td>
      <td class="border px-4 py-2">${assets.length}</td>
      <td class="border px-4 py-2">
        <ul class="list-disc pl-4">${assetList}</ul>
      </td>
      <td class="border px-4 py-2">
        <button class="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600" onclick="returnAssets('${user}')">Return All</button>
        <button class="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 ml-2" onclick="allocateNew('${user}')">Assign New</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Search live filter
userSearch.addEventListener("input", () => renderTable(groupedAssets));

// Return all assets of a user
window.returnAssets = async (user) => {
  if (!confirm(`Return all assets from ${user}?`)) return;
  const promises = groupedAssets[user].map(asset =>
    updateDoc(doc(db, "assets", asset.id), {
      status: "Available",
      AllocatedTo: "",
      allocationDate: ""
    })
  );
  await Promise.all(promises);
  alert("Assets returned.");
  loadAssets();
};

// Redirect to Allocate page with user prefilled
window.allocateNew = (user) => {
  window.location.href = `allocate-asset.html?user=${encodeURIComponent(user)}`;
};

// Init
loadAssets();
