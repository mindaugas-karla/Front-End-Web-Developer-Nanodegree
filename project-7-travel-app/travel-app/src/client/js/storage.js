// Check and load Storage Data
function checkStorage(systemName) {
    let getData = localStorage.getItem(systemName);
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

// Create New Storage Value
function createEntry(userName, valueSet) {
    localStorage.setItem(userName, JSON.stringify(valueSet));
    return true;
}

// Create New User: add UserName and Selected Profile
function updateUser(systemPart, userName, dataSet) {
    let checkData = Client.checkStorage(systemPart);
    if (checkData["status"]) {
        let loadedData = checkData["load"];
        if (loadedData[userName]) {
            let userData = loadedData[userName];

            if (typeof dataSet === 'object' && dataSet !== null) {
                for (const [key, value] of Object.entries(dataSet)) {
                    console.log(`${key}: ${value}`);
                    userData[key] = value;
                }
                let obj = {[userName]:userData};
                Client.createEntry(systemPart, obj);
            }
            else {
                //Error
                console.log("Error");
            }
        }
        else {
            //Error
            console.log("Error");
        }
    }
    else {
        //Error
        console.log("Error");
    }
}

export {
    checkStorage,
    createEntry,
    updateUser
}