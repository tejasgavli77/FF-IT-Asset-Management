// Import Firebase modules + your init file
import { db, auth } from "./auth.js";  
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const assetsCollection = collection(db, "assets");


// ✅ Collection reference
const assetsCollection = collection(db, "assets");

// ✅ Function to generate prefixed and unique assetId
async function generateAssetId(assetType) {
  console.log("DEBUG START ---------------------");

  console.log("Raw assetType received:", assetType);
  if (typeof assetType !== "string") {
    console.warn("❌ assetType is not a string:", assetType);
  }

  const cleanedType = typeof assetType === "string"
    ? assetType.trim().toLowerCase()
    : "";

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

  let assetId;
  let exists = true;

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

  console.log("📌 SELECT element:", typeField);
  console.log("📌 Selected option index:", typeField.selectedIndex);
  console.log("📌 Selected text:", typeField.options[typeField.selectedIndex]?.text);
  console.log("📌 Selected value:", typeField.value);

  const selectedValue = typeField.value;

  if (!selectedValue) {
    console.error("❌ assetType is empty or undefined!");
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
    history: [
      {
        date: new Date().toISOString(),
        action: "Asset Added",
        details: "Initial registration",
      },
    ],
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
