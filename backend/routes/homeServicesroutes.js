// backend/routes/homeServicesroutes.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pool = require('../db'); // Adjust as per your DB connection setup

const router = express.Router();

// Ensure the necessary directories exist
const ensureDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Directory created: ${directory}`);
  }
};

// Define the path for profile pictures directory
const profilePicDirectory = path.join(__dirname, '../uploads/profile_pics');

// Ensure directory is present
ensureDirectory(profilePicDirectory);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicDirectory); // All images go to profile pictures directory
  },
  filename: (req, file, cb) => {
    // Append timestamp to file name to ensure uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
  

// POST route to submit new home services
router.post(
  '/',
  upload.array('profile_picture', 5), // Allow multiple profile pictures (adjust maxCount as needed)
  async (req, res) => {
    try {
      const {
        full_name, service_type, phone_number, locality, availability, rate, years_of_experience
      } = req.body;

      // Get client_id from session or request
      const client_id = req.user ? req.user.id : req.body.client_id;
      console.log('Client ID retrieved:', client_id);

      // Array to track missing required fields
      const missingFields = [];

      // Validate required fields
      if (!full_name) missingFields.push('full_name');
      if (!service_type) missingFields.push('service_type');
      if (!phone_number) missingFields.push('phone_number');
      if (!locality) missingFields.push('locality');
      if (!availability) missingFields.push('availability');
      if (!client_id) missingFields.push('client_id');

      // Check if any fields are missing
      if (missingFields.length > 0) {
        console.error('Validation failed: Missing required fields:', missingFields);
        return res.status(400).json({ error: 'Missing required fields: ' + missingFields.join(', ') });
      }

      // Validate rate to ensure it's a valid positive number
      if (rate && (isNaN(rate) || parseFloat(rate) < 0)) {
        console.error('Validation failed: Invalid rate');
        return res.status(400).json({ error: 'Rate must be a valid positive number.' });
      }

      // Collect file paths for profile pictures (if any)
      const profilePictures = req.files.map(file => file.path);

      console.log('Profile Pictures:', profilePictures);

      // Format array for PostgreSQL (it must start with '{' and end with '}')
      const formattedProfilePictures = profilePictures.length > 0 ? `{${profilePictures.join(',')}}` : null;

      // Insert service data into the database
      const query = `
        INSERT INTO home_services 
        (full_name, service_type, phone_number, locality, availability, profile_picture, 
        rate, years_of_experience, client_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `;
      const values = [
        full_name, service_type, phone_number, locality, availability, 
        formattedProfilePictures, // use the formatted profile pictures string
        rate || null,              // Allow null for optional fields
        years_of_experience || null, // Allow null for optional fields
        client_id
      ];

      const result = await pool.query(query, values);
      console.log('Service successfully saved with ID:', result.rows[0].id);
      res.status(201).json({ service_id: result.rows[0].id });
    } catch (error) {
      console.error('Error saving service to database:', error);
      res.status(500).json({ error: 'Internal Server Error while saving service' });
    }
  }
);


// Route to search home services with locality and optional service_type using POST method
router.post('/search', async (req, res) => {
  try {
      const { locality, service_type } = req.body;

      // Check if locality is provided
      if (!locality) {
          return res.status(400).json({ error: "Locality is required for search." });
      }

      // Build the SQL query with dynamic values
      let query = 'SELECT * FROM home_services WHERE locality = $1';
      const values = [locality];

      // Add service_type filter if provided, converting input to uppercase
      if (service_type) {
          const serviceTypeUpper = service_type.toUpperCase();
          values.push(serviceTypeUpper);
          query += ` AND service_type = $${values.length}`;
      }

      // Execute the query
      const result = await pool.query(query, values);

      // Send a message if no results found
      if (result.rows.length === 0) {
          return res.status(404).json({ message: "No matching workers found." });
      }

      res.json(result.rows); // Return results if found
  } catch (error) {
      console.error("Error searching home services:", error);
      res.status(500).json({ error: "An error occurred while searching for home services." });
  }
});


module.exports = router;
