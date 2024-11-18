// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the import based on your database configuration

// POST route to fetch properties based on criteria for rent
router.post('/', async (req, res) => {
    const { locality, property_type, number_of_bedrooms, price } = req.body;

    // Log the received request body
    console.log("Received request body:", req.body);

    try {
        // Query the database for rental properties based on criteria
        let query = 'SELECT * FROM rent_properties WHERE 1=1';
        const queryParams = [];

        // Dynamically add filters
        if (locality) {
            queryParams.push(locality);
            query += ` AND locality = $${queryParams.length}`;
            console.log("Added locality filter:", locality);
        }
        if (property_type) {
            queryParams.push(property_type);
            query += ` AND property_type = $${queryParams.length}`;
            console.log("Added property_type filter:", property_type);
        }
        if (number_of_bedrooms) {
            queryParams.push(number_of_bedrooms);
            query += ` AND number_of_bedrooms >= $${queryParams.length}`;
            console.log("Added number_of_bedrooms filter:", number_of_bedrooms);
        }
        if (price) {
            queryParams.push(price);
            query += ` AND monthly_price <= $${queryParams.length}`;
            console.log("Added price filter:", price);
        }

        // Log the final query and parameters
        console.log("Final Query:", query);
        console.log("Query Parameters:", queryParams);

        // Execute the query
        const result = await db.query(query, queryParams);
        
        // Log the query result
        console.log("Query Result:", result.rows);

        // Respond with the filtered rental properties
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rental properties:', error);
        res.status(500).json({ error: 'An error occurred while fetching rental properties.' });
    }
});

module.exports = router;
