const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');
const router = express.Router();
const pool = require('../db'); // Assuming you have a pool setup for database connections

// ========================================
// 1. Client Analytics
// ========================================

router.get('/analytics/client', async (req, res) => {
  try {
    // Execute all client analytics queries in parallel
    const clientQueries = [
      pool.query('SELECT COUNT(id) AS total_clients FROM client_login'),
      pool.query('SELECT COUNT(DISTINCT client_id) AS total_sell_clients FROM sell_properties'),
      pool.query('SELECT COUNT(DISTINCT client_id) AS total_rent_clients FROM rent_properties'),
      pool.query('SELECT COUNT(DISTINCT client_id) AS total_home_service_clients FROM home_services'),
    ];

    const [
      totalClients,
      totalSellClients,
      totalRentClients,
      totalHomeServiceClients
    ] = await Promise.all(clientQueries);

    const clientAnalytics = {
      total_clients: totalClients.rows[0].total_clients,
      total_sell_clients: totalSellClients.rows[0].total_sell_clients,
      total_rent_clients: totalRentClients.rows[0].total_rent_clients,
      total_home_service_clients: totalHomeServiceClients.rows[0].total_home_service_clients
    };

    console.log('Total Clients:', totalClients);
    console.log('Total Sell Clients:', totalSellClients);
    console.log('Total Rent Clients:', totalRentClients);
    console.log('Total Home Service Clients:', totalHomeServiceClients);


    // Send all client analytics data
    res.json({ clientAnalytics });
  } catch (error) {
    console.error('Error fetching client analytics data:', error);
    res.status(500).json({ error: 'Error fetching client analytics data' });
  }
});


// ========================================
// 2. Sell Property Analytics
// ========================================


router.get('/analytics/sell-property', async (req, res) => {
    try {
      const sellPropertyQueries = [
        pool.query('SELECT COUNT(id) AS total_sell_properties FROM sell_properties'),
        pool.query('SELECT property_type, COUNT(id) AS count FROM sell_properties GROUP BY property_type'),
        pool.query('SELECT locality, COUNT(id) AS count FROM sell_properties GROUP BY locality'),
        pool.query('SELECT CASE ' +
          'WHEN price::NUMERIC < 100000 THEN \'Under 100k\' ' +
          'WHEN price::NUMERIC BETWEEN 100000 AND 1000000 THEN \'1Lac - 10Lac\' ' +
          'WHEN price::NUMERIC BETWEEN 1000000 AND 2000000 THEN \'10Lac - 20Lac\' ' +
          'WHEN price::NUMERIC BETWEEN 2000000 AND 3000000 THEN \'20Lac - 30Lac\' ' +
          'WHEN price::NUMERIC BETWEEN 3000000 AND 5000000 THEN \'30Lac - 50Lac\' ' +
          'WHEN price::NUMERIC BETWEEN 5000000 AND 9000000 THEN \'50Lac - 90Lac\' ' +
          'ELSE \'Over 1crore\' END AS price_range, COUNT(id) AS count ' +
          'FROM sell_properties GROUP BY price_range'),
        pool.query('SELECT property_condition, COUNT(id) AS count FROM sell_properties GROUP BY property_condition'),
        pool.query('SELECT number_of_bedrooms, COUNT(id) AS count FROM sell_properties GROUP BY number_of_bedrooms'),
        pool.query('SELECT furnished, COUNT(id) AS count FROM sell_properties GROUP BY furnished'),
      ];
  
      const [
        totalSellProperties,
        byPropertyType,
        byLocality,
        byPriceRange,
        byCondition,
        byBedrooms,
        byFurnishedStatus
      ] = await Promise.all(sellPropertyQueries);
  
      const sellPropertyAnalytics = {
        total_sell_properties: totalSellProperties.rows[0].total_sell_properties,
        by_property_type: byPropertyType.rows,
        by_locality: byLocality.rows,
        by_price_range: byPriceRange.rows,
        by_condition: byCondition.rows,
        by_bedrooms: byBedrooms.rows,
        by_furnished_status: byFurnishedStatus.rows,
      };
  
      res.json({ sellPropertyAnalytics });
    } catch (error) {
      console.error('Error fetching sell property analytics data:', error);
      res.status(500).json({ error: 'Error fetching sell property analytics data' });
    }
  });


  
  // ========================================
  // 3. Rent Property Analytics
  // ========================================



  router.get('/analytics/rent-property', async (req, res) => {
    try {
      const rentPropertyQueries = [
        pool.query('SELECT COUNT(id) AS total_rent_properties FROM rent_properties'),
        pool.query('SELECT property_type, COUNT(id) AS count FROM rent_properties GROUP BY property_type'),
        pool.query('SELECT locality, COUNT(id) AS count FROM rent_properties GROUP BY locality'),
        pool.query('SELECT CASE ' +
          'WHEN monthly_price::NUMERIC < 15000 THEN \'Under 15k\' ' +
          'WHEN monthly_price::NUMERIC BETWEEN 15000 AND 20000 THEN \'15k - 20k\' ' +
          'WHEN monthly_price::NUMERIC BETWEEN 20000 AND 30000 THEN \'20k - 30k\' ' +
          'WHEN monthly_price::NUMERIC BETWEEN 30000 AND 40000 THEN \'30k - 40k\' ' +
          'WHEN monthly_price::NUMERIC BETWEEN 40000 AND 60000 THEN \'40k - 60k\' ' +
          'WHEN monthly_price::NUMERIC BETWEEN 60000 AND 100000 THEN \'60k - 100k\' ' +
          'WHEN monthly_price::NUMERIC BETWEEN 100000 AND 200000 THEN \'100k - 200k\' ' +
          'ELSE \'Over 2k\' END AS price_range, COUNT(id) AS count ' +
          'FROM rent_properties GROUP BY price_range'),
        pool.query('SELECT property_condition, COUNT(id) AS count FROM rent_properties GROUP BY property_condition'),
        pool.query('SELECT number_of_bedrooms, COUNT(id) AS count FROM rent_properties GROUP BY number_of_bedrooms'),
        pool.query('SELECT furnished, COUNT(id) AS count FROM rent_properties GROUP BY furnished'),
      ];
  
      const [
        totalRentProperties,
        byPropertyType,
        byLocality,
        byPriceRange,
        byCondition,
        byBedrooms,
        byFurnishedStatus
      ] = await Promise.all(rentPropertyQueries);
  
      const rentPropertyAnalytics = {
        total_rent_properties: totalRentProperties.rows[0].total_rent_properties,
        by_property_type: byPropertyType.rows,
        by_locality: byLocality.rows,
        by_price_range: byPriceRange.rows,
        by_condition: byCondition.rows,
        by_bedrooms: byBedrooms.rows,
        by_furnished_status: byFurnishedStatus.rows,
      };
  
      res.json({ rentPropertyAnalytics });
    } catch (error) {
      console.error('Error fetching rent property analytics data:', error);
      res.status(500).json({ error: 'Error fetching rent property analytics data' });
    }
  });
  


// ========================================
// 4. Home Service Worker Analytics
// ========================================

router.get('/analytics/home-service-worker', async (req, res) => {
  try {
    // Execute all home service worker analytics queries in parallel
    const homeServiceWorkerQueries = [
      pool.query('SELECT COUNT(id) AS total_workers FROM home_services'),
      pool.query('SELECT locality, COUNT(id) AS count FROM home_services GROUP BY locality'),
      pool.query('SELECT service_type, COUNT(id) AS count FROM home_services GROUP BY service_type'),
      pool.query('SELECT years_of_experience, COUNT(id) AS count FROM home_services GROUP BY years_of_experience'),
    ];

    const [
      totalWorkers,
      byLocality,
      byServiceType,
      byExperience
    ] = await Promise.all(homeServiceWorkerQueries);

    const homeServiceWorkerAnalytics = {
      total_workers: totalWorkers.rows[0].total_workers,
      by_locality: byLocality.rows,
      by_service_type: byServiceType.rows,
      by_experience: byExperience.rows,
    };

    // Send all home service worker analytics data
    res.json({ homeServiceWorkerAnalytics });
  } catch (error) {
    console.error('Error fetching home service worker analytics data:', error);
    res.status(500).json({ error: `Error fetching home services data : ${error.message}` });
  }
});











