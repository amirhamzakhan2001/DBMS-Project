// Global flag to indicate if header and footer are already loaded in this session
if (!window.AppState) {
    window.AppState = {
        headerFooterLoaded: false,
        isLoggedIn: false // Added isLoggedIn flag for session management
    };
}


// Define checkSessionStatus function globally
function checkSessionStatus() {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log
    if (token) {
        const expiration = localStorage.getItem('tokenExpiration');
        console.log('Expiration:', expiration); // Debug log
        if (expiration && Date.now() > parseInt(expiration, 10)) {
            handleLogout(); // Expired session
            console.log('Session expired. Logging out...');
        } else {
            console.log('Session active. Token found in localStorage.');
            AppState.isLoggedIn = true; // Update AppState with login status
        }
    } else {
        console.log('No active session. Token not found.');
        AppState.isLoggedIn = false;
    }
}

/// Function to load content into the content area
async function loadFullPage(page, addToHistory = true) {
    const loader = document.getElementById('loader'); // Loader element
    loader.style.display = 'block'; // Show loader

    // Load header and footer only if not already loaded
    if (!AppState.headerFooterLoaded) {
        console.log('Loading header and footer for the first time...');
        try {
            await loadHeaderAndFooter();
            AppState.headerFooterLoaded = true;
            sessionStorage.setItem('headerFooterLoaded', 'true'); // Store in sessionStorage
            console.log('Header and footer loaded successfully.');
        } catch (error) {
            console.error('Error loading header and footer:', error);
            loader.style.display = 'none'; // Hide loader on error
            return; // Exit the function on error
        }
    } else {
        console.log('Header and footer already loaded.');
    }

    try {
        console.log(`Fetching content for: ${page}`);
        const response = await fetch(page); // Fetch the main content page
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();

        // Update the URL and push to browser history if required
        if (addToHistory) {
            const historyState = { page: page };
            window.history.pushState(historyState, '', page); // Update URL in history
            console.log(`Pushed to history: ${page}`);
        }

        // Create a new DOMParser instance
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Update the <title> of the document
        document.title = doc.title;

        // Load links from the new page's <head>
        loadHeadResources(doc);

        // Get new content from the fetched HTML
        const newContent = doc.getElementById('content');
        if (newContent) { // Check if content exists
            document.getElementById('content').innerHTML = newContent.innerHTML; // Load the new content

            // Execute any <script> tags that are part of the newly loaded content
            await executePageScripts(doc); // Await the execution of scripts

            // Call initialization functions after loading new content
            // reinitializePageContent(); // Reinitialize dynamic content
        } else {
            console.error('No content found in the loaded page.');
        }

        // Scroll to the top of the page
        window.scrollTo(0, 0); // Scroll to top

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('Failed to load the page. Please try again later.'); // User feedback
    } finally {
        loader.style.display = 'none'; // Hide loader
    }
}

// Load the header and footer
async function loadHeaderAndFooter() {
    console.log('Loading header and footer...');
    await Promise.all([
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load header');
                return response.text();
            })
            .then(html => {
                document.getElementById('header').innerHTML = html; // Load header
                console.log('Header loaded successfully.');
                initializeDropdowns(); // Initialize login/profile dropdowns
                
            }),
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load footer');
                return response.text();
            })
            .then(html => {
                document.getElementById('footer').innerHTML = html; // Load footer
                console.log('Footer loaded successfully.');
            })
    ]);
}

