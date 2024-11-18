

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db'); // Connection to the database
const router = express.Router();

// Ensure the necessary directories exist
const ensureDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Directory created: ${directory}`);
  }
};

// Define the paths for photos and documents directories
const photosDirectory = path.join(__dirname, '../uploads/photos');
const documentsDirectory = path.join(__dirname, '../uploads/documents');

// Ensure directories are present
ensureDirectory(photosDirectory);
ensureDirectory(documentsDirectory);

// Set up multer for file uploads with improved error handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Running multer disk storage for upload directory folder');
    if (file.fieldname === 'photos') {
      cb(null, photosDirectory);
    } else if (file.fieldname === 'documents') {
      cb(null, documentsDirectory);
    } else {
      cb(new Error('Invalid field name for file upload')); // Handle unexpected field names
    }
  },
  filename: (req, file, cb) => {
    // Append timestamp to file name to ensure uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to handle form data and save to database
router.post(
  '/',
  upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'documents', maxCount: 5 }]),
  async (req, res) => {
    try {
      const {
        property_title, property_type, price, locality, location, area,
        number_of_bedrooms, number_of_bathrooms, number_of_balconies, year_built,
        property_condition, parking_spaces, amenities, furnished, utilities_included,
        floor_number, description, video_tour, seller_name, 
        contact_number, email_address, preferred_contact, additional_notes
      } = req.body;

      console.log('Fetching client_id from session or request');
      // Get client_id from session or request
      const client_id = req.user ? req.user.id : req.body.client_id;
      console.log('Client ID retrieved:', client_id);

      // Array to track missing required fields
      const missingFields = [];

      // Validate required fields
      if (!property_title) missingFields.push('property_title');
      if (!property_type) missingFields.push('property_type');
      if (!price) missingFields.push('price');
      if (!locality) missingFields.push('locality');
      if (!location) missingFields.push('location');
      if (!area) missingFields.push('area');
      if (!number_of_bedrooms) missingFields.push('number_of_bedrooms');
      if (!number_of_bathrooms) missingFields.push('number_of_bathrooms');
      if (!property_condition) missingFields.push('property_condition');
      if (!utilities_included) missingFields.push('utilities_included');
      if (!seller_name) missingFields.push('seller_name');
      if (!contact_number) missingFields.push('contact_number');
      if (!email_address) missingFields.push('email_address');
      if (!client_id) missingFields.push('client_id');

      // Check if any fields are missing
      if (missingFields.length > 0) {
        console.error('Validation failed: Missing required fields:', missingFields);
        return res.status(400).json({ error: 'Missing required fields: ' + missingFields.join(', ') });
      }

      // Validate price to ensure it's a valid positive number
      if (!price || isNaN(price) || parseFloat(price) < 0) {
        console.error('Validation failed: Invalid price');
        return res.status(400).json({ error: 'Price must be a valid positive number.' });
      }

      // Collect file paths for photos and documents
      const photos = req.files['photos'] ? req.files['photos'].map(file => file.path) : [];
      const documents = req.files['documents'] ? req.files['documents'].map(file => file.path) : [];

      console.log('Photos:', photos);
      console.log('Documents:', documents);

      // Format arrays for PostgreSQL (they must start with '{' and end with '}')
      const formattedPhotos = photos.length > 0 ? `{${photos.join(',')}}` : null;
      const formattedDocuments = documents.length > 0 ? `{${documents.join(',')}}` : null;


      // Insert property data into the database
      const query = `
        INSERT INTO sell_properties 
        (property_title, property_type, price, locality, location, area, 
        number_of_bedrooms, number_of_bathrooms, number_of_balconies, year_built, 
        property_condition, parking_spaces, amenities, furnished, utilities_included, 
        floor_number, description, photos, video_tour, seller_name, 
        contact_number, email_address, preferred_contact, additional_notes, property_documents, client_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        RETURNING id;
      `;
      const values = [
        property_title, property_type, price, locality, location, area, 
        number_of_bedrooms, number_of_bathrooms,
        number_of_balconies || null,    // Allow null for optional fields
        year_built || null,              // Allow null for optional fields
        property_condition, 
        parking_spaces || null,          // Allow null for optional fields
        amenities || null,               // Allow null for optional fields
        furnished || null,               // Allow null for optional fields
        utilities_included, 
        floor_number || null,            // Allow null for optional fields
        description || null,             // Allow null for optional fields
        formattedPhotos,             // use the formatted photos string
        video_tour || null,              // Allow null for optional fields
        seller_name, 
        contact_number, 
        email_address, 
        preferred_contact || null,       // Allow null for optional fields
        additional_notes || null,        // Allow null for optional fields
        formattedDocuments,         // use the formatted document string
        client_id
      ];

      const result = await pool.query(query, values);
      console.log('Property successfully saved with ID:', result.rows[0].id);
      res.status(201).json({ property_id: result.rows[0].id });
    } catch (error) {
      console.error('Error saving property to database:', error);
      res.status(500).json({ error: 'Internal Server Error while saving property' });
    }
  }
);

module.exports = router;
