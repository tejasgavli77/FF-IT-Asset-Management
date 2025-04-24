document.addEventListener('DOMContentLoaded', function () {
  const assetTableBody = document.getElementById('asset-table').querySelector('tbody');

  // Fetch the assets from Firebase (or your backend API)
  fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/assets.json') // Update with the correct API endpoint
    .then(response => response.json())
    .then(data => {
      // Clear the table first
      assetTableBody.innerHTML = '';

      // Loop through assets and add them to the table
      for (const assetId in data) {
        const asset = data[assetId];

        // Create a table row
        const row = document.createElement('tr');
        
        // Create table cells for each asset field
        const assetIdCell = document.createElement('td');
        assetIdCell.textContent = assetId;
        row.appendChild(assetIdCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = asset.name;
        row.appendChild(nameCell);

        const typeCell = document.createElement('td');
        typeCell.textContent = asset.type; // Assuming 'type' exists
        row.appendChild(typeCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = asset.status; // Assuming 'status' exists
        row.appendChild(statusCell);

        const actionCell = document.createElement('td');
        actionCell.classList.add('text-blue-600', 'cursor-pointer');
        actionCell.innerHTML = `<i class="bi bi-pencil"></i> Edit / <i class="bi bi-trash"></i> Delete`; // Add actions for editing or deleting
        row.appendChild(actionCell);

        // Append the row to the table body
        assetTableBody.appendChild(row);
      }
    })
    .catch(error => {
      console.error('Error fetching assets:', error);
      alert('Failed to load assets. Please try again later.');
    });
});
