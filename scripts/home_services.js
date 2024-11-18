
console.log('the frontend js code is starting to get executing..');


function initializehome_services() {
    console.log('the frontend js code staarts to get executed..');
    // JavaScript for search functionality
    // JavaScript for search functionality
    const searchContainer = document.querySelector('.home_service_search-container');
    const searchInput = searchContainer.querySelector('.home_service_search-input');
    const searchButton = searchContainer.querySelector('.home_service_search-btn');
    const localityDropdown = searchContainer.querySelector('#locality');

    // Optional: Focus on the search input when the search container is clicked
    searchContainer.addEventListener('click', () => {
        searchInput.focus();
    });

    // Optional: Function to handle the search action
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        const selectedLocality = localityDropdown.value; // Get the selected locality

        // Handle search logic here
        alert('Searching for: ' + query + (selectedLocality ? ' in ' + selectedLocality : ''));
    });


    // Worker Details Form Modal functionality
    const modal = document.getElementById('workerFormModal');
    const openModalButton = document.querySelector('.open-form-link'); // Adjust selector if necessary
    const closeModalButton = modal.querySelector('.close-modal');
    const form = document.getElementById('workerForm');

    // Function to open the modal
    openModalButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        modal.style.display = 'flex'; // Display modal as flex
    });

    // Function to close the modal
    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none'; // Hide modal
    });

    // Close modal on clicking outside of modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide modal
        }
    });

    // Form submission handling
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate form inputs
        const fullName = form.full_name.value.trim();
        const serviceType = form.service_type.value.trim().toUpperCase(); // Convert service type to uppercase
        const phoneNumber = form.phone_number.value.trim();
        const locality = form.locality.value.trim();
        const availability = form.availability.value.trim();
        const profilePicture = form.profile_picture.files[0];

        if (!fullName || !serviceType || !phoneNumber || !locality || !availability) {
            alert('Please fill in all required fields.');
            return;
        }

        // Optional: Validate phone number format (simple validation)
        if (!/^\d+$/.test(phoneNumber)) {
            alert('Please enter a valid phone number.');
            return;
        }

        if (profilePicture && !['image/jpeg', 'image/png', 'image/gif'].includes(profilePicture.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF).');
            return;
        }

        // Create a FormData object for submission
        const formData = new FormData();


        const clientId = sessionStorage.getItem('client_id'); // Adjust according to your actual storage method
        if (clientId) {
            formData.append('client_id', clientId); // Append client ID to FormData
            console.log("Client ID found and added to FormData:", clientId);
        } else {
            alert('Client ID not found. Please log in again.');
            console.log("Client ID not found in session storage.");
            return; // Stop the form submission
        }


        formData.append('full_name', fullName);
        formData.append('service_type', serviceType); // Use uppercase service type
        formData.append('phone_number', phoneNumber);
        formData.append('locality', locality);
        formData.append('availability', availability);
        if (form.rate.value.trim()) {
            formData.append('rate', form.rate.value.trim());
        }
        if (form.years_of_experience.value.trim()) {
            formData.append('years_of_experience', form.years_of_experience.value.trim());
        }
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        // Send formData to your server via fetch
        fetch('http://localhost:3000/api/home-services', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Worker details submitted successfully!');
                modal.style.display = 'none'; // Close modal on success
                form.reset(); // Reset the form
            } else {
                alert(`There was an error submitting the form. Please try again. : ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem with your submission. Please try again later.');
        });
    });

}


function setupSearchFunctionality() {
    const searchButton = document.getElementById("searchButton"); // Adjust the ID as needed
    const resultsContainer = document.getElementById("searchResults"); // Adjust the ID as needed
    let currentPage = 1;
    const resultsPerPage = 5; // Adjust as needed

    // Search button event listener
    searchButton.addEventListener("click", async () => {
        console.log('Search button clicked');
        const searchCriteria = getSearchCriteria();

        // Log the values for search criteria
        console.log('Search criteria:', searchCriteria);

        // Fetch service workers based on search criteria
        const serviceWorkers = await fetchServiceWorkers(searchCriteria);
        console.log('Fetched service workers:', serviceWorkers);

        currentPage = 1; // Reset to first page
        displayResults(serviceWorkers);
    });

    function getSearchCriteria() {
        // Get the selected locality value
        const locality = document.getElementById("locality").value;
    
        // Get the entered service type
        const serviceType = document.getElementById("searchInput").value;
    
        // Return the search criteria as an object
        return {
            locality: locality, // Use null if not selected
            service_type: serviceType.trim() || null // Use null if input is empty
        };
    }
    

    // Function to fetch service workers from API
    async function fetchServiceWorkers(searchCriteria) {
        try {
            console.log('Sending request to fetch service workers...');
            resultsContainer.innerHTML = '<p>Loading...</p>'; // Show loading
            const response = await fetch("http://localhost:3000/api/home-services/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchCriteria),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            return data; // Assuming your API returns a JSON array of service workers
        } catch (error) {
            console.error("Error fetching service workers:", error);
            return [];
        } finally {
            resultsContainer.innerHTML = ''; // Clear loading message
        }
    }

    // Function to create service worker container
    function createServiceWorkerContainer(serviceWorker) {
        const workerContainer = document.createElement("div");
        workerContainer.classList.add("service_worker_result");

        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('service_worker_image');

        // Process the profile_picture field
        let photoArray = [];
        if (typeof serviceWorker.profile_picture === 'string') {
            // Remove curly braces and split by comma to get individual photo paths
            photoArray = serviceWorker.profile_picture.replace(/[{}]/g, '').split(',')
                .map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', '')); // Remove prefix
            console.log('Profile picture is a string');
        } else if (Array.isArray(serviceWorker.profile_picture)) {
            // Process each item in the array
            photoArray = serviceWorker.profile_picture.map(p =>
                p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', '')); // Remove prefix
            console.log('Profile picture is an array');
        }

        console.log('Processed Photo Array for Result:', photoArray);

        // Default image link if no photos are available
        let imgSrc;
        if (photoArray.length > 0) {
            imgSrc = `http://localhost:3000/uploads/profile_pics/${photoArray[0]}`; // Use the first photo in the array
        } else {
            imgSrc = 'https://ik.imagekit.io/fyhproject/fyhproject_image/profilepic.webp?updatedAt=1730615134215'; // Replace with your default image link
        }

        const image = document.createElement('img');
        image.src = imgSrc;
        image.alt = `${serviceWorker.full_name}'s Profile Picture`;
        imageContainer.appendChild(image);

        // Service Worker details
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("service_worker_details");
        detailsContainer.innerHTML = `
            <h3 class="service_worker_name">${serviceWorker.full_name}</h3>
            <p>Service Type: ${serviceWorker.service_type}</p>
            <p>Contact Number: ${serviceWorker.phone_number}</p>
            <p>Locality: ${serviceWorker.locality}</p>
            <p>Availability: ${serviceWorker.availability}</p>
            <p>Rate: $${serviceWorker.rate}</p>
            <p>Years of Experience: ${serviceWorker.years_of_experience}</p>
        `;

        workerContainer.appendChild(imageContainer);
        workerContainer.appendChild(detailsContainer);
        
        return workerContainer;
    }

    // Function to display results
    function displayResults(serviceWorkers) {
        console.log('Displaying service workers...');
        resultsContainer.innerHTML = ""; // Clear previous results
        if (serviceWorkers.length === 0) {
            resultsContainer.innerHTML = "<p>No service workers found.</p>";
            return;
        }

        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = Math.min(startIndex + resultsPerPage, serviceWorkers.length);

        // Render results for the current page
        serviceWorkers.slice(startIndex, endIndex).forEach((worker, index) => {
            console.log(`Rendering service worker ${startIndex + index + 1}:`, worker);
            const workerContainer = createServiceWorkerContainer(worker);
            resultsContainer.appendChild(workerContainer);
        });

        // Render pagination if needed
        renderPagination(serviceWorkers.length);
    }

    // Function to render pagination
    function renderPagination(totalResults) {
        const paginationContainer = document.createElement("div");
        paginationContainer.classList.add("rent_result_pagination");

        const totalPages = Math.ceil(totalResults / resultsPerPage);

        // Disable "Prev" and "Next" buttons based on the current page
        const prevButton = document.createElement("button");
        prevButton.innerText = "Prev";
        prevButton.classList.add("control-button"); // Apply control-button class
        prevButton.disabled = currentPage === 1; // Disable if on the first page
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--; // Go to previous page
                displayResults(serviceWorkers); // Redisplay results for the current page
                renderPagination(totalResults); // Re-render pagination
            }
        });
        paginationContainer.appendChild(prevButton);

        // Determine which page numbers to show
        const pageNumbersToShow = [];
        if (totalPages <= 2) {
            // Show all pages if there are two or fewer
            for (let i = 1; i <= totalPages; i++) {
                pageNumbersToShow.push(i);
            }
        } else {
            // More than 2 pages, show relevant page numbers
            if (currentPage > 2) {
                pageNumbersToShow.push(1); // Always show the first page
            }

            // Calculate page numbers around the current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbersToShow.push(i);
            }

            if (currentPage < totalPages - 1) {
                pageNumbersToShow.push(totalPages); // Always show the last page
            }
        }

        // Create page number buttons
        pageNumbersToShow.forEach(page => {
            const pageButton = document.createElement("button");
            pageButton.innerText = page;
            pageButton.classList.add("page-button");
            pageButton.addEventListener("click", () => {
                currentPage = page; // Update current page
                displayResults(serviceWorkers); // Redisplay results for the current page
                renderPagination(totalResults); // Re-render pagination
            });

            // Highlight the current page button
            if (page === currentPage) {
                pageButton.classList.add("active");
            }

            paginationContainer.appendChild(pageButton);
        });

        const nextButton = document.createElement("button");
        nextButton.innerText = "Next";
        nextButton.classList.add("control-button"); // Apply control-button class
        nextButton.disabled = currentPage === totalPages; // Disable if on the last page
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++; // Go to next page
                displayResults(serviceWorkers); // Redisplay results for the current page
                renderPagination(totalResults); // Re-render pagination
            }
        });
        paginationContainer.appendChild(nextButton);

        // Clear existing pagination and append new
        const existingPagination = document.querySelector(".rent_result_pagination");
        if (existingPagination) {
            existingPagination.remove();
        }
        resultsContainer.appendChild(paginationContainer);
    }
}



// Call the function to initialize the app
initializehome_services();
setupSearchFunctionality();

