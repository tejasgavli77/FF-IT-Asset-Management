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

let allAssets = [];
let groupedUsers = [];

const userTableBody = document.getElementById("userTableBody");
const searchUser = document.getElementById("searchUser");

async function loadAssets() {
  const snapshot = await getDocs(assetsCollection);
  allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  groupedUsers = groupAssetsByUser(allAssets);
  renderUserTable(groupedUsers);
}

function groupAssetsByUser(assets) {
  const userMap = {};

  assets.forEach(asset => {
    const user = asset.AllocatedTo?.trim();
    if (asset.status === "Allocated" && user) {
      if (!userMap[user]) userMap[user] = [];
      userMap[user].push(asset);
    }
  });

  return Object.entries(userMap).map(([user, assets], i) => ({
    index: i + 1,
    user,
    assets
  }));
}

function renderUserTable(users) {
  userTableBody.innerHTML = users.map(({ index, user, assets }) => `
    <tr class="border-b">
      <td class="border px-4 py-2">${index}</td>
      <td class="border px-4 py-2">${user}</td>
      <td class="border px-4 py-2">${assets.length}</td>
      <td class="border px-4 py-2">
        <ul class="list-disc pl-4">
          ${assets.map(asset => `<li>${asset.assetId} (${asset.model || ""})</li>`).join("")}
        </ul>
      </td>
      <td class="border px-4 py-2 space-x-2 text-center">
        <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          onclick="returnAllAssets('${user}')">Return All</button>
        <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onclick="assignNew('${user}')">Assign New</button>
      </td>
    </tr>
  `).join("");
}

window.returnAllAssets = async function (user) {
  if (!confirm(`Return all assets assigned to ${user}?`)) return;

  const updates = allAssets
    .filter(asset => asset.AllocatedTo === user)
    .map(asset => updateDoc(doc(db, "assets", asset.id), {
      status: "Available",
      AllocatedTo: "",
      allocationDate: ""
    }));

  await Promise.all(updates);
  alert("Assets returned successfully.");
  loadAssets();
};

window.assignNew = function (user) {
  const encoded = encodeURIComponent(user);
  window.location.href = `allocate-asset.html?user=${encoded}`;
};

searchUser.addEventListener("input", () => {
  const term = searchUser.value.toLowerCase();
  const filtered = groupedUsers.filter(u =>
    u.user.toLowerCase().includes(term)
  );
  renderUserTable(filtered);
});

document.addEventListener("DOMContentLoaded", loadAssets);

