document.addEventListener('DOMContentLoaded', function () {
  // Select the asset dropdown
  const assetSelect = document.getElementById('asset-id');  // Make sure you're selecting the correct dropdown
  
  // Fetch assets from your Firebase or API endpoint
  fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/assets.json')  // Adjust endpoint if necessary
    .then(response => response.json())
    .then(data => {
      // Clear existing options
      assetSelect.innerHTML = '<option value="">-- Select an Asset --</option>';

      // Loop through the assets and add them to the dropdown
      for (const assetId in data) {
        const asset = data[assetId];
        const option = document.createElement('option');
        option.value = assetId;
        option.textContent = asset.name;  // Assuming `name` is a property in the asset object
        assetSelect.appendChild(option);
      }
    })
    .catch(error => {
      console.error('Error fetching assets:', error);
      alert('Failed to load assets. Please try again later.');
    });

  // Handle form submission
  const form = document.getElementById('allocateForm');  // Make sure to select the correct form element
  
  form.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the default form submission

    // Collect form values
    const assetId = document.getElementById('asset-id').value;
    const userId = document.getElementById('userName').value;  // Change user ID to userName
    const allocationDate = document.getElementById('allocationDate').value;

    // Validate the form inputs
    if (!assetId || !userId || !allocationDate) {
      alert("All fields are required.");
      return;
    }

    // Prepare data to be sent to the backend
    const allocationData = {
      assetId: assetId,
      userId: userId,
      allocationDate: allocationDate
    };

    // Send POST request to backend API
    fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/allocate-asset.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(allocationData)  // Send data as JSON
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
      if (data.success) {
        alert('Asset allocated successfully!');
        form.reset();  // Reset the form
      } else {
        alert('Error allocating asset: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while allocating the asset. Please try again.');
    });
  });
});
