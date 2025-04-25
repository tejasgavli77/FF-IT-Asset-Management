import { getDocs, assetsCollection } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', async function () {
  const assetSelect = document.getElementById('assetSelect'); // Only one dropdown in HTML
  assetSelect.innerHTML = '<option value="">-- Select an Asset --</option>';

  try {
    const snapshot = await getDocs(assetsCollection);
    snapshot.forEach(doc => {
      const data = doc.data();

      // Only show assets that are available
      if (data.status === 'Available') {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = data.name || `${data.type} - ${data.model}`;
        assetSelect.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    alert('Failed to load assets. Please try again later.');
  }
});

