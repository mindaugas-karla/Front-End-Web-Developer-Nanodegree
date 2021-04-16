/** Functions to Manage Platform */
/** (I know It's better to separate this category,
 * but it was way easier to do this way,
 * because then I started I added more and more usability,
 * and it was too hard to move this later) */

// Log Out Button
function logOut(userName) {
    // Clears User Entry
    let newEntry = { login: 0, user: 0 };
    Client.createEntry("system", newEntry);

    document.getElementById("login-username").value = "";
    document.getElementById("header-logged-in").value = "";


    // Hide Menu Elements, set Sign Out Mode
    document.getElementById("main-footer").classList.add("hiddenFooter");
    document.getElementById("main-content").classList.add("hiddenGrid");
    document.getElementById("main-header").classList.add("hiddenPart");
    document.getElementById("travel-app").classList.add("hiddenBody");

    document.getElementById("content-widget").classList.add("hiddenPart");
    document.getElementById("content-intro").classList.add("hiddenPart");
    document.getElementById("content-menu").classList.add("hiddenPart");
    document.getElementById("content-slider").classList.add("hiddenPart");
    document.getElementById("content-app").classList.add("hiddenPart");
    document.getElementById("content-list").classList.add("hiddenPart");


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

            // Add Logout button Listener
            document.getElementById('header-logout').addEventListener('click', function () { logOut(userName); });
            // Add Intro button
            document.getElementById('intro-confirm').addEventListener('click', function () { confirmIntro(userName); });

            let profilePic = checkData["load"][userName]["profile"];
            let introMessage = checkData["load"][userName]["intro"];
            console.log("intro:" + introMessage);
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
            console.log("1A1.PRILOGINTAS");

            insideApp(loggedUser);
        }
        else {
            console.log("1A2.OFFLINE");

            // Do nothing: Leave Log In page
        }
    }
    else {
        console.log("1B.NERADO");

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
            loadedData[userName] = { "profile": 0, "lists": {} };
            Client.createEntry("users", loadedData);
            openProfileSetup(userName);
        }
    }
    else {
        var userData = {
            [userName]: { "profile": 0, "lists": {} }
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
        "contact"
    ];

    for (var i = 0; i < pagesAll.length; i++) {
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

    //
    document.getElementById('header-logo').addEventListener('click', function () { Client.reloadWeb(); });
    document.getElementById('header-text').addEventListener('click', function () { Client.reloadWeb(); });


});






//** Inside APP Functionality **/ 




/////////////////

/** APP FUNCTIONS */
/** Functions related to data managing and results */

// Check Weather Header

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('header-search-bar-confirm').addEventListener('click', function () { checkWeather(); });
});






function setPopTodayDestinations(res) {
    console.log("tvarkom");
    console.log(res);
    if (res && res.total > 4) {
        let image1 = document.createDocumentFragment();
        for (let i = 0; i < 5; i++) {
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


function getPopularDestinationImages(popularDestination) {
    let popularDestinations = "London,Malta,Vilnius,Cyprus";
    let popularDestinationsArray = popularDestinations.split(",");

    let todaysDestination = popularDestinationsArray[Math.floor(Math.random() * popularDestinationsArray.length)];

    document.getElementById("todays-suggestion").innerHTML = `Today's suggestion to visit: <b>${todaysDestination}</b>`;

    // Add data to POST request
    postData('http://localhost:8082/apiPopular', {
        analyseValue: todaysDestination
    })
        .then(function (res) {
            // console.log("rezultatai");
            //console.log(res);
            setPopTodayDestinations(res);

            //managePopup("results-header-search", "show");
        })


}


function updateResultsCheckBar(resultsData) {
    //results-header
    if (resultsData) {
        //rado!


        document.getElementById("results-header").innerHTML = "";

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



        document.getElementById("results-header").appendChild(formBlock);


    }
    else {
        document.getElementById("results-header").innerHTML = "No Data";
        setTimeout(function () {
            managePopup("results-header-search", "hide");
        }, 3000);
        //nerado !
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
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}


function getWeather(analyseName) {
    // Add data to POST request
    postData('http://localhost:8082/apiWeather', {
        analyseValue: analyseName
    })
        .then(function (res) {
            console.log("rezultatai");
            console.log(res);
            updateResultsCheckBar(res);

            managePopup("results-header-search", "show");
        })
}

function checkWeather() {
    document.getElementById("results-header").innerHTML = "Loading...";
    managePopup("results-header-search", "show");

    let weatherInput = document.getElementById("header-search-bar");
    console.log("Ieskos oro salies:" + weatherInput.value);

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





// Create a new list item when clicking on the "Add" button
function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("myInput").value;
    var t = document.createTextNode(inputValue);
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

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}

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

function openLists(listName) {
    console.log("atidaro:" + listName);

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

        var listLine = document.createElement("li");
        listLine.innerHTML = text;
        if (status == 1) {
            listLine.className = "checked";
        }

        var span = document.createElement("SPAN");

        span.onclick = function () {
            var div = this.parentElement;
            div.remove();
        }

        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);

        listLine.appendChild(span);
        document.getElementById("myUL").appendChild(listLine);
    }






    console.log(getList);


    menuNavigation("list");


}


function deleteLists(listName) {

    let userName = document.getElementById("header-logged-in").innerHTML;

    let checkUser = Client.checkStorage("users");
    let loadedData = checkUser["load"];
    let userData = loadedData[userName];

    let userLists = userData["lists"];

    delete userLists[listName];

    console.log(userLists);


    userData["lists"] = userLists;
    Client.updateUser("users", userName, userData);

    refreshLists();
    // console.log(getList);



}

function refreshLists() {
    let userName = document.getElementById("header-logged-in").innerHTML;


    let checkUser = Client.checkStorage("users");
    console.log(checkUser);
    if (checkUser.status) {
        let loadedData = checkUser["load"];
        let userData = loadedData[userName];

        let userLists = userData["lists"];
        console.log("listas");
        console.log(userLists);
        if (userLists && Object.keys(userLists).length !== 0) {
            document.getElementById("widget-lists-results").innerHTML = "";

            var blockList = document.createElement("div");

            for (const [key, value] of Object.entries(userLists)) {
                var lineFull = document.createElement("div");
                lineFull.classList.add('widgetListLineTable');
                var span2 = document.createElement("SPAN");
                var txt = document.createTextNode("\u00D7");
                span2.classList.add('widgetListsDelete');
                span2.classList.add('noselect');
                span2.classList.add('pointerCursor');
                span2.appendChild(txt);
                span2.onclick = function () {
                    deleteLists(key);
                }

                var span = document.createElement("SPAN");
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

function saveListform() {
    let listTitle = document.getElementById("list-input-name");

    if (Client.checkInput(listTitle.value)) {
        var myNodelist = document.getElementsByTagName("LI");
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

            //console.log(text);

            myListObject[i] = newObject;


        }


        let checkData = Client.checkStorage("system");
        let userName = checkData["load"]["user"];

        console.log("username:" + userName);

        let checkUser = Client.checkStorage("users");
        let loadedData = checkUser["load"];
        let userData = loadedData[userName];

        console.log("serdata");
        console.log(userData);

        // console.log(userDataLists);


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


document.addEventListener('DOMContentLoaded', function () {
    refreshLists();
    getPopularDestinationImages("Vilnius");
    document.getElementById('add-new-list-item').addEventListener('click', function () { newElement(); });
    document.getElementById('list-clear-button').addEventListener('click', function () { clearListform(); });
    document.getElementById('list-save-button').addEventListener('click', function () { saveListform(); });

    // Create a "close" button and append it to each list item
    var myNodelist = document.getElementsByTagName("LI");
    for (let i = 0; i < myNodelist.length; i++) {
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        myNodelist[i].appendChild(span);
    }

    // Click on a close button to hide the current list item
    var close = document.getElementsByClassName("close");
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            //div.style.display = "none";
            div.remove();


        }
    }

    // Add a "checked" symbol when clicking on a list item
    var list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);



});


