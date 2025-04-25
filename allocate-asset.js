import { getDocs, assetsCollection } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', async function () {
  const assetSelect = document.getElementById('assetSelect');
  assetSelect.innerHTML = '<option value="">-- Select an Asset --</option>';

  try {
    const snapshot = await getDocs(assetsCollection);
    snapshot.forEach(doc => {
      const asset = doc.data();

      // Only show assets with status "available"
      if (asset.status && asset.status.toLowerCase() === 'available') {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${asset.name || asset.type} (${asset.model || 'No Model'})`;
        assetSelect.appendChild(option);
      }
    });

    if (assetSelect.options.length === 1) {
      assetSelect.innerHTML = '<option value="">No available assets</option>';
    }

  } catch (error) {
    console.error('Error loading assets:', error);
    alert('Failed to load available assets.');
  }
});
