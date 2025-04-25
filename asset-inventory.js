import { assetsCollection, getDocs } from './firebaseConfig.js';

async function loadAssets() {
  const tableBody = document.querySelector('#asset-table tbody');
  tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Loading...</td></tr>';

  try {
    const snapshot = await getDocs(assetsCollection);
    let rows = '';

    snapshot.forEach(doc => {
      const asset = doc.data();

      rows += `
        <tr>
          <td class="px-4 py-2 border-b">${doc.id}</td>
          <td class="px-4 py-2 border-b">${asset.name || asset.type}</td>
          <td class="px-4 py-2 border-b">${asset.type}</td>
          <td class="px-4 py-2 border-b">${asset.status}</td>
          <td class="px-4 py-2 border-b">-</td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows || '<tr><td colspan="5" class="text-center py-4">No assets found.</td></tr>';
  } catch (err) {
    console.error('Error loading assets:', err);
    tableBody.innerHTML = '<tr><td colspan="5" class="text-red-500 text-center py-4">Error loading assets.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', loadAssets);
