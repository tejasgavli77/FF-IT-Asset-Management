// user-assets.js
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

const userSearch = document.getElementById("userSearch");
const userTableBody = document.getElementById("userTableBody");

let allAssets = [];

async function loadUserAssets() {
  const snapshot = await getDocs(assetsCollection);
  allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderUserTable(allAssets);
}

function renderUserTable(data) {
  const grouped = {};

  data.forEach(asset => {
    const user = asset.AllocatedTo?.trim();
    if (!user) return;

    if (!grouped[user]) grouped[user] = [];
    grouped[user].push(asset);
  });

  const searchTerm = userSearch.value.toLowerCase();
  const filteredUsers = Object.keys(grouped).filter(user => user.toLowerCase().includes(searchTerm));

  userTableBody.innerHTML = "";
  filteredUsers.forEach((user, i) => {
    const userAssets = grouped[user];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${i + 1}</td>
      <td class="border px-4 py-2">${user}</td>
      <td class="border px-4 py-2">${userAssets.length}</td>
      <td class="border px-4 py-2">
        <ul class="list-disc pl-5 text-sm">
          ${userAssets.map(asset => `<li>${asset.assetId} - ${asset.model}</li>`).join("")}
        </ul>
      </td>
      <td class="border px-4 py-2 space-x-2 text-center">
        <button class="return-all-btn text-yellow-500 hover:text-yellow-700" data-user="${user}" title="Return All">
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
        <button class="reassign-btn text-green-500 hover:text-green-700" data-user="${user}" title="Reassign">
          <i class="bi bi-arrow-left-right"></i>
        </button>
      </td>
    `;
    userTableBody.appendChild(row);
  });

  bindUserEvents();
}

function bindUserEvents() {
  document.querySelectorAll(".return-all-btn").forEach(btn =>
    btn.addEventListener("click", async () => {
      const user = btn.dataset.user;
      const userAssets = allAssets.filter(a => a.AllocatedTo === user);
      if (confirm(`Return all assets assigned to ${user}?`)) {
        for (const asset of userAssets) {
          await updateDoc(doc(db, "assets", asset.id), {
            status: "Available",
            AllocatedTo: "",
            allocationDate: ""
          });
        }
        alert("Assets returned successfully!");
        loadUserAssets();
      }
    })
  );

  document.querySelectorAll(".reassign-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      const user = btn.dataset.user;
      const firstAsset = allAssets.find(a => a.AllocatedTo === user);
      if (firstAsset) {
        window.location.href = `allocate-asset.html?assetId=${firstAsset.assetId}`;
      }
    })
  );
}

userSearch.addEventListener("input", () => renderUserTable(allAssets));
document.addEventListener("DOMContentLoaded", loadUserAssets);
