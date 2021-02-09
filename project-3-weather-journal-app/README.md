# Project 3: Weather Journal App
##### Udacity Front End Developer Nanodegree Program
This project consists of:
- Lesson 1: Introduction
- Lesson 2: Node & Express Environment
- Lesson 3: HTTP Requests & Routes
- Lesson 4: Asynchronous JavaScript

## Requirements
This project requires you to create an asynchronous web app that uses Web API and user data to dynamically update the UI for a Weather-Journal App.

## This project helped with :speech_balloon:
- [x] How dto setup a Node environment with Express and the necessary project dependencies
- [x] How to setup a server with GET and POST routes
- [x] How to create developer credentials for a Web API
- [x] How to use the Fetch API with my credentials and user input to get dynamic data into my app routes
- [x] How to access a GET route on the server side, from a function called on the client side
- [x] How to chain Promises together
- [x] How to access HTML elements with JavaScript and set their properties dynamically

## Developement Strategy Used :speech_balloon:
- [x] Setting up project environment, making sure Node and packages installed, and included in server.js file.
- [x] Added POST and GET routes to ensure correct retrieval of data from the server.
- [x] Acquired API credentials from OpenWeatherMap website.
- [x] Created async functions to fetch weather data and store it on my local server.
- [x] Set up a function that updated UI dynamically.

## Architecture
The project have a structure like the one shown below. App successfully renders a home page with clear design and functionality added when index.html is loaded in the browser. No errors displayed in console.

```
server.js
package.json
package-lock.json
node_modules
website
- css
-- styles.css
-- web-layout.css
-- web-styling.css
-- web-system.css
- images
-- sad_smile.png
-- normal_smile.png
-- happy_smile.png
-- temperature.png
-- icona.ico
- app.js
- index.html
../README.mdn
```

## Technologies Used
- Html
- Css
- JavaScript


## Results

![](images/weather_app.png)

### Preview Links
Landing Page preview links are active. From generated link you can view active Landing page.

- [Landing Page: Index](https://mindaugas-karla.github.io/Front-End-Web-Developer-Nanodegree/project-3-weather-journal-app/weather-journal-app/website/index.html)

### Testing
To get the project up and running follow the steps below:
- Open Terminal & navigate to project folder
```
cd project-3-weather-journal-app
cd weather-journal-app
```
- To set up project environment, make sure that the Node and packages (Express, Cors and Body-Parser) installed, and which are used to create the server.
- After that to start your server, run the command node server.js in your terminal
```
node server.js
```




