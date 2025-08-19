import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAspahfUUGnBzh0mh6U53evGQzWQP956xQ",
  authDomain: "ffassetmanager.firebaseapp.com",
  databaseURL: "https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ffassetmanager",
  storageBucket: "ffassetmanager.appspot.com",
  messagingSenderId: "803858971008",
  appId: "1:803858971008:web:72d69ddce6cbc85010a965"
};

const app = initializeApp(firebaseConfig);  // ✅ only once
const db = getFirestore(app);
const auth = getAuth(app);
const assetsCollection = collection(db, "assets");

// ✅ Function to generate prefixed and unique assetId

async function generateAssetId(assetType) {
  console.log("DEBUG START ---------------------");

  console.log("Raw assetType received:", assetType);
  if (typeof assetType !== 'string') {
    console.warn("❌ assetType is not a string:", assetType);
  }

  const cleanedType = typeof assetType === 'string'
    ? assetType.trim().toLowerCase()
    : '';

  console.log("Cleaned assetType:", cleanedType);

  const prefixMap = {
    laptop: "L",
    desktop: "D",
    monitor: "Mn",
    printer: "P",
    mouse: "Ms",
    headset: "H",
    keyboard: "Key"
  };

  const prefix = prefixMap[cleanedType] || "X";
  console.log("Resolved prefix:", prefix);
  console.log("DEBUG END ---------------------");

  // ... rest of your loop


  while (exists) {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    assetId = `${prefix}-${randomId}`;

    const q = query(assetsCollection, where("assetId", "==", assetId));
    const snapshot = await getDocs(q);
    exists = !snapshot.empty;
  }

  return assetId;
}

  
// ✅ Form submission handler

document.getElementById("assetForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const typeField = document.getElementById("assetType");

  // 🔍 LOG FULL SELECT DETAILS
  console.log("📌 SELECT element:", typeField);
  console.log("📌 Selected option index:", typeField.selectedIndex);
  console.log("📌 Selected text:", typeField.options[typeField.selectedIndex]?.text);
  console.log("📌 Selected value:", typeField.value);

  const selectedValue = typeField.value;

  // 🚨 Add check before generating ID
  if (!selectedValue) {
    console.error("❌ assetType is empty or undefined!");
    alert("Please select a valid asset type.");
    return;
  }

  const assetId = await generateAssetId(selectedValue); // ✅ Now pass correct, logged value

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
    await addDoc(assetsCollection, assetData);
    alert("✅ Asset added successfully!");
    document.getElementById("assetForm").reset();
  } catch (error) {
    console.error("❌ Error adding asset: ", error);
    alert("Failed to add asset.");
  }
});

// ✅ Global logout function
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
      console.error("Logout error:", error);
    });
};
