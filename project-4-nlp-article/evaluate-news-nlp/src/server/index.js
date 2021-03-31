/* Server & Routes Setup */
// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

// To get API key from .env
const dotenv = require('dotenv');
dotenv.config();

// Somehow fetching doenst work without this
const fetch = require("node-fetch");

/* Middleware*/
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Set port
const port = 8082;

// Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening() {
    console.log(`ATTENTION: server running on port ${port} !`);
};

// Sentiment Analysis API version 2.1, Default Url
const defaultUrl = 'https://api.meaningcloud.com/sentiment-2.1';

// Get API KEY
const apiKey = process.env.API_KEY;

/* Function to GET Web API Data - Async GET */
const getAnalyses = async (req, res) => {
    let analyseValue = req.body.analyseValue;
    let analyseOption = req.body.analyseOption;
    let analyseSet;

    if (analyseOption == "web") {
        analyseSet = '?url=' + analyseValue;
    }
    else if (analyseOption == "text") {
        analyseSet = '?txt=' + analyseValue;
    }
    else {
        analyseSet = '?txt=' + analyseValue;
    }

    let urlSend = defaultUrl + analyseSet + '&key=' + apiKey + '&lang=en';
    const response = await fetch(urlSend);
    try {
        const data = await response.json();
        res.send(data)
    }
    catch (error) {
        console.log('error', error);
    }
}

// POST Route
app.post('/apiFeed', getAnalyses);

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})