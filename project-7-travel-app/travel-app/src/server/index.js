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
    console.log ("analize");
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

    console.log ("urla:"+urlSend)
    const response = await fetch(urlSend);
    try {
        const data = await response.json();
        console.log(data)
        res.send(data)
    }
    catch (error) {
        console.log('error', error);
    }
}

// POST Route
app.post('/apiFeed', getAnalyses);



// newwwwwww


// Geonames API, Default Url
const defaultUrl_geonames = 'http://api.geonames.org/searchJSON?q=';

// Weatherbit API, Default Url
const defaultUrl_weatherbit = 'http://api.weatherbit.io/v2.0/current?';

// Pixabay API, Default Url
const defaultUrl_pixabay = 'http://pixabay.com/api/?q=';

// Get more Info about Country via Restcountries API
const defaultUrl_restcountries = 'https://restcountries.eu/rest/v2/name/';


// Get Geonames API KEY
const apiKey_geonames = process.env.API_KEY_GEONAMES;

// Get Weatherbit API KEY
const apiKey_weatherbit = process.env.API_KEY_WEATHERBIT;

// Get Pixabay API KEY
const apiKey_pixabay = process.env.API_KEY_PIXABAY;






/* Function to GET Longitude and Latitude Using Geoname API Data - Async GET */
const getGeonameData = async (analyseValue) => {
    let urlSend = defaultUrl_geonames + analyseValue + '&username=' + apiKey_geonames + '&maxRows=' + 1;
    const response = await fetch(urlSend);
    try {
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
}

/* Function to GET Weather from Longitude and Latitude Using Weatherbit API Data - Async GET */
const getWeatherbitData = async (lat, lng) => {
    let urlSend = defaultUrl_weatherbit + "lat=" +lat + '&lon=' + lng + '&key=' + apiKey_weatherbit;
    const response = await fetch(urlSend);
    try {
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
}
/* Function to GET Weather from Longitude and Latitude Using Weatherbit API Data - Async GET */
const getPixabayData = async (destination) => {
    let urlSend = defaultUrl_pixabay + destination + '&image_type=photo' + '&category=places' + '&safesearch=true' + '&orientation=horizontal' + '&key=' + apiKey_pixabay;

    console.log(urlSend);
    const response = await fetch(urlSend);
    try {
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
}











// Data back
let searchData = {};

function getWeatherData (req, res) {
    let analyseValue = req.body.analyseValue;
    console.log("sitas:::"+analyseValue);


    getGeonameData (analyseValue)
    .then((data) => {
        const lat = data.geonames[0].lat;
        const lng = data.geonames[0].lng;
        const country = data.geonames[0].countryName;
        const pupulation = data.geonames[0].population;

        searchData["country"] = country;
        searchData["pupulation"] = pupulation;


        const weatherData = getWeatherbitData(lat, lng);
        return weatherData;
      })
      .then((weatherData) => {
        console.log("orai");

        console.log(weatherData.data[0].timezone);
        console.log(weatherData.data[0].weather);
        searchData["time_zone"] = weatherData.data[0].timezone;

console.log ("ciaaa:"+analyseValue);
        const imageData = getPixabayData(analyseValue);
        return imageData;

   
      })
      .then((imageData) => {
       
        console.log(imageData);

        
        res.send(searchData);

   
      })




      

}




// POST Route
app.post('/apiWeather', getWeatherData);





app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})