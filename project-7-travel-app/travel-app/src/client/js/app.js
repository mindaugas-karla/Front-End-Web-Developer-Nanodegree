/** Functions to Manage Platform */
/** (I know It's better to separate this category,
 * but it was way easier to do this way,
 * because then I started I added more and more usability,
 * and it was too hard to move this later, I just cant stop to add new things :) ) */

/** 
 [x] Add end date and display length of trip.
 [x] Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
 [+-] Allow user to add multiple destinations on the same trip.
    [+-] Pull in weather for additional locations.
    (object is ready for multimple save, but I kinga dont know how to vizualize it, someday mb I will finish it)
 [+-] Allow the user to add hotel and/or flight data.
    [+-] Multiple places to stay? Multiple flights?
 [x] Integrate the REST Countries API to pull in data for the country being visited.
 [x] Allow the user to remove the trip.
 [x] Use Local Storage to save the data so that when they close, then revisit the page, their information is still there.
 [-] Instead of just pulling a single day forecast, pull the forecast for multiple days.
 [x] Incorporate icons into forecast. (Into Weather section)
 [x] Allow user to Print their trip and/or export to PDF.
 [x] Allow the user to add a todo list and/or packing list for their trip.
 [x] Allow the user to add additional trips (this may take some heavy reworking, but is worth the challenge).
 [-] Automatically sort additional trips by countdown.
 [x] Move expired trips to bottom/have their style change so it’s clear it’s expired.
 */

 /** General Functions */
// Initiate Print Action
function printPlan(idPrint) {
    let printContents = document.getElementById(idPrint).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    Client.reloadWeb();
}

// Get Date Difference
function dateDifference(d1, d2) {
    let t2 = d2.getTime();
    let t1 = d1.getTime();
    return parseInt((t2 - t1) / (24 * 3600 * 1000));
}

// Change date format, String -> Date
function stringToDate(date) {
    let parts = date.split('/');
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
    return mydate;
}

// Check Time Left to Begin of Travel
function timeLeft(travelStart) {
    const currentDate = (Date.now()) / 1000;
    const travelBegining = (travelStart.getTime()) / 1000;
    const daysLeft = Math.round((travelBegining - currentDate) / 86400);
    return daysLeft;
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
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}
/** --------------------*/


/** Platform Main Configuration Functions */
// Log Out Button
function logOut(userName) {
    // Clears User Entry
    let newEntry = { login: 0, user: 0 };
    Client.createEntry("system", newEntry);

    document.getElementById("login-username").value = "";
    document.getElementById("header-logged-in").innerHTML = "";
    document.getElementById("intro-user-name").innerHTML = "";

    // Hide Menu Elements, set Sign Out Mode
    document.getElementById("main-footer").classList.add("hiddenFooter");
    document.getElementById("main-content").classList.add("hiddenGrid");
    document.getElementById("main-header").classList.add("hiddenPart");

    document.getElementById("travel-app").classList.add("hiddenBody");
    document.getElementById("content-app").classList.add("hiddenPart");
    document.getElementById("content-intro").classList.add("hiddenPart");
    document.getElementById("content-list").classList.add("hiddenPart");
    document.getElementById("content-about").classList.add("hiddenPart");
    document.getElementById("content-contact").classList.add("hiddenPart");

    document.getElementById("content-widget").classList.add("hiddenPart");
    document.getElementById("content-menu").classList.add("hiddenPart");
    document.getElementById("content-slider").classList.add("hiddenPart");

    document.getElementById("content-trip-load").classList.add("hiddenPart");

    blockManagement("content-profile", "hide");
    blockManagement("content-login", "show");
}

// Open App, with Logged In User settings
function insideApp(userName) {
    // Load User Data
    let checkData = Client.checkStorage("users");
    if (checkData["status"]) {
        if (checkData["load"][userName]) {
            // Set Login Status to system storage
            let newEntry = { login: 1, user: userName };
            Client.createEntry("system", newEntry);
            document.getElementById("header-logged-in").innerHTML = userName;
            document.getElementById("intro-user-name").innerHTML = userName;

            // Add Logout button Listener
            document.getElementById('header-logout').addEventListener('click', function () { logOut(userName); });
            // Add Intro button
            document.getElementById('intro-confirm').addEventListener('click', function () { confirmIntro(userName); });

            let profilePic = checkData["load"][userName]["profile"];
            let introMessage = checkData["load"][userName]["intro"];
            if (introMessage == 0) {
                document.getElementById("content-intro").classList.remove("hiddenPart");
            }
            else {
                document.getElementById("content-app").classList.remove("hiddenPart");
            }

            // Set Profile
            setProfileImage(profilePic);

            //load user settings
            document.getElementById("main-footer").classList.remove("hiddenFooter");
            document.getElementById("main-content").classList.remove("hiddenGrid");
            document.getElementById("main-header").classList.remove("hiddenPart");
            document.getElementById("travel-app").classList.remove("hiddenBody");
            document.getElementById("content-widget").classList.remove("hiddenPart");
            document.getElementById("content-menu").classList.remove("hiddenPart");
            document.getElementById("content-slider").classList.remove("hiddenPart");

            blockManagement("content-profile", "hide");
            blockManagement("content-login", "hide");
        }
        else {
            console.log("ERROR!");
        }
    }
}

// Procced, Save Profile and Continue
function profileNext(userName) {
    const rbs = document.querySelectorAll('input[name="profiles"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }

    if (selectedValue == "first") {
        let dataSet = { "profile": 1, "intro": 0, "lists": {} };
        Client.updateUser("users", userName, dataSet);
        insideApp(userName);
    }
    else if (selectedValue == "second") {
        let dataSet = { "profile": 2, "intro": 0, "lists": {} };
        Client.updateUser("users", userName, dataSet);
        insideApp(userName);
    }
    else {
        document.getElementById("first-label").classList.add("profileError");
        document.getElementById("second-label").classList.add("profileError");

        setTimeout(function () {
            document.getElementById("first-label").classList.remove("profileError");
            document.getElementById("second-label").classList.remove("profileError");

        }, 3000);
    }
}

// Check if User is loggedIn or loggedOut, or mb new User
function checkSystem() {
    let checkData = Client.checkStorage("system");
    if (checkData["status"]) {
        let loggedIn = checkData["load"]["login"];
        let loggedUser = checkData["load"]["user"];

        if (loggedIn == 1) {
            insideApp(loggedUser);
        }
        else {
            // Do nothing: Leave Log In page
        }
    }
    else {
        // Create basic system settings, for further use
        let newEntry = { login: 0, user: 0 };
        Client.createEntry("system", newEntry);
    }
}

// Confirm Intro Page
function confirmIntro(userName) {
    let dataSet = { "intro": 1 };
    Client.updateUser("users", userName, dataSet);

    document.getElementById("content-intro").classList.add("hiddenPart");
    document.getElementById("content-app").classList.remove("hiddenPart");
}

// Set Profile Image To App
function setProfileImage(selection) {
    if (selection == 1) {
        document.getElementById("header-profile-image").classList.remove("profile_image_second");
        document.getElementById("header-profile-image").classList.add("profile_image_first");
    }
    else {
        document.getElementById("header-profile-image").classList.remove("profile_image_first");
        document.getElementById("header-profile-image").classList.add("profile_image_second");
    }
}

// Choose Profile Image
function profileSelect(profile) {
    document.getElementById("first-label").classList.remove("profileError");
    document.getElementById("second-label").classList.remove("profileError");
    if (profile == 1) {
        document.getElementById("first-label").classList.add("profileSelected");
        document.getElementById("second-label").classList.remove("profileSelected");
    }
    else {
        document.getElementById("first-label").classList.remove("profileSelected");
        document.getElementById("second-label").classList.add("profileSelected");
    }
}

// Pre-App Pages Management
function blockManagement(sectionId, sectionOption) {
    if (document.getElementById(sectionId)) {
        let changeClass = document.getElementById(sectionId);
        if (sectionOption == "show") {
            changeClass.classList.remove("deactivated");
            changeClass.classList.add("activated");
        }
        else {
            changeClass.classList.remove("activated");
            changeClass.classList.add("deactivated");
        }
    }
}

// Open Profile Setup Window
function openProfileSetup(userName) {
    document.getElementById("user-name-profile").innerHTML = userName;
    document.getElementById('login-profile-button').addEventListener('click', function () { profileNext(userName); });
    blockManagement("content-login", "hide");
    blockManagement("content-profile", "show");
}

// Check user Username in the system
function proceedLogin(userName) {
    let checkData = Client.checkStorage("users");
    if (checkData["status"]) {
        let loadedData = checkData["load"];
        if (loadedData[userName]) {
            let userData = loadedData[userName];
            let userProfile = userData["profile"];
            if (userProfile == 0) {
                openProfileSetup(userName);
            }
            else {
                insideApp(userName);
            }
        }
        else {
            loadedData[userName] = { "profile": 0, "lists": {}, "trips": {} };
            Client.createEntry("users", loadedData);
            openProfileSetup(userName);
        }
    }
    else {
        let userData = {
            [userName]: { "profile": 0, "lists": {}, "trips": {} }
        };

        Client.createEntry("users", userData);
        openProfileSetup(userName);
    }
}

// Check if Username is not empty and valid
function loginManager() {
    const userName = document.getElementById("login-username");
    const userNotification = document.getElementById("login-notification");

    if (Client.checkInput(userName.value)) {
        userName.style.borderColor = "";
        userNotification.style.display = "none";
        proceedLogin(userName.value);
    }
    else {
        userName.style.borderColor = "red";
        userNotification.style.display = "block";
        setTimeout(function () {
            userName.style.borderColor = "";
            userNotification.style.display = "none";
        }, 3000);
    }
}

// Manage Header PopUp
function managePopup(popId, popOption) {
    if (popOption == "show") {
        document.getElementById(popId).style.display = "block";
    }
    else {
        document.getElementById(popId).style.display = "none";
    }
}

// Manage Navigation, Dinamically change play field :)
function menuNavigation(menuButton) {
    const pagesAll = [
        "intro",
        "app",
        "list",
        "about",
        "contact",
        "trip-load"
    ];

    for (let i = 0; i < pagesAll.length; i++) {
        let page = pagesAll[i];
        document.getElementById("content-" + page).classList.add("hiddenPart");
    }

    document.getElementById("content-" + menuButton).classList.remove("hiddenPart");
}

// Add event Listeners and start app functions only than DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check User Status [ if loggedIn or loggedOut, or mb new User?! ]
    checkSystem();

    // Event listener to add function to existing HTML DOM element
    document.getElementById('login-username-button').addEventListener('click', function () { loginManager(); });
    document.getElementById('first-label').addEventListener('click', function () { profileSelect(1); });
    document.getElementById('second-label').addEventListener('click', function () { profileSelect(2); });
    document.getElementById('results-header-button').addEventListener('click', function () { managePopup("results-header-search", "hide"); });

    // Menu Navigation Setup
    document.getElementById('menu-app').addEventListener('click', function () { menuNavigation("app"); });
    document.getElementById('menu-list').addEventListener('click', function () { menuNavigation("list"); });
    document.getElementById('menu-about').addEventListener('click', function () { menuNavigation("about"); });
    document.getElementById('menu-contact').addEventListener('click', function () { menuNavigation("contact"); });

    // Reload Web Setup
    document.getElementById('header-logo').addEventListener('click', function () { Client.reloadWeb(); });
    document.getElementById('header-text').addEventListener('click', function () { Client.reloadWeb(); });

    document.getElementById('header-search-bar-confirm').addEventListener('click', function () { checkWeather(); });
});
/** ------------ */

