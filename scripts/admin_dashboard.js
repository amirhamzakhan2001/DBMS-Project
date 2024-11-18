

// Function to fetch analytics data from the backend and render charts
async function fetchAnalyticsData() {
    try {

        console.log('Frontend starts executing');

        // Fetch data from your backend API for all analytics
        const clientAnalyticsResponse = await fetch('http://localhost:3000/api/admindashboard/analytics/client');
        const sellPropertyAnalyticsResponse = await fetch('http://localhost:3000/api/admindashboard/analytics/sell-property');
        const rentPropertyAnalyticsResponse = await fetch('http://localhost:3000/api/admindashboard/analytics/rent-property');
        const homeServiceWorkerAnalyticsResponse = await fetch('http://localhost:3000/api/admindashboard/analytics/home-service-worker');

        console.log('Fetch api code  executed');

        const clientData = await clientAnalyticsResponse.json();
        const sellPropertyData = await sellPropertyAnalyticsResponse.json();
        const rentPropertyData = await rentPropertyAnalyticsResponse.json();
        const homeServiceWorkerData = await homeServiceWorkerAnalyticsResponse.json();

        // Display total counts on the page
        displayTotalCounts(sellPropertyData.sellPropertyAnalytics, rentPropertyData.rentPropertyAnalytics, homeServiceWorkerData.homeServiceWorkerAnalytics);
        console.log('Data fetched successfully');

        // Render charts using the data
        renderClientAnalyticsChart(clientData.clientAnalytics);

        // Render charts using the data of sell properties
        renderSellPropertyByType(sellPropertyData.sellPropertyAnalytics.by_property_type);
        renderSellPropertyByLocality(sellPropertyData.sellPropertyAnalytics.by_locality);
        renderSellPropertyByPriceRange(sellPropertyData.sellPropertyAnalytics.by_price_range);
        renderSellPropertyByCondition(sellPropertyData.sellPropertyAnalytics.by_condition);
        renderSellPropertyByBedrooms(sellPropertyData.sellPropertyAnalytics.by_bedrooms);
        renderSellPropertyByFurnishedStatus(sellPropertyData.sellPropertyAnalytics.by_furnished_status);

        // Render charts for rent property analytics
        renderRentPropertyByType(rentPropertyData.rentPropertyAnalytics.by_property_type);
        renderRentPropertyByLocality(rentPropertyData.rentPropertyAnalytics.by_locality);
        renderRentPropertyByPriceRange(rentPropertyData.rentPropertyAnalytics.by_price_range);
        renderRentPropertyByCondition(rentPropertyData.rentPropertyAnalytics.by_condition);
        renderRentPropertyByBedrooms(rentPropertyData.rentPropertyAnalytics.by_bedrooms);
        renderRentPropertyByFurnishedStatus(rentPropertyData.rentPropertyAnalytics.by_furnished_status);

        // Render charts for home service worker analytics
        renderHomeServiceWorkerByLocality(homeServiceWorkerData.homeServiceWorkerAnalytics.by_locality);
        renderHomeServiceWorkerByServiceType(homeServiceWorkerData.homeServiceWorkerAnalytics.by_service_type);
        renderHomeServiceWorkerByExperience(homeServiceWorkerData.homeServiceWorkerAnalytics.by_experience);


        console.log('render define functions get called');
  
    } catch (error) {
    console.error('Error fetching analytics data:', error);
    }
}

// Function to display total counts of sell properties, rent properties, and home service workers
function displayTotalCounts(sellPropertyData, rentPropertyData, homeServiceWorkerData) {
    // Get the elements where totals will be displayed
    document.getElementById('total-sell-properties').innerText = sellPropertyData.total_sell_properties;
    document.getElementById('total-rent-properties').innerText = rentPropertyData.total_rent_properties;
    document.getElementById('total-home-service-workers').innerText = homeServiceWorkerData.total_workers;
}

