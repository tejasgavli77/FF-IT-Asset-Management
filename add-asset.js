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

// ✅ Function to generate prefixed and unique assetId

async function generateAssetId(assetType) {
  let assetId;
  let exists = true;

  // Prefix map
  const prefixMap = {
    laptop: "L",
    desktop: "D",
    monitor: "Mn",
    printer: "P",
    mouse: "Mo",
    headset: "H"
  };

  const cleanedType = assetType?.trim().toLowerCase(); // 💡 Clean and normalize
  const prefix = prefixMap[cleanedType] || "X";

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

  const type = document.getElementById("assetType").value;
  console.log("Selected Asset Type:", type); // ✅ FIXED LINE
  const assetId = await generateAssetId(type); // now correctly passes "Mouse", etc.

  const assetData = {
    assetId,
    type,
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
