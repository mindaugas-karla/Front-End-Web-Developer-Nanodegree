/**
 * 
 * NLP Article Analyse
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
    const regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
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
    else if (elmnt == "completed") {
        let notificationProcess = document.getElementById("resultsProcess");
        let resultsProcess = document.getElementById("results");
        if (option == 1) {
            notificationProcess.innerHTML = "ANALYSE IS COMPLETED";
            resultsProcess.style.display = "block";
        }
        else {
            notificationProcess.innerHTML = "ANALYSE FAILED";
            resultsProcess.style.display = "none";
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
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}

// Convert Score Mark to Text
function translateScore(score) {
    let translation;
    switch (score) {
        case 'P+':
            translation = 'strong positive';
            break;
        case 'P':
            translation = 'positive';
            break;
        case 'NEW':
            translation = 'neutral';
            break;
        case 'N':
            translation = 'negative';
            break;
        case 'N+':
            translation = 'strong negative';
            break;
        case 'NONE':
            translation = 'without sentiment';
            break;
        default:
            translation = 'unknown';
    }
    return translation.toUpperCase();
}

// Update and Show results for User
function updateResults(data) {
    const status = data.status.msg;
    const credits = data.status.credits;
    const remaining_credits = data.status.remaining_credits;

    const model = data.model;
    const confidence = data.confidence;
    const agreement = data.agreement;
    const score = data.score_tag;
    const score_translated = translateScore(score);
    const irony = data.irony;
    const subjectivity = data.subjectivity;

    if (status == "OK") {
        let resultsProcess = document.getElementById("results");
        let analysedResults = "";
        analysedResults += "<span class='results_done_title'>MODEL: </span> <span>" + model + "</span> <br>";
        analysedResults += "<span class='results_done_title'>CONFIDENCE: </span> <span>" + confidence + "% </span> <br>";
        analysedResults += "<span class='results_done_title'>STATE: </span> <span>" + agreement + " </span> <br>";
        analysedResults += "<span class='results_done_title'>SCORE: </span> <span>" + score + " (" + score_translated + ")" + " </span> <br>";
        analysedResults += "<span class='results_done_title'>IRONY: </span> <span>" + irony + " </span> <br>";
        analysedResults += "<span class='results_done_title'>SUBJECTIVITY: </span> <span>" + subjectivity + " </span> <br>";

        resultsProcess.innerHTML = analysedResults;

        notifCenter("completed", 1);
    }
    else {
        notifCenter("completed", 0);
    }
}

// Send data for NLP Analyse
function getNlpAnalyse(analyseSource, analyseOption) {
    // Add data to POST request
    postData('http://localhost:8082/apiFeed', {
        analyseValue: analyseSource,
        analyseOption: analyseOption
    })
        // Function which updates UI
        .then(function (res) {
            updateResults(res);
        })
}

// Analyse Input
function generateResponse() {
    let analyseValue = document.getElementById("analyseValue");
    let resultsProcess = document.getElementById("results");
    resultsProcess.style.display = "none";
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
