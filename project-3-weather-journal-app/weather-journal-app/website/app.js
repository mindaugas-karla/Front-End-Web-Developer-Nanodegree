/**
 * 
 * Weather Journal App.
 * This project requires you to
 * create an asynchronous web app that uses Web API 
 * and user data to dynamically update the UI in a Weather Journal application.
 * 
 * Dependencies: server.js
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/



/**
TASKS:
[Project Environment Setup]
    [x] Node and Express should be installed on the local machine. The project file server.js should require express(), and should create an instance of their app using express.
    [x] The Express app instance should be pointed to the project folder with .html, .css, and .js files.
    [x] The ‘cors’ package should be installed in the project from the command line, required in the project file server.js, and the instance of the app should be setup to use cors().
    [x] The body-parser package should be installed and included in the project.
    [x] Local server should be running and producing feedback to the Command Line through a working callback function.
    [x] Create API credentials on OpenWeatherMap.com
[APIs and Routes]
    [x] There should be a JavaScript Object named projectData initiated in the file server.jsto act as the app API endpoint.
    [x] The personal API Key for OpenWeatherMap API is saved in a named const variable.
    [x] The API Key variable is passed as a parameter to fetch() .
    [x] Data is successfully returned from the external API.
    [x] There should be a GET route setup on the server side with the first argument as a string naming the route, and the second argument a callback function to return the JS object created at the top of server code.
    [x] There should be an asynchronous function to fetch the data from the app endpoint
    [x] You should be able to add an entry to the project endpoint using a POST route setup on the server side and executed on the client side as an asynchronous function.
    [x] The client side function should take two arguments, the URL to make a POST to, and an object holding the data to POST.
    [x] The server side function should create a new entry in the apps endpoint (the named JS object) consisting of the data received from the client side POST.

[Dynamic UI]
    [x] The input element with the placeholder property set to “enter zip code here” should have an id of zip.
    [x] The textarea included in project HTML should have an id of feelings.
    [x] The button included in project HTML should have an id of generate.
    [x] The div with the id, entryHolder should have three child divs with the ids:date, temp, content.
    [x] In the file app.js, the element with the id of generate should have an addEventListener() method called on it, with click as the first parameter, and a named callback function as the second parameter.
    [x] Included in the async function to retrieve that app’s data on the client side, existing DOM elements should have their innerHTML properties dynamically set according to data returned by the app route.

Suggestions by myself:
    [x] Changed Design / Template
    [x] Added Custom moods
    [x] Added temp feelings
    [x] Added temp data view
    [x] Added entreis counter
    [x] Added recent entry category
   
 */

/* Global Variables */

// OpenWeatherMap Default Url
const defaultUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Personal API Key for OpenWeatherMap API
const apiKey = 'b0a261c59f09156790ca4d47525c070a';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.'+ d.getDate()+'.'+ d.getFullYear(); // EDITED: month + 1

// Temporary Data before Save
let tempData;

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', generateResponse);
document.getElementById('saveBox').addEventListener('click', addEntry);

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

// Check Text Field - Feelings Validation
function checkText(feelingsText) {
    if (feelingsText.length !== 0 && feelingsText !== null) {
        return true;
    }
    else {
        return false;
    }
}

// Notification that something wrong
function notifError(elmnt, option) {
    if (option == 1) {
        elmnt.style.borderColor = "#d7e4ef";
    }
    else {
        elmnt.style.borderColor = "#bd1414";
        setTimeout(function () {
            elmnt.style.borderColor = "#d7e4ef";
        }, 3000);
    }
}

// Convert Kelvins to Celcius & Fahrenheit
function tempConverter(kelvinTemp) {
    let celciusTemp = kelvinTemp - 273.15;
    let fahrenheitTemp = ((celciusTemp) * 9 / 5) + 32;

    let arrayResponse = [];
    arrayResponse["celcius"] = Math.round((celciusTemp + Number.EPSILON) * 100) / 100;
    arrayResponse["fahrenheit"] = Math.round((fahrenheitTemp + Number.EPSILON) * 100) / 100;

    return arrayResponse;
}

// Remove Moods Styles - Classes
function removeSmiles() {
    const sectionsAll = document.querySelectorAll('.smilesSelector');

    for (const section of sectionsAll) {
        let smileName = section.value;
        let currentSmile = document.getElementById(smileName);
        if (currentSmile.classList.contains("activeSmile")) {
            currentSmile.classList.remove("activeSmile");
        }
    }
}

// Remove Moods Radio Selection
function removeRadioSmiles() {
    const sectionsAll = document.querySelectorAll('.smilesSelector');
    for (const section of sectionsAll) {
        section.checked = false;
    }
}

// Update Temperature Data to display before saving entry
function updateUiTemp(data) {
    let date = newDate;
    let temperatureData = tempConverter(data.main.temp);
    let temperatureFeelsData = tempConverter(data.main.feels_like);

    let celciusTemp = temperatureData.celcius;
    let fahrenheitTemp = temperatureData.fahrenheit;

    let celciusFeelsTemp = temperatureFeelsData.celcius;
    let fahrenheitFeelsTemp = temperatureFeelsData.fahrenheit;

    document.getElementById('date').innerHTML = `<span>Date:<b> ${date}</b></span>`;
    document.getElementById('temp').innerHTML = `<span>Temperature:<b> ${fahrenheitTemp}F (${celciusTemp}C)</b></span>`;
    document.getElementById('content').innerHTML = `<span>Feels Like:<b> ${fahrenheitFeelsTemp}F (${celciusFeelsTemp}C)</b></span>`;
    document.getElementById("loadedData").style.display = "block";
    document.getElementById("smilesBox").style.display = "block";

    tempData = data;
}

