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

function reloadWeb () {
    location.reload();
}




export {
    checkInput,
    reloadWeb

}