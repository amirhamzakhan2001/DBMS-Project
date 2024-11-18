const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pool = require('../db'); // Import your db connection
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

require('dotenv').config(); // Load environment variables

const router = express.Router();

// Apply rate limiting to login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

// Set up session management
router.use(session({
    secret: process.env.SESSION_SECRET || 'your-default-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 60 * 60 * 1000, // Session duration set to 1 hour
    }
}));

// Check session status
router.get('/session-status', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Client registration route
router.post('/client-register', [
    body('full_name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    console.log('Received register request:', req.body); // Log incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); // Log validation errors
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { full_name, email, password } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM client_login WHERE email = $1', [email]);
        console.log('Existing user check:', existingUser.rows); // Log existing user check

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        console.log('Hashed password:', hashedPassword); // Log hashed password

        await pool.query('INSERT INTO client_login (full_name, email, password) VALUES ($1, $2, $3)', [full_name, email, hashedPassword]);
        console.log('User registered successfully'); // Log success message
        res.json({ success: true, message: 'Registration successful! Please log in.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// Client login route
router.post('/client-login', loginLimiter, [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    console.log('Received login request:', req.body); // Log incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); // Log validation errors
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT id AS client_id, email, password FROM client_login WHERE email = $1', [email]);
        console.log('User query result:', result.rows); // Log result of user query

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Email not registered! Please register first.' });
        }

        const user = result.rows[0]; // Get the user data
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validity:', isPasswordValid); // Log password validity check

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        // Store client_id in the session
        req.session.user = { id: user.client_id, email: user.email };
        console.log('User logged in successfully:', req.session.user); // Log successful login
        res.status(200).json({ success: true, message: 'Login successful!', client_id: user.client_id });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

// Logout route
router.post('/client-logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err); // Log logout error
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        console.log('Logged out successfully'); // Log successful logout
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;
