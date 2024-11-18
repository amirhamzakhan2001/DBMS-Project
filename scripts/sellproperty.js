// Function to initialize the sell property form

console.log('Initializing the sell property form...');

function initializeSellPropertyForm() {
    console.log("Page loaded and script initialized.");

    // Populate Year Built options dynamically
    const yearSelect = document.getElementById('year-built');
    const currentYear = new Date().getFullYear();

    console.log("Populating 'Year Built' options.");
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    console.log("'Year Built' options populated.");

    // Form submission handling
    document.getElementById('sellproperty-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        console.log("Form submission started.");

        // Validate required fields
        const requiredFields = document.querySelectorAll('.sellproperty_input[required]');
        let allFieldsFilled = true;

        // Remove previous error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());

        requiredFields.forEach(field => {
            if (!field.value.trim()) { // Check if the field is empty
                allFieldsFilled = false;
                field.classList.add('error'); // Add error class for styling
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.textContent = `${field.previousElementSibling.innerText} is required.`;
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
                console.log(`Validation failed for field: ${field.id}`);
            } else {
                field.classList.remove('error'); // Remove error class if filled
            }
        });

        // Check if all required fields are filled
        if (!allFieldsFilled) {
            console.log("Form validation failed. Please complete all required fields.");
            return; // Stop the form submission
        }

        // Validate photo uploads
        const photoInput = document.getElementById('photos');
        const photoFiles = photoInput.files;
        console.log("Photo files selected:", photoFiles.length);
        if (photoFiles.length < 3) {
            alert('Please upload at least 3 photos.');
            return; // Stop the form submission
        }

        // Create a FormData object from the form
        const formData = new FormData(this);
        console.log("FormData created with form values.");

        // Get the client ID from session/local storage (assuming it is stored after login)
        const clientId = sessionStorage.getItem('client_id'); // Adjust according to your actual storage method
        if (clientId) {
            formData.append('client_id', clientId); // Append client ID to FormData
            console.log("Client ID found and added to FormData:", clientId);
        } else {
            alert('Client ID not found. Please log in again.');
            console.log("Client ID not found in session storage.");
            return; // Stop the form submission
        }

        // Sending the data to the server using Fetch API
        fetch('http://localhost:3000/api/sellproperty', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log("Response received from server:", response);
            return response.json();
        })
        .then(data => {
            console.log("Data parsed from response:", data);
            if (data.property_id) {
                alert('Property listed successfully with ID: ' + data.property_id);
                this.reset(); // Reset the form fields
                console.log("Form reset after successful submission.");
            } else {
                alert('Error listing property: ' + (data.error || 'Unknown error'));
                console.log("Error listing property:", data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert('An error occurred while listing the property. Please try again later.');
            console.log("Fetch error:", error);
        });
    });

    console.log('executed fully the sell property form function...');
}

initializeSellPropertyForm();
