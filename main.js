const allocateBtn = document.createElement('button');
allocateBtn.textContent = 'Allocate';
allocateBtn.addEventListener('click', () => {
  const user = prompt("Enter the name or ID of the user to allocate this asset:");
  if (user) {
    db.collection("assets").doc(doc.id).update({
      status: "Allocated",
      currentOwner: user
    }).then(() => {
      alert("✅ Asset allocated successfully!");
      location.reload(); // refresh to update UI
    }).catch((error) => {
      console.error("❌ Allocation failed:", error);
    });
  }
});
row.appendChild(allocateBtn);
const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Delete';
deleteBtn.style.marginLeft = '10px';
deleteBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to delete this asset?")) {
    db.collection("assets").doc(doc.id).delete().then(() => {
      alert("🗑️ Asset deleted successfully!");
      location.reload();
    }).catch((error) => {
      console.error("❌ Error deleting asset:", error);
    });
  }
});
row.appendChild(deleteBtn);
