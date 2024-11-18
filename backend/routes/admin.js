// backend/admin.js


const express = require('express');
const session = require('express-session');
const pool = require('../db'); // Import your db connection
const router = express.Router();
require('dotenv').config(); // Ensure to load environment variables

// Set up session management with a static secret
router.use(session({
    secret: process.env.SESSION_SECRET || 'your-default-secret', // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // Session duration set to 2 hours
}));


// Check session status
router.get('/session-status', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


// Admin login route
router.post('/admin-login', async (req, res) => {
    console.log('Received login attempt:', req.body); // Log the request body
    const { admin_name, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM admin_login WHERE admin_name = $1', [admin_name]);
        console.log('Database query result:', result.rows); // Log the query result

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Assuming passwords are hashed, compare the passwords
            if (user.password === password) { // Use bcrypt.compare for hashed passwords
                req.session.user = { id: user.id, admin_name: user.admin_name }; // Store user info in session
                return res.json({ success: true, message: 'Login successful' });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid Password' });
            }
        } else {
            return res.status(401).json({ success: false, message: 'No user found' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});


// Optional: Logout route
router.post('/admin-logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});




module.exports = router;