// Initialize dropdowns for login/profile
function initializeDropdowns() {
    const loginDropdown = document.getElementById("loginDropdown");
    const profileDropdown = document.getElementById("profileDropdown");
    const logoutButton = document.getElementById("logoutButton");

    // Check if elements exist to avoid null reference errors
    if (loginDropdown && profileDropdown) {
        const token = localStorage.getItem("token"); // Check login state

        if (token) {
            // User is logged in, show profile dropdown
            AppState.isLoggedIn = true; // Update login state
            loginDropdown.style.display = "none";
            profileDropdown.style.display = "flex"; // Ensure this matches your desired layout
            // Optionally set user’s profile picture if available
            // profileAvatar.src = user.profilePictureURL || 'path/to/default-avatar.png';
        } else {
            // User is not logged in, show login dropdown
            AppState.isLoggedIn = false; // Update login state
            loginDropdown.style.display = "flex"; // Ensure this matches your desired layout
            profileDropdown.style.display = "none";
        }

        // Setup logout button event
        if (logoutButton) {
            logoutButton.addEventListener("click", handleLogout);
        }
    } else {
        console.error('Login or profile dropdown not found in header.');
    }
}

// Function to load links from the new page's <head>
function loadHeadResources(doc) {
    console.log('Loading head resources...');
    const head = document.head;
    const links = doc.querySelectorAll('head link');
    links.forEach(link => {
        const newLink = document.createElement('link');
        newLink.rel = link.rel;
        newLink.href = link.href;
        newLink.type = link.type;
        head.appendChild(newLink); // Append new link to head
        console.log(`Loaded link: ${link.href}`);
    });
    console.log('Head resources loaded.');
}


// Function to execute page-specific scripts
async function executePageScripts(doc) {
    console.log('Executing page-specific scripts...');
    const promises = [];

    // Get the current page name
    const page = window.location.pathname.split('/').pop(); // Get the current page name
    console.log(`Current page: ${page}`);

    // Define the URL for the page-specific script
    const pageScriptUrl = `scripts/${page.replace('.html', '')}.js`; // Assuming scripts are named after HTML pages

    console.log(`Looking for script: ${pageScriptUrl}`);

    // Check if we are on the index.html page
    if (page === 'index.html') {
        const mainScript = document.createElement('script');
        mainScript.src = 'scripts/script.js'; // Path to your main script
        promises.push(new Promise((resolve) => {
            mainScript.onload = () => {
                console.log(`Loaded main script: scripts/script.js`); // Log successful load
                resolve(); // Resolve when loaded
            };
            document.body.appendChild(mainScript); // Append main script
        }));
    } else {
        // Check if the page-specific script exists before trying to load it
        promises.push(
            fetch(pageScriptUrl, { method: 'HEAD' }) // Check if the script exists
                .then((response) => {
                    if (response.ok) {
                        const pageScript = document.createElement('script');
                        pageScript.src = pageScriptUrl;

                        // Log when the script is successfully loaded
                        return new Promise((resolve) => {
                            pageScript.onload = () => {
                                console.log(`Loaded script: ${pageScriptUrl}`); // Log successful load
                                resolve(); // Resolve when loaded
                            };
                            document.body.appendChild(pageScript); // Append the page-specific script
                            console.log(`Appended script: ${pageScriptUrl}`);
                        });
                    } else {
                        console.warn(`No specific script found for ${page}, skipping load.`);
                    }
                })
                .catch(() => {
                    // Handle fetch error without throwing an error
                    console.warn(`Error fetching script for ${page}, skipping load.`);
                })
        );
    }

    // Wait for all scripts to load
    await Promise.all(promises);
    console.log('All scripts loaded, reinitializing page content...');
    reinitializePageContent(); // Run any initialization functions here
}




// Reinitialize dynamic content after loading a new page (event listeners, etc.)
function reinitializePageContent() {
    console.log('Reinitializing page content...');
    setupHeaderLinks(); // Set up navigation links in the header
    setupServiceLinks(); // Set up links in parallel boxes
    setupFooterLinks(); // Set up footer links

    // Additional initialization can be added here as needed
    InitializeSlider();
    setupParallelBoxes();
}

// Set up event listeners for navigation links in the header
function setupHeaderLinks() {
    console.log('Setting up header links...');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.removeEventListener('click', handleHeaderLinkClick); // Remove existing listener to avoid duplicates
        link.addEventListener('click', handleHeaderLinkClick);
    });
}