/** Inside APP Functionality **/ 

/////////////////

/** APP FUNCTIONS */
/** Functions related to data managing and results */

/** Check Weather Header */
// Update Results on header search bar
function updateResultsCheckBar(resultsData, idAdd) {
    if (resultsData) {
        document.getElementById(idAdd).innerHTML = "";

        let formBlock = document.createDocumentFragment();

        // Country Flag, Name and Code
        let countryBlock = document.createElement('div');
        countryBlock.classList.add('countryBlock');

        let countryName = document.createElement('span');
        countryName.innerHTML = resultsData.country + ", " + resultsData.country_code;
        countryName.classList.add('countryName');


        let countryFlag = document.createElement('img');
        countryFlag.src = resultsData.flag;
        countryFlag.classList.add('countryFlag');

        countryBlock.appendChild(countryFlag);
        countryBlock.appendChild(countryName);
        formBlock.appendChild(countryBlock);


        let infoGeneral = document.createElement('div');
        infoGeneral.classList.add('generalInfoStyle');

        let infoBlock = `
            <div>
                <span class="searchBarResultTitle">Population:</span>
                <span class="searchBarResultText">${resultsData.country_population}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Capital:</span>
                <span class="searchBarResultText">${resultsData.capital}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Demonym:</span>
                <span class="searchBarResultText">${resultsData.demonym}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Region:</span>
                <span class="searchBarResultText">${resultsData.region}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Sub Region:</span>
                <span class="searchBarResultText">${resultsData.subregion}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Calling Code:</span>
                <span class="searchBarResultText">${resultsData.calling_code}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Web Domain:</span>
                <span class="searchBarResultText">${resultsData.web_domain}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Time Zone:</span>
                <span class="searchBarResultText">${resultsData.time_zone}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Sunrise:</span>
                <span class="searchBarResultText">${resultsData.sunrise}</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Sunset:</span>
                <span class="searchBarResultText">${resultsData.sunset}</span>
            </div>
            `;
        infoGeneral.innerHTML = infoBlock;

        formBlock.appendChild(infoGeneral);


        let imageIcon = `https://www.weatherbit.io/static/img/icons/${resultsData.weather_icon}.png`;

        let infoWeather = document.createElement('div');
        infoWeather.classList.add('weatherSearchBlock');


        let infoBlockWeather = `
            <div class="weatherSearchTitle">Weather</div>
            <div>
                <span class="searchBarResultTitle">Wind Speed:</span>
                <span class="searchBarResultText">${resultsData.wind_speed} m/s</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Temperature:</span>
                <span class="searchBarResultText">${resultsData.weather_temp} °C</span>
            </div>
            <div>
                <span class="searchBarResultTitle">Condition:</span>
                <span class="searchBarResultText">${resultsData.weather_description}</span>
                <img class="weatherIcon" src="${imageIcon}">
            </div>
        `;
        infoWeather.innerHTML = infoBlockWeather;
        formBlock.appendChild(infoWeather);

        let infoImage = document.createElement('div');
        infoImage.classList.add('imageSearchBlock');

        let infoImageTitle = document.createElement('div');
        let infoImageTitleText = `
                <div class="weatherSearchTitle">Image</div>
            `;
        infoImageTitle.innerHTML = infoImageTitleText;
        infoImage.appendChild(infoImageTitle);

        if (resultsData.image_preview) {
            let imagePreview = document.createElement('img');
            imagePreview.src = resultsData.image_preview;
            imagePreview.classList.add('imagePreviewSearch');

            infoImage.appendChild(imagePreview);

            let infoImageDescription = document.createElement('div');
            let infoImageDescriptionText = `
                <div class="">${resultsData.tags}</div>
            `;
            infoImageDescription.innerHTML = infoImageDescriptionText;
            infoImage.appendChild(infoImageDescription);
        }
        else {
            let infoImageDescription = document.createElement('div');
            let infoImageDescriptionText = `
                <div class="">No Image</div>
            `;

            infoImageDescription.innerHTML = infoImageDescriptionText;
            infoImage.appendChild(infoImageDescription);
        }

        formBlock.appendChild(infoImage);
        document.getElementById(idAdd).appendChild(formBlock);
    }
    else {
        document.getElementById(idAdd).innerHTML = "No Data";
    }
}

