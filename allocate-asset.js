import { getDocs, assetsCollection } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', async function () {
  const assetSelect = document.getElementById('assetSelect');
  assetSelect.innerHTML = '<option value="">-- Select an Asset --</option>';

  try {
    const snapshot = await getDocs(assetsCollection);
    snapshot.forEach(doc => {
      const data = doc.data();

      // Only include available assets
      if (data.status && data.status.toLowerCase() === 'available') {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${data.name || data.type} (${data.model || 'No Model'})`;
        assetSelect.appendChild(option);
      }
    });

    if (assetSelect.options.length === 1) {
      assetSelect.innerHTML = '<option value="">No available assets</option>';
    }

  } catch (error) {
    console.error('Error fetching assets from Firestore:', error);
    alert('Error loading asset list.');
  }
});
