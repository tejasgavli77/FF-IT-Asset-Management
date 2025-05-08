import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"; 
import { getFirestore, getDocs, collection, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async function () {
  const assetDropdown = document.getElementById('assetSelect');
  assetDropdown.innerHTML = `<option value="">-- Select an Asset --</option>`;

  try {
    const snapshot = await getDocs(assetsCollection);

    snapshot.forEach(docSnap => {
      const asset = docSnap.data();

      if (asset.status && asset.status.toLowerCase() === 'available') {
        const option = document.createElement("option");
        option.value = docSnap.id; // ✅ Use Firestore document ID here
        option.textContent = `${asset.assetId} | ${asset.type} | ${asset.model} | ${asset.serialNumber}`;
        assetDropdown.appendChild(option);
      }
    });

    if (assetDropdown.options.length === 1) {
      assetDropdown.innerHTML = '<option value="">No available assets</option>';
    }
  } catch (error) {
    console.error("Error fetching assets:", error);
    alert("Failed to load available assets.");
  }

  // Add event listener to the Assign Asset button
  const assignButton = document.getElementById('assignBtn');
  if (assignButton) {
    assignButton.addEventListener('click', allocateAsset);
  }
});

// Allocate Asset function with confirmation popup
async function allocateAsset() {
  const assetDocId = document.getElementById("assetSelect").value; // This is now doc ID
  const userName = document.getElementById("userName").value;
  const allocationDate = document.getElementById("allocationDate").value;

  if (!assetDocId || !userName || !allocationDate) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  // Show confirmation dialog before proceeding
  const confirmation = confirm("Are you sure you want to assign this asset?");
  if (!confirmation) return;

  try {
    const assetRef = doc(db, "assets", assetDocId); // ✅ Use doc ID here
    await updateDoc(assetRef, {
      status: "Allocated",
      AllocatedTo: userName,
      allocationDate: allocationDate,
    });

    showToast("Asset successfully Allocated!", "success");
    document.getElementById("allocateForm").reset();
    // Optionally, reload the page to update dropdown
    setTimeout(() => location.reload(), 1000);
  } catch (error) {
    console.error("Error allocating asset: ", error);
    showToast("Error allocating asset.", "error");
  }
}

// Toast Notification (success or error)
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `
    fixed bottom-5 right-5 
    ${type === "success" ? "bg-green-500" : "bg-red-500"} 
    text-white px-4 py-2 rounded shadow-lg animate-fade-in-out z-50
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Fade animation for toast
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out forwards;
}
`;
document.head.appendChild(style);