// Get Selected Radio Mood Option
function getMoodOption() {
    const sectionsAll = document.querySelectorAll('.smilesSelector');
    let response = false;
    for (const section of sectionsAll) {
        let smileName = section.value;
        if (section.checked) {
            response = smileName;
        }
    }
    return response;
}

// Cleare all form, after submiting the entry.
function clearForm() {
    document.getElementById("zip").value = "";
    document.getElementById("feelings").value = "";
    removeSmiles();
    removeRadioSmiles();

    document.getElementById("loadedData").style.display = "none";
    document.getElementById("noteBox").style.display = "none";
    document.getElementById("smilesBox").style.display = "none";
    document.getElementById("saveBox").style.display = "none";
}

// Load Data to Recent entries Category, or for All Entries Later
function createEntryLoad(recentDate, recentTemperature, recentFeelLike, recentMood, recentNote) {
    let temperatureData = tempConverter(recentTemperature);
    let temperatureFeelsData = tempConverter(recentFeelLike);

    let celciusTemp = temperatureData.celcius;
    let fahrenheitTemp = temperatureData.fahrenheit;

    let celciusFeelsTemp = temperatureFeelsData.celcius;
    let fahrenheitFeelsTemp = temperatureFeelsData.fahrenheit;

    if (recentMood == "sad") {
        recentMood = "<img class=\"facesIcon noselect\" src=\"images/sad_smile.png\">";
    }
    else if (recentMood == "neutral") {
        recentMood = "<img class=\"facesIcon noselect\" src=\"images/normal_smile.png\">";
    }
    else if (recentMood == "happy") {
        recentMood = "<img class=\"facesIcon noselect\" src=\"images/happy_smile.png\">";
    }
    else {
        recentMood = "unknown";
    }

    let entryStack = "<b>Date:</b> "+recentDate + "<br><b>Temperature:</b> " + fahrenheitTemp + "F (" + celciusTemp + "C) " + "<br><b>Feels:</b> " + fahrenheitFeelsTemp + "F (" + celciusFeelsTemp + "C)" + "<br><b>Mood:</b> " + recentMood;

    document.getElementById("recents_entries").innerHTML = entryStack;
    document.getElementById("recents_note").innerHTML = "<b>Note:</b> " + recentNote;
}

// Dynamically creating EventListener for Mood Selection.
function createMoodSelector() {
    const sectionsAll = document.querySelectorAll('.smilesSelector');

    for (const section of sectionsAll) {
        let smileName = section.value;
        let currentSmile = document.getElementById(smileName);

        if (currentSmile.classList.contains("activeSmile")) {
            currentSmile.classList.remove("activeSmile");
        }

        let prev = null;

        section.addEventListener('change', function () {
            (prev) ? console.log(prev.value) : null;
            if (this !== prev) {
                prev = this;
            }
            removeSmiles();
            document.getElementById(this.value).classList.add("activeSmile");
            document.getElementById("noteBox").style.display = "block";
            document.getElementById("saveBox").style.display = "block";
        });
    }
}

// Activating Mood Selection
createMoodSelector();

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

/* Function to GET Web API Data - Async GET */
const getTemperature = async (baseURL, zipCode, apiKey) => {
    const response = await fetch(baseURL + '?zip=' + zipCode + '&appid=' + apiKey)
    //console.log(response);
    try {
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
}

/* Function to POST data - Async POST */
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
        //console.log(newData);
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}

/* Start Process to get temperature for future saving */
function startProcess(zipCode) {
    getTemperature(defaultUrl, zipCode, apiKey)
        .then(function (data) {
            updateUiTemp(data);
        })
}

/* Save Entry to Server side*/
function addEntry() {
    let moodStatus = getMoodOption();
    let noteEntry = document.getElementById("feelings").value;

    if (checkText(noteEntry)) {
        // Add data to POST request
        postData('http://localhost:8000/addData', {
            date: newDate,
            temperature: tempData.main.temp,
            feels_like: tempData.main.feels_like,
            mood: moodStatus,
            note: noteEntry
        })
            // Function which updates UI
            .then(function () {
                updateUI();
                clearForm();
            })
    }
    else {
        notifError(feelings, 2);
    }
}


/* Function to GET Project Data - Update UI */
const updateUI = async () => {
    const request = await fetch('http://localhost:8000/allData');
    try {
        const allData = await request.json();
        console.log(allData);
        const dataLength = allData.length;
        const currentLength = dataLength - 1;

        if (dataLength > 0) {
            document.getElementById("entiresCounter").innerHTML = dataLength;
            document.getElementById("showEntries").style.display = "block";

            /* Recent entry */
            let recentDate = allData[currentLength].date;
            let recentTemperature = allData[currentLength].temperature;
            let recentFeelLike = allData[currentLength].feels_like;
            let recentMood = allData[currentLength].mood;
            let recentNote = allData[currentLength].note;

            createEntryLoad(recentDate, recentTemperature, recentFeelLike, recentMood, recentNote);
        }
    }
    catch (error) {
        console.log('error', error);
    }
}

/* Update UI with existing Data */
updateUI();