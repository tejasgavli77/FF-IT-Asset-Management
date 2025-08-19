// merged-asset-management.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase config - replace with your own if needed
const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.appspot.com",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

// Initialize Firebase app and services once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements for asset management
const assetTypeSelect = document.getElementById("assetType");
const manageBtn = document.getElementById("manageTypesBtn");
const popover = document.getElementById("manageTypesPopover");
const closePopoverBtn = document.getElementById("closeManagePopover");
const customList = document.getElementById("customTypesList");
const typeSearchInput = document.getElementById("typeSearch");
const newTypeInput = document.getElementById("newAssetType");
const addAssetTypeBtn = document.getElementById("addAssetTypeBtn");

// Ensure user is logged in
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
});

// Load custom asset types into dropdown
async function loadAssetTypes() {
  assetTypeSelect.innerHTML = `<option value="">Select Type</option>`;
  const snapshot = await getDocs(collection(db, "assetTypes"));

  snapshot.forEach(doc => {
    const type = doc.data()?.name;
    if(type){
      const option = document.createElement("option");
      option.value = type.toLowerCase();
      option.textContent = type;
      assetTypeSelect.appendChild(option);
    }
  });
}

// Refresh the list of custom types in the popover
async function refreshCustomList() {
  customList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "assetTypes"));
  snapshot.forEach(doc => {
    const type = doc.data()?.name;
    if(type){
      const li = document.createElement("li");
      li.className = "flex justify-between items-center bg-gray-100 px-3 py-2 rounded";
      li.innerHTML = `
        <span>${type}</span>
        <button data-value="${type}" class="text-red-600 hover:text-red-800" title="Delete ${type}">
          <i class="bi bi-trash"></i>
        </button>
      `;
      customList.appendChild(li);
    }
  });
}

// Generate unique asset ID with prefix based on asset type
async function generateAssetId(assetType) {
  const prefixMap = {
    laptop: "L",
    desktop: "D",
    monitor: "Mn",
    printer: "P",
    mouse: "Ms",
    headset: "H",
    keyboard: "Key",
    pendrive: "PD",
    switch: "Sw" // Add more if needed
  };

  const cleanedType = typeof assetType === 'string' ? assetType.trim().toLowerCase() : '';
  const prefix = prefixMap[cleanedType] || "X";

  let assetId = "";
  let exists = true;

  while (exists) {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    assetId = `${prefix}-${randomId}`;

    const q = query(collection(db, "assets"), where("assetId", "==", assetId));
    const snapshot = await getDocs(q);
    exists = !snapshot.empty;
  }
  return assetId;
}

// Handle asset form submission: add asset document to Firestore
document.getElementById("assetForm").addEventListener("submit", async e => {
  e.preventDefault();

  const typeField = assetTypeSelect;
  const selectedValue = typeField.value;

  if(!selectedValue){
    alert("Please select a valid asset type.");
    return;
  }

  const assetId = await generateAssetId(selectedValue);

  const assetData = {
    assetId,
    type: selectedValue,
    model: document.getElementById("model").value,
    serialNumber: document.getElementById("serialNumber").value,
    purchaseDate: document.getElementById("purchaseDate").value,
    status: "Available",
    history: [{
      date: new Date().toISOString(),
      action: "Asset Added",
      details: "Initial registration"
    }]
  };

  try {
    await addDoc(collection(db, "assets"), assetData);
    alert(`✅ Asset ${assetId} added successfully!`);
    document.getElementById("assetForm").reset();
    await loadAssetTypes();
  } catch(error) {
    console.error("❌ Error adding asset:", error);
    alert("Failed to add asset.");
  }
});

// Logout button logic
window.logout = function(){
  signOut(auth).then(() => {
    window.location.href = "login.html";
  }).catch(err => {
    alert("Logout failed: " + err.message);
  });
};

// Show manage types popover on gear icon click
manageBtn.addEventListener("click", async () => {
  await refreshCustomList();
  // Position the popover right below the gear button
  const rect = manageBtn.getBoundingClientRect();
  popover.style.top = (rect.bottom + window.scrollY + 10) + "px";
  popover.style.left = (rect.left + window.scrollX) + "px";
  popover.classList.remove("hidden");
  // Clear new type input and search filter
  newTypeInput.value = "";
  typeSearchInput.value = "";
});

// Close popover on close button
closePopoverBtn.addEventListener("click", () => {
  popover.classList.add("hidden");
});

// Live filter for asset type search inside popover
typeSearchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll("#customTypesList li").forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(term) ? "flex" : "none";
  });
});

// Add new custom asset type
addAssetTypeBtn.addEventListener("click", async () => {
  const newType = newTypeInput.value.trim();
  if (!newType) {
    alert("Please enter a valid asset type.");
    return;
  }

  try {
    // Check for duplicates
    const q = query(collection(db, "assetTypes"), where("name", "==", newType));
    const existing = await getDocs(q);
    if(!existing.empty){
      alert("This asset type already exists.");
      return;
    }

    await addDoc(collection(db, "assetTypes"), { name: newType });
    alert("✅ Asset type added.");
    newTypeInput.value = "";
    await loadAssetTypes();
    await refreshCustomList();
  } catch(error){
    console.error("Error adding asset type:", error);
    alert("Failed to add asset type.");
  }
});

// Delete asset type on trash icon click (event delegation)
customList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-value]");
  if (!btn) return;

  const valToRemove = btn.dataset.value;
  const confirmDelete = confirm(`Are you sure you want to delete asset type "${valToRemove}"?`);
  if (!confirmDelete) return;

  try {
    const q = query(collection(db, "assetTypes"), where("name", "==", valToRemove));
    const snapshot = await getDocs(q);

    const deletePromises = [];
    snapshot.forEach(docSnap => {
      deletePromises.push(deleteDoc(docSnap.ref));
    });
    await Promise.all(deletePromises);

    // Remove deleted option from select dropdown
    Array.from(assetTypeSelect.options).forEach(opt => {
      if(opt.textContent === valToRemove) opt.remove();
    });

    await refreshCustomList();
    alert(`✅ "${valToRemove}" deleted successfully.`);
  } catch(err){
    console.error("Failed to delete asset type:", err);
    alert("Error deleting asset type.");
  }
});

// Load asset types initially
loadAssetTypes();
