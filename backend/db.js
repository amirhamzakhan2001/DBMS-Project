// it helps to handle the connection to our PostgreSQL database.

// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


// Connect to the database and log the connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = pool;

console.log('Database Config:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

