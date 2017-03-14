'use strict';

var botBuilder = require('claudia-bot-builder');
var helpers = require("./helpers");

module.exports = botBuilder(function(message) {

    var reqArr = message.text.split(" ");
    var command = message.originalRequest.command;
    var topic = reqArr.length > 2 ? reqArr.splice(reqArr.length - 1)[0] : "";
    var q = reqArr.join(" ");; //this takes all params except the last as search terms
    var url = helpers.BASE_URL + "?q=" + q;
    var title = "The result of search for: " + q;
        url = topic !== "" ? url + "&topic=" + topic : url;
        title = topic !== "" ? title + " topic: " + topic : title; // add topic to title text if a topic has been given as an argument by the user

    switch (command) {
        case helpers.WELCOME_COMMAND:
            return helpers.welcome(message.originalRequest.user_name);
        
        case helpers.SHOW_COMMAND:
            var parsedIndex = parseInt(reqArr[reqArr.length - 1]);
            var index = parsedIndex !== NaN && parsedIndex >= 1 && parsedIndex <= 10 ? parsedIndex - 1 : 0;
            return helpers.show(url, title,index);
        
        case helpers.SEARCH_COMMAND:
            return helpers.search(reqArr, url, title);
        
        case helpers.RANDOM_COMMAND:
             q = helpers.randomData[Math.floor(Math.random() * helpers.randomData.length)];
             url = helpers.BASE_URL+"?q=" + q;
             title = "Your random search: "+q;
             var index = Math.floor(Math.random() * 10);
            return helpers.show(reqArr, url, title,index);  
        case helpers.TUTORIAL_COMMAND:
              var url = helpers.BASE_URL+"?=q="+q+"&type=guide&skill=beginner";
              title = "Your "+q+" tutorials search results:";   
             return helpers.search(url, title);
        default:
            console.log("No command was identified!");
    };

}, { platforms: ['slackSlashCommand'] });
