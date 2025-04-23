document.getElementById('addAssetBtn').addEventListener('click', () => {
  const assetType = document.getElementById('assetType').value;
  const model = document.getElementById('model').value;
  const serial = document.getElementById('serial').value;
  const purchaseDate = document.getElementById('purchaseDate').value;

  db.collection("assets").add({
    type: assetType,
    model: model,
    serialNumber: serial,
    purchaseDate: purchaseDate,
    status: "Available",
    currentOwner: "",
    createdAt: new Date()
  }).then(() => {
    alert("✅ Asset added successfully!");
  }).catch((error) => {
    console.error("❌ Error adding asset:", error);
  });
});
