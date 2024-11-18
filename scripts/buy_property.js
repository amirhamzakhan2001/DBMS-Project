console.log('buy_property.js start executing');

function initbuyPropertySearch() {
    console.log('buy_property.js function start executing');

    const searchButton = document.getElementById("search-button");
    const resultsContainer = document.createElement("div");
    const detailedViewContainer = document.createElement("div");
    
    resultsContainer.id = "buy_result_results-container"; // Set ID for results container
    detailedViewContainer.id = "buy_result_detailed-view-container"; // Set ID for detailed view container

    let properties = []; // This will hold the fetched properties
    const resultsPerPage = 5; // Number of results per page
    let currentPage = 1; // Track the current page

    // Append results and detailed view containers to the main content
    const mainContent = document.getElementById("content");
    mainContent.appendChild(resultsContainer);
    mainContent.appendChild(detailedViewContainer);

    // Set up event listener for search button
    searchButton.addEventListener("click", async () => {
        console.log('Search button clicked');
        const searchCriteria = getSearchCriteria();
        
        // Log the values for search criteria
        console.log('Search criteria:', searchCriteria);

        // Validate locality
        if (!searchCriteria.locality) {
            alert("Please enter a locality.");
            return;
        }

        // Fetch properties based on search criteria
        properties = await fetchProperties(searchCriteria);
        console.log('Fetched properties:', properties);

        currentPage = 1; // Reset to first page
        displayResults(properties);
    });

    function getSearchCriteria() {
        const locality = document.getElementById("locality").value;
        const property_type = document.getElementById("property_type").value || null; // Allow empty
        const number_of_bedrooms = document.getElementById("number_of_bedrooms").value || null; // Allow empty
        const price = document.getElementById("price").value || null; // Allow empty

        return { locality, property_type, number_of_bedrooms, price };
    }

    async function fetchProperties({ locality, property_type, number_of_bedrooms, price }) {
        try {
            console.log('Sending request to fetch properties...');
            resultsContainer.innerHTML = '<p>Loading...</p>'; // Show loading

            
            const response = await fetch("http://localhost:3000/api/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locality, property_type, number_of_bedrooms, price }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            return data; // Assuming your API returns a JSON array of properties
        } catch (error) {
            console.error("Error fetching properties:", error);
            return [];
        }finally {
            resultsContainer.innerHTML = ''; // Clear loading message
        }
    }

    function displayResults(properties) {
        console.log('Displaying results...');
        resultsContainer.innerHTML = ""; // Clear previous results
        if (properties.length === 0) {
            resultsContainer.innerHTML = "<p>No properties found.</p>";
            return;
        }

        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = Math.min(startIndex + resultsPerPage, properties.length);

        // Render results for the current page
        properties.slice(startIndex, endIndex).forEach((property, index) => {
            console.log(`Rendering property ${startIndex + index + 1}:`, property);
        

            // Process the property.photos field, assuming it may be a PostgreSQL array string format
            let photoArray = [];
            if (typeof property.photos === 'string') {
                // Remove curly braces and split by comma to get individual photo paths
                photoArray = property.photos.replace(/[{}]/g, '').split(',')
                    .map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', '')); // Remove prefix
                console.log('photo property is string');
            } else if (Array.isArray(property.photos)) {
                // If it's already an array, process each item directly
                photoArray = property.photos.map(p =>
                    p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', '') // Remove prefix
                );
                console.log('photo property is array');
            }

            console.log('Processed Photo Array for Result:', photoArray);

            const propertyContainer = createPropertyContainer(property, photoArray);

            // Create HTML for images
            const imagesHtml = photoArray.map(img => {
                const imgSrc = `http://localhost:3000/uploads/photos/${img}`; // Construct the correct URL
                console.log(`Image URL: ${imgSrc}`); // Log the image URL
                
                return imgSrc; // Return the URL for later use in slideshow
            })


            // Start auto-slideshow for images in search results (if applicable)
            startAutoSlideshow(propertyContainer.querySelector('.buy_result_image-slideshow'), imagesHtml);


            // Append the property container to the results container
            resultsContainer.appendChild(propertyContainer);
        });

        // Render pagination
        renderPagination(properties.length);
    }

    function createPropertyContainer(property, photoArray) {
        const propertyContainer = document.createElement("div");
        propertyContainer.classList.add("buy_result_property-result");

       // Create image slideshow container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('buy_result_image-slideshow');
        propertyContainer.appendChild(imageContainer);


        // Property details
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("buy_result_property-details");
        detailsContainer.innerHTML = `
            <h3 class="buy_result_property-title" data-id="${property.id}">${property.property_title}</h3>
            <p>Type: ${property.property_type}</p>
            <p>Price: ₹${property.price}</p>
            <p>Locality: ${property.locality}</p>
            <p>Location: ${property.location}</p>
            <p>Area: ${property.area} sq. ft.</p>
            <p>Bedrooms: ${property.number_of_bedrooms}</p>
            <p>Utilities Included: ${property.utilities_included}</p>
        `;

        propertyContainer.appendChild(detailsContainer);

        // Add click event to show detailed view
        const titleElement = detailsContainer.querySelector(".buy_result_property-title");
        titleElement.addEventListener("click", () => {
            showDetailedView(property, photoArray); // Pass the property and photo array
        });
        return propertyContainer;
    }


     // ** New function: Auto-slideshow for search result images **
     function startAutoSlideshow(container, images) {
        let index = 0;
    
        // Clear only the images inside the container to prevent duplicates
        container.innerHTML = ''; // Clear previous images
    
        // Create img elements for each URL and add them to the container
        images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add('buy_result_image-slideshow');
            img.style.opacity = "0"; // Start hidden
            img.style.position = "absolute"; // Position absolutely for layering
            img.style.top = "0";
            img.style.left = "0";
            img.style.transition = "opacity 1s ease-in-out"; // Smooth transition
            container.appendChild(img);
        });
    
        const imageElements = container.querySelectorAll('.buy_result_image-slideshow');
    
        if (imageElements.length <= 1) {
            if (imageElements.length) {
                imageElements[0].style.opacity = "1"; // Show single image if only one exists
            }
            return; // Skip slideshow if there's only one image
        }
    
        // Show the first image
        imageElements[0].style.opacity = "1";
    
        // Set an interval to change images every 2 seconds
        setInterval(() => {
            // Fade out the current image
            imageElements[index].style.opacity = "0";
    
            // Move to the next image index
            index = (index + 1) % imageElements.length;
    
            // Fade in the next image
            imageElements[index].style.opacity = "1";
        }, 2000); // Change image every 2 seconds
    }



    function createImageGrid(images, title) {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("buy_result_image-grid");
    
        // Create a wrapper for the images to arrange them in a grid
        const gridWrapper = document.createElement("div");
        gridWrapper.classList.add("buy_result_grid-wrapper");
    
        images.forEach((img, index) => {
            const imgElement = document.createElement("img");
            imgElement.src = `http://localhost:3000/uploads/photos/${img}`; // Adjust the path
            imgElement.alt = title;
            imgElement.classList.add("buy_result_property-image");
    
            // Create a container for each image
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("buy_detailed_image-container");
    
            // Check if it's the last image in an odd list and center it
            if (images.length % 2 !== 0 && index === images.length - 1) {
                imageWrapper.classList.add("single-image");
            }
    
            // Append the image to its container
            imageWrapper.appendChild(imgElement);
            gridWrapper.appendChild(imageWrapper);
        });
    
        imageContainer.appendChild(gridWrapper);
        return imageContainer;
    }
    
    function showDetailedView(property, photoArray) {
        console.log('Showing detailed view for property:', property);
    
        // Create and append the overlay
        const overlay = document.createElement('div');
        overlay.className = 'buy_result_body-overlay';
        document.body.appendChild(overlay);
    
        // Prevent background scrolling
        document.body.classList.add('buy_resultoverlayno-scroll');
    
        // Create detailed view container
        const detailedViewContainer = document.createElement('div');
        detailedViewContainer.className = 'buy_result_detailed-view';
    
        // Process document links
        let documentArray = [];
        if (typeof property.property_documents === 'string') {
            documentArray = property.property_documents.replace(/[{}]/g, '').split(',')
                .map(doc => doc.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsdocuments', ''));
        } else if (Array.isArray(property.property_documents)) {
            documentArray = property.property_documents.map(doc => 
                doc.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsdocuments', ''));
        }
    
        const documentImages = documentArray.length > 0
            ? documentArray.map(doc => {
                const docUrl = `http://localhost:3000/uploads/documents/${doc}`;
                return `<img src="${docUrl}" alt="${doc}" class="buy_result_detailed-image">`;
            }).join('')
            : '<p>No documents available.</p>';
    
        // Prepare video tour link if available
        const videoTourLink = property.video_tour
            ? `<div><strong>Video Tour:</strong> <a href="${property.video_tour}" target="_blank">Watch Video Tour</a></div>`
            : '<div><strong>Video Tour:</strong> Not available</div>';
    
        // Create the image grid for property photos
        const imageGrid = createImageGrid(photoArray, property.property_title);
    
        // Set the detailed view content
        detailedViewContainer.innerHTML = `
            <button class="buy_result_close-button">×</button>
            <div class="buy_result_image-grid-container">${imageGrid.outerHTML}</div>
            <div class="buy_result_info-container">
                <div class="buy_result_info-left">
                    <h2 class="buy_result_property-title">${property.property_title}</h2>
                    <p><strong>Property Type:</strong> ${property.property_type}</p>
                    <p><strong>Price:</strong> ₹${property.price}</p>
                    <p><strong>Locality:</strong> ${property.locality}</p>
                    <p><strong>Location:</strong> ${property.location}</p>
                    <p><strong>Area:</strong> ${property.area} sq. ft.</p>
                    <p><strong>Description:</strong> ${property.description}</p>
                    <p><strong>Seller Name:</strong> ${property.seller_name}</p>
                    <p><strong>Contact Number:</strong> ${property.contact_number}</p>
                    <p><strong>Email Address:</strong> ${property.email_address}</p>
                    <p><strong>Preferred Contact:</strong> ${property.preferred_contact || "N/A"}</p>
                </div>
                <div class="buy_result_info-right">
                    <p><strong>Bedrooms:</strong> ${property.number_of_bedrooms}</p>
                    <p><strong>Bathrooms:</strong> ${property.number_of_bathrooms}</p>
                    <p><strong>Balconies:</strong> ${property.number_of_balconies || "N/A"}</p>
                    <p><strong>Year Built:</strong> ${property.year_built || "N/A"}</p>
                    <p><strong>Condition:</strong> ${property.property_condition}</p>
                    <p><strong>Parking Spaces:</strong> ${property.parking_spaces || "N/A"}</p>
                    <p><strong>Amenities:</strong> ${property.amenities || "N/A"}</p>
                    <p><strong>Furnished:</strong> ${property.furnished}</p>
                    <p><strong>Utilities Included:</strong> ${property.utilities_included}</p>
                    <p><strong>Floor Number:</strong> ${property.floor_number || "N/A"}</p>
                    ${videoTourLink}
                    <p><strong>Additional Notes:</strong> ${property.additional_notes || "N/A"}</p>
                </div>
            </div>
            <div>
                <strong>Property Documents:</strong>
                <div class="buy_result_document-images">
                    ${documentImages}
                </div>
            </div>
        `;
    
        // Append detailed view container to body
        document.body.appendChild(detailedViewContainer);
    
        const closeButton = detailedViewContainer.querySelector(".buy_result_close-button");
    
        // Event listener for the close button
        closeButton.addEventListener("click", () => {
            console.log('Closing detailed view');
            detailedViewContainer.remove(); // Remove the detailed view
            overlay.remove(); // Remove overlay
            document.body.classList.remove('buy_resultoverlayno-scroll'); // Re-enable scrolling
        });
    
        // Prevent clicking the overlay from closing the detailed view
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                console.log('Doing nothing when overlay clicked..');
            }
        });
    }
    
    

    function renderPagination(totalResults) {
        const paginationContainer = document.createElement("div");
        paginationContainer.classList.add("buy_result_pagination");
    
        const totalPages = Math.ceil(totalResults / resultsPerPage);
    
        // Disable "Prev" and "Next" buttons based on the current page
        const prevButton = document.createElement("button");
        prevButton.innerText = "Prev";
        prevButton.classList.add("control-button"); // Apply control-button class
        prevButton.disabled = currentPage === 1; // Disable if on the first page
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--; // Go to previous page
                displayResults(properties); // Redisplay results for the current page
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
                displayResults(properties); // Redisplay results for the current page
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
                displayResults(properties); // Redisplay results for the current page
                renderPagination(totalResults); // Re-render pagination
            }
        });
        paginationContainer.appendChild(nextButton);
    
        // Clear existing pagination and append new
        const existingPagination = document.querySelector(".buy_result_pagination");
        if (existingPagination) {
            existingPagination.remove();
        }
        resultsContainer.appendChild(paginationContainer);
    }
    
    
}

// Initialize the buy property search on page load
initbuyPropertySearch();
