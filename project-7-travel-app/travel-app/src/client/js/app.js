
document.addEventListener('DOMContentLoaded', function () {
    app ();
    document.getElementById('login-username-button').addEventListener('click', function(){loginManager();});
    document.getElementById('login-profile-button').addEventListener('click', function(){profileNext();});

    document.getElementById('first-label').addEventListener('click', function(){profileSelect(1);});
    document.getElementById('second-label').addEventListener('click', function(){profileSelect(2);});

});

function appInsideSet () {

}




function profileSelect(profile) {

    if (profile == 1) {
        document.getElementById("first-label").classList.add("profileSelected");
        document.getElementById("second-label").classList.remove("profileSelected");
    }
    else {
        document.getElementById("first-label").classList.remove("profileSelected");
        document.getElementById("second-label").classList.add("profileSelected");

    }


}



function app () {
    let checkData = checkStorage("system");
    if (checkData["status"]) {
        console.log ("rado system");
        let loggedIn = checkData["load"]["login"];

        if (loggedIn == 1) {
            console.log("PRISILOGGINES!");
            appInsideSet ();
        }
        else {
            console.log("NERISILOGGINES!");
        }
    }
    else {
        console.log ("create system setting");
        let newEntry = {login:0};    
        createEntry("system", newEntry);
    }
}

function profileNext () {
    const rbs = document.querySelectorAll('input[name="profiles"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }

    if (selectedValue == "first") {


    }
    else if (selectedValue == "second") {


    }
    else {
        document.getElementById("first-label").classList.add("profileError");
        document.getElementById("second-label").classList.add("profileError");
       
        setTimeout(function(){
            document.getElementById("first-label").classList.remove("profileError");
            document.getElementById("second-label").classList.remove("profileError");
           
        },3000);
    }

    //console.log("pasirinkta:"+selectedValue);

}




// Check Input Field - Input Validation
function checkInput(inputValue) {
    if (inputValue !== null && inputValue.length !== 0) {
        return true;
    }
    else {
        return false;
    }
}


function checkStorage (userName) {
    let getData = localStorage.getItem(userName);
    let response = [];
    if (getData) {
        response.status = true;
        response.load = JSON.parse(getData);
    }
    else {
        response.status = false;
        response.load = false;
    }
    return response;
}


function createEntry (userName, valueSet) {
    localStorage.setItem(userName, JSON.stringify(valueSet));
    return true;
}



function chooseProfile () {


        //user-name-profile

}

function blockManagement (sectionId, sectionOption) {
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

function openProfileSetup (userName) {
    document.getElementById("user-name-profile").innerHTML = userName;
    blockManagement ("content-login", "hide");
    blockManagement ("content-profile", "show");    
}


function proceedLogin (userName) {
    let checkData = checkStorage("users");
    if (checkData["status"]) {
        let loadedData = checkData["load"];

        if (loadedData[userName]) {
            console.log("RADO USERI");
            let userData = loadedData[userName];
            let userProfile = userData["profile"];
            if (userProfile == 0) {
                console.log("nesukurtas profilis");
                openProfileSetup (userName);
            }
            else {
                console.log("done, priloginti !");


            }

        }
        else {
            console.log("NERADO USERIO");
            loadedData[userName] = { "profile" : 0};
            createEntry("users", loadedData);
        }
    }
    else {

        var userData = {
            userName:{ "profile" : 0}
        };   

        createEntry("users", userData);
    }

    // if (checkStorage (userName)) {
    //     let userData = loadUser(userName);
    //     console.log("atloadinta");
    //     console.log(userData);

    //     if (userData["profile"] == 0) {
    //         console.log("neparinktas profilis");
    //     }
    //     else {
    //         console.log("parinktas profilis");
    //     }
    // }
    // else {
    //     console.log("NERADO");
        
    // }


}



function loginManager() {
    const userName = document.getElementById("login-username");
    const userNotification = document.getElementById("login-notification");
    
    if (checkInput(userName.value)) {
        userName.style.borderColor = "";
        userNotification.style.display = "none";
        proceedLogin (userName.value);
    }
    else {
        userName.style.borderColor = "red";
        userNotification.style.display = "block";

        setTimeout(function(){
            userName.style.borderColor = "";
            userNotification.style.display = "none";
        },3000);
    }
}








const userName = "JonasB";
let leggedIn = 0;
var useris1 = {name:"petras", image:"1"};
var useris2 = {name:"jonas", image:"2"};
var test = {user1:useris1, user2:useris2};



localStorage.setItem('appData', JSON.stringify(test));



// document.addEventListener('DOMContentLoaded', function () {

//     let appData;

//     if (localStorage.getItem('appData')) {
//         leggedIn = 1;
//         console.log("123");
//        appData = JSON.parse(localStorage.getItem('appData'));
//        //appData = localStorage.getItem('appData');
//        console.log(appData);
//        if (appData['user2']) {

//         console.log("rado");

//        }
//        else {
//         console.log("nerado");

//        }


//        let user = appData["user"];

//         console.log("user:"+user);
//       }
//       else {
//         leggedIn = 2;
//         console.log("222");
//         appData = [];


//       }


//     console.log ("rez:"+leggedIn);


//     document.getElementById("header-logged-in").innerHTML = userName;
// });


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('menu-about').addEventListener('click', function(){menuNavigation("about");});
    document.getElementById('menu-app').addEventListener('click', function(){menuNavigation("app");});
    document.getElementById('menu-list').addEventListener('click', function(){menuNavigation("list");});
    document.getElementById('menu-about').addEventListener('click', function(){menuNavigation("about");});
    document.getElementById('menu-contact').addEventListener('click', function(){menuNavigation("contact");});
});
//submit_button.addEventListener("click", test_click_event);


function menuNavigation (menuButton) {
    console.log("mygtuka:"+menuButton);
    const pagesAll = [
        "intro",
        "app",
        "list",
        "about",
        "contact"
    ];

    //content-
   
    for (i = 0; i < pagesAll.length; i++) {
        let page = pagesAll[i];
        console.log("page:"+page);

        document.getElementById("content-"+page).style.display = "none";
      }

      document.getElementById("content-"+menuButton).style.display = "block";



}