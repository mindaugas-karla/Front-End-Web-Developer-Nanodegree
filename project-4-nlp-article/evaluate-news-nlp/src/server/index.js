/* Server & Routes Setup */

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Set port
const port = 8082;

// Get API KEY
const dotenv = require('dotenv');
dotenv.config();


// Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening() {
    console.log(`ATTENTION: server running on port ${port} !`);
};





/* Global Variables */

// Sentiment Analysis API version 2.1, Default Url
const defaultUrl = 'https://api.meaningcloud.com/sentiment-2.1?';

// Personal API Key for OpenWeatherMap API
const apiKey = process.env.API_KEY;

// Setup empty JS object to act as endpoint for all routes
let projectData = [];







const mockAPIResponse = require('./mockAPI.js');






app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})



app.get('/test', function (req, res) {
    res.send(mockAPIResponse);
})

// var textapi = new meaningcloud({
//     application_key: process.env.API_KEY
//  });