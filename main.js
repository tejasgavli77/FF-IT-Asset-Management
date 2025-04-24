const assetData = {
  assetId: uuidv4(),
  type: document.getElementById('assetType').value,
  model: document.getElementById('model').value,
  serialNumber: document.getElementById('serialNumber').value,
  purchaseDate: document.getElementById('purchaseDate').value,
  status: 'available',
  history: [{
    date: new Date().toISOString(),
    action: 'Asset Added',
    details: 'Initial registration'
  }]
};
// Function to load and display assets
function loadAssets() {
  const assetTableBody = document.getElementById("assetTableBody");
  assetTableBody.innerHTML = ""; // Clear existing rows

  db.collection("assets").orderBy("createdAt", "desc").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.type}</td>
        <td>${data.model}</td>
        <td>${data.serialNumber}</td>
        <td>${data.purchaseDate}</td>
        <td>${data.status}</td>
        <td>${data.currentOwner || "-"}</td>
      `;

      // Allocate Button
      const allocateBtn = document.createElement("button");
      allocateBtn.textContent = "Allocate";
      allocateBtn.addEventListener("click", () => {
        const user = prompt("Enter name of user to allocate:");
        if (user) {
          db.collection("assets").doc(doc.id).update({
            status: "Allocated",
            currentOwner: user
          }).then(() => {
            alert("✅ Asset allocated!");
            loadAssets(); // Refresh the list
          }).catch((error) => {
            console.error("❌ Error allocating asset:", error);
          });
        }
      });

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure to delete this asset?")) {
          db.collection("assets").doc(doc.id).delete().then(() => {
            alert("🗑️ Asset deleted!");
            loadAssets(); // Refresh the list
          }).catch((error) => {
            console.error("❌ Error deleting asset:", error);
          });
        }
      });

      const actionTd = document.createElement("td");
      actionTd.appendChild(allocateBtn);
      actionTd.appendChild(deleteBtn);
      row.appendChild(actionTd);

      assetTableBody.appendChild(row);
    });
  }).catch((error) => {
    console.error("❌ Error loading assets:", error);
  });
}

// Call this function when the page loads
window.onload = loadAssets;

