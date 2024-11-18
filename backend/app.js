// backend/app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path for serving static files
const adminRoutes = require('./routes/admin'); // Import the admin routes
const clientRoutes = require('./routes/client'); // Import the client routes
const sellFormRoutes = require('./routes/sellform'); // Import the sell form routes
const rentFormRoute = require('./routes/rentform');  // Import the rent form routes
const buypropertyRoutes = require('./routes/buypropertyroutes'); // Import buy property routes
const forrentpropertyRoutes = require('./routes/forrentpropertyroutes'); // Import the for_rent property routes
const homeServicesRoutes = require('./routes/homeServicesroutes'); // Import home services routes
const admindashboardRoutes = require('./routes/admindashboardroutes'); // Import admin_dashboard routes



const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // To handle URL-encoded data

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads

// Routes
app.use('/api/admin', adminRoutes); // Use the admin routes with a base URL
app.use('/api/client', clientRoutes); // Use the client routes with a base URL
app.use('/api/sellproperty', sellFormRoutes); // Use the sell property routes with a base URL
app.use('/api/rentproperty', rentFormRoute);  // Use the rent property routes with a base URL
app.use('/api/properties', buypropertyRoutes); // Use the properties routes with a base URL
app.use('/api/forrentproperties', forrentpropertyRoutes); // Use the rent property routes with a base URL
app.use('/api/home-services', homeServicesRoutes); // Use the home services routes with a base URL
app.use('/api/admindashboard', admindashboardRoutes); // Use the admin dashboard routes with a base URL



// Start the server
const host = '0.0.0.0'; //Bind all network to interface
app.listen(PORT, host, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send('Something went wrong!'); // Send an error response
});

//Add a catch-all route for handling 404 errors
app.use((req, res) => {
    res.status(404).send('Sorry, that route does not exist.');
});