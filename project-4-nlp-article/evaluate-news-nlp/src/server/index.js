

var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.static('dist'));

console.log(__dirname);

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8082, function () {
    console.log('Example app listening on port 8082!');
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse);
})

// var textapi = new meaningcloud({
//     application_key: process.env.API_KEY
//  });