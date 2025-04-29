import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const assetsCollection = collection(db, "assets");

// ✅ Function to generate unique 4-digit assetId
async function generateAssetId() {
  let assetId;
  let exists = true;

  // Mapping of type to prefix
  const typePrefix = {
    laptop: "L",
    desktop: "D",
    monitor: "M",
    printer: "P"
  };

  const prefix = typePrefix[assetType.toLowerCase()] || "X"; // fallback "X" for unknown types

  while (exists) {
    assetId = Math.floor(1000 + Math.random() * 9000).toString();
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

  const assetId = await generateAssetId(); // 🔑 custom ID

  const assetData = {
    assetId,
    type: document.getElementById("assetType").value,
    model: document.getElementById("model").value,
    serialNumber: document.getElementById("serialNumber").value,
    purchaseDate: document.getElementById("purchaseDate").value,
    status: "available",
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
