document.addEventListener('DOMContentLoaded', function () {
  const assetSelect = document.getElementById('asset-id');

  // Step 1: Fetch Assets
  fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/assets.json')
    .then(response => response.json())
    .then(data => {
      assetSelect.innerHTML = '<option value="">-- Select an Asset --</option>';
      for (const assetId in data) {
        const asset = data[assetId];
        // Only show available assets
        if (asset.status === 'available') {
          const option = document.createElement('option');
          option.value = assetId;
          option.textContent = `${asset.name} (${asset.serialNumber})`;
          assetSelect.appendChild(option);
        }
      }
    })
    .catch(error => {
      console.error('Error fetching assets:', error);
      alert('Failed to load assets. Please try again later.');
    });

  // Step 2: Form Submission for Allocation
  const form = document.getElementById('allocateForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const assetId = document.getElementById('asset-id').value;
    const userId = document.getElementById('userName').value;
    const allocationDate = document.getElementById('allocationDate').value;

    if (!assetId || !userId || !allocationDate) {
      alert("All fields are required.");
      return;
    }

    // Save allocation to a separate collection
    const allocationData = {
      assetId,
      userId,
      allocationDate
    };

    fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/allocate-asset.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allocationData)
    })
    .then(response => response.json())
    .then(data => {
      // Step 3: Update asset status in the assets collection
      return fetch(`https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/assets/${assetId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'allocated', allocatedTo: userId, allocationDate })
      });
    })
    .then(() => {
      alert('Asset allocated successfully!');
      form.reset();
    })
    .catch(error => {
      console.error('Error allocating asset:', error);
      alert('An error occurred while allocating the asset.');
    });
  });
});
