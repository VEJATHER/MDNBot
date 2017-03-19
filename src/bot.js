'use strict';

let botBuilder = require('claudia-bot-builder');
let helpers = require("./helpers");

module.exports = botBuilder(function(message) {

    let reqArr = message.text.split(" ");
    let command = message.originalRequest.command;
    let topic = reqArr.length > 2 ? reqArr.splice(reqArr.length - 1)[0] : "";
    let q = reqArr.join(" ");; //this takes all params except the last as search terms
    let url = helpers.BASE_URL + "?q=" + q;
    let title = "The result of search for: " + q;
        url = topic !== "" ? url + "&topic=" + topic : url;
        title = topic !== "" ? title + " topic: " + topic : title; // add topic to title text if a topic has been given as an argument by the user

    switch (command) {
        case helpers.WELCOME_COMMAND:
            return helpers.welcome(message.originalRequest.user_name);
        
        case helpers.SHOW_COMMAND:
            let parsedIndex = parseInt(reqArr[reqArr.length - 1]);
            let index = parsedIndex !== NaN && parsedIndex >= 1 && parsedIndex <= 10 ? parsedIndex - 1 : 0;
            return helpers.show(url, title,index);
        
        case helpers.SEARCH_COMMAND:
            return helpers.search(url, title);
        
        case helpers.RANDOM_COMMAND:
             q = helpers.randomData[Math.floor(Math.random() * helpers.randomData.length)];
             url = helpers.BASE_URL+"?q=" + q;
             title = "Your random search: "+q;
             index = Math.floor(Math.random() * 10);
            return helpers.show(url, title,index);  
        default:
            console.log("No command was identified!");
    };

});
