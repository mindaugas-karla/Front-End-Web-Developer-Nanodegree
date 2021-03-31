/**
 * 
 * NLP article analyse
 * This project requires you to
 * create an asynchronous web app that uses Web API 
 * and dynamically update the UI, to use Webpack and practices learned at course.
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/


// Event listener to add function to existing HTML DOM element
document.getElementById('analyseButton').addEventListener('click', generateResponse);



// Check Input Field - Input Validation
function checkInput(inputValue) {
    if (inputValue.length !== 0 && inputValue !== null) {
        return true;
    }
    else {
        return false;
    }
}

// Validate Url
function validURL(inputValue) {
    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    return regex.test(inputValue);
}

// Notification center to inform user
function notifCenter(elmnt, option) {
    if (elmnt == "form") {
        let notificationShow = document.getElementById("notificationForm");
        let notificationMessage = document.getElementById("notificationMark");
        let notificationInput = document.getElementById("analyseValue");
        
        
        if (option == 1) {
            notificationInput.style.borderColor = "#dfe7e8";
            notificationShow.style.display = "none";
            notificationMessage.innerHTML = "";
        }
        else {
            notificationShow.style.display = "block";
            notificationInput.style.borderColor = "#c42332";
            notificationMessage.innerHTML = "Nothing to Analyse. Enter URL or TEXT!";

            setTimeout(function () {
                notificationShow.style.display = "none";
                notificationInput.style.borderColor = "#dfe7e8";
            }, 5000);
        }
    }
    else if (elmnt == "analyse") {
        let notificationProcess = document.getElementById("resultsProcess");

        if (option == "text") {
            notificationProcess.innerHTML = "TEXT IS BEING ANALYSED";
        }
        else if (option == "web") {
            notificationProcess.innerHTML = "WEBSITE IS BEING ANALYSED";
        }
        else {
            notificationProcess.innerHTML = "READY TO ANALYSE";
        }
    }
    else {
        notificationInput.style.borderColor = "#dfe7e8";
        notificationShow.style.display = "none";
        notificationMessage.innerHTML = "";
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
        console.log(newData);
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}

function updateResults (data) {
    console.log("Gauta");
    console.log(data);

}


function getNlpAnalyse (analyseSource, analyseOption) {
    // Add data to POST request
    postData('http://localhost:8082/apiFeed', {
        analyseValue: analyseSource,
        analyseOption: analyseOption
    })
    // Function which updates UI
    .then(function (res) {
        console.log(res);
        updateResults (res);
    })
}




// Analyse Input
function generateResponse () {
    let analyseValue = document.getElementById("analyseValue");
    if (checkInput(analyseValue.value)) {
        notifCenter("form", 1);
        let optionSet;
        if (validURL(analyseValue.value)) {
            optionSet = "web";
            notifCenter("analyse", optionSet);
            getNlpAnalyse(analyseValue.value, optionSet);
        }
        else {
            optionSet = "text";
            notifCenter("analyse", optionSet);
            getNlpAnalyse(analyseValue.value, optionSet);
        }
    }
    else {
        notifCenter("form", 0);
    }
}
