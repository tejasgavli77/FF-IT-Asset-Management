// Firebase imports
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

const tableBody = document.getElementById("userAssetTableBody");
const searchInput = document.getElementById("searchInput");

let userMap = {};

async function loadUserAssets() {
  const snapshot = await getDocs(query(collection(db, "assets"), where("status", "==", "Allocated")));
  const assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  userMap = {};
  assets.forEach(asset => {
    const owner = asset.AllocatedTo || "Unknown";
    if (!userMap[owner]) userMap[owner] = [];
    userMap[owner].push(asset);
  });

  renderUserTable(userMap);
}

function renderUserTable(data) {
  tableBody.innerHTML = "";
  Object.keys(data).forEach((user, index) => {
    const assets = data[user];
    const assetDetails = assets.map(asset => `
      <div class="flex justify-between items-center border-b py-1">
        <span class="text-gray-700 text-sm">${asset.assetId} - ${asset.model}</span>
        <button class="text-xs text-red-600 hover:underline" onclick="returnSingleAsset('${asset.id}', '${user}')">Return</button>
      </div>
    `).join("");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${index + 1}</td>
      <td class="border px-4 py-2 font-semibold">${user}</td>
      <td class="border px-4 py-2">${assets.length}</td>
      <td class="border px-4 py-2">${assetDetails}</td>
      <td class="border px-4 py-2 text-center">
        <button class="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="returnAll('${user}')">Return All</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function searchUsers() {
  const term = searchInput.value.toLowerCase();
  const filtered = {};
  Object.keys(userMap).forEach(user => {
    if (user.toLowerCase().includes(term)) filtered[user] = userMap[user];
  });
  renderUserTable(filtered);
}

searchInput.addEventListener("input", searchUsers);

window.returnAll = async function (user) {
  const assets = userMap[user];
  for (const asset of assets) {
    await updateDoc(doc(db, "assets", asset.id), {
      status: "Available",
      AllocatedTo: "",
      allocationDate: ""
    });
  }
  alert(`All assets returned for ${user}`);
  loadUserAssets();
};

window.returnSingleAsset = async function (assetId, user) {
  await updateDoc(doc(db, "assets", assetId), {
    status: "Available",
    AllocatedTo: "",
    allocationDate: ""
  });
  alert(`Asset returned for ${user}`);
  loadUserAssets();
};

loadUserAssets();
