import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"; 
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async function () {
  const tableBody = document.getElementById("assetTableBody");

  try {
    const snapshot = await getDocs(collection(db, "assets"));
    snapshot.forEach(docSnap => {
      const asset = docSnap.data();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-4 py-2">${asset.assetId || '-'}</td>
        <td class="px-4 py-2">${asset.model || '-'}</td>
        <td class="px-4 py-2">${asset.type || '-'}</td>
        <td class="px-4 py-2">${asset.serialNumber || '-'}</td>
        <td class="px-4 py-2">${asset.status || '-'}</td>
        <td class="px-4 py-2">${asset.purchaseDate || '-'}</td>
        <td class="px-4 py-2">${asset.AllocatedTo || '-'}</td>
        <td class="px-4 py-2">${asset.allocationDate || '-'}</td>
        <td class="px-4 py-2">
          <button class="text-blue-600 hover:underline allocate-btn" data-asset-id="${asset.assetId}">
            Allocate
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Now bind allocate buttons
    document.querySelectorAll(".allocate-btn").forEach(button => {
      button.addEventListener("click", () => {
        const assetId = button.getAttribute("data-asset-id");
        if (assetId) {
          window.location.href = `allocate-asset.html?assetId=${encodeURIComponent(assetId)}`;
        }
      });
    });

  } catch (error) {
    console.error("Error loading assets:", error);
    alert("❌ Failed to load assets.");
  }
});
