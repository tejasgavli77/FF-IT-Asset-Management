// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  
  // Select the form element
  const form = document.getElementById('allocate-asset-form');
  
  // Handle form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent default form submission
    
    // Collect form values
    const assetId = document.getElementById('asset-id').value;
    const userId = document.getElementById('user-id').value;
    const allocationDate = document.getElementById('allocation-date').value;
    
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
    
    // Send POST request to backend API (Replace 'your-api-endpoint.com' with your actual API endpoint)
    fetch('https://ffassetmanager-default-rtdb.asia-southeast1.firebasedatabase.app/allocate-asset', {
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