// Get Weather
function getWeather(analyseName) {
    // Add data to POST request
    postData('http://localhost:8082/apiWeather', {
        analyseValue: analyseName
    })
        .then(function (res) {
            managePopup("results-header-search", "show");

            if (res) {
                updateResultsCheckBar(res, "results-header");
            }
            else {
                setTimeout(function () {
                    managePopup("results-header-search", "hide");
                }, 3000);
            }
        })
}

// Iniciate Check weather for header menu search
function checkWeather() {
    document.getElementById("results-header").innerHTML = "Loading...";
    managePopup("results-header-search", "show");

    let weatherInput = document.getElementById("header-search-bar");

    if (Client.checkInput(weatherInput.value)) {
        weatherInput.style.borderColor = "";
        getWeather(weatherInput.value);
    }
    else {
        weatherInput.style.borderColor = "red";
        setTimeout(function () {
            weatherInput.style.borderColor = "";
        }, 3000);
    }
}
/** ------------------ */


/** Popular Destinations */
// Set Popular destinations in bottom widget/slider section
function setPopTodayDestinations(res) {
    if (res && res.total > 4) {
        let image1 = document.createDocumentFragment();
        for (let i = 0; i < 5; i++) {
            // I can add user and url to picture, but it's not my idea, its bad for my design
            let image1_page = res.hits[i].pageUrl;
            let image1_user = res.hits[i].user;
            let image1_tags = res.hits[i].tags;
            let image1_url = res.hits[i].webformatURL;

            let image1_block = document.createElement('figure');

            let image1_image = document.createElement('img');
            image1_image.src = image1_url;
            image1_image.alt = image1_tags;
            image1_image.classList.add('popularDestinationSingle');

            image1_block.appendChild(image1_image);
            image1.appendChild(image1_block);
        }
        document.getElementById("popular-destinations").appendChild(image1);
    }
    else {
        document.getElementById("content-slider").classList.add("hiddenPart");
    }
}

// Get random country to suggest to visit
function getPopularDestinationImages() {
    let popularDestinations = "London,Malta,Vilnius,Cyprus";
    let popularDestinationsArray = popularDestinations.split(",");

    let todaysDestination = popularDestinationsArray[Math.floor(Math.random() * popularDestinationsArray.length)];

    document.getElementById("todays-suggestion").innerHTML = `Today's suggestion to visit: <b>${todaysDestination}</b>`;

    // Add data to POST request
    postData('http://localhost:8082/apiPopular', {
        analyseValue: todaysDestination
    })
        .then(function (res) {
            setPopTodayDestinations(res);
        })
}
/** ------------------ */









/** To do List */
// Create a new list item when clicking on the "Add" button
function newElement() {
    let li = document.createElement("li");
    let inputValue = document.getElementById("myInput").value;
    let t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        document.getElementById("myInput").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("myInput").style.borderColor = "";
        }, 3000);

    }
    else {
        document.getElementById("myUL").appendChild(li);
    }
    document.getElementById("myInput").value = "";

    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            let div = this.parentElement;
            div.style.display = "none";
        }
    }
}

// Clear To Do List form
function clearListform(listOption) {
    if (listOption == "save") {
        document.getElementById("myUL").innerHTML = "List saved";
        setTimeout(function () {
            document.getElementById("myUL").innerHTML = "";
        }, 1500);
    }
    else {
        document.getElementById("myUL").innerHTML = "List is cleared";
        setTimeout(function () {
            document.getElementById("myUL").innerHTML = "";
        }, 1500);
    }
}

// Open Selected To Do List
function openLists(listName) {
    let userName = document.getElementById("header-logged-in").innerHTML;
    let checkUser = Client.checkStorage("users");
    let loadedData = checkUser["load"];
    let userData = loadedData[userName];
    let userLists = userData["lists"];
    let getList = userLists[listName];

    document.getElementById("list-input-name").value = listName;
    document.getElementById("myUL").innerHTML = "";

    for (const [key, value] of Object.entries(getList)) {
        let text = value["text"];
        let status = value["completed"];

        let listLine = document.createElement("li");
        listLine.innerHTML = text;
        if (status == 1) {
            listLine.className = "checked";
        }

        let span = document.createElement("span");

        span.onclick = function () {
            let div = this.parentElement;
            div.remove();
        }

        let txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);

        listLine.appendChild(span);
        document.getElementById("myUL").appendChild(listLine);
    }
    menuNavigation("list");
}

// Delete Selected To Do List
function deleteLists(listName) {
    let userName = document.getElementById("header-logged-in").innerHTML;
    let checkUser = Client.checkStorage("users");
    let loadedData = checkUser["load"];
    let userData = loadedData[userName];
    let userLists = userData["lists"];

    delete userLists[listName];

    userData["lists"] = userLists;
    Client.updateUser("users", userName, userData);

    refreshLists();
}

