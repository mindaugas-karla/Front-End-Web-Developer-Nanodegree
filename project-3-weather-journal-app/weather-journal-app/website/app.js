/* Global Variables */

// OpenWeatherMap Default Url
const defaultUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Personal API Key for OpenWeatherMap API
const apiKey = 'b0a261c59f09156790ca4d47525c070a';



// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();



// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', generateResponse);


/* Helper Functions */
// Check Zip Code Validation
function checkZipCode(zipCode) {
    const regexp = /^[0-9]{5}(?:-[0-9]{4})?$/;
    if (regexp.test(zipCode)) {
        return true;
    }
    else {
        return false;
    }
}

function checkText(feelingsText) {
    if (feelingsText.length !== 0 && feelingsText !== null) {
        return true;
    }
    else {
        return false;
    }
}

function notifError(elmnt, option) {
    if (option == 1) {
        elmnt.style.borderColor = "#d7e4ef";
    }
    else {
        elmnt.style.borderColor = "#bd1414";
    }
}

function toggleFutures() {


}



/* Function called by event listener */
function generateResponse() {
    const zipCode = document.getElementById('zip');
    if (checkZipCode(zipCode.value)) {
        notifError(zipCode, 1);
        startProcess(zipCode.value);
    }
    else {
        notifError(zipCode, 0);
    }
}

function startProcess(zipCode) {
    getTemperature(defaultUrl, zipCode, apiKey)
        .then(function (data) {
            // Add data to POST request
            postData('http://localhost:8000/addData', {
                date: newDate,
                temperature: data.main.temp,
                feels_like: data.main.feels_like
            })
            // Function which updates UI
            .then(function () {
                updateUI()
            })
        })
}



// Async GET
const getTemperature = async (baseURL, zipCode, apiKey) => {
    const response = await fetch(baseURL + '?zip=' + zipCode + '&appid=' + apiKey)
    //console.log(response);
    try {
        const data = await response.json();
        //console.log(data);
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
}

// Async POST
const postData = async (url = '', data = {}) => {
    const postRequest = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await postRequest.json();
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}






/* Function to GET Web API Data*/

/* Function to POST data */


/* Function to GET Project Data */
