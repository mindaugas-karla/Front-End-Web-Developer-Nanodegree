/** Functions to Manage Platform */
/** (I know It's better to separate this category,
 * but it was way easier to do this way,
 * because then I started I added more and more usability,
 * and it was too hard to move this later) */

// Log Out Button
function logOut (userName) {
    // Clears User Entry
    let newEntry = { login: 0, user: 0 };
    Client.createEntry("system", newEntry);

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
            console.log("intro:"+introMessage);
            if (introMessage == 0) {
                document.getElementById("content-intro").classList.remove("hiddenPart");
            }
            else {
                document.getElementById("content-app").classList.remove("hiddenPart");
            }


            // Set Profile
            setProfileImage (profilePic);

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
        let dataSet = { "profile": 1, "intro" : 0 };
        Client.updateUser("users", userName, dataSet);
        insideApp(userName);
    }
    else if (selectedValue == "second") {
        let dataSet = { "profile": 2, "intro" : 0 };
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
function confirmIntro (userName) {

    let dataSet = { "intro" : 1 };
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
            loadedData[userName] = { "profile": 0 };
            Client.createEntry("users", loadedData);
            openProfileSetup(userName);
        }
    }
    else {
        var userData = {
            [userName]: { "profile": 0 }
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
function managePopup (popId, popOption) {
    if (popOption == "show") {
        document.getElementById(popId).style.display = "block";
    }
    else {
       document.getElementById(popId).style.display = "none";
    }
}

// Manage Navigation, Dinamically change play field :)
function menuNavigation(menuButton) {
    console.log("mygtuka:" + menuButton);
    const pagesAll = [
        "intro",
        "app",
        "list",
        "about",
        "contact"
    ];

    for (var i = 0; i < pagesAll.length; i++) {
        let page = pagesAll[i];
        console.log("page:" + page);
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


function updateResultsCheckBar () {



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
            //updateResults(res);

            managePopup("results-header-search", "show");
        })
}



function checkWeather () {
    let weatherInput = document.getElementById("header-search-bar").value;
    console.log("Ieskos oro salies:"+weatherInput);    
    getWeather(weatherInput);

}