// Event handler for header links
function handleHeaderLinkClick(event) {
    event.preventDefault();
    const page = this.getAttribute('data-page');
    console.log(`Header link clicked: ${page}`);
    loadFullPage(page); // Load the new content
}

// Set up event listeners for service links in parallel boxes
function setupServiceLinks() {
    console.log('Setting up service links...');
    const serviceLinks = document.querySelectorAll('.parallel-boxes .box a');

    serviceLinks.forEach(link => {
        link.removeEventListener('click', handleServiceLinkClick); // Remove existing listener to avoid duplicates
        link.addEventListener('click', (e) => {
            const isClientLoggedIn = sessionStorage.getItem("isClientLoggedIn"); // Check login state
            console.log('Service link clicked. isClientLoggedIn:', isClientLoggedIn); // Log login status

            if (!isClientLoggedIn) {
                e.preventDefault(); // Prevent link from opening
                alert("Please log in as a client to access this service.");
            } else {
                handleServiceLinkClick.call(link, e); // Allow link to open
            }
        });
    });
}


// Event handler for service links
function handleServiceLinkClick(event) {
    event.preventDefault();
    const page = this.getAttribute('data-page');
    console.log(`Service link clicked: ${page}`);
    loadFullPage(page); // Load the new content
}

// Set up event listeners for footer links
function setupFooterLinks() {
    console.log('Setting up footer links...');
    document.querySelectorAll('.footer-link').forEach(link => {
        link.removeEventListener('click', handleFooterLinkClick); // Remove existing listener to avoid duplicates
        link.addEventListener('click', handleFooterLinkClick);
    });
}

// Event handler for footer links
function handleFooterLinkClick(event) {
    event.preventDefault();
    const page = this.getAttribute('data-page');
    console.log(`Footer link clicked: ${page}`);
    loadFullPage(page); // Load the new content
}

// Function to handle logout button click (if needed in the UI)
function handleLogout() {
    console.log('Logout function called.');
    // Reset the dropdowns
    loginDropdown.style.display = "flex";
    profileDropdown.style.display = "none";

    // Check if the token exists before removal
    const token = localStorage.getItem("token");
    if (token) {
        console.log('Token found. Removing token:', token);
        localStorage.removeItem("token"); // Remove token from localStorage
    } else {
        console.log('No token found. Nothing to remove.');
    }

    // Check if isClientLoggedIn exists before removal
    const isClientLoggedIn = sessionStorage.getItem("isClientLoggedIn");
    if (isClientLoggedIn) {
        console.log('isClientLoggedIn found. Removing:', isClientLoggedIn);
        sessionStorage.removeItem("isClientLoggedIn"); // Remove isClientLoggedIn from sessionStorage
    } else {
        console.log('No isClientLoggedIn flag found. Nothing to remove.');
    }

    // Remove client_id from sessionStorage upon logout
    const clientId = sessionStorage.getItem("client_id");
    if (clientId) {
        console.log('client_id found. Removing:', clientId);
        sessionStorage.removeItem("client_id"); // Remove client_id from sessionStorage
    } else {
        console.log('No client_id found. Nothing to remove.');
    }

    // Optional: Update application state
    window.AppState.isLoggedIn = false; // Update the app state if you're using it
    console.log('User logged out. App state updated to logged out.');

    // Redirect to the home page or login page after logout
    console.log('Redirecting to index.html...');
    loadFullPage('index.html'); // Reload index page after logout
}



// Check login state on page load
function checkLoginState() {
    const isClientLoggedIn = sessionStorage.getItem("isClientLoggedIn");
    console.log(`login state Initial isClientLoggedIn: ${isClientLoggedIn}`);

    if (!isClientLoggedIn) {
        // Restrict access to protected links
        setupServiceLinks(); // Re-run this function to adjust link behaviors
    }
}

// Initial content load on page load
window.onload = () => {

    checkLoginState(); // Check login state on page load
    checkSessionStatus(); // Call it here
    // Log isClientLoggedIn status at website start
    console.log('Website loaded. Initial isClientLoggedIn:', sessionStorage.getItem("isClientLoggedIn"));


    // Check for popstate event first to handle back/forward navigation
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            console.log(`Popstate event triggered for page: ${event.state.page}`);
            loadFullPage(event.state.page, false); // Load the previous page without adding to history again
        } else {
            const currentPage = window.location.pathname === '/' || window.location.pathname === '/index.html' ? 'index.html' : window.location.pathname;
            console.log(`Document loaded. Current page: ${currentPage}`);
            loadFullPage(currentPage, false); // Load the current page without adding to history
        }
    });

    // Load the default loader
    document.body.insertAdjacentHTML('afterbegin', '<div id="loader" style="display: none;">Loading...</div>');
    console.log('Loader initialized.');

    // Initial load of the current page
    const initialPage = window.location.pathname === '/' || window.location.pathname === '/index.html' ? 'index.html' : window.location.pathname;
    console.log(`Initial page: ${initialPage}`);
    loadFullPage(initialPage, false); // Load initial page content

    setupServiceLinks();
};

// Event listener for logout button (if it exists)
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    console.log("Logout button found:", logoutButton); // Add this line
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            onsole.log("Logout button clicked."); // Debug log
            handleLogout(); // Call the logout function
        });
    }
});



// -----------------------------------------------Slider js code------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    InitializeSlider();
});

function InitializeSlider() {
    // Check if the slider elements exist
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) {
        return; // Exit the function if there are no slides
    }

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideInterval = 2000; // Time between slide changes in milliseconds
    let intervalId;

    function showSlides() {
        slides.forEach((slide, index) => {
            slide.style.display = index === currentSlide ? 'block' : 'none';
        });
    }

    function changeSlide() {
        currentSlide = (currentSlide + 1) % totalSlides; // Move to the next slide
        showSlides();
    }

    function startSlider() {
        intervalId = setInterval(changeSlide, slideInterval);
    }

    // Initialize the slider
    showSlides(); // Show the first slide
    startSlider(); // Start the automatic sliding when the page loads
}



//--------------------------parallel box message-------------------------------------------------------------------------------------------



// Dynamic message change
function changeMessage(message) {
    document.getElementById('dynamic-message').textContent = message;
}

function setupParallelBoxes() {

    // Get the boxes and message element
    const boxes = document.querySelectorAll('.box');
    const messageElement = document.getElementById('message');

    // Exit if the message element or boxes don't exist
    if (!messageElement || boxes.length === 0) {
        return; // Exit the function if there are no boxes or message element
    }

    // Default message to display initially
    const defaultMessage = "Welcome to Find Your Home, your go-to destination for all your real estate needs! We are dedicated to helping you navigate the property market with ease and confidence. Whether you’re buying, selling, renting, or looking for home services, we have the expertise to assist you. Explore our options and let us help you find the perfect solution tailored to your needs!";

    // Set the default message on page load
    messageElement.textContent = defaultMessage;

    // Add event listeners for each box
    boxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            const newMessage = box.getAttribute('data-message'); // Get the message from the data attribute
            messageElement.style.opacity = 0; // Fade out the current message
            setTimeout(() => {
                messageElement.textContent = newMessage; // Change the message
                messageElement.style.opacity = 1; // Fade in the new message
            }, 300); // Delay to allow fade-out to finish
        });

        box.addEventListener('mouseleave', () => {
            messageElement.style.opacity = 0; // Fade out the current message
            setTimeout(() => {
                messageElement.textContent = defaultMessage; // Reset to default message
                messageElement.style.opacity = 1; // Fade in the default message
            }, 300); // Delay to allow fade-out to finish
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupParallelBoxes(); // Call your function here
});



