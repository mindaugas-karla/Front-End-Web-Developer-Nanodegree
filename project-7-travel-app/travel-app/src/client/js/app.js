

const userName = "JonasB";
let leggedIn = 0;
var useris1 = {name:"petras", image:"1"};
var useris2 = {name:"jonas", image:"2"};
var test = {user1:useris1, user2:useris2};



localStorage.setItem('appData', JSON.stringify(test));



document.addEventListener('DOMContentLoaded', function () {

    let appData;

    if (localStorage.getItem('appData')) {
        leggedIn = 1;
        console.log("123");
       appData = JSON.parse(localStorage.getItem('appData'));
       //appData = localStorage.getItem('appData');
       console.log(appData);
       if (appData['user2']) {

        console.log("rado");

       }
       else {
        console.log("nerado");

       }


       let user = appData["user"];

        console.log("user:"+user);
      }
      else {
        leggedIn = 2;
        console.log("222");
        appData = [];


      }


    console.log ("rez:"+leggedIn);


    document.getElementById("header-logged-in").innerHTML = userName;
});
