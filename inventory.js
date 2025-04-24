document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#asset-table tbody');

  fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/assets.json')
    .then(response => response.json())
    .then(data => {
      tableBody.innerHTML = '';

      if (!data) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4">No assets found.</td></tr>`;
        return;
      }

      Object.entries(data).forEach(([id, asset]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="px-4 py-2 border">${id}</td>
          <td class="px-4 py-2 border">${asset.name || '-'}</td>
          <td class="px-4 py-2 border">${asset.type || '-'}</td>
          <td class="px-4 py-2 border">${asset.status || '-'}</td>
          <td class="px-4 py-2 border">
            <i class="bi bi-pencil-square text-blue-500 cursor-pointer"></i>
            <i class="bi bi-trash text-red-500 ml-2 cursor-pointer"></i>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching asset data:', error);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 p-4">Failed to load assets.</td></tr>`;
    });
});