// Rendering Client Analytics Chart
function renderClientAnalyticsChart(data) {
    const ctx = document.getElementById('clientChart').getContext('2d');
    
    // Find the maximum value in the dataset
    const maxValue = Math.max(
        data.total_clients,
        data.total_sell_clients,
        data.total_rent_clients,
        data.total_home_service_clients
    );
    
    // Set the suggested max value to a little higher than the max value in the data to show some more graph above data
    const suggestedMax = Math.ceil(maxValue * 1.5);

    const chart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: ['Total Clients', 'Sell Clients', 'Rent Clients', 'Home Service Clients'], // Labels for each dataset
            datasets: [{
                label: 'Number of Clients',
                data: [
                    data.total_clients,
                    data.total_sell_clients,
                    data.total_rent_clients,
                    data.total_home_service_clients
                ], // The data points
                backgroundColor: '#36A2EB', // Color can be customized
                borderColor: '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Total number of Clients in each table',
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold' // Font weight
                    },
                    padding: {
                        top: 10,
                        bottom: 20 // Space around the title
                    },
                    color: '#333', // Title color
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1,  // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : '';  // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}

  

// Rendering Sell Property by Type Pie Chart
function renderSellPropertyByType(data) {
    const ctx = document.getElementById('sell-property-by-type').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'pie', // Change chart type to pie
        data: {
            labels: data.map(item => item.property_type), // Labels for property types (e.g., 'House', 'Apartment')
            datasets: [{
                label: 'Properties by Type',
                data: data.map(item => item.count), // Data points (count of each property type)
                backgroundColor: [
                    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#33FFF5'
                ], // Array of colors for each slice
                borderColor: '#FFFFFF', // Border color for each slice
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Property by Type', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            }
        }
    });
}


// Rendering Sell Property by Locality Chart
function renderSellPropertyByLocality(data) {
    const ctx = document.getElementById('sell-property-by-locality').getContext('2d');
    // Find the maximum value in the data array
    const maxValue = Math.max(...data.map(item => item.count));
    // Set the suggested max value to a little higher than the max value in the data to show some more graph above data
    const suggestedMax = Math.ceil(maxValue * 1.5);
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.locality),
            datasets: [{
                label: 'number of properties',
                data: data.map(item => item.count),
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Property by Locality',
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold' // Font weight
                    },
                    padding: {
                        top: 10,
                        bottom: 20 // Space around the title
                    },
                    color: '#333', // Title color
                }
            },
            scales: {
                y: { beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1,  // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : '';  // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}

// Rendering Sell Property by Price Range Chart
function renderSellPropertyByPriceRange(data) {
    const ctx = document.getElementById('sell-property-by-price-range').getContext('2d');
    // Find the maximum value in the data array
    const maxValue = Math.max(...data.map(item => item.count));
    // Set the suggested max value to a little higher than the max value in the data to show some more graph above data
    const suggestedMax = Math.ceil(maxValue * 1.5);
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.price_range),
            datasets: [{
                label: 'Number of Properties',
                data: data.map(item => item.count),
                backgroundColor: '#FFEB3B',
                borderColor: '#FFEB3B',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Property by Price Range',
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold' // Font weight
                    },
                    padding: {
                        top: 10,
                        bottom: 20 // Space around the title
                    },
                    color: '#333', // Title color
                }
            },
            scales: {
                y: { beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1,  // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : '';  // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}


// Rendering Sell Property by Bedrooms Pie Chart
function renderSellPropertyByBedrooms(data) {
    const ctx = document.getElementById('sell-property-by-bedrooms').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'pie', // Change chart type to pie
        data: {
            labels: data.map(item => `${item.number_of_bedrooms} Bedrooms`), // Labels for number of bedrooms
            datasets: [{
                label: 'Properties by Number of Bedrooms',
                data: data.map(item => item.count), // Data points (count of each bedroom type)
                backgroundColor: [
                    '#FFC107', '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#33FFF5'
                ], // Array of colors for each slice
                borderColor: '#FFFFFF', // Border color for each slice
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Property by total number of Bedrooms', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            }
        }
    });
}

// Rendering Sell Property by Condition Pie Chart
function renderSellPropertyByCondition(data) {
    const ctx = document.getElementById('sell-property-by-condition').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'pie', // Change chart type to pie
        data: {
            labels: data.map(item => item.property_condition), // Labels for property conditions (e.g., 'New', 'Good', etc.)
            datasets: [{
                label: 'Properties by Condition',
                data: data.map(item => item.count), // Data points (count of each condition)
                backgroundColor: [
                    '#4CAF50', '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#33FFF5'
                ], // Array of colors for each slice
                borderColor: '#FFFFFF', // Border color for each slice
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Property by Condition', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            }
        }
    });
}

// Rendering Sell Property by Furnished Status Pie Chart
function renderSellPropertyByFurnishedStatus(data) {
    const ctx = document.getElementById('sell-property-by-furnished-status').getContext('2d');

    // Count the number of null or missing data points (properties with no furnished status)
    const missingDataCount = data.filter(item => item.furnished === null || item.furnished === undefined).length;

    // Filter out null or missing data from the actual chart data
    const filteredData = data.filter(item => item.furnished !== null && item.furnished !== undefined);

    // If there is missing data, add a slice for it in the pie chart
    const labels = filteredData.map(item => item.furnished || 'Unknown');
    const counts = filteredData.map(item => item.count);
    if (missingDataCount > 0) {
        labels.push('No Data');
        counts.push(missingDataCount);
    }

    new Chart(ctx, {
        type: 'pie', // Pie chart type
        data: {
            labels: labels, // Labels including 'No Data' if missing data exists
            datasets: [{
                label: 'Properties by Furnished Status',
                data: counts, // Count data, including the missing data count
                backgroundColor: ['#8E24AA', '#FFB300', '#29B6F6', '#E0E0E0'], // Colors for each slice
                borderColor: '#FFFFFF',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Number of Property by Furnished Status',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            }
        }
    });
}


// Render additional charts for rent property analytics
function renderRentPropertyByType(rentPropertyData) {
    // Render chart for rent properties by type (e.g., Apartment, House, etc.)
    console.log('Rendering rent properties by type');
    const ctx = document.getElementById('rent-property-by-type').getContext('2d');

    new Chart(ctx, {
        type: 'pie', // Change chart type to pie
        data: {
            labels: rentPropertyData.map(item => item.property_type), // Labels for property type
            datasets: [{
                label: 'Rent Properties by Type',
                data: rentPropertyData.map(item => item.count), // Data points (count of each property type)
                backgroundColor: [
                    '#FFC107', '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#33FFF5' // Color for each slice
                ], 
                borderColor: '#FFFFFF', // Border color for each slice
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Properties by Type', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            }
        }
    });
}


function renderRentPropertyByLocality(rentPropertyData) {
    // Render chart for rent properties by locality (e.g., different cities or areas)
    console.log('Rendering rent properties by locality');
    const ctx = document.getElementById('rent-property-by-locality').getContext('2d');
    
    // Find the maximum value in the data array
    const maxValue = Math.max(...rentPropertyData.map(item => item.count));
    // Set the suggested max value to a little higher than the max value in the data to show some more graph above data
    const suggestedMax = Math.ceil(maxValue * 1.5);

    new Chart(ctx, {
        type: 'bar', // Change chart type to bar
        data: {
            labels: rentPropertyData.map(item => item.locality), // Labels for localities
            datasets: [{
                label: 'Number of properties',
                data: rentPropertyData.map(item => item.count), // Data points (count of properties per locality)
                backgroundColor: ['#FF5733'], // Background colors for each bar
                borderColor: '#fff', // Border color for each bar
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Rent Properties by Locality', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            },
            scales: {
                y: {
                    beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1, // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : ''; // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}


function renderRentPropertyByPriceRange(rentPropertyData) {
    // Render chart for rent properties by price range (e.g., under 15k, 15k-20k, etc.)
    console.log('Rendering rent properties by price range');
    const ctx = document.getElementById('rent-property-by-price-range').getContext('2d');
    // Find the maximum value in the data array
    const maxValue = Math.max(...rentPropertyData.map(item => item.count));;
    // Set the suggested max value to a little higher than the max value in the data to show some more graph above data
    const suggestedMax = Math.ceil(maxValue * 1.5);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: rentPropertyData.map(item => item.price_range),
            datasets: [{
                label: 'Number of Properties',
                data: rentPropertyData.map(item => item.count),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Rent Properties by Price Range', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            },
            scales: {
                y: { beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1,  // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : '';  // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}

function renderRentPropertyByCondition(rentPropertyData) {
    // Render chart for rent properties by condition (e.g., Excellent, Good, Needs Renovation)
    console.log('Rendering rent properties by condition');
    const ctx = document.getElementById('rent-property-by-condition').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: rentPropertyData.map(item => item.property_condition),
            datasets: [{
                label: 'Rent Properties by Condition',
                data: rentPropertyData.map(item => item.count),
                backgroundColor: ['#FF6347', '#FFDB58', '#98FB98', '#FF1493'],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Rent Properties by Condition', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            },
            legend: {
                position: 'top', // Position legend at the top
                labels: {
                    font: {
                        size: 14, // Font size for legend labels
                        weight: 'normal'
                    },
                    padding: 10
                }
            }
        }
    });
}

function renderRentPropertyByBedrooms(rentPropertyData) {
    // Render chart for rent properties by number of bedrooms (e.g., 1 Bedroom, 2 Bedrooms, etc.)
    console.log('Rendering rent properties by number of bedrooms');
    const ctx = document.getElementById('rent-property-by-bedrooms').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie', // Change chart type to pie
        data: {
            labels: rentPropertyData.map(item => `${item.number_of_bedrooms} Bedroom(s)`), // Labels for number of bedrooms
            datasets: [{
                label: 'Rent Properties by Number of Bedrooms',
                data: rentPropertyData.map(item => item.count), // Data points (count of properties per bedroom type)
                backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#D033FF', '#FFC300', '#FF8C00'], // Array of colors for each slice
                borderColor: '#fff', // Border color for each slice
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Show the title
                    text: 'Number of Rent Properties by Bedrooms', // Title text
                    font: {
                        size: 18, // Font size for the title
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                },
                legend: {
                    position: 'top', // Position legend at the top
                    labels: {
                        font: {
                            size: 14, // Font size for legend labels
                            weight: 'normal'
                        },
                        padding: 10
                    }
                }
            }
        }
    });
}


function renderRentPropertyByFurnishedStatus(rentPropertyData) {
    // Render chart for rent properties by furnished status (e.g., Furnished, Unfurnished)
    console.log('Rendering rent properties by furnished status');
    const ctx = document.getElementById('rent-property-by-furnished-status').getContext('2d');

    // Count the number of null or missing data points (properties with no furnished status)
    const missingDataCount = rentPropertyData.filter(item => item.furnished === null || item.furnished === undefined).length;

    // Filter out null or missing data from the actual chart data
    const filteredData = rentPropertyData.filter(item => item.furnished !== null && item.furnished !== undefined);

    // If there is missing data, add a slice for it in the pie chart
    const labels = filteredData.map(item => item.furnished || 'Unknown');
    const counts = filteredData.map(item => item.count);
    if (missingDataCount > 0) {
        labels.push('No Data');
        counts.push(missingDataCount);
    }

    new Chart(ctx, {
        type: 'pie', // Pie chart type
        data: {
            labels: labels, // Labels including 'No Data' if missing data exists
            datasets: [{
                label: 'Rent Properties by Furnished Status',
                data: counts, // Count data, including the missing data count
                backgroundColor: ['#FFD700', '#A9A9A9', '#E0E0E0'], // Colors for each slice
                borderColor: '#FFFFFF',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Number of Rent Properties by Furnished Status',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            }
        }
    });
}



function renderHomeServiceWorkerByLocality(homeServiceWorkerData) {
    console.log('Rendering home service workers by locality');
    const ctx = document.getElementById('home-service-worker-by-locality').getContext('2d');
    // Find the maximum value in the data array for scaling the Y-axis
    const maxValue = Math.max(...homeServiceWorkerData.map(item => item.count));
    const suggestedMax = Math.ceil(maxValue * 1.5); // Adding space above the max value

    new Chart(ctx, {
        type: 'bar', // Change chart type to bar
        data: {
            labels: homeServiceWorkerData.map(item => item.locality), // Labels for each locality
            datasets: [{
                label: 'Number of Workers',
                data: homeServiceWorkerData.map(item => item.count), // Data points (count of workers per locality)
                backgroundColor: ['#FF6347', '#98FB98', '#FFD700', '#A9A9A9'], // Array of colors for each bar
                borderColor: '#fff', // Border color for each bar
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Home Service Workers by Locality',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            },
            scales: {
                y: {
                    beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1, // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : ''; // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}

function renderHomeServiceWorkerByServiceType(homeServiceWorkerData) {
    console.log('Rendering home service workers by service type');
    const ctx = document.getElementById('home-service-worker-by-service-type').getContext('2d');
    // Find the maximum value in the data array for scaling the Y-axis
    const maxValue = Math.max(...homeServiceWorkerData.map(item => item.count));
    const suggestedMax = Math.ceil(maxValue * 1.5); // Adding space above the max value

    new Chart(ctx, {
        type: 'bar', // Change chart type to bar
        data: {
            labels: homeServiceWorkerData.map(item => item.service_type), // Labels for each service type
            datasets: [{
                label: 'Number of Workers',
                data: homeServiceWorkerData.map(item => item.count), // Data points (count of workers for each service type)
                backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#D033FF'], // Array of colors for each bar
                borderColor: '#fff', // Border color for each bar
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Home Service Workers by Service Type',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            },
            scales: {
                y: {
                    beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1, // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : ''; // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}


// Function to render home service worker analytics by experience
function renderHomeServiceWorkerByExperience(homeServiceWorkerData) {
    console.log('Rendering home service workers by experience');
    const ctx = document.getElementById('home-service-worker-by-experience').getContext('2d');
    // Find the maximum value in the data array
    const maxValue = Math.max(...homeServiceWorkerData.map(item => item.count));
    // Set the suggested max value to a little higher than the max value in the data to show some more graph above data
    const suggestedMax = Math.ceil(maxValue * 1.5);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: homeServiceWorkerData.map(item => `${item.years_of_experience} years`),
            datasets: [{
                label: 'Number of Workers',
                data: homeServiceWorkerData.map(item => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Home Service Workers by Experience',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#333'
                }
            },
            scales: {
                y: { beginAtZero: true, // Ensure the Y-axis starts from 0
                    suggestedMax: suggestedMax, // Add space above the highest bar
                    ticks: {
                        stepSize: 1,  // Ensures each tick is an integer
                        callback: function(value) {
                            return value % 1 === 0 ? value : '';  // Removes decimals from ticks
                        }
                    }
                }
            }
        }
    });
}



// Call the fetch function when the page loads
fetchAnalyticsData();
  










// JavaScript to open sections dynamically

function loadSection(sectionId, event) {
    if (event) event.preventDefault(); // Prevent anchor default action
    console.log('loadSection starts executing');
    
    // Hide all sections
    const sections = document.querySelectorAll('.section-container');
    sections.forEach(section => {
        section.style.display = 'none';
        console.log('Hiding section: ', section.id);
    });
    
    // Also hide the analytics container
    const analyticsContainer = document.getElementById('analytics-container');
    if (sectionId !== 'analytics-container') {
        console.log('analytics section are hiding');
        analyticsContainer.style.display = 'none'; // Hide analytics section
    }
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    console.log('Trying to show section: ', sectionId);
    
    if (selectedSection) {
        selectedSection.style.display = 'block';
        console.log('Section displayed: ', sectionId);
    } else {
        console.log('No section found with ID: ', sectionId);
    }
}

function toggleDropdown(event) {
    event.preventDefault(); // Prevent default anchor click behavior
    const dropdown = document.getElementById('settings-dropdown');
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target.textContent !== "Settings") {
            dropdown.style.display = 'none';
        }
    }, { once: true });
}


// You could use this function to show the analytics container again if needed
function showAnalytics() {
    const analyticsContainer = document.getElementById('analytics-container');
    analyticsContainer.style.display = 'block'; // Show analytics section
}







// ============================================================================
// read and display operations
// ============================================================================





// Function to fetch sell properties data from the backend and display it


// Function to process photo and document fields
function processPropertyFields(property) {
    // Process the property.photos field, assuming it may be a PostgreSQL array string format
    let photoArray = [];
    if (typeof property.photos === 'string') {
      // Remove curly braces and split by comma to get individual photo paths
      photoArray = property.photos.replace(/[{}]/g, '').split(',')
        .map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', ''));
    } else if (Array.isArray(property.photos)) {
      // If it's already an array, process each item directly
      photoArray = property.photos.map(p =>
        p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', '')
      );
    }
  
    // Process document links
    let documentArray = [];
    if (typeof property.property_documents === 'string') {
      documentArray = property.property_documents.replace(/[{}]/g, '').split(',')
        .map(doc => doc.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsdocuments', ''));
    } else if (Array.isArray(property.property_documents)) {
      documentArray = property.property_documents.map(doc => 
        doc.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsdocuments', '')
      );
    }
  
    const videoTourLink = property.video_tour
    ? `<div><strong>Video Tour:</strong> <a href="${property.video_tour}" target="_blank">Watch Video Tour</a></div>`
    : '<div><strong>Video Tour:</strong> Not available</div>';

    return {
        photoArray: photoArray,
        documentArray: documentArray,
        videoTourLink: videoTourLink
    };
}


// Fetch and display sell properties data, and manage pagination
function fetchAndDisplaySellProperties() {

    let selladminCurrentPage = 1;
    const sellPropertiesPerPage = 10;  // Number of properties to display per page
    let sellAllProperties = [];  // Store all fetched sell properties

    fetch('http://localhost:3000/api/admindashboard/sell-properties')
    .then(response => response.json())
    .then(data => {
        sellAllProperties = data.rows;  // Store the fetched properties in the array
        const totalPages = Math.ceil(sellAllProperties.length / sellPropertiesPerPage); // Calculate total pages

        // Function to display properties for the current page
        function sellDisplayProperties(page) {
        const startIndex = (page - 1) * sellPropertiesPerPage;
        const endIndex = startIndex + sellPropertiesPerPage;
        const propertiesToDisplay = sellAllProperties.slice(startIndex, endIndex);

        const tableBody = document.querySelector('#sell-properties-table tbody');
        tableBody.innerHTML = '';  // Clear the existing rows

        propertiesToDisplay.forEach(property => {
            const { photoArray, documentArray, videoTourLink } = processPropertyFields(property); // Process photos and documents
  
            // Create HTML for images and documents
            const imagesHtml = photoArray.map(img => {
              const imgSrc = `http://localhost:3000/uploads/photos/${img}`; // Construct the correct URL
              return `<a href="${imgSrc}" target="_blank">${imgSrc}</a>`; // Link to view image
            }).join('<br>');  // Join images with line breaks
  
            const documentHtml = documentArray.map(doc => {
              const docUrl = `http://localhost:3000/uploads/documents/${doc}`; // Construct the correct document URL
              return `<a href="${docUrl}" target="_blank">${doc}</a>`; // Link to download document
            }).join('<br>');  // Join document links with line breaks
  
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${property.id}</td>
            <td>${property.client_id}</td>
            <td>${property.property_title}</td>
            <td>${property.property_type}</td>
            <td>${property.price}</td>
            <td>${property.locality}</td>
            <td>${property.location}</td>
            <td>${property.area}</td>
            <td>${property.number_of_bedrooms}</td>
            <td>${property.number_of_bathrooms}</td>
            <td>${property.number_of_balconies}</td>
            <td>${property.year_built}</td>
            <td>${property.property_condition}</td>
            <td>${property.parking_spaces}</td>
            <td>${property.amenities}</td>
            <td>${property.furnished}</td>
            <td>${property.utilities_included}</td>
            <td>${property.floor_number}</td>
            <td>${property.description}</td>
            <td>${imagesHtml}</td> <!-- Display images -->
            <td>${videoTourLink}</td> <!-- Display video tour link -->
            <td>${property.seller_name}</td>
            <td>${property.contact_number}</td>
            <td>${property.email_address}</td>
            <td>${property.preferred_contact}</td>
            <td>${property.additional_notes}</td>
            <td>${documentHtml}</td> <!-- Display documents -->
            `;
            tableBody.appendChild(row);
        });
        }

        // Function to update pagination controls based on the current page
        function sellUpdatePaginationControls() {
        const totalPages = Math.ceil(sellAllProperties.length / sellPropertiesPerPage);
        const currentPageElement = document.querySelector('#current-page');
        currentPageElement.textContent = selladminCurrentPage;

        // Disable or enable the previous/next buttons based on the current page
        const prevPageBtn = document.querySelector('#prev-page-btn');
        const nextPageBtn = document.querySelector('#next-page-btn');

        prevPageBtn.disabled = selladminCurrentPage === 1;
        nextPageBtn.disabled = selladminCurrentPage === totalPages;
        }

        // Handle "Previous" button click
        document.querySelector('#prev-page-btn').addEventListener('click', () => {
        if (selladminCurrentPage > 1) {
            selladminCurrentPage--;
            sellDisplayProperties(selladminCurrentPage);
            sellUpdatePaginationControls();
        }
        });

        // Handle "Next" button click
        document.querySelector('#next-page-btn').addEventListener('click', () => {
        const totalPages = Math.ceil(sellAllProperties.length / sellPropertiesPerPage);
        if (selladminCurrentPage < totalPages) {
            selladminCurrentPage++;
            sellDisplayProperties(selladminCurrentPage);
            sellUpdatePaginationControls();
        }
        });

        // Initial display and pagination control update
        sellDisplayProperties(selladminCurrentPage);
        sellUpdatePaginationControls();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert("There was an issue fetching the data. Please try again.");
    });
}

// Call the function to fetch and display properties on page load
fetchAndDisplaySellProperties();












// Function to process photo and document fields
function processRentPropertyFields(property) {
    // Process the property.photos field, assuming it may be a PostgreSQL array string format
    let photoArray = [];
    if (typeof property.photos === 'string') {
        // Remove curly braces and split by comma to get individual photo paths
        photoArray = property.photos.replace(/[{}]/g, '').split(',').map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', ''));
    } else if (Array.isArray(property.photos)) {
        // If it's already an array, process each item directly
        photoArray = property.photos.map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', ''));
    }

    const videoTourLink = property.video_tour
        ? `<div><strong>Video Tour:</strong> <a href="${property.video_tour}" target="_blank">Watch Video Tour</a></div>`
        : '<div><strong>Video Tour:</strong> Not available</div>';

    return {
        photoArray: photoArray,
        videoTourLink: videoTourLink
    };
}

// Fetch and display rent properties data, and manage pagination
function fetchAndDisplayRentProperties() {
    let rentCurrentPage = 1;
    const rentPropertiesPerPage = 10;  // Number of properties to display per page
    let rentAllProperties = [];  // Store all fetched rent properties
    fetch('http://localhost:3000/api/admindashboard/rent-properties')
    .then(response => response.json())
    .then(data => {
        rentAllProperties = data.rows;  // Store the fetched properties in the array
        const totalPages = Math.ceil(rentAllProperties.length / rentPropertiesPerPage); // Calculate total pages

        // Function to display properties for the current page
        function rentDisplayProperties(page) {
            const startIndex = (page - 1) * rentPropertiesPerPage;
            const endIndex = startIndex + rentPropertiesPerPage;
            const propertiesToDisplay = rentAllProperties.slice(startIndex, endIndex);

            const tableBody = document.querySelector('#rent-properties-table tbody');
            tableBody.innerHTML = '';  // Clear the existing rows

            propertiesToDisplay.forEach(property => {
                const { photoArray, videoTourLink } = processRentPropertyFields(property); // Process photos and documents

                // Create HTML for images and documents
                const imagesHtml = photoArray.map(img => {
                    const imgSrc = `http://localhost:3000/uploads/photos/${img}`; // Construct the correct URL
                    return `<a href="${imgSrc}" target="_blank">${imgSrc}</a>`; // Link to view image
                }).join('<br>');  // Join images with line breaks


                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${property.id}</td>
                    <td>${property.client_id}</td>
                    <td>${property.property_title}</td>
                    <td>${property.property_type}</td>
                    <td>${property.monthly_price}</td>
                    <td>${property.locality}</td>
                    <td>${property.location}</td>
                    <td>${property.area}</td>
                    <td>${property.number_of_bedrooms}</td>
                    <td>${property.number_of_bathrooms}</td>
                    <td>${property.number_of_balconies}</td>
                    <td>${property.year_built}</td>
                    <td>${property.property_condition}</td>
                    <td>${property.parking_spaces}</td>
                    <td>${property.amenities}</td>
                    <td>${property.furnished}</td>
                    <td>${property.utilities_included}</td>
                    <td>${property.floor_number}</td>
                    <td>${property.description}</td>
                    <td>${imagesHtml}</td> <!-- Display images -->
                    <td>${videoTourLink}</td> <!-- Display video tour link -->
                    <td>${property.landlord_name}</td>
                    <td>${property.contact_number}</td>
                    <td>${property.email_address}</td>
                    <td>${property.preferred_contact}</td>
                    <td>${property.additional_notes}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Function to update pagination controls based on the current page
        function rentUpdatePaginationControls() {
            const totalPages = Math.ceil(rentAllProperties.length / rentPropertiesPerPage);
            const currentPageElement = document.querySelector('#rent-current-page');
            currentPageElement.textContent = rentCurrentPage;

            // Disable or enable the previous/next buttons based on the current page
            const prevPageBtn = document.querySelector('#rent-prev-page-btn');
            const nextPageBtn = document.querySelector('#rent-next-page-btn');

            prevPageBtn.disabled = rentCurrentPage === 1;
            nextPageBtn.disabled = rentCurrentPage === totalPages;
        }

        // Handle "Previous" button click
        document.querySelector('#rent-prev-page-btn').addEventListener('click', () => {
            if (rentCurrentPage > 1) {
                rentCurrentPage--;
                rentDisplayProperties(rentCurrentPage);
                rentUpdatePaginationControls();
            }
        });

        // Handle "Next" button click
        document.querySelector('#rent-next-page-btn').addEventListener('click', () => {
            const totalPages = Math.ceil(rentAllProperties.length / rentPropertiesPerPage);
            if (rentCurrentPage < totalPages) {
                rentCurrentPage++;
                rentDisplayProperties(rentCurrentPage);
                rentUpdatePaginationControls();
            }
        });

        // Initial display and pagination control update
        rentDisplayProperties(rentCurrentPage);
        rentUpdatePaginationControls();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert("There was an issue fetching the data. Please try again.");
    });
}

// Call the function to fetch and display properties on page load
fetchAndDisplayRentProperties();









// Function to process profile picture (similar to how we handled photos in rent properties)
function processHomeServiceFields(service) {
    let profilePicArray = [];
    if (typeof service.profile_picture === 'string') {
        // Remove curly braces and split by comma to get individual profile picture paths
        profilePicArray = service.profile_picture.replace(/[{}]/g, '').split(',').map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', ''));
    } else if (Array.isArray(service.profile_picture)) {
        // If it's already an array, process each item directly
        profilePicArray = service.profile_picture.map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', ''));
    }

    // Return processed profile picture URL
    const profilePicHtml = profilePicArray.map(img => {
        const imgSrc = `http://localhost:3000/uploads/profile_pics/${img}`; // Construct the correct URL
        return `<a href="${imgSrc}" target="_blank">${imgSrc}</a>`; // Link to view image
    }).join('<br>'); // Join images with line breaks

    return {
        profilePicHtml: profilePicHtml
    };
}

// Fetch and display home services data, and manage pagination
function fetchAndDisplayHomeServices() {
    let homeServiceCurrentPage = 1;
    const homeServicesPerPage = 10;  // Number of home services to display per page
    let homeAllServices = [];  // Store all fetched home services
    fetch('http://localhost:3000/api/admindashboard/home-services')
    .then(response => response.json())
    .then(data => {
        homeAllServices = data.rows;  // Store the fetched home services in the array
        const totalPages = Math.ceil(homeAllServices.length / homeServicesPerPage); // Calculate total pages

        // Function to display home services for the current page
        function homeDisplayServices(page) {
            const startIndex = (page - 1) * homeServicesPerPage;
            const endIndex = startIndex + homeServicesPerPage;
            const servicesToDisplay = homeAllServices.slice(startIndex, endIndex);

            const tableBody = document.querySelector('#home-services-table tbody');
            tableBody.innerHTML = '';  // Clear the existing rows

            servicesToDisplay.forEach(service => {
                const { profilePicHtml } = processHomeServiceFields(service); // Process profile picture

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${service.id}</td>
                    <td>${service.full_name}</td>
                    <td>${service.service_type}</td>
                    <td>${service.phone_number}</td>
                    <td>${service.locality}</td>
                    <td>${service.availability}</td>
                    <td>${profilePicHtml}</td> <!-- Display profile picture -->
                    <td>${service.rate}</td>
                    <td>${service.years_of_experience}</td>
                    <td>${service.client_id}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Function to update pagination controls based on the current page
        function homeUpdatePaginationControls() {
            const totalPages = Math.ceil(homeAllServices.length / homeServicesPerPage);
            const currentPageElement = document.querySelector('#home-current-page');
            currentPageElement.textContent = homeServiceCurrentPage;

            // Disable or enable the previous/next buttons based on the current page
            const prevPageBtn = document.querySelector('#home-prev-page-btn');
            const nextPageBtn = document.querySelector('#home-next-page-btn');

            prevPageBtn.disabled = homeServiceCurrentPage === 1;
            nextPageBtn.disabled = homeServiceCurrentPage === totalPages;
        }

        // Handle "Previous" button click
        document.querySelector('#home-prev-page-btn').addEventListener('click', () => {
            if (homeServiceCurrentPage > 1) {
                homeServiceCurrentPage--;
                homeDisplayServices(homeServiceCurrentPage);
                homeUpdatePaginationControls();
            }
        });

        // Handle "Next" button click
        document.querySelector('#home-next-page-btn').addEventListener('click', () => {
            const totalPages = Math.ceil(homeAllServices.length / homeServicesPerPage);
            if (homeServiceCurrentPage < totalPages) {
                homeServiceCurrentPage++;
                homeDisplayServices(homeServiceCurrentPage);
                homeUpdatePaginationControls();
            }
        });

        // Initial display and pagination control update
        homeDisplayServices(homeServiceCurrentPage);
        homeUpdatePaginationControls();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert("There was an issue fetching the data. Please try again.");
    });
}

// Call the function to fetch and display home services on page load
fetchAndDisplayHomeServices();




// Function to process profile picture for client (similar to how we handled in home services)
function processClientProfileFields(client) {
    let profilePicArray = [];
    if (typeof client.profile_picture === 'string') {
        // Remove curly braces and split by comma to get individual profile picture paths
        profilePicArray = client.profile_picture.replace(/[{}]/g, '').split(',').map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', ''));
    } else if (Array.isArray(client.profile_picture)) {
        // If it's already an array, process each item directly
        profilePicArray = client.profile_picture.map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', ''));
    }

    // Return processed profile picture URL
    const profilePicHtml = profilePicArray.map(img => {
        const imgSrc = `http://localhost:3000/uploads/profile_pics/${img}`; // Construct the correct URL
        return `<a href="${imgSrc}" target="_blank">${imgSrc}</a>`; // Link to view image
    }).join('<br>'); // Join images with line breaks

    return {
        profilePicHtml: profilePicHtml
    };
}

// Fetch and display client profiles, and manage pagination
function fetchAndDisplayClientProfiles() {
    let clientProfileCurrentPage = 1;
    const clientProfilesPerPage = 10;  // Number of client profiles to display per page
    let allClientProfiles = [];  // Store all fetched client profiles
    fetch('http://localhost:3000/api/admindashboard/client-profiles')
    .then(response => response.json())
    .then(data => {
        allClientProfiles = data.rows;  // Store the fetched client profiles in the array
        const totalPages = Math.ceil(allClientProfiles.length / clientProfilesPerPage); // Calculate total pages

        // Function to display client profiles for the current page
        function displayClientProfiles(page) {
            const startIndex = (page - 1) * clientProfilesPerPage;
            const endIndex = startIndex + clientProfilesPerPage;
            const profilesToDisplay = allClientProfiles.slice(startIndex, endIndex);

            const tableBody = document.querySelector('#client-profile-table tbody');
            tableBody.innerHTML = '';  // Clear the existing rows

            profilesToDisplay.forEach(client => {
                const { profilePicHtml } = processClientProfileFields(client); // Process profile picture

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.client_id}</td>
                    <td>${client.full_name}</td>
                    <td>${client.email}</td>
                    <td>${client.phone_number}</td>
                    <td>${client.date_of_birth}</td>
                    <td>${client.preferred_contact}</td>
                    <td>${client.address}</td>
                    <td>${profilePicHtml}</td> <!-- Display profile picture -->
                    <td>${client.is_complete}</td>
                    <td><a href="${client.facebook_url}" target="_blank">Facebook</a></td>
                    <td><a href="${client.twitter_url}" target="_blank">Twitter</a></td>
                    <td><a href="${client.linked_url}" target="_blank">LinkedIn</a></td>
                    <td>${client.bio}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Function to update pagination controls based on the current page
        function updatePaginationControls() {
            const totalPages = Math.ceil(allClientProfiles.length / clientProfilesPerPage);
            const currentPageElement = document.querySelector('#client-current-page');
            currentPageElement.textContent = clientProfileCurrentPage;

            // Disable or enable the previous/next buttons based on the current page
            const prevPageBtn = document.querySelector('#client-prev-page-btn');
            const nextPageBtn = document.querySelector('#client-next-page-btn');

            prevPageBtn.disabled = clientProfileCurrentPage === 1;
            nextPageBtn.disabled = clientProfileCurrentPage === totalPages;
        }

        // Handle "Previous" button click
        document.querySelector('#client-prev-page-btn').addEventListener('click', () => {
            if (clientProfileCurrentPage > 1) {
                clientProfileCurrentPage--;
                displayClientProfiles(clientProfileCurrentPage);
                updatePaginationControls();
            }
        });

        // Handle "Next" button click
        document.querySelector('#client-next-page-btn').addEventListener('click', () => {
            const totalPages = Math.ceil(allClientProfiles.length / clientProfilesPerPage);
            if (clientProfileCurrentPage < totalPages) {
                clientProfileCurrentPage++;
                displayClientProfiles(clientProfileCurrentPage);
                updatePaginationControls();
            }
        });

        // Initial display and pagination control update
        displayClientProfiles(clientProfileCurrentPage);
        updatePaginationControls();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert("There was an issue fetching the data. Please try again.");
    });
}

// Call the function to fetch and display client profiles on page load
fetchAndDisplayClientProfiles();







// ========================================================================
// delete operations
// =========================================================================


// delete rent property---------------------------------------------------------------------------------

// Function to initialize event listeners for Rent Property
function setupRentEventListeners() {
    initializeRentEventListeners();
}

// Function to initialize event listeners for Rent Property
function initializeRentEventListeners() {
    // Event listener for the 'Delete Rent Property' button
    const deleteRentPropertyButton = document.getElementById('delete-rent-property-btn');
    if (deleteRentPropertyButton) {
        deleteRentPropertyButton.addEventListener('click', showDeleteRentPropertyContainer);
    }

    // Event listener for the 'Cancel' button inside the delete container
    const cancelDeleteRentButton = document.getElementById('cancel-delete-btn');
    if (cancelDeleteRentButton) {
        cancelDeleteRentButton.addEventListener('click', cancelDeleteRentProperty);
    }

    // Event listener for the 'Confirm Delete' button
    const confirmDeleteRentButton = document.getElementById('confirm-delete-btn');
    if (confirmDeleteRentButton) {
        confirmDeleteRentButton.addEventListener('click', confirmDeleteRentProperty);
    }
}

// Function to show the delete Rent Property input container
function showDeleteRentPropertyContainer() {
    const deleteContainer = document.getElementById('delete-property-container');
    const overlay = document.getElementById('overlay');

    if (deleteContainer && overlay) {
        overlay.style.display = 'block'; // Show the overlay
        deleteContainer.style.display = 'flex'; // Show the container
    }
}

// Function to cancel the delete operation for Rent Property
function cancelDeleteRentProperty() {
    const deleteContainer = document.getElementById('delete-property-container');
    const overlay = document.getElementById('overlay');

    if (deleteContainer && overlay) {
        overlay.style.display = 'none'; // Hide the overlay
        deleteContainer.style.display = 'none'; // Hide the delete container
    }
}

// Function to confirm the delete operation and delete Rent Property
async function confirmDeleteRentProperty() {
    console.log('Property delete function starts executing');
    const propertyIdInput = document.getElementById('delete-property-id');
    const propertyId = propertyIdInput ? propertyIdInput.value.trim() : '';
    const overlay = document.getElementById('overlay');

    if (propertyId) {
        try {
            const response = await fetch(`http://localhost:3000/api/admindashboard/rent/${propertyId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                alert('Property deleted successfully!');
                removeRowFromTable(propertyId);  // Remove the property row from the table
            } else {
                const errorMessage = await response.text();
                alert(`Error deleting property: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Failed to delete property.');
        }
    } else {
        alert('Please enter a valid property ID.');
    }

    // Hide the overlay and delete container after the operation
    if (overlay) {
        overlay.style.display = 'none';
    }
    const deleteContainer = document.getElementById('delete-property-container');
    if (deleteContainer) {
        deleteContainer.style.display = 'none';
    }
}

// Function to remove the Rent Property row from the table once it's deleted
function removeRowFromTable(propertyId) {
    const table = document.getElementById('rent-properties-table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowId = row.querySelector('td').textContent;  // Assuming the first cell is the ID
            if (rowId === String(propertyId)) {
                row.remove();  // Remove the row with the matching ID
            }
        });
    }
}

// Call the setup function to initialize event listeners
setupRentEventListeners();



// delete sell property---------------------------------------------------------------------------------

// Function to initialize event listeners for delete operations
function setUpDeleteSellPropertyEvents() {
    initializeDeleteButtonListeners();
}

// Function to set up event listeners for the delete sell property button
function initializeDeleteButtonListeners() {
    const deleteSellPropertyBtn = document.getElementById('delete-sell-property-btn');
    if (deleteSellPropertyBtn) {
        console.log("Delete button found!");
        deleteSellPropertyBtn.addEventListener('click', showDeleteSellPropertyModal);
    }

    // Event listener for the 'Cancel' button inside the delete modal
    const cancelDeleteBtn = document.getElementById('cancel-delete-sell-btn');
    if (cancelDeleteBtn) {
        console.log("Delete button found!");
        cancelDeleteBtn.addEventListener('click', closeDeleteSellPropertyModal);
    }

    // Event listener for the 'Confirm Delete' button
    const confirmDeleteBtn = document.getElementById('confirm-delete-sell-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteSellPropertyAction);
    }
}

// Function to display the delete modal
function showDeleteSellPropertyModal() {
    const deleteModal = document.getElementById('delete-sell-property-container');
    const overlay = document.getElementById('overlay');

    if (deleteModal && overlay) {
        overlay.style.display = 'block'; // Show overlay
        deleteModal.style.display = 'flex'; // Display the modal container
    }
}

// Function to close the delete modal without deleting
function closeDeleteSellPropertyModal() {
    const deleteModal = document.getElementById('delete-sell-property-container');
    const overlay = document.getElementById('overlay');

    if (deleteModal && overlay) {
        overlay.style.display = 'none'; // Hide the overlay
        deleteModal.style.display = 'none'; // Hide the modal container
    }
}

// Function to confirm the delete action and delete the sell property from the database
async function confirmDeleteSellPropertyAction() {
    const propertyIdInput = document.getElementById('delete-sell-property-id');
    const propertyId = propertyIdInput ? propertyIdInput.value.trim() : '';
    const overlay = document.getElementById('overlay');

    if (propertyId) {
        try {
            const response = await fetch(`http://localhost:3000/api/admindashboard/sell/${propertyId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                alert('Sell property deleted successfully!');
                removeSellPropertyRowFromTable(propertyId);  // Remove the sell property row from the table after successful deletion
            } else {
                const errorMessage = await response.text();
                alert(`Error deleting sell property: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Failed to delete sell property.');
        }
    } else {
        alert('Please enter a valid property ID.');
    }

    // Hide the modal after the operation
    if (overlay) {
        overlay.style.display = 'none';
    }
    const deleteModal = document.getElementById('delete-sell-property-container');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

// Function to remove the sell property row from the table upon successful deletion
function removeSellPropertyRowFromTable(propertyId) {
    const table = document.getElementById('sell-properties-table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowId = row.querySelector('td').textContent;  // Assuming the first cell contains the property ID
            if (rowId === String(propertyId)) {
                row.remove(); // Remove the row with the matching property ID
            }
        });
    }
}

// Call the function to initialize event listeners
setUpDeleteSellPropertyEvents();



// delete home service workers-------------------------------------------------------------------------------

// Function to initialize event listeners for delete operations
function setUpDeleteHomeServiceEvents() {
    initializeDeletehomeButtonListeners();
}

// Function to set up event listeners for the delete home service button
function initializeDeletehomeButtonListeners() {
    const deleteHomeServiceBtn = document.getElementById('delete-home-service-btn');
    if (deleteHomeServiceBtn) {
        console.log('button got clicked');
        deleteHomeServiceBtn.addEventListener('click', showDeleteHomeServiceModal);
    }

    // Event listener for the 'Cancel' button inside the delete modal
    const cancelDeleteBtn = document.getElementById('cancel-delete-home-service-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteHomeServiceModal);
    }

    // Event listener for the 'Confirm Delete' button
    const confirmDeleteBtn = document.getElementById('confirm-delete-home-service-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteHomeServiceAction);
    }
}

// Function to display the delete modal
function showDeleteHomeServiceModal() {
    const deleteModal = document.getElementById('delete-home-service-container');
    const overlay = document.getElementById('overlay');

    if (deleteModal && overlay) {
        overlay.style.display = 'block'; // Show overlay
        deleteModal.style.display = 'flex'; // Display the modal container
    }
}

// Function to close the delete modal without deleting
function closeDeleteHomeServiceModal() {
    const deleteModal = document.getElementById('delete-home-service-container');
    const overlay = document.getElementById('overlay');

    if (deleteModal && overlay) {
        overlay.style.display = 'none'; // Hide the overlay
        deleteModal.style.display = 'none'; // Hide the modal container
    }
}

// Function to confirm the delete action and delete the home service from the database
async function confirmDeleteHomeServiceAction() {
    const serviceIdInput = document.getElementById('delete-home-service-id');
    const serviceId = serviceIdInput ? serviceIdInput.value.trim() : '';
    const overlay = document.getElementById('overlay');

    if (serviceId) {
        try {
            const response = await fetch(`http://localhost:3000/api/admindashboard/home-services/${serviceId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                alert('Home service deleted successfully!');
                removeHomeServiceRowFromTable(serviceId);  // Remove the home service row from the table after successful deletion
            } else {
                const errorMessage = await response.text();
                alert(`Error deleting home service: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Failed to delete home service.');
        }
    } else {
        alert('Please enter a valid service ID.');
    }

    // Hide the modal after the operation
    if (overlay) {
        overlay.style.display = 'none';
    }
    const deleteModal = document.getElementById('delete-home-service-container');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

// Function to remove the home service row from the table upon successful deletion
function removeHomeServiceRowFromTable(serviceId) {
    const table = document.getElementById('home-services-table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowId = row.querySelector('td').textContent;  // Assuming the first cell contains the service ID
            if (rowId === String(serviceId)) {
                row.remove(); // Remove the row with the matching service ID
            }
        });
    }
}

// Call the function to initialize event listeners
setUpDeleteHomeServiceEvents();



// delete client profile ----------------------------------------------------------------------------------

// Function to initialize event listeners for delete operations
function initDeleteClientProfileEvents() {
    setUpDeleteButtonListeners();
}

// Function to set up event listeners for the delete client profile button
function setUpDeleteButtonListeners() {
    const deleteClientProfileBtn = document.getElementById('delete-client-profile-btn');
    if (deleteClientProfileBtn) {
        deleteClientProfileBtn.addEventListener('click', showDeleteClientProfileModal);
    }

    // Event listener for the 'Cancel' button inside the delete modal
    const cancelDeleteBtn = document.getElementById('cancel-delete-client-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteClientProfileModal);
    }

    // Event listener for the 'Confirm Delete' button
    const confirmDeleteBtn = document.getElementById('confirm-delete-client-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteClientProfileAction);
    }
}

// Function to display the delete modal
function showDeleteClientProfileModal() {
    const deleteModal = document.getElementById('delete-client-profile-container');
    const overlay = document.getElementById('overlay');

    if (deleteModal && overlay) {
        overlay.style.display = 'block'; // Show overlay
        deleteModal.style.display = 'flex'; // Display the modal container
    }
}

// Function to close the delete modal without deleting
function closeDeleteClientProfileModal() {
    const deleteModal = document.getElementById('delete-client-profile-container');
    const overlay = document.getElementById('overlay');

    if (deleteModal && overlay) {
        overlay.style.display = 'none'; // Hide the overlay
        deleteModal.style.display = 'none'; // Hide the modal container
    }
}

// Function to confirm the delete action and delete the client profile from the database
async function confirmDeleteClientProfileAction() {
    const clientIdInput = document.getElementById('delete-client-id');
    const clientId = clientIdInput ? clientIdInput.value.trim() : '';
    const overlay = document.getElementById('overlay');

    if (clientId) {
        try {
            const response = await fetch(`http://localhost:3000/api/admindashboard/clients/${clientId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                alert('Client profile deleted successfully!');
                removeClientProfileRowFromTable(clientId);  // Remove the client profile row from the table after successful deletion
            } else {
                const errorMessage = await response.text();
                alert(`Error deleting client profile: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Failed to delete client profile.');
        }
    } else {
        alert('Please enter a valid client ID.');
    }

    // Hide the modal after the operation
    if (overlay) {
        overlay.style.display = 'none';
    }
    const deleteModal = document.getElementById('delete-client-profile-container');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

// Function to remove the client profile row from the table upon successful deletion
function removeClientProfileRowFromTable(clientId) {
    const table = document.getElementById('client-profiles-table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowId = row.querySelector('td').textContent;  // Assuming the first cell contains the client ID
            if (rowId === String(clientId)) {
                row.remove(); // Remove the row with the matching client ID
            }
        });
    }
}

// Call the function to initialize event listeners
initDeleteClientProfileEvents();



// =================================================================
//  update operations
// ===================================================================




// update sell form and its code---------------------------------------------------------------------------------------------------

function initializeUpdatesellPropertyForm() {
    // Show the update form when the "Update Property" button is clicked
    document.getElementById('update-sell-property-btn').addEventListener('click', showUpdatesellForm);

    // Close the update form when the cancel button is clicked
    document.getElementById('close-update-form').addEventListener('click', hideUpdatesellForm);

    // Event listener for the Property ID input
    document.getElementById('property-id').addEventListener('input', handlesellPropertyIdInput);

    // Submit form and send data to backend
    document.getElementById('update-property-form').addEventListener('submit', handlesellSubmitForm);
}

// Show the update form with overlay
function showUpdatesellForm() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('update-property-container').style.display = 'block';
}

// Hide the update form with overlay
function hideUpdatesellForm() {
    // Hide the overlay and form container
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('update-property-container').style.display = 'none';

    // Reset the form fields
    const updateForm = document.getElementById('update-property-form');
    updateForm.reset();  // Reset all form fields to their default values

    // Clear any dynamic fields (like the ones added for column selection)
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = '';  // Clears dynamic fields generated

    // Optionally, reset dropdowns and radio buttons to default (if needed)
    resetDropdowns(); 
}

function resetDropdowns() {
    // Get all dropdowns (select elements) on the page
    const dropdowns = document.querySelectorAll('select');

    // Loop through each dropdown and reset it to the default selected value
    dropdowns.forEach(function(dropdown) {
        dropdown.selectedIndex = 0; // Set to the first option (you can customize this if needed)
    });
}


// Handle the input for Property ID and dynamically add column dropdown
function handlesellPropertyIdInput() {
    const propertyId = document.getElementById('property-id').value;
    const fieldsContainer = document.getElementById('fields-container');
    
    // Clear any existing fields
    fieldsContainer.innerHTML = '';

    // If Property ID is provided, enable dropdown and allow selecting columns to update
    if (propertyId) {
        addsellColumnDropdown();
    }
}

// Function to add the dropdown for selecting which column to update
function addsellColumnDropdown(excludeColumn) {
    const fieldsContainer = document.getElementById('fields-container');
    
    // Column options for the dropdown
    const columns = getsellColumnOptions();

    // Create the dropdown
    const select = document.createElement('select');
    select.classList.add('update-column-dropdown');
    select.addEventListener('change', function() {
        addsellInputField(select.value);
    });

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'Select Column to Update';
    select.appendChild(defaultOption);

    // Populate the dropdown with column options
    columns.forEach(column => {
        if (column.value !== excludeColumn) {
            const option = document.createElement('option');
            option.value = column.value;
            option.innerText = column.label;
            select.appendChild(option);
        }
    });

    // Add the dropdown to the fields container
    fieldsContainer.appendChild(select);
}

// Function to get the column options
function getsellColumnOptions() {
    return [
        { value: 'property_title', label: 'Property Title' },
        { value: 'property_type', label: 'Property Type' },
        { value: 'price', label: 'Price' },
        { value: 'locality', label: 'Locality' },
        { value: 'location', label: 'Location' },
        { value: 'area', label: 'Area' },
        { value: 'number_of_bedrooms', label: 'Number of Bedrooms' },
        { value: 'number_of_bathrooms', label: 'Number of Bathrooms' },
        { value: 'number_of_balconies', label: 'Number of Balconies' },
        { value: 'year_built', label: 'Year Built' },
        { value: 'property_condition', label: 'Property Condition' },
        { value: 'parking_spaces', label: 'Parking Spaces' },
        { value: 'amenities', label: 'Amenities' },
        { value: 'furnished', label: 'Furnished' },
        { value: 'utilities_included', label: 'Utilities Included' },
        { value: 'floor_number', label: 'Floor Number' },
        { value: 'description', label: 'Description' },
        { value: 'photos', label: 'Photos' },
        { value: 'video_tour', label: 'Video Tour' },
        { value: 'seller_name', label: 'Seller Name' },
        { value: 'contact_number', label: 'Contact Number' },
        { value: 'email_address', label: 'Email Address' },
        { value: 'preferred_contact', label: 'Preferred Contact' },
        { value: 'additional_notes', label: 'Additional Notes' },
        { value: 'property_documents', label: 'Property Documents' }
    ];
}

// Function to handle adding input fields for the selected column
function addsellInputField(column) {
    const fieldsContainer = document.getElementById('fields-container');

    // Check if the input field already exists
    const existingField = document.getElementById(column);
    if (existingField) return;

    // Create the input field based on the column type
    let inputField;
    switch (column) {
        case 'property_title':
        case 'location':
        case 'description':
        case 'seller_name':
        case 'contact_number':
        case 'email_address':
        case 'amenities':
        case 'video_tour':
        case 'utilities_included':
        case 'additional_notes':
            inputField = createsellTextInput(column);
            break;
        case 'price':
        case 'area':
        case 'parking_spaces':
        case 'floor_number':
            inputField = createsellNumberInput(column);
            break;
        case 'property_type':
            inputField = createsellDropdown(column, ['House', 'Apartment', 'Villa', 'Other']); // Updated property types
            break;
        case 'locality':
            inputField = createsellDropdown(column, [
                'Ghaffar Manzil', 'Haji Colony', 'Johri Farm', 'Noor Nagar', 'Okhla Vihar', 
                'Shaheen Bagh', 'Abu Fazal Enclave', 'Joga Bai Extn', 'Ghafoor Nagar', 'Zakir Nagar', 
                'Batla House Chowk', 'Khaliullah Masjid', 'Pahalwan Chowk', 'Jasola Vihar', 'Sukhdev Vihar', 
                'Julena', 'New Friends Colony', 'Others'
            ]); // Added the full list of localities
            break;
        case 'year_built':
            inputField = createYearBuiltDropdown(column); // Handling dynamic population of Year Built
            break;
        case 'property_condition':
            inputField = createsellDropdown(column, ['New', 'Like New', 'Renovated', 'Requires Renovation', 'Old but Gold']); // Updated options
            break;
        case 'furnished':
            inputField = createsellDropdown(column, ['Furnished', 'Semi-Furnished', 'Unfurnished']); // Updated options
            break;
        case 'preferred_contact':
            inputField = createsellDropdown(column, ['phone', 'email', 'whatsapp']); // Options for preferred contact
            break;
        case 'number_of_bedrooms':
        case 'number_of_bathrooms':
        case 'number_of_balconies':
            inputField = createsellDropdown(column, ['1', '2', '3', '4', '5', '5+']); // Options for number of bedrooms, bathrooms, etc.
            break;
        case 'photos':
        case 'property_documents':
            inputField = createsellFileInput(column);
            break;
        default:
            break;
    }

    // Add the input field to the form
    if (inputField) {
        fieldsContainer.appendChild(inputField);
    }
}

// Create text input field
function createsellTextInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="text" id="${column}" name="${column}" required>`;
    return div;
}

// Create number input field
function createsellNumberInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="number" id="${column}" name="${column}" required>`;
    return div;
}

// Create dropdown input field
function createsellDropdown(column, options = []) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    let optionsHtml = '<option value="">Select</option>';

    options.forEach(option => {
        optionsHtml += `<option value="${option}">${option}</option>`;
    });

    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <select id="${column}" name="${column}" required>
                        ${optionsHtml}
                    </select>`;
    return div;
}

// Create Year Built dropdown with dynamic population
function createYearBuiltDropdown(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    const yearSelect = document.createElement('select');
    yearSelect.id = column;
    yearSelect.name = column;
    yearSelect.required = true;

    const currentYear = new Date().getFullYear();
    let optionsHtml = '<option value="">Select Year</option>';
    for (let year = currentYear; year >= 1900; year--) {
        optionsHtml += `<option value="${year}">${year}</option>`;
    }

    yearSelect.innerHTML = optionsHtml;
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>`;
    div.appendChild(yearSelect);
    
    return div;
}

// Create file input field
function createsellFileInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="file" id="${column}" name="${column}" multiple required>`;
    return div;
}

// Submit the form and send data to backend
function handlesellSubmitForm(event) {
    event.preventDefault();

    const propertyId = document.getElementById('property-id').value;
    if (!propertyId) {
        alert('Please enter a valid Property ID.');
        return;
    }

    const formData = new FormData();
    formData.append('id', propertyId);
    console.log(formData);

    // Loop through the form inputs and append the selected column values
    const fields = document.querySelectorAll('.form-field input, .form-field select');
    fields.forEach(field => {
        if (field.type === 'file') {
            // Handle file input separately
            if (field.files.length > 0) {
                formData.append(field.name, field.files[0]);  // Add file
            }
        } else {
            formData.append(field.name, field.value);
        }
    });

    // Send the form data to the backend
    fetch('http://localhost:3000/api/admindashboard/sell-properties/update', {
        method: 'PATCH',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Property updated successfully');
            hideUpdatesellForm();
        } else {
            alert('Error updating property: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating property.');
    });
}

// Initialize the form when the page loads
initializeUpdatesellPropertyForm();













//  update rent property ----------------------------------------------------------------------------

function initializeUpdaterentPropertyForm() {
    // Show the update form when the "Update Property" button is clicked
    document.getElementById('update-rent-property-btn').addEventListener('click', showUpdaterentForm);

    // Close the update form when the cancel button is clicked
    document.getElementById('close-update-rent-form').addEventListener('click', hideUpdaterentForm);

    // Event listener for the Property ID input
    document.getElementById('rent-property-id').addEventListener('input', handlerentPropertyIdInput);

    // Submit form and send data to backend
    document.getElementById('update-rent-property-form').addEventListener('submit', handlerentSubmitForm);
}

// Show the update form with overlay
function showUpdaterentForm() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('update-rent-property-container').style.display = 'block';
}

// Hide the update form with overlay
function hideUpdaterentForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('update-rent-property-container').style.display = 'none';

    // Reset the form fields
    const updateForm = document.getElementById('update-rent-property-form');
    updateForm.reset();  // Reset all form fields

    // Clear dynamic fields
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = '';  // Clears dynamic fields generated
}

function resetrentDropdowns() {
    // Get all dropdowns (select elements) on the page
    const dropdowns = document.querySelectorAll('select');

    // Loop through each dropdown and reset it to the default selected value
    dropdowns.forEach(function(dropdown) {
        dropdown.selectedIndex = 0; // Set to the first option (you can customize this if needed)
    });
}

// Handle the input for Property ID and dynamically add column dropdown
function handlerentPropertyIdInput() {
    const propertyId = document.getElementById('rent-property-id').value;
    const fieldsContainer = document.getElementById('fields-container');
    
    // Clear any existing fields
    fieldsContainer.innerHTML = '';

    // If Property ID is provided, enable dropdown and allow selecting columns to update
    if (propertyId) {
        addrentColumnDropdown();
    }
}

// Function to add the dropdown for selecting which column to update
function addrentColumnDropdown(excludeColumn) {
    const fieldsContainer = document.getElementById('fields-container');
    
    const columns = getrentColumnOptions();

    // Create the dropdown
    const select = document.createElement('select');
    select.classList.add('update-column-dropdown');
    select.addEventListener('change', function() {
        addrentInputField(select.value);
    });

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'Select Column to Update';
    select.appendChild(defaultOption);

    // Populate the dropdown with column options
    columns.forEach(column => {
        if (column.value !== excludeColumn) {
            const option = document.createElement('option');
            option.value = column.value;
            option.innerText = column.label;
            select.appendChild(option);
        }
    });

    // Add the dropdown to the fields container
    fieldsContainer.appendChild(select);
}

// Get the column options for Rent Property
function getrentColumnOptions() {
    return [
        { value: 'property_title', label: 'Property Title' },
        { value: 'property_type', label: 'Property Type' },
        { value: 'monthly_price', label: 'Monthly Price' },
        { value: 'locality', label: 'Locality' },
        { value: 'location', label: 'Location' },
        { value: 'area', label: 'Area' },
        { value: 'number_of_bedrooms', label: 'Number of Bedrooms' },
        { value: 'number_of_bathrooms', label: 'Number of Bathrooms' },
        { value: 'number_of_balconies', label: 'Number of Balconies' },
        { value: 'year_built', label: 'Year Built' },
        { value: 'property_condition', label: 'Property Condition' },
        { value: 'parking_spaces', label: 'Parking Spaces' },
        { value: 'amenities', label: 'Amenities' },
        { value: 'furnished', label: 'Furnished' },
        { value: 'utilities_included', label: 'Utilities Included' },
        { value: 'floor_number', label: 'Floor Number' },
        { value: 'description', label: 'Description' },
        { value: 'photos', label: 'Photos' },
        { value: 'video_tour', label: 'Video Tour' },
        { value: 'landlord_name', label: 'Landlord Name' },
        { value: 'contact_number', label: 'Contact Number' },
        { value: 'email_address', label: 'Email Address' },
        { value: 'preferred_contact', label: 'Preferred Contact' },
        { value: 'additional_notes', label: 'Additional Notes' }
    ];
}

// Function to handle adding input fields for the selected column
function addrentInputField(column) {
    const fieldsContainer = document.getElementById('fields-container');

    const existingField = document.getElementById(column);
    if (existingField) return;

    let inputField;
    switch (column) {
        case 'property_title':
        case 'location':
        case 'description':
        case 'landlord_name':
        case 'contact_number':
        case 'email_address':
        case 'amenities':
        case 'video_tour':
        case 'utilities_included':
        case 'additional_notes':
            inputField = createrentTextInput(column);
            break;
        case 'monthly_price':
        case 'area':
        case 'parking_spaces':
        case 'floor_number':
            inputField = createrentNumberInput(column);
            break;
        case 'property_type':
            inputField = createrentDropdown(column, ['House', 'Apartment', 'Villa', 'shared Room','Other']);
            break;
        case 'locality':
            inputField = createrentDropdown(column, [
                'Ghaffar Manzil', 'Haji Colony', 'Johri Farm', 'Noor Nagar', 'Okhla Vihar', 
                'Shaheen Bagh', 'Abu Fazal Enclave', 'Joga Bai Extn', 'Ghafoor Nagar', 'Zakir Nagar', 
                'Batla House Chowk', 'Khaliullah Masjid', 'Pahalwan Chowk', 'Jasola Vihar', 'Sukhdev Vihar', 
                'Julena', 'New Friends Colony', 'Others'
            ]); // Added the full list of localities
            break;
        case 'year_built':
            inputField = createYearBuiltDropdown(column);
            break;
        case 'property_condition':
            inputField = createrentDropdown(column, ['New', 'Like New', 'Renovated', 'Requires Renovation', 'Old but Gold']);
            break;
        case 'furnished':
            inputField = createrentDropdown(column, ['Furnished', 'Semi-Furnished', 'Unfurnished']);
            break;
        case 'preferred_contact':
            inputField = createrentDropdown(column, ['phone', 'email', 'whatsapp']);
            break;
        case 'number_of_bedrooms':
        case 'number_of_bathrooms':
        case 'number_of_balconies':
            inputField = createrentDropdown(column, ['1', '2', '3', '4', '5', '5+']);
            break;
        case 'photos':
            inputField = createrentFileInput(column);
            break;
        default:
            break;
    }

    // Add the input field to the form
    if (inputField) {
        fieldsContainer.appendChild(inputField);
    }
}

// Create text input field for Rent Property
function createrentTextInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="text" id="${column}" name="${column}" required>`;
    return div;
}

// Create number input field for Rent Property
function createrentNumberInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="number" id="${column}" name="${column}" required>`;
    return div;
}

// Create dropdown input field for Rent Property
function createrentDropdown(column, options) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    const select = document.createElement('select');
    select.id = column;
    select.name = column;

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.innerText = option;
        select.appendChild(optionElement);
    });

    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>`;
    div.appendChild(select);

    return div;
}

// Create file input field for Rent Property
function createrentFileInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="file" id="${column}" name="${column}" multiple required>`;
    return div;
}

function createYearBuiltDropdown(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    const select = document.createElement('select');
    select.id = column;
    select.name = column;

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        select.appendChild(option);
    }

    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>`;
    div.appendChild(select);

    return div;
}


// Submit the Rent Property form and send data to backend
function handlerentSubmitForm(event) {
    event.preventDefault();

    const propertyId = document.getElementById('rent-property-id').value;
    if (!propertyId) {
        alert('Please enter a valid Property ID.');
        return;
    }

    const formData = new FormData();
    formData.append('id', propertyId);

    const fields = document.querySelectorAll('.form-field input, .form-field select');
    fields.forEach(field => {
        if (field.type === 'file') {
            formData.append(field.name, field.files);
        } else {
            formData.append(field.name, field.value);
        }
    });

    fetch('http://localhost:3000/api/admindashboard/rent-properties/update', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Property updated successfully!');
                hideUpdaterentForm();  // Close the form
            } else {
                alert('Failed to update property.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the property.');
        });
}

initializeUpdaterentPropertyForm();









//  update home services workers form ------------------------------------------------------------------------

function initializeUpdateHomeServicesForm() {
    // Show the update form when the "Update Service Worker" button is clicked
    document.getElementById('update-home-service-btn').addEventListener('click', showUpdateHomeServicesForm);

    // Close the update form when the cancel button is clicked
    document.getElementById('close-update-home-form').addEventListener('click', hideUpdateHomeServicesForm);

    // Event listener for Service Worker ID input
    document.getElementById('home-service-id').addEventListener('input', handleHomeServiceIdInput);

    // Submit form and send data to backend
    document.getElementById('update-home-service-form').addEventListener('submit', handleHomeServiceSubmitForm);
}

// Show the update form with overlay
function showUpdateHomeServicesForm() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('update-home-service-container').style.display = 'block';
}

// Hide the update form with overlay
function hideUpdateHomeServicesForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('update-home-service-container').style.display = 'none';

    // Reset the form fields
    const updateForm = document.getElementById('update-home-service-form');
    updateForm.reset();  // Reset all form fields

    // Clear dynamic fields
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = '';  // Clears dynamic fields generated
}

// Handle the input for Service Worker ID and dynamically add column dropdown
function handleHomeServiceIdInput() {
    const serviceWorkerId = document.getElementById('home-service-id').value;
    const fieldsContainer = document.getElementById('fields-container');
    
    // Clear any existing fields
    fieldsContainer.innerHTML = '';

    // If Service Worker ID is provided, enable dropdown and allow selecting columns to update
    if (serviceWorkerId) {
        addHomeServiceColumnDropdown();
    }
}

// Function to add the dropdown for selecting which column to update
function addHomeServiceColumnDropdown() {
    const fieldsContainer = document.getElementById('fields-container');
    
    const columns = getHomeServiceColumnOptions();

    // Create the dropdown
    const select = document.createElement('select');
    select.classList.add('update-column-dropdown');
    select.addEventListener('change', function() {
        addHomeServiceInputField(select.value);
    });

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'Select Column to Update';
    select.appendChild(defaultOption);

    // Populate the dropdown with column options
    columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column.value;
        option.innerText = column.label;
        select.appendChild(option);
    });

    // Add the dropdown to the fields container
    fieldsContainer.appendChild(select);
}

// Get the column options for Home Services
function getHomeServiceColumnOptions() {
    return [
        { value: 'full_name', label: 'Full Name' },
        { value: 'service_type', label: 'Service Type' },
        { value: 'phone_number', label: 'Phone Number' },
        { value: 'locality', label: 'Locality' },
        { value: 'availability', label: 'Availability' },
        { value: 'rate', label: 'Rate' },
        { value: 'years_of_experience', label: 'Years of Experience' },
        { value: 'profile_picture', label: 'Profile Picture' }
    ];
}

// Function to handle adding input fields for the selected column
function addHomeServiceInputField(column) {
    const fieldsContainer = document.getElementById('fields-container');

    let inputField;
    switch (column) {
        case 'full_name':
        case 'phone_number':
        case 'availability':
            inputField = createHomeServiceTextInput(column);
            break;
        case 'rate':
        case 'years_of_experience':
            inputField = createHomeServiceNumberInput(column);
            break;
        case 'service_type':
            inputField = createHomeServiceDropdown(column, ['Plumber', 'Carpenter', 'Painter', 'Electrician', 'Cook', 'Cleaner', 'Outdoor Worker']);
            break;
        case 'locality':
            inputField = createHomeServiceDropdown(column, [
                'Ghaffar Manzil', 'Haji Colony', 'Johri Farm', 'Noor Nagar', 'Okhla Vihar', 
                'Shaheen Bagh', 'Abu Fazal Enclave', 'Joga Bai Extn', 'Ghafoor Nagar', 'Zakir Nagar', 
                'Batla House Chowk', 'Khaliullah Masjid', 'Pahalwan Chowk', 'Jasola Vihar', 'Sukhdev Vihar', 
                'Julena', 'New Friends Colony', 'Others'
            ]); // Added the full list of localities
            break;
        case 'profile_picture':
            inputField = createHomeServiceFileInput(column);
            break;
        default:
            break;
    }

    // Add the input field to the form
    if (inputField) {
        fieldsContainer.appendChild(inputField);
    }
}

// Create text input field for Home Services
function createHomeServiceTextInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="text" id="${column}" name="${column}" required>`;
    return div;
}

// Create number input field for Home Services
function createHomeServiceNumberInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="number" id="${column}" name="${column}" required>`;
    return div;
}

// Create dropdown input field for Home Services
function createHomeServiceDropdown(column, options = []) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    let optionsHtml = '<option value="">Select</option>';

    options.forEach(option => {
        optionsHtml += `<option value="${option}">${option}</option>`;
    });

    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <select id="${column}" name="${column}" required>
                        ${optionsHtml}
                    </select>`;
    return div;
}

// Create file input field for Home Services
function createHomeServiceFileInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="file" id="${column}" name="${column}" multiple required>`;
    return div;
}

// Submit the Home Service form and send data to backend
function handleHomeServiceSubmitForm(event) {
    event.preventDefault();

    const serviceWorkerId = document.getElementById('home-service-id').value;
    if (!serviceWorkerId) {
        alert('Please enter a valid Service Worker ID.');
        return;
    }

    const formData = new FormData();
    formData.append('id', serviceWorkerId);

    const fields = document.querySelectorAll('.form-field input, .form-field select');
    fields.forEach(field => {
        if (field.type === 'file') {
            formData.append(field.name, field.files);
        } else {
            formData.append(field.name, field.value);
        }
    });

    fetch('http://localhost:3000/api/admindashboard/home-services/update', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Service Worker updated successfully!');
                hideUpdateHomeServicesForm();  // Close the form
            } else {
                alert('Failed to update service worker.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the service worker.');
        });
}

initializeUpdateHomeServicesForm();









//  update client profile management form ---------------------------------------------------------------

function initializeUpdateClientForm() {
    // Show the update form when the "Update Client" button is clicked
    document.getElementById('update-client-profile-btn').addEventListener('click', showUpdateClientForm);

    // Close the update form when the cancel button is clicked
    document.getElementById('close-update-client-form').addEventListener('click', hideUpdateClientForm);

    // Event listener for Client ID input
    document.getElementById('client-profile-id').addEventListener('input', handleClientIdInput);

    // Submit form and send data to backend
    document.getElementById('update-client-profile-form').addEventListener('submit', handleClientSubmitForm);
}

// Show the update form with overlay
function showUpdateClientForm() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('update-client-profile-container').style.display = 'block';
}

// Hide the update form with overlay
function hideUpdateClientForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('update-client-profile-container').style.display = 'none';

    // Reset the form fields
    const updateForm = document.getElementById('update-client-profile-form');
    updateForm.reset();  // Reset all form fields

    // Clear dynamic fields
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = '';  // Clears dynamic fields generated
}

// Handle the input for Client ID and dynamically add column dropdown
function handleClientIdInput() {
    const clientId = document.getElementById('client-profile-id').value;
    const fieldsContainer = document.getElementById('fields-container');
    
    // Clear any existing fields
    fieldsContainer.innerHTML = '';

    // If Client ID is provided, enable dropdown and allow selecting columns to update
    if (clientId) {
        addClientColumnDropdown();
    }
}

// Function to add the dropdown for selecting which column to update
function addClientColumnDropdown() {
    const fieldsContainer = document.getElementById('fields-container');
    
    const columns = getClientColumnOptions();

    // Create the dropdown
    const select = document.createElement('select');
    select.classList.add('update-column-dropdown');
    select.addEventListener('change', function() {
        addClientInputField(select.value);
    });

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'Select Column to Update';
    select.appendChild(defaultOption);

    // Populate the dropdown with column options
    columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column.value;
        option.innerText = column.label;
        select.appendChild(option);
    });

    // Add the dropdown to the fields container
    fieldsContainer.appendChild(select);
}

// Get the column options for Clients
function getClientColumnOptions() {
    return [
        { value: 'full_name', label: 'Full Name' },
        { value: 'email', label: 'Email' },
        { value: 'phone_number', label: 'Phone Number' },
        { value: 'preferred_contact', label: 'Preferred Contact' },
        { value: 'address', label: 'Address' },
        { value: 'profile_picture', label: 'Profile Picture' }
    ];
}

// Function to handle adding input fields for the selected column
function addClientInputField(column) {
    const fieldsContainer = document.getElementById('fields-container');

    let inputField;
    switch (column) {
        case 'full_name':
        case 'phone_number':
        case 'address':
            inputField = createClientTextInput(column);
            break;
        case 'email':
            inputField = createClientEmailInput(column);
            break;
        case 'preferred_contact':
            inputField = createClientDropdownInput(column, ['Phone', 'Email', 'WhatsApp']);
            break;
        case 'profile_picture':
            inputField = createClientFileInput(column);
            break;
        default:
            break;
    }

    // Add the input field to the form
    if (inputField) {
        fieldsContainer.appendChild(inputField);
    }
}

// Create text input field for Client Management
function createClientTextInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="text" id="${column}" name="${column}" required>`;
    return div;
}

// Create email input field for Client Management
function createClientEmailInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="email" id="${column}" name="${column}" required>`;
    return div;
}

// Create dropdown input field for Client Management
function createClientDropdownInput(column, options = []) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    let optionsHtml = '<option value="">Select</option>';

    options.forEach(option => {
        optionsHtml += `<option value="${option}">${option}</option>`;
    });

    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <select id="${column}" name="${column}" required>
                        ${optionsHtml}
                    </select>`;
    return div;
}

// Create file input field for Client Management
function createClientFileInput(column) {
    const div = document.createElement('div');
    div.classList.add('form-field');
    div.innerHTML = `<label for="${column}">${column.replace(/_/g, ' ').toUpperCase()}:</label>
                    <input type="file" id="${column}" name="${column}" multiple required>`;
    return div;
}

// Submit the Client form and send data to backend
function handleClientSubmitForm(event) {
    event.preventDefault();

    const clientId = document.getElementById('client-profile-id').value;
    if (!clientId) {
        alert('Please enter a valid Client ID.');
        return;
    }

    const formData = new FormData();
    formData.append('id', clientId);

    const fields = document.querySelectorAll('.form-field input, .form-field select');
    fields.forEach(field => {
        if (field.type === 'file') {
            formData.append(field.name, field.files);
        } else {
            formData.append(field.name, field.value);
        }
    });

    fetch('http://localhost:3000/api/admindashboard/client-profile/update', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Client updated successfully!');
                hideUpdateClientForm();  // Close the form
            } else {
                alert('Failed to update client.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the client.');
        });
}

initializeUpdateClientForm();
