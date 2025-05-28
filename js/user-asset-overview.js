// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const assetsCollection = collection(db, "assets");

document.addEventListener("DOMContentLoaded", loadUserAssets);

async function loadUserAssets() {
  const snapshot = await getDocs(assetsCollection);
  const allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const userMap = {};
  allAssets.forEach(asset => {
    const user = asset.AllocatedTo?.trim();
    if (user) {
      if (!userMap[user]) userMap[user] = [];
      userMap[user].push(asset);
    }
  });

  renderUserTable(userMap);
  bindSearch(userMap);
}

function renderUserTable(userMap) {
  const tbody = document.getElementById("userAssetTableBody");
  tbody.innerHTML = "";

  const users = Object.keys(userMap);
  users.forEach((user, index) => {
    const assets = userMap[user];
    const assetList = assets.map(a => `<li>${a.assetId} (${a.model || "N/A"})</li>`).join("");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${index + 1}</td>
      <td class="border px-4 py-2 font-medium">${user}</td>
      <td class="border px-4 py-2 text-center">${assets.length}</td>
      <td class="border px-4 py-2"><ul class="list-disc pl-4">${assetList}</ul></td>
      <td class="border px-4 py-2 space-x-2 text-center">
        <button class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 return-btn" data-user="${user}">Return All</button>
        <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 assign-btn" data-user="${user}">Assign New</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  bindActionButtons(userMap);
}

function bindSearch(userMap) {
  const searchInput = document.getElementById("userSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = {};
    for (const user in userMap) {
      if (user.toLowerCase().includes(searchTerm)) {
        filtered[user] = userMap[user];
      }
    }
    renderUserTable(filtered);
  });
}

function bindActionButtons(userMap) {
  document.querySelectorAll(".return-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const user = btn.dataset.user;
      const confirmReturn = confirm(`Return all assets assigned to ${user}?`);
      if (!confirmReturn) return;

      const promises = userMap[user].map(asset =>
        updateDoc(doc(db, "assets", asset.id), {
          status: "Available",
          AllocatedTo: "",
          allocationDate: ""
        })
      );

      await Promise.all(promises);
      alert(`Assets returned for ${user}`);
      loadUserAssets();
    });
  });

  document.querySelectorAll(".assign-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const user = btn.dataset.user;
      window.location.href = `allocate-asset.html?user=${encodeURIComponent(user)}`;
    });
  });
}
