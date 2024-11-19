---

# FindYourHome: DBMS Project

Welcome to **FindYourHome**, a real estate management system designed as a project for the **DBMS (Database Management Systems)** course by a team of 5 students pursuing **M.Sc. AI & ML** at **Jamia Millia Islamia**. This project demonstrates the integration of a PostgreSQL database with a Node.js backend and a frontend built using HTML, CSS, and JavaScript.

## Project Contributors

- **Faizan Khan**
- **Yasir Farouqui**
- **Amir Hamza Khan**
- **Haider Ali Khan**
- **Aliza Sheikh**

---

## Project Overview

This project allows users to perform the following tasks:
1. Add and view properties available for rent or sale.
2. Manage client profiles and login details.
3. Manage home services, including service worker details.
4. Perform admin tasks such as monitoring property and user details.
5. Visualize analytics on various properties and user data.

---

## Features

- **Admin Dashboard**: Manage properties, clients, and home services.
- **User-Friendly Interface**: Simple forms for data entry and retrieval.
- **Dynamic Analytics**: Visualizations for properties, clients, and services.
- **Data Storage**: PostgreSQL as the database.
- **Backend API**: Built using Node.js and Express.js.
- **Frontend**: Developed with HTML, CSS, and JavaScript.

---

## Project Structure

### Root Folder: FindYourHome
'''FindYourHome/
│
├── backend/
│   ├── node_modules/              # Node.js dependencies
│   ├── routes/                    # Backend API routes
│   │   ├── admin.js
│   │   ├── admindashboardroutes.js
│   │   ├── buypropertyroutes.js
│   │   ├── client.js
│   │   ├── forrentpropertyroutes.js
│   │   ├── homeServicesroutes.js
│   │   ├── rentform.js
│   │   └── sellform.js
│   ├── uploads/                   # File uploads (images/documents)
│   │   ├── documents/
│   │   ├── photos/
│   │   └── profile_pics/
│   ├── .env                       # Environment variables
│   ├── app.js                     # Main backend server file
│   ├── db.js                      # Database connection setup
│   ├── package.json               # Node.js dependencies
│   └── package-lock.json
│
├── scripts/                       # JavaScript files for frontend functionality
│   ├── admin_dashboard.js
│   ├── admin_login.js
│   ├── buy_property.js
│   ├── client_login.js
│   ├── for_rent.js
│   ├── home_services.js
│   ├── rentproperty.js
│   ├── script.js
│   └── sellproperty.js
│
├── styles/                        # Stylesheets
│   └── styles.css
│
├── aboutus.html                   # About Us page
├── admin_dashboard.html           # Admin Dashboard page
├── admin_login.html               # Admin Login page
├── buy_property.html              # Buy Property page
├── buy_sell.html                  # Buy/Sell page
├── client_login.html              # Client Login page
├── footer.html                    # Footer template
├── for_rent.html                  # For Rent page
├── header.html                    # Header template
├── home_services.html             # Home Services page
├── index.html                     # Homepage
├── privacypolicy.html             # Privacy Policy page
├── rent_cosharing.html            # Rent Co-Sharing page
├── rentproperty.html              # Rent Property page
├── sellproperty.html              # Sell Property page
└── termscondition.html            # Terms & Conditions page

---

## Database Setup

### Database Name: FindYourHome

#### Tables:
1. **rent_properties**: Stores rental property details.
2. **sell_properties**: Stores properties for sale.
3. **admin_login**: Admin credentials.
4. **client_login**: Client login details.
5. **home_services**: Home service worker details.
6. **client_profile**: Client profile information.

---


## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL

---

##Tables structure and its feature in PostgreSql is 
CREATE TABLE admin_login (
    id SERIAL PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE rent_properties (
    id SERIAL PRIMARY KEY,
    property_title VARCHAR(255) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    monthly_price NUMERIC(10, 2) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    area NUMERIC(10, 2) NOT NULL,
    number_of_bedrooms INTEGER NOT NULL,
    number_of_bathrooms INTEGER NOT NULL,
    number_of_balconies INTEGER,
    year_built INTEGER,
    property_condition VARCHAR(100) NOT NULL,
    parking_spaces INTEGER,
    amenities TEXT,
    furnished VARCHAR(50),
    utilities_included VARCHAR(255) NOT NULL,
    floor_number INTEGER,
    description TEXT,
    photos TEXT[],
    video_tour VARCHAR(255),
    landlord_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    preferred_contact VARCHAR(50),
    additional_notes TEXT,
    client_id INTEGER,
    FOREIGN KEY (client_id) REFERENCES client_login(id) ON DELETE SET NULL
);

CREATE TABLE sell_properties (
    id SERIAL PRIMARY KEY,
    property_title VARCHAR(255) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    locality VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    area NUMERIC NOT NULL,
    number_of_bedrooms INTEGER NOT NULL,
    number_of_bathrooms INTEGER NOT NULL,
    number_of_balconies INTEGER,
    year_built INTEGER,
    property_condition VARCHAR(100) NOT NULL,
    parking_spaces INTEGER,
    amenities TEXT,
    furnished VARCHAR(50),
    utilities_included VARCHAR(255),
    floor_number INTEGER,
    description TEXT,
    photos TEXT[],
    video_tour VARCHAR(255),
    seller_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    preferred_contact VARCHAR(50),
    additional_notes TEXT,
    property_documents TEXT[],
    client_id INTEGER,
    FOREIGN KEY (client_id) REFERENCES client_login(id) ON DELETE SET NULL
);

CREATE TABLE client_login (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL  -- This will store the hashed password
);

CREATE TABLE home_services (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    availability VARCHAR(100) NOT NULL,
    profile_picture TEXT[],
    rate NUMERIC,
    years_of_experience INTEGER,
    client_id INTEGER,
    FOREIGN KEY (client_id) REFERENCES client_login(id) ON DELETE SET NULL
);

CREATE TABLE client_profile (
    id SERIAL PRIMARY KEY,
    client_id INTEGER,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    preferred_contact VARCHAR(50),
    address TEXT,
    profile_picture TEXT[],
    is_complete BOOLEAN,
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    linked_url VARCHAR(255),
    bio TEXT,
    FOREIGN KEY (client_id) REFERENCES client_login(id) ON DELETE SET NULL
); 


---

## Prerequisites

Ensure the following are installed:
1. **Node.js** (v14 or above)
2. **PostgreSQL** (v12 or above)
3. **npm** (Node Package Manager)

---

## Installation Guide

### Clone the Repository
bash
git clone https://github.com/your-repo/FindYourHome.git
cd FindYourHome


### Install Dependencies
Navigate to the backend folder and install dependencies:
bash
cd backend
npm install


### Configure the Database
1. Create a PostgreSQL database named FindYourHome.
2. Execute the provided SQL table structures in your PostgreSQL editor.

### Set Environment Variables
Create a .env file in the backend folder with the following:
plaintext
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=FindYourHome
JWT_SECRET=your_jwt_secret


### Start the Backend Server
bash
cd backend
node app.js


### Open Frontend
1. Use any live server tool (e.g., VS Code Live Server) to open index.html.

---

## Usage

1. Open index.html to view the homepage.
2. Navigate through different functionalities such as renting, selling, and home services.

3. Analytics and forms: Admin can view analytics and manage properties/services. 

---


## Notes

This is a non-production project developed for educational purposes and is not fully functional. Some features may not work as expected.

---

## License

This project is open-source and free to use. Modify as required for educational purposes.

---