// =============================
// crud operations
//===============================


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Define the directory for each file type
      let uploadPath = '';
      if (file.fieldname === 'photos') {
        uploadPath = path.join(__dirname, '../uploads/photos');
      } else if (file.fieldname === 'documents') {
        uploadPath = path.join(__dirname, '../uploads/documents');
      } else if (file.fieldname === 'profile_picture') {
        uploadPath = path.join(__dirname, '../uploads/profile_pics');
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});
  
const upload = multer({ storage: storage });







// ======== Sell Properties CRUD ========




// GET: Fetch all sell properties without pagination
router.get('/sell-properties', (req, res) => {
    pool.query(`
      SELECT id, property_title, property_type, price,locality, location, area, 
             number_of_bedrooms, number_of_bathrooms, number_of_balconies, 
             year_built, property_condition, parking_spaces, amenities, furnished, 
             utilities_included, floor_number, description, photos, video_tour, 
             seller_name, contact_number, email_address, preferred_contact, 
             additional_notes, property_documents, client_id 
      FROM sell_properties`, (error, results) => {
      if (error) {
        return res.status(500).send('Error fetching properties data');
      }
      // Return the complete data for all properties
      res.json({
        rows: results.rows,  // All properties
      });
    });
});
  
  



// POST: Add a new sell property
router.post('/sell-properties', upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'documents', maxCount: 5 }]),
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