// Refresh To Do List Section at Widgets Menu
function refreshLists() {
    let userName = document.getElementById("header-logged-in").innerHTML;

    let checkUser = Client.checkStorage("users");
    if (checkUser.status) {
        let loadedData = checkUser["load"];
        let userData = loadedData[userName];
        let userLists = userData["lists"];

        if (userLists && Object.keys(userLists).length !== 0) {
            document.getElementById("widget-lists-results").innerHTML = "";

            for (const [key, value] of Object.entries(userLists)) {
                let lineFull = document.createElement("div");
                lineFull.classList.add('widgetListLineTable');
                let span2 = document.createElement("span");
                let txt = document.createTextNode("\u00D7");
                span2.classList.add('widgetListsDelete');
                span2.classList.add('noselect');
                span2.classList.add('pointerCursor');
                span2.appendChild(txt);
                span2.onclick = function () {
                    deleteLists(key);
                }

                let span = document.createElement("span");
                span.innerHTML = key;
                span.classList.add('noselect');
                span.classList.add('pointerCursor');
                span.classList.add('widgetListsName');
                span.onclick = function () {
                    openLists(key);
                }
                lineFull.appendChild(span);
                lineFull.appendChild(span2);
                document.getElementById("widget-lists-results").appendChild(lineFull);
            }
        }
        else {
            document.getElementById("widget-lists-results").innerHTML = "No Lists Yet";
        }
    }
}

// Save To Do List Form, and Refresh Widget section!
function saveListform() {
    let listTitle = document.getElementById("list-input-name");

    if (Client.checkInput(listTitle.value)) {
        let myNodelist = document.getElementsByTagName("li");
        let myListObject = {};
        for (let i = 0; i < myNodelist.length; i++) {
            let bySingle = myNodelist[i];
            let completed = 0;
            if (bySingle.classList.contains("checked")) {
                completed = 1;
            }

            let textOnly = bySingle.textContent;
            let text = textOnly.slice(0, -1);

            let newObject = { "text": text, "completed": completed };

            myListObject[i] = newObject;
        }

        let checkData = Client.checkStorage("system");
        let userName = checkData["load"]["user"];

        let checkUser = Client.checkStorage("users");
        let loadedData = checkUser["load"];
        let userData = loadedData[userName];

        userData["lists"][listTitle.value] = myListObject;
        Client.updateUser("users", userName, userData);

        clearListform("save");
        refreshLists();
    }
    else {
        listTitle.style.borderColor = "red";
        setTimeout(function () {
            listTitle.style.borderColor = "";
        }, 3000);
    }
}


/** Create Travel Plan */
// Add Date To Live View
function updateDate() {
    let travelStart = document.getElementById("travel-start");
    let travelEnd = document.getElementById("travel-end");

    //travelStart.value = "2021/04/21";
    //travelEnd.value = "2021/04/26";

    if (Client.checkDate(travelStart.value) && Client.checkDate(travelEnd.value)) {
        let startDate = stringToDate(travelStart.value);
        let endDate = stringToDate(travelEnd.value);

        let dayDifference = dateDifference(startDate, endDate);
        let travelStartsIn = timeLeft(startDate);

        let fragmentBlock = document.createDocumentFragment();
        let dateInfoList = document.createElement('ul');

        let dateLi = document.createElement('li');
        dateLi.innerHTML = `<span class="titleInfoDate">Date: </span>${travelStart.value}-${travelEnd.value}`;

        let durationLi = document.createElement('li');
        durationLi.innerHTML = `<span class="titleInfoDate">Duration: </span>${dayDifference} days`;

        let startsLi = document.createElement('li');
        startsLi.innerHTML = `<span class="titleInfoDate">Starts in: </span>${travelStartsIn} days`;

        dateInfoList.appendChild(dateLi);
        dateInfoList.appendChild(durationLi);
        dateInfoList.appendChild(startsLi);

        let textList = document.createElement('span');
        textList.innerText = `Travel Date`;
        textList.classList.add('categoryTitleInfo');

        fragmentBlock.appendChild(textList);
        fragmentBlock.appendChild(dateInfoList);

        document.getElementById("plan-date-live-preview").innerHTML = "";
        document.getElementById("plan-date-live-preview").appendChild(fragmentBlock);
        document.getElementById("plan-date-live-preview").style.visibility = "unset";

        document.getElementById("add-date").value = "Update";
    }
    else {
        travelStart.style.borderColor = "red";
        travelEnd.style.borderColor = "red";
        setTimeout(function () {
            travelStart.style.borderColor = "";
            travelEnd.style.borderColor = "";
        }, 3000);
    }
}

// Add Destination to Live View
function addDestination() {
    let destinationInput = document.getElementById("plan-input-destination");

    let hotelInput = document.getElementById("plan-input-hotel").value;
    let flightInput = document.getElementById("plan-input-flight-date").value;

    if (Client.checkInput(destinationInput.value)) {
        document.getElementById("plan-destinations-live-preview").innerHTML = "Loading...";

        // Add data to POST request
        postData('http://localhost:8082/apiWeather', {
            analyseValue: destinationInput.value
        })
            .then(function (res) {

                document.getElementById("plan-destinations-live-preview").innerHTML = "";
                document.getElementById("plan-destinations-live-title-preview").innerHTML = "Destination";

                updateResultsCheckBar(res, "plan-destinations-live-preview");

                if (Client.checkInput(hotelInput) == false) {
                    hotelInput = "-";
                }
                if (Client.checkInput(flightInput) == false) {
                    flightInput = "-";
                }

                let fragmentBlock = document.createDocumentFragment();
                let dateInfoList = document.createElement('ul');

                let dateLi = document.createElement('li');
                dateLi.innerHTML = `<span class="titleInfoDate">Flight date: </span>${hotelInput}`;

                let durationLi = document.createElement('li');
                durationLi.innerHTML = `<span class="titleInfoDate">Hotel: </span>${flightInput}`;

                dateInfoList.appendChild(dateLi);
                dateInfoList.appendChild(durationLi);

                let textList = document.createElement('span');
                textList.innerText = `General Information`;
                textList.classList.add('generalInfo');

                fragmentBlock.appendChild(textList);
                fragmentBlock.appendChild(dateInfoList);
                document.getElementById("plan-destinations-live-general-preview").style.visibility = "unset";
                document.getElementById("plan-destinations-live-general-preview").innerHTML = "";
                document.getElementById("plan-destinations-live-general-preview").appendChild(fragmentBlock);
                document.getElementById("add-destination").value = "Update";
            })
    }
    else {
        destinationInput.style.borderColor = "red";
        setTimeout(function () {
            destinationInput.style.borderColor = "";
        }, 3000);
    }
}

// Add Not to Live View
function addNote() {
    let textInput = document.getElementById("plan-input-textarea");

    let fragmentBlock = document.createDocumentFragment();

    let textSpan = document.createElement('span');
    textSpan.innerHTML = `${textInput.value}`;

    let textList = document.createElement('span');
    textList.innerText = `Note`;
    textList.classList.add('categoryTitleInfo');

    fragmentBlock.appendChild(textList);
    fragmentBlock.appendChild(textSpan);

    document.getElementById("plan-note-live-preview").innerHTML = "";
    document.getElementById("plan-note-live-preview").appendChild(fragmentBlock);
    document.getElementById("plan-note-live-preview").style.visibility = "unset";

    document.getElementById("add-note").value = "Update";
}

// Add To Do List to Live View
function addTodDO() {
    let textInput = document.getElementById("plan-input-todo");

    let fragmentBlock = document.createDocumentFragment();

    let textSpan = document.createElement('span');
    textSpan.innerHTML = `${textInput.value}`;

    let textList = document.createElement('span');
    textList.innerText = `To Do List`;
    textList.classList.add('categoryTitleInfo');

    fragmentBlock.appendChild(textList);
    fragmentBlock.appendChild(textSpan);

    document.getElementById("plan-todolist-live-preview").innerHTML = "";
    document.getElementById("plan-todolist-live-preview").appendChild(fragmentBlock);
    document.getElementById("plan-todolist-live-preview").style.visibility = "unset";
    
    document.getElementById("add-todo").value = "Update";
}

// Save Travel Plan to Storage and refresh Widgets Menu + activate Print Button
function savePlan() {
    let confirmSave = true;

    let travelName = document.getElementById("plan-input-title");
    if (Client.checkInput(travelName.value) == false) {
        confirmSave = false;

        travelName.style.borderColor = "red";
        setTimeout(function () {
            travelName.style.borderColor = "";
        }, 3000);
    }

    let travelStart = document.getElementById("travel-start");
    let travelEnd = document.getElementById("travel-end");

    if (Client.checkInput(travelStart.value) == false || Client.checkInput(travelEnd.value) == false) {
        confirmSave = false;

        travelStart.style.borderColor = "red";
        travelEnd.style.borderColor = "red";
        setTimeout(function () {
            travelStart.style.borderColor = "";
            travelEnd.style.borderColor = "";
        }, 3000);
    }

    let travelDestination = document.getElementById("plan-input-destination");

    if (Client.checkInput(travelDestination.value) == false) {
        confirmSave = false;

        travelDestination.style.borderColor = "red";
        setTimeout(function () {
            travelDestination.style.borderColor = "";
        }, 3000);
    }

    if (confirmSave) {
        let travelHotel = document.getElementById("plan-input-hotel");
        let travelFlightDate = document.getElementById("plan-input-flight-date");
        let travelNote = document.getElementById("plan-input-textarea");
        let travelTodo = document.getElementById("plan-input-todo");

        let myListObject = {};
        myListObject["travelDestination"] = travelDestination.value;
        myListObject["travelStart"] = travelStart.value;
        myListObject["travelEnd"] = travelEnd.value;
        myListObject["travelHotel"] = travelHotel.value;
        myListObject["travelFlight"] = travelFlightDate.value;
        myListObject["travelNote"] = travelNote.value;
        myListObject["travelTodo"] = travelTodo.value;

        let checkData = Client.checkStorage("system");
        let userName = checkData["load"]["user"];

        let checkUser = Client.checkStorage("users");
        let loadedData = checkUser["load"];
        let userData = loadedData[userName];

        userData["trips"][travelName.value] = myListObject;
        Client.updateUser("users", userName, userData);

        clearPlansform("save");
        document.getElementById("print-trip-button").style.display = "block";

        refreshPlans();
    }
    else {
        console.log("Error");
    }

    document.getElementById("plan-date-live-preview").visibility = "hidden";
    document.getElementById("plan-destinations-live-general-preview").visibility = "hidden";
    document.getElementById("plan-note-live-preview").visibility = "hidden";
    document.getElementById("plan-todolist-live-preview").visibility = "hidden";
}

// Clear Travel Plan Form, Reset View
function clearPlansform(optionValue) {
    document.getElementById("plan-input-title").value = "";
    document.getElementById("travel-start").value = "";
    document.getElementById("travel-end").value = "";
    document.getElementById("plan-input-destination").value = "";
    document.getElementById("plan-input-hotel").value = "";
    document.getElementById("plan-input-flight-date").value = "";
    document.getElementById("plan-input-textarea").value = "";
    document.getElementById("plan-input-todo").value = "";

    document.getElementById("plan-name-live-preview").innerHTML = "";
    document.getElementById("plan-date-live-preview").innerHTML = "";
    document.getElementById("plan-destinations-live-title-preview").innerHTML = "";
    document.getElementById("plan-destinations-live-preview").innerHTML = "";
    document.getElementById("plan-destinations-live-general-preview").innerHTML = "";
    document.getElementById("plan-note-live-preview").innerHTML = "";
    document.getElementById("plan-todolist-live-preview").innerHTML = "";

    document.getElementById("plan-date-live-preview").visibility = "hidden";
    document.getElementById("plan-note-live-preview").visibility = "hidden";
}

// Delete Selected Plan, Refresh view
function deletePlans(listName) {
    let userName = document.getElementById("header-logged-in").innerHTML;
    let checkUser = Client.checkStorage("users");
    let loadedData = checkUser["load"];
    let userData = loadedData[userName];
    let userLists = userData["trips"];

    delete userLists[listName];

    userData["trips"] = userLists;
    Client.updateUser("users", userName, userData);

    refreshPlans();
}

// Refresh Travel Plan List on Widgets Side Menu
function refreshPlans() {
    let checkData = Client.checkStorage("system");
    let userName = checkData["load"]["user"];

    let checkUser = Client.checkStorage("users");
    if (checkUser.status) {
        let loadedData = checkUser["load"];
        let userData = loadedData[userName];
        let userLists = userData["trips"];

        if (userLists && Object.keys(userLists).length !== 0) {
            document.getElementById("widget-plans-results").innerHTML = "";
            document.getElementById("widget-plans-expired").innerHTML = "";

            let expired = true;
            for (const [key, value] of Object.entries(userLists)) {
                let lineFull = document.createElement("div");
                lineFull.classList.add('widgetListLineTable');

                let span2 = document.createElement("span");
                let txt = document.createTextNode("\u00D7");
                span2.classList.add('widgetListsDelete');
                span2.classList.add('noselect');
                span2.classList.add('pointerCursor');
                span2.appendChild(txt);
                span2.onclick = function () {
                    deletePlans(key);
                }

                let span = document.createElement("span");
                span.innerHTML = key;
                span.classList.add('noselect');
                span.classList.add('pointerCursor');
                span.classList.add('widgetListsName');
                span.onclick = function () {
                    openPlans(key);
                }
                lineFull.appendChild(span);
                lineFull.appendChild(span2);

                let startTripDay = stringToDate(value.travelStart);

                let travelStartsIn = timeLeft(startTripDay);

                if (travelStartsIn < 0) {
                    document.getElementById("widget-plans-expired").appendChild(lineFull);
                    expired = false;
                }
                else {
                    document.getElementById("widget-plans-results").appendChild(lineFull);
                }
            }

            if (expired) {
                document.getElementById("widget-plans-expired").innerHTML = "No Expired Plans";
            }
        }
        else {
            document.getElementById("widget-plans-results").innerHTML = "No Plans Yet";
        }
    }
}

