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
    let urlSend = defaultUrl_weatherbit + "lat=" + lat + '&lon=' + lng + '&key=' + apiKey_weatherbit;
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
    const response = await fetch(urlSend);
    try {
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
}

/* Function to GET More information about Country Using RestCountries API Data - Async GET */
const getRestCountriesData = async (name) => {
    let urlSend = defaultUrl_restcountries + name;
    const response = await fetch(urlSend);
    try {
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
}

// Gather all data and back
let searchData = {};
function getWeatherData(req, res) {
    let analyseValue = req.body.analyseValue;
    getGeonameData(analyseValue)
        .then((data) => {
            let resultsFound = data.totalResultsCount;
            if (resultsFound > 0) {
                const lat = data.geonames[0].lat;
                const lng = data.geonames[0].lng;
                const country = data.geonames[0].countryName;
                const population = data.geonames[0].population;
                const countryCode = data.geonames[0].countryCode;
                const description = data.geonames[0].fcodeName;
                const domain = data.geonames[0].topLevelDomain;

                searchData["country"] = country;
                searchData["population"] = population;
                searchData["country_code"] = countryCode;
                searchData["description"] = description;
                searchData["web_domain"] = description;

                const weatherData = getWeatherbitData(lat, lng);
                return weatherData;
            }
            else {
                return false;
            }
        })
        .then((weatherData) => {
            if (weatherData) {
                searchData["time_zone"] = weatherData.data[0].timezone;
                searchData["wind_speed"] = weatherData.data[0].wind_spd;
                searchData["sunset"] = weatherData.data[0].sunset;
                searchData["sunrise"] = weatherData.data[0].sunrise;

                searchData["weather_icon"] = weatherData.data[0]["weather"].icon;
                searchData["weather_code"] = weatherData.data[0]["weather"].code;
                searchData["weather_description"] = weatherData.data[0]["weather"].description;
                searchData["weather_temp"] = weatherData.data[0].temp;

                const imageData = getPixabayData(analyseValue);
                return imageData;
            }
            else {
                return false;
            }
        })
        .then((imageData) => {
            if (imageData && imageData.total > 0) {
                let imageDataGet = imageData.hits[0];
                searchData["image_preview"] = imageDataGet.previewURL;
                searchData["image_web"] = imageDataGet.webformatURL;
                searchData["tags"] = imageDataGet.tags;
            }

            const restCountries = getRestCountriesData(searchData["country"]);
            return restCountries;
        })
        .then((restCountries) => {
            if (restCountries && restCountries.status !== 404) {
                searchData["calling_code"] = restCountries[0].callingCodes;
                searchData["capital"] = restCountries[0].capital;
                searchData["region"] = restCountries[0].region;
                searchData["flag"] = restCountries[0].flag;
                searchData["country_population"] = restCountries[0].population;
                searchData["subregion"] = restCountries[0].subregion;
                searchData["demonym"] = restCountries[0].demonym;
                searchData["web_domain"] = restCountries[0].topLevelDomain;
                res.send(searchData);
            }
            else {
                res.send(false);
            }
        })
}

// POST Route
app.post('/apiWeather', getWeatherData);

function getPopularImages(req, res) {
    let analyseValue = req.body.analyseValue;
    getPixabayData(analyseValue)
        .then((data) => {
            if (data && data.total > 0) {
                res.send(data);
            }
            else {
                return false;
            }
        })
}

// POST Route
app.post('/apiPopular', getPopularImages);

// Main Index Route
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})