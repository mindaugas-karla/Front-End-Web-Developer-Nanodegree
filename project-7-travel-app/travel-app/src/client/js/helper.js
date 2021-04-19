//** Helper Functions **/

// Check Input Field - Input Validation
function checkInput(inputValue) {
    if (inputValue !== null && inputValue.length !== 0) {
        return true;
    }
    else {
        return false;
    }
}

// Reload Website
function reloadWeb () {
    location.reload();
}

// Check if Date is Correct
function checkDate(date) {
    if (!isNaN(Date.parse(date))) {
        return true;
    }
    else {
        return false;
    }
}

export {
    checkInput,
    reloadWeb,
    checkDate

}