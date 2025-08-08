<script type="module">
  // Firebase Imports
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

  // ✅ Firebase Config
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

  let allAssets = [];
  let currentPage = 1;
  const rowsPerPage = 25;

  // 🔁 Load data after DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("tableBody");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const typeFilter = document.getElementById("typeFilter");
    const resetBtn = document.getElementById("resetFilters");

    async function loadAssets() {
      const snapshot = await getDocs(collection(db, "assets"));
      allAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTable(allAssets);
    }

    async function loadAssetTypes() {
      const typeSnapshot = await getDocs(collection(db, "assetTypes"));
      typeFilter.innerHTML = `<option value="">All Types</option>`;
      typeSnapshot.forEach(doc => {
        const type = doc.data().name;
        const option = document.createElement("option");
        option.value = type.toLowerCase();
        option.textContent = type;
        typeFilter.appendChild(option);
      });
    }

    function applyFilters() {
      const searchTerm = searchInput.value.toLowerCase();
      const status = statusFilter.value.toLowerCase();
      const type = typeFilter.value.toLowerCase();

      const filtered = allAssets.filter(asset => {
        const matchesSearch =
          asset.assetId?.toLowerCase().includes(searchTerm) ||
          asset.model?.toLowerCase().includes(searchTerm) ||
          asset.serialNumber?.toLowerCase().includes(searchTerm) ||
          asset.type?.toLowerCase().includes(searchTerm) ||
          asset.AllocatedTo?.toLowerCase().includes(searchTerm);

        const matchesStatus = !status || asset.status?.toLowerCase() === status;
        const matchesType = !type || asset.type?.toLowerCase() === type;

        return matchesSearch && matchesStatus && matchesType;
      });

      currentPage = 1;
      renderTable(filtered);
    }

    function renderTable(data) {
      tableBody.innerHTML = "";
      const start = (currentPage - 1) * rowsPerPage;
      const paginatedData = data.slice(start, start + rowsPerPage);

      paginatedData.forEach((asset, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border px-4 py-2 text-center">${start + index + 1}</td>
          <td class="border px-4 py-2 text-center">${asset.assetId || "N/A"}</td>
          <td class="border px-4 py-2 text-center">${asset.type || "N/A"}</td>
          <td class="border px-4 py-2 text-center">${asset.model || "N/A"}</td>
          <td class="border px-4 py-2 text-center">${asset.serialNumber || "N/A"}</td>
          <td class="border px-4 py-2 text-center">${asset.AllocatedTo || "-"}</td>
          <td class="border px-4 py-2 text-center">${asset.allocationDate || "-"}</td>
          <td class="border px-4 py-2 text-center">${asset.purchaseDate || "N/A"}</td>
          <td class="border px-4 py-2 text-center">
            <span class="px-2 py-1 rounded text-white ${asset.status?.toLowerCase() === "available" ? "bg-green-500" : "bg-red-500"}">
              ${asset.status || "N/A"}
            </span>
          </td>
          <td class="border px-4 py-2 space-x-2 text-center">
            <button class="edit-btn text-blue-500" data-id="${asset.id}"><i class="bi bi-pencil-square"></i></button>
            <button class="allocate-btn text-green-500" data-assetid="${asset.assetId}"><i class="bi bi-arrow-left-right"></i></button>
            <button class="return-btn text-yellow-500" data-id="${asset.id}"><i class="bi bi-arrow-counterclockwise"></i></button>
            <button class="delete-btn text-red-500" data-id="${asset.id}"><i class="bi bi-trash"></i></button>
            <button class="history-btn text-gray-600" data-id="${asset.id}"><i class="bi bi-clock-history"></i></button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      renderPagination(data);
      bindEvents();
    }

    function renderPagination(data) {
      const pagination = document.getElementById("pagination");
      const totalPages = Math.ceil(data.length / rowsPerPage);
      pagination.innerHTML = `
        <div class="flex justify-between items-center mt-4">
          <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled class="bg-gray-300 px-3 py-1 rounded"' : 'class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"'}>Prev</button>
          <span>Page ${currentPage} of ${totalPages}</span>
          <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled class="bg-gray-300 px-3 py-1 rounded"' : 'class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"'}>Next</button>
        </div>
      `;
    }

    window.goToPage = function (page) {
      const totalPages = Math.ceil(allAssets.length / rowsPerPage);
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      applyFilters(); // Re-apply filters with new pagination
    };

    async function confirmDelete(assetId) {
      if (confirm("Are you sure you want to delete this asset?")) {
        await deleteDoc(doc(db, "assets", assetId));
        alert("Asset deleted successfully!");
        loadAssets();
      }
    }

    async function returnAsset(assetId) {
      if (confirm("Mark this asset as Available?")) {
        const assetRef = doc(db, "assets", assetId);
        const assetSnap = await getDoc(assetRef);
        const assetData = assetSnap.data();

        const updatedHistory = [
          ...(assetData.history || []),
          {
            date: new Date().toISOString(),
            action: "Returned",
            details: `Returned by ${assetData.AllocatedTo || "Unknown"}`
          }
        ];

        await updateDoc(assetRef, {
          status: "Available",
          AllocatedTo: "",
          allocationDate: "",
          history: updatedHistory
        });

        alert("Asset returned successfully!");
        loadAssets();
      }
    }

    async function editAsset(assetId) {
      const assetDoc = await getDoc(doc(db, "assets", assetId));
      const assetData = assetDoc.data();

      const newType = prompt("Edit Type:", assetData.type || "");
      const newModel = prompt("Edit Model:", assetData.model || "");

      if (newType !== null && newModel !== null) {
        await updateDoc(doc(db, "assets", assetId), {
          type: newType,
          model: newModel
        });
        alert("Asset updated successfully!");
        loadAssets();
      }
    }

    async function viewHistory(assetId) {
      const assetDoc = await getDoc(doc(db, "assets", assetId));
      const asset = assetDoc.data();
      const history = asset.history || [];

      const historyList = document.getElementById("historyList");
      historyList.innerHTML = "";

      if (history.length === 0) {
        historyList.innerHTML = `<li class="text-gray-500">No history available for this asset.</li>`;
      } else {
        history.forEach(entry => {
          const li = document.createElement("li");
          li.textContent = `${new Date(entry.date).toLocaleString()} — ${entry.action} ${entry.details ? `(${entry.details})` : ""}`;
          historyList.appendChild(li);
        });
      }

      document.getElementById("historyModal").classList.remove("hidden");
    }

    function bindEvents() {
      document.querySelectorAll(".edit-btn").forEach(btn =>
        btn.addEventListener("click", () => editAsset(btn.dataset.id))
      );
      document.querySelectorAll(".allocate-btn").forEach(btn =>
        btn.addEventListener("click", () => openAllocateModal(btn.dataset.assetid))
      );
      document.querySelectorAll(".return-btn").forEach(btn =>
        btn.addEventListener("click", () => returnAsset(btn.dataset.id))
      );
      document.querySelectorAll(".delete-btn").forEach(btn =>
        btn.addEventListener("click", () => confirmDelete(btn.dataset.id))
      );
      document.querySelectorAll(".history-btn").forEach(btn =>
        btn.addEventListener("click", () => viewHistory(btn.dataset.id))
      );
    }

    window.openAllocateModal = (assetId) => {
      window.location.href = `allocate-asset.html?assetId=${assetId}`;
    };

    // 🔃 Initial Load
    loadAssets();
    loadAssetTypes();

    // Filter listeners
    searchInput.addEventListener("input", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    typeFilter.addEventListener("change", applyFilters);
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "";
      typeFilter.value = "";
      currentPage = 1;
      renderTable(allAssets);
    });
  });
</script>