// Open Selected Plan to View and print, and Delete
function openPlans(planName) {
    document.getElementById("travel-app").classList.add("hiddenBody");
    document.getElementById("content-app").classList.add("hiddenPart");
    document.getElementById("content-intro").classList.add("hiddenPart");
    document.getElementById("content-list").classList.add("hiddenPart");
    document.getElementById("content-about").classList.add("hiddenPart");
    document.getElementById("content-contact").classList.add("hiddenPart");
    document.getElementById("content-trip-load").classList.remove("hiddenPart");

    let userName = document.getElementById("header-logged-in").innerHTML;

    let checkUser = Client.checkStorage("users");
    let loadedData = checkUser["load"];
    let userData = loadedData[userName];

    let userLists = userData["trips"];

    let getList = userLists[planName];

    document.getElementById("list-input-name").value = planName;
    document.getElementById("myUL").innerHTML = "";

    let travelDestination = getList["travelDestination"];
    let travelStart = getList["travelStart"];
    let travelEnd = getList["travelEnd"];
    let travelHotel = getList["travelHotel"];
    let travelFlight = getList["travelFlight"];
    let travelNote = getList["travelNote"];
    let travelTodo = getList["travelTodo"];

    let travelNameSpace = document.getElementById("loaded-trip-name");
    travelNameSpace.innerHTML = "";
    travelNameSpace.innerHTML = `<span class="categoryTitleInfo">Travel Name:</span><span> ${planName}</span>`;

    let startDate = stringToDate(travelStart);
    let endDate = stringToDate(travelEnd);

    let dayDifference = dateDifference(startDate, endDate);
    let travelStartsIn = timeLeft(startDate);

    let fragmentBlock = document.createDocumentFragment();
    let dateInfoList = document.createElement('ul');

    let dateLi = document.createElement('li');
    dateLi.innerHTML = `<span class="titleInfoDate">Date: </span>${travelStart}-${travelEnd}`;

    let durationLi = document.createElement('li');
    durationLi.innerHTML = `<span class="titleInfoDate">Duration: </span>${dayDifference} days`;

    let startsLi = document.createElement('li');
    startsLi.innerHTML = `<span class="titleInfoDate">Starts in: </span>${travelStartsIn} days`;

    dateInfoList.appendChild(dateLi);
    dateInfoList.appendChild(durationLi);
    dateInfoList.appendChild(startsLi);

    let textList = document.createElement('span');
    textList.innerText = `Travel Date`;
    textList.classList.add('categoryTitleInfo');

    fragmentBlock.appendChild(textList);
    fragmentBlock.appendChild(dateInfoList);

    document.getElementById("loaded-trip-date").innerHTML = "";
    document.getElementById("loaded-trip-date").appendChild(fragmentBlock);
    document.getElementById("loaded-trip-date").style.visibility = "unset";

    // Note
    if (Client.checkInput(travelNote)) {
        let fragmentBlock = document.createDocumentFragment();

        let textSpan = document.createElement('span');
        textSpan.innerHTML = `${travelNote}`;

        let textList = document.createElement('span');
        textList.innerText = `Note`;
        textList.classList.add('categoryTitleInfo');

        fragmentBlock.appendChild(textList);
        fragmentBlock.appendChild(textSpan);

        document.getElementById("loaded-trip-note").innerHTML = "";
        document.getElementById("loaded-trip-note").appendChild(fragmentBlock);
        document.getElementById("loaded-trip-note").style.visibility = "unset";
    }

    // To Do List
    if (Client.checkInput(travelTodo)) {
        let fragmentBlock = document.createDocumentFragment();
        let textSpan = document.createElement('span');
        textSpan.innerHTML = `${travelTodo}`;

        let textList = document.createElement('span');
        textList.innerText = `To Do List`;
        textList.classList.add('categoryTitleInfo');

        fragmentBlock.appendChild(textList);
        fragmentBlock.appendChild(textSpan);

        document.getElementById("loaded-trip-todo").innerHTML = "";
        document.getElementById("loaded-trip-todo").appendChild(fragmentBlock);
        document.getElementById("loaded-trip-todo").style.visibility = "unset";
    }

    // Destination
    document.getElementById("loaded-trip-destination").innerHTML = "Loading...";
    
    // Add data to POST request
    postData('http://localhost:8082/apiWeather', {
        analyseValue: travelDestination
    })
        .then(function (res) {
            document.getElementById("loaded-plan-destinations-live-title-preview").innerHTML = "Destination";
            document.getElementById("loaded-trip-destination").innerHTML = "";
            updateResultsCheckBar(res, "loaded-plan-destinations-live-preview");

            if (Client.checkInput(travelHotel) == false) {
                travelHotel = "-";
            }
            if (Client.checkInput(travelFlight) == false) {
                travelFlight = "-";
            }

            let fragmentBlock = document.createDocumentFragment();
            let dateInfoList = document.createElement('ul');

            let dateLi = document.createElement('li');
            dateLi.innerHTML = `<span class="titleInfoDate">Flight date: </span>${travelHotel}`;

            let durationLi = document.createElement('li');
            durationLi.innerHTML = `<span class="titleInfoDate">Hotel: </span>${travelFlight} days`;

            dateInfoList.appendChild(dateLi);
            dateInfoList.appendChild(durationLi);

            let textList = document.createElement('span');
            textList.innerText = `General Information`;
            textList.classList.add('generalInfo');

            fragmentBlock.appendChild(textList);
            fragmentBlock.appendChild(dateInfoList);

            document.getElementById("loaded-plan-destinations-live-general-preview").style.visibility = "unset";
            document.getElementById("loaded-plan-destinations-live-general-preview").innerHTML = "";
            document.getElementById("loaded-plan-destinations-live-general-preview").appendChild(fragmentBlock);
        })

    document.getElementById('loaded-clear-trip-button').addEventListener('click', function () {
        menuNavigation("app");
        deletePlans(planName);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    refreshLists();
    refreshPlans();
    getPopularDestinationImages();

    document.getElementById('add-new-list-item').addEventListener('click', function () { newElement(); });
    document.getElementById('list-clear-button').addEventListener('click', function () { clearListform(); });
    document.getElementById('list-save-button').addEventListener('click', function () { saveListform(); });
    document.getElementById('print-trip-button').addEventListener('click', function () { printPlan("results-print"); });
    document.getElementById('loaded-print-trip-button').addEventListener('click', function () { printPlan("content-trip-load"); });
    document.getElementById('add-destination').addEventListener('click', function () { addDestination(); });
    document.getElementById('add-note').addEventListener('click', function () { addNote(); });
    document.getElementById('add-todo').addEventListener('click', function () { addTodDO(); });
    document.getElementById('save-trip-button').addEventListener('click', function () { savePlan(); });
    document.getElementById('clear-trip-button').addEventListener('click', function () { clearPlansform(); });
    document.getElementById('plan-input-title').addEventListener('change',
        function () {
            let travelName = document.getElementById("plan-input-title").value;
            let nameInput = `<span class="categoryTitleInfo">Travel Name:</span><span> ${travelName}</span>`;
            document.getElementById("plan-name-live-preview").innerHTML = nameInput;
        }
    );
    document.getElementById('add-date').addEventListener('click', function () { updateDate(); });

    // Create a "close" button and append it to each list item
    let myNodelist = document.getElementsByTagName("li");
    for (let i = 0; i < myNodelist.length; i++) {
        let span = document.createElement("span");
        let txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        myNodelist[i].appendChild(span);
    }

    // Click on a close button to hide the current list item
    let close = document.getElementsByClassName("close");
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            let div = this.parentElement;
            div.remove();
        }
    }

    // Add a "checked" symbol when clicking on a list item
    let list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'li') {
            ev.target.classList.toggle('checked');
        }
    }, false);
});