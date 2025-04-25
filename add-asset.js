import { addDoc } from 'firebase/firestore';
import { assetsCollection } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addAssetForm');

  form.addEventListener('submit', async (e) => {
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
      status: assetStatus,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(assetsCollection, assetData);
      alert('✅ Asset added successfully!');
      form.reset();
    } catch (error) {
      console.error('❌ Firestore error:', error);
      alert('Error adding asset. See console for details.');
    }
  });
});
