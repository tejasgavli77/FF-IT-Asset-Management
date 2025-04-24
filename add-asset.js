// js/add-asset.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addAssetForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const assetName = document.getElementById('assetName').value;
    const assetType = document.getElementById('assetType').value;
    const assetStatus = document.getElementById('assetStatus').value;

    if (!assetName || !assetType || !assetStatus) {
      alert('Please fill in all fields.');
      return;
    }

    const assetData = {
      name: assetName,
      type: assetType,
      status: assetStatus
    };

    fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/assets.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assetData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add asset');
      }
      return response.json();
    })
    .then(data => {
      alert('✅ Asset added!');
      form.reset();
    })
    .catch(error => {
      console.error('❌ Error adding asset:', error);
      alert('Error adding asset. Check the console.');
    });
  });
});
