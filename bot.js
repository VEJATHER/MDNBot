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
            return helpers.show(reqArr, url, title);
            // case helpers.SEARCH_COMMAND:
            //     return handleSearchCommand(reqArr, url, topic);
            // case helpers.RANDOM_COMMAND:
            //     return handleRandomCommand(reqArr, url, topic);
            // case helpers.TUTORIAL_COMMAND:
            //     return handleTutorialCommand(reqArr, url);
        default:
            console.log("No command was identified!");
    };

}, { platforms: ['slackSlashCommand'] });