// PUT: Update a sell property by id
// Update the property details route
router.patch('/sell-properties/update', upload.fields([
  { name: 'photos', maxCount: 5 },        // Limit the number of photos (optional)
  { name: 'documents', maxCount: 3 }      // Limit the number of documents (optional)
]), async (req, res) => {
  const propertyId = req.body.id; // Property ID from the form
  const updatedFields = req.body; // Fields to update from the form

  // Collect file paths for photos and documents
  const photos = req.files['photos'] ? req.files['photos'].map(file => file.path) : [];
  const documents = req.files['documents'] ? req.files['documents'].map(file => file.path) : [];

  try {
      // Step 1: Check if the property exists
      const propertyExists = await pool.query('SELECT * FROM sell_properties WHERE id = $1', [propertyId]);
      if (propertyExists.rowCount === 0) {
          return res.status(404).json({ message: 'Property not found' });
      }

      // Step 2: Get the current values for photos and documents
      const currentPhotos = propertyExists.rows[0].photos || '{}'; // Default to empty array in PostgreSQL format
      const currentDocuments = propertyExists.rows[0].property_documents || '{}';

      // Step 3: Format arrays for PostgreSQL (retain existing data if no new files are uploaded)
      const formattedPhotos = photos.length > 0 ? `{${photos.join(',')}}` : currentPhotos;
      const formattedDocuments = documents.length > 0 ? `{${documents.join(',')}}` : currentDocuments;

      // Step 4: Build dynamic SQL query for updating the property
      let updateQuery = 'UPDATE sell_properties SET ';
      const values = [];
      const setValues = [];

      // Loop through the fields sent by the frontend and prepare the update query
      Object.keys(updatedFields).forEach((key, index) => {
          if (key !== 'id' && updatedFields[key] !== undefined && updatedFields[key] !== null) {
              setValues.push(`${key} = $${index + 1}`);
              values.push(updatedFields[key]);
          }
      });

      // Add file paths to the values for photos and documents (ensure correct array format)
      setValues.push(`photos = $${values.length + 1}`);
      values.push(formattedPhotos);

      setValues.push(`property_documents = $${values.length + 1}`);
      values.push(formattedDocuments);

      if (setValues.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
      }

      // Add the WHERE condition for the property ID
      updateQuery += setValues.join(', ') + ` WHERE id = $${values.length + 1}`;
      values.push(propertyId); // Add property ID for the WHERE clause

      // Execute the update query
      const result = await pool.query(updateQuery, values);

      if (result.rowCount > 0) {
          return res.status(200).json({ message: 'Property updated successfully' });
      } else {
          return res.status(500).json({ message: 'Failed to update the property' });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
});




// DELETE: Delete a sell property by id
router.delete('/sell/:id', async (req, res) => {
  const propertyId = req.params.id;

  try {
      // Step 1: Retrieve the property details, including the photos and documents
      const result = await pool.query('SELECT photos, property_documents FROM sell_properties WHERE id = $1', [propertyId]);

      if (result.rows.length === 0) {
          return res.status(404).send('Property not found');
      }

      // Get the property data (photos and documents)
      const property = result.rows[0];
      let photoArray = [];
      let documentArray = [];

      // Step 2: Process the photos array or string to extract image names
      if (typeof property.photos === 'string') {
          // If it's a string (PostgreSQL array), clean it and split by commas
          photoArray = property.photos.replace(/[{}]/g, '').split(',')
              .map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', '')); // Remove prefix
      } else if (Array.isArray(property.photos)) {
          // If it's already an array, directly use it
          photoArray = property.photos.map(p =>
              p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', '')); // Remove prefix
      }

      // Process the property_documents array to extract document names
      if (typeof property.property_documents === 'string') {
          // If it's a string (PostgreSQL array), clean it and split by commas
          documentArray = property.property_documents.replace(/[{}]/g, '').split(',')
              .map(d => d.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsdocuments', '')); // Remove prefix
      } else if (Array.isArray(property.property_documents)) {
          // If it's already an array, directly use it
          documentArray = property.property_documents.map(d =>
              d.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsdocuments', '')); // Remove prefix
      }

      console.log('Photos to delete:', photoArray);
      console.log('Documents to delete:', documentArray);

      // Step 3: Delete the images from the server (Photos)
      photoArray.forEach(photoName => {
          // Construct the full file path for each image to delete
          const photoPath = path.join('C:', 'Users', 'amirh', 'OneDrive', 'Desktop', 'FindYourHome', 'backend', 'uploads', 'photos', photoName);

          // Use fs.unlink to delete the photo file
          fs.unlink(photoPath, (err) => {
              if (err) {
                  console.error('Error deleting photo:', photoPath, err);
              } else {
                  console.log('Successfully deleted photo:', photoPath);
              }
          });
      });

      // Step 4: Delete the property documents from the server (Documents)
      documentArray.forEach(docName => {
          // Construct the full file path for each document to delete
          const docPath = path.join('C:', 'Users', 'amirh', 'OneDrive', 'Desktop', 'FindYourHome', 'backend', 'uploads', 'documents', docName);

          // Use fs.unlink to delete the document file
          fs.unlink(docPath, (err) => {
              if (err) {
                  console.error('Error deleting document:', docPath, err);
              } else {
                  console.log('Successfully deleted document:', docPath);
              }
          });
      });

      // Step 5: Delete the property data from the database
      await pool.query('DELETE FROM sell_properties WHERE id = $1', [propertyId]);

      res.status(204).send('Property, photos, and documents deleted successfully');
  } catch (error) {
      console.error('Error during delete operation:', error);
      res.status(500).json({ error: 'Error deleting property, photos, and documents' });
  }
});



// ======== Rent Properties CRUD ========

// GET: Fetch all rent properties
router.get('/rent-properties', (req, res) => {
    pool.query(`
        SELECT id, property_title, property_type, monthly_price, locality, location, area,
        number_of_bedrooms, number_of_bathrooms, number_of_balconies, year_built, 
        property_condition, parking_spaces, amenities, furnished, 
        utilities_included, floor_number, description, photos, video_tour, 
        landlord_name, contact_number, email_address, preferred_contact, additional_notes, client_id 
        FROM rent_properties`, (error, results) => {
        if (error) {
            return res.status(500).send('Error fetching properties data');
        }
        // Return the complete data for all properties
        res.json({
            rows: results.rows,  // All properties
        });
    });
});
        

// POST: Add a new rent property
router.post('/rent-properties',upload.fields([{ name: 'photos', maxCount: 10 }]), async(req, res) => {
    try{
        const {
            property_title,
            property_type,
            monthly_price,
            locality,
            location,
            area,
            number_of_bedrooms,
            number_of_bathrooms,
            number_of_balconies,
            year_built,
            property_condition,
            parking_spaces,
            amenities,
            furnished,
            utilities_included,
            floor_number,
            description,
            video_tour,
            landlord_name,
            contact_number,
            email_address,
            preferred_contact,
            additional_notes,
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
        if (!monthly_price) missingFields.push('monthly_price');
        if (!locality) missingFields.push('locality');
        if (!location) missingFields.push('location');
        if (!area) missingFields.push('area');
        if (!number_of_bedrooms) missingFields.push('number_of_bedrooms');
        if (!number_of_bathrooms) missingFields.push('number_of_bathrooms');
        if (!property_condition) missingFields.push('property_condition');
        if (!utilities_included) missingFields.push('utilities_included');
        if (!landlord_name) missingFields.push('landlord_name');
        if (!contact_number) missingFields.push('contact_number');
        if (!email_address) missingFields.push('email_address');
        if (!client_id) missingFields.push('client_id');

        // Check if any fields are missing
        if (missingFields.length > 0) {
        console.error('Validation failed: Missing required fields:', missingFields);
        return res.status(400).json({ error: 'Missing required fields: ' + missingFields.join(', ') });
        }

        // Validate monthly_price to ensure it's a valid positive number
        if (!monthly_price || isNaN(monthly_price) || parseFloat(monthly_price) < 0) {
        console.error('Validation failed: Invalid price');
        return res.status(400).json({ error: 'Price must be a valid positive number.' });
        }

        // Collect file paths for photos
        const photos = req.files['photos'] ? req.files['photos'].map(file => file.path) : [];

        console.log('Photos:', photos);

        // Format array for PostgreSQL (it must start with '{' and end with '}')
        const formattedPhotos = photos.length > 0 ? `{${photos.join(',')}}` : null;

        const query = `
            INSERT INTO rent_properties 
            (property_title, property_type, monthly_price, locality, location, area, number_of_bedrooms, number_of_bathrooms, 
            number_of_balconies, year_built, property_condition, parking_spaces, amenities, furnished, utilities_included, 
            floor_number, description, photos, video_tour, landlord_name, contact_number, email_address, preferred_contact, 
            additional_notes, client_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
            RETURNING id
        `;

        const values = [
            property_title, property_type, monthly_price, locality, location, area, 
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
            formattedPhotos,                 // use the formatted photos string
            video_tour || null,              // Allow null for optional fields
            landlord_name, 
            contact_number, 
            email_address, 
            preferred_contact || null,       // Allow null for optional fields
            additional_notes || null,        // Allow null for optional fields
            client_id
        ];

        const result = await pool.query(query, values);
        console.log('Property successfully saved with ID:', result.rows[0].id);
        res.status(201).json({ property_id: result.rows[0].id });
    } catch (error) {
    console.error('Error saving property to database:', error);
    res.status(500).json({ error: 'Internal Server Error while saving property' });
    }
});


// PUT: Update an existing rent property
// Update the rent property details route
router.put('/rent-properties/update', upload.fields([
  { name: 'photos', maxCount: 5 },        // Limit the number of photos (optional)
]), async (req, res) => {
  const propertyId = req.body.id; // Property ID from URL
  const updatedFields = req.body; // Fields to update from the form

  // Collect file paths for photos and documents
  const photos = req.files['photos'] ? req.files['photos'].map(file => file.path) : [];

  console.log('Photos:', photos);

  // Format arrays for PostgreSQL (they must start with '{' and end with '}')
  const formattedPhotos = photos.length > 0 ? `{${photos.join(',')}}` : null;

  try {
      // Check if property ID exists in the database
      const propertyExists = await pool.query('SELECT 1 FROM rent_properties WHERE id = $1', [propertyId]);
      if (propertyExists.rowCount === 0) {
          return res.status(404).json({ message: 'Property not found' });
      }

      // Build dynamic SQL query for updating the rent property
      let updateQuery = 'UPDATE rent_properties SET ';
      const values = [];
      const setValues = [];

      // Loop through the fields sent by the frontend and prepare the update query
      Object.keys(updatedFields).forEach((key, index) => {
          if (key !== 'id' && updatedFields[key] !== undefined && updatedFields[key] !== null) {
              setValues.push(`${key} = $${index + 1}`);
              values.push(updatedFields[key]);
          }
      });

      // Add file paths to the values for photos and documents
      if (formattedPhotos) {
          setValues.push('photos = $' + (values.length + 1));
          values.push(formattedPhotos);
      }

      if (setValues.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
      }

      // Add the WHERE condition for the property ID
      updateQuery += setValues.join(', ') + ` WHERE id = $${values.length + 1}`;
      values.push(propertyId); // Add property ID for the WHERE clause

      // Execute the update query
      const result = await pool.query(updateQuery, values);

      if (result.rowCount > 0) {
          return res.status(200).json({ message: 'Property updated successfully' });
      } else {
          return res.status(500).json({ message: 'Failed to update the property' });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
});



// DELETE: Delete a rent property by id
router.delete('/rent/:id', async (req, res) => {
    const propertyId = req.params.id;

    try {
        // Step 1: Retrieve the property details, including the photos
        const result = await pool.query('SELECT photos FROM rent_properties WHERE id = $1', [propertyId]);

        if (result.rows.length === 0) {
            return res.status(404).send('Property not found');
        }

        // Get the photo data from the database
        const property = result.rows[0];
        let photoArray = [];

        // Step 2: Process the photos array or string to extract image names
        if (typeof property.photos === 'string') {
            // If it's a string (PostgreSQL array), clean it and split by commas
            photoArray = property.photos.replace(/[{}]/g, '').split(',')
                .map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', '')); // Remove prefix
            console.log('photo property is string');
        } else if (Array.isArray(property.photos)) {
            // If it's already an array, directly use it
            photoArray = property.photos.map(p =>
                p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsphotos', '')); // Remove prefix
            console.log('photo property is array');
        }

        console.log('Photos to delete:', photoArray);

        // Step 3: Delete the images from the server
        photoArray.forEach(photoName => {
            // Construct the full file path for each image to delete
            const imagePath = path.join('C:', 'Users', 'amirh', 'OneDrive', 'Desktop', 'FindYourHome', 'backend', 'uploads', 'photos', photoName);

            // Use fs.unlink to delete the image
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image:', imagePath, err);
                } else {
                    console.log('Successfully deleted image:', imagePath);
                }
            });
        });

        // Step 4: Delete the property data from the database
        await pool.query('DELETE FROM rent_properties WHERE id = $1', [propertyId]);

        res.status(204).send('Property and images deleted successfully');
    } catch (error) {
        console.error('Error during delete operation:', error);
        res.status(500).json({ error: 'Error deleting property and images' });
    }
});





// ======== Home Services CRUD ========

// GET: Fetch all home services
router.get('/home-services', (req, res) => {
  pool.query(`
    SELECT id, full_name, service_type, phone_number, locality, 
    availability, profile_picture, rate, years_of_experience, client_id 
    FROM home_services`, (error, results) => {
        if (error) {
          return res.status(500).send('Error fetching properties data');
        }
        // Return the complete data for all properties
        res.json({
          rows: results.rows,  // All properties
        });
    });
});
    

// POST: Add a new home service worker
router.post('/home-services', (req, res) => {
  const { full_name, service_type, phone_number, locality, availability, profile_picture, rate, years_of_experience, client_id } = req.body;

  const query = `
    INSERT INTO home_services 
    (full_name, service_type, phone_number, locality, availability, profile_picture, rate, years_of_experience, client_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  pool.query(query, [full_name, service_type, phone_number, locality, availability, profile_picture, rate, years_of_experience, client_id], (error, results) => {
    if (error) return res.status(500).send('Error adding new home service worker');
    res.status(201).json({ id: results.rows[0].id });
  });
});

// PUT: Update a home service worker by id
// Update the home service worker details route
router.put('/home-services/update', upload.fields([
  { name: 'profile_picture', maxCount: 1 }   // Limit the number of profile pictures (optional)
]), async (req, res) => {
  const workerId = req.body.id; // Worker ID from URL
  const updatedFields = req.body; // Fields to update from the form

  // Collect file paths for profile pictures
  const profilePicture = req.files['profile_picture'] ? req.files['profile_picture'].map(file => file.path) : [];

  console.log('Profile Picture:', profilePicture);

  // Format array for PostgreSQL (they must start with '{' and end with '}')
  const formattedProfilePicture = profilePicture.length > 0 ? `{${profilePicture.join(',')}}` : null;

  try {
      // Check if worker ID exists in the database
      const workerExists = await pool.query('SELECT 1 FROM home_services WHERE id = $1', [workerId]);
      if (workerExists.rowCount === 0) {
          return res.status(404).json({ message: 'Worker not found' });
      }

      // Build dynamic SQL query for updating the home service worker
      let updateQuery = 'UPDATE home_services SET ';
      const values = [];
      const setValues = [];

      // Loop through the fields sent by the frontend and prepare the update query
      Object.keys(updatedFields).forEach((key, index) => {
          if (key !== 'id' && updatedFields[key] !== undefined && updatedFields[key] !== null) {
              setValues.push(`${key} = $${index + 1}`);
              values.push(updatedFields[key]);
          }
      });

      // Add file paths to the values for profile pictures
      if (formattedProfilePicture) {
          setValues.push('profile_picture = $' + (values.length + 1));
          values.push(formattedProfilePicture);
      }

      if (setValues.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
      }

      // Add the WHERE condition for the worker ID
      updateQuery += setValues.join(', ') + ` WHERE id = $${values.length + 1}`;
      values.push(workerId); // Add worker ID for the WHERE clause

      // Execute the update query
      const result = await pool.query(updateQuery, values);

      if (result.rowCount > 0) {
          return res.status(200).json({ message: 'Worker updated successfully' });
      } else {
          return res.status(500).json({ message: 'Failed to update the worker' });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
});



// DELETE: Delete a home service worker by ID
router.delete('/home-services/:id', async (req, res) => {
  const serviceId = req.params.id;

  try {
      // Step 1: Retrieve the home service details, including the profile picture
      const result = await pool.query('SELECT profile_picture FROM home_services WHERE id = $1', [serviceId]);

      if (result.rows.length === 0) {
          return res.status(404).send('Home service not found');
      }

      // Get the profile picture data from the database
      const homeService = result.rows[0];
      let profilePicArray = [];

      // Step 2: Process the profile picture array or string to extract image names
      if (typeof homeService.profile_picture === 'string') {
          // If it's a string (PostgreSQL array), clean it and split by commas
          profilePicArray = homeService.profile_picture.replace(/[{}]/g, '').split(',')
              .map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', '')); // Remove prefix
          console.log('Profile picture is a string');
      } else if (Array.isArray(homeService.profile_picture)) {
          // If it's already an array, directly use it
          profilePicArray = homeService.profile_picture.map(p =>
              p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', '')); // Remove prefix
          console.log('Profile picture is an array');
      }

      console.log('Profile pictures to delete:', profilePicArray);

      // Step 3: Delete the profile picture from the server
      profilePicArray.forEach(picName => {
          // Construct the full file path for each profile picture to delete
          const picPath = path.join('C:', 'Users', 'amirh', 'OneDrive', 'Desktop', 'FindYourHome', 'backend', 'uploads', 'profile_pics', picName);

          // Use fs.unlink to delete the profile picture
          fs.unlink(picPath, (err) => {
              if (err) {
                  console.error('Error deleting image:', picPath, err);
              } else {
                  console.log('Successfully deleted image:', picPath);
              }
          });
      });

      // Step 4: Delete the home service data from the database
      await pool.query('DELETE FROM home_services WHERE id = $1', [serviceId]);

      res.status(204).send('Home service and profile picture deleted successfully');
  } catch (error) {
      console.error('Error during delete operation:', error);
      res.status(500).json({ error: 'Error deleting home service and profile picture' });
  }
});


//====================================================
// client profile crud
// ===================================================

// GET: Fetch all client profiles
router.get('/client-profiles', (req, res) => {
  pool.query(`
    SELECT 
      id, client_id, full_name, email, phone_number, 
      date_of_birth, preferred_contact, address, profile_picture, 
      is_complete, facebook_url, twitter_url, linked_url, bio 
    FROM client_profile`, (error, results) => {
    if (error) {
      return res.status(500).send('Error fetching client profiles');
    }
    // Return the complete data for all client profiles
    res.json({
      rows: results.rows,  // All client profiles
    });
  });
});



// PUT: Update a client profile by id
// Update the client profile details route
router.put('/client-profile/update', upload.fields([
  { name: 'profile_picture', maxCount: 1 }   // Limit the number of profile pictures (optional)
]), async (req, res) => {
  const clientId = req.body.id; // Client ID from URL
  const updatedFields = req.body; // Fields to update from the form

  // Collect file paths for profile picture
  const profilePicture = req.files['profile_picture'] ? req.files['profile_picture'].map(file => file.path) : [];

  console.log('Profile Picture:', profilePicture);

  // Format array for PostgreSQL (they must start with '{' and end with '}')
  const formattedProfilePicture = profilePicture.length > 0 ? `{${profilePicture.join(',')}}` : null;

  try {
      // Check if client ID exists in the database
      const clientExists = await pool.query('SELECT 1 FROM client_profile WHERE id = $1', [clientId]);
      if (clientExists.rowCount === 0) {
          return res.status(404).json({ message: 'Client not found' });
      }

      // Build dynamic SQL query for updating the client profile
      let updateQuery = 'UPDATE client_profile SET ';
      const values = [];
      const setValues = [];

      // Loop through the fields sent by the frontend and prepare the update query
      Object.keys(updatedFields).forEach((key, index) => {
          if (key !== 'id' && updatedFields[key] !== undefined && updatedFields[key] !== null) {
              setValues.push(`${key} = $${index + 1}`);
              values.push(updatedFields[key]);
          }
      });

      // Add file paths to the values for profile picture
      if (formattedProfilePicture) {
          setValues.push('profile_picture = $' + (values.length + 1));
          values.push(formattedProfilePicture);
      }

      if (setValues.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
      }

      // Add the WHERE condition for the client ID
      updateQuery += setValues.join(', ') + ` WHERE id = $${values.length + 1}`;
      values.push(clientId); // Add client ID for the WHERE clause

      // Execute the update query
      const result = await pool.query(updateQuery, values);

      if (result.rowCount > 0) {
          return res.status(200).json({ message: 'Client profile updated successfully' });
      } else {
          return res.status(500).json({ message: 'Failed to update the client profile' });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


// DELETE route to delete a client profile and associated profile picture

router.delete('/client-profiles/:id', async (req, res) => {
    const clientId = req.params.id;

    try {
        // Step 1: Retrieve the client profile details, including the profile picture
        const result = await pool.query('SELECT profile_picture FROM client_profile WHERE client_id = $1', [clientId]);

        if (result.rows.length === 0) {
            return res.status(404).send('Client profile not found');
        }

        // Get the profile picture data from the database
        const clientProfile = result.rows[0];
        let profilePicArray = [];

        // Step 2: Process the profile picture field to extract image names
        if (typeof clientProfile.profile_picture === 'string') {
            // If it's a string (PostgreSQL array), clean it and split by commas
            profilePicArray = clientProfile.profile_picture.replace(/[{}]/g, '').split(',')
                .map(p => p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', '')); // Remove prefix
            console.log('Profile picture is a string');
        } else if (Array.isArray(clientProfile.profile_picture)) {
            // If it's already an array, directly use it
            profilePicArray = clientProfile.profile_picture.map(p =>
                p.trim().replace('C:UsersamirhOneDriveDesktopFindYourHomebackenduploadsprofile_pics', '')); // Remove prefix
            console.log('Profile picture is an array');
        }

        console.log('Profile pictures to delete:', profilePicArray);

        // Step 3: Delete the profile picture from the server
        profilePicArray.forEach(picName => {
            // Construct the full file path for each profile picture to delete
            const picPath = path.join('C:', 'Users', 'amirh', 'OneDrive', 'Desktop', 'FindYourHome', 'backend', 'uploads', 'profile_pics', picName);

            // Use fs.unlink to delete the profile picture
            fs.unlink(picPath, (err) => {
                if (err) {
                    console.error('Error deleting image:', picPath, err);
                } else {
                    console.log('Successfully deleted image:', picPath);
                }
            });
        });

        // Step 4: Delete the client profile data from the database
        await pool.query('DELETE FROM client_profile WHERE client_id = $1', [clientId]);

        res.status(204).send('Client profile and profile picture deleted successfully');
    } catch (error) {
        console.error('Error during delete operation:', error);
        res.status(500).json({ error: 'Error deleting client profile and profile picture' });
    }
});



  

module.exports = router;

