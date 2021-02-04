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
app.use(express.static('/website'));

// Set port
const port = 8000;

// Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening() {
    console.log(`ATTENTION: server running on port: ${port}`);
};

// Setup empty JS object to act as endpoint for all routes
const projectData = [];

// Callback function to complete GET '/allData'
app.get('/allData', sendData);

function sendData(req, res) {
    res.send(projectData);
}

// Post Route
app.post('/addData', addData);

function addData(req, res) {
    let data = req.body;
    console.log(data);

    projectData["date"] = req.body.date;
    projectData["temperature"] = req.body.temperature;
    projectData["feelings"] = req.body.feelings;

    res.send(projectData);
}
