const express = require('express');
const appController = require('./appController');

// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

const app = express();
const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Middleware setup

//==========================================================
//This server will be purely served for database interaction and construction, frontend will be located at another folder
//Uncommenting the following line will show the original frontend page
//app.use(express.static('public'));  // Serve static files from the 'public' directory

app.use(express.json());             // Parse incoming JSON payloads

// mount the router
app.use('/', appController);

// ----------------------------------------------------------
// Starting the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

