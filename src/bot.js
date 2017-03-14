'use strict';

let botBuilder = require('claudia-bot-builder'),
    slackTemplate = botBuilder.slackTemplate,
    promise = require('request-promise'),
    helpers = require("./helpers"),
    setOptions = helpers.setOptions,
    randomData = helpers.randomData;

module.exports = botBuilder(function(message) {

    let reqArr = message.text.split(" ");
        command = message.originalRequest.command;
        // topic = reqArr.length > 2 ? requestParams.splice(reqArr.length - 1)[0] : "",
        // q = requestParams.slice(1).join(" "), //this takes all params except the last as search terms
        // url = baseURL + "?q=" + q,
        // url = topic !== "" ? url + "&topic=" + topic : url,
        // title = "The result of search for: " + q;
        // title = topic !== "" ? title + " topic: " + topic : title; // add topic to title text if a topic has been given as an argument by the user
        
// if(message.originalRequest.command === "/mdnbot") {
//          return {
//             "mrkdwn": true,
//             "response_type": "in_channel",
//             "text":"Hello " + message.originalRequest.user_name + "! I am MDN bot and will make your developers life easier, by searching MDN for you. \n */mdnbot-search [searchTerm] [searchTopic]* will give results visible only to you. \n */mdnbot-show [searchTerm] [searchTopic] [itemNumber]* command will make particular item visible for all. \n */mdnbot-random* will do a random search \n */mdnbot* will display this welcome text. Happy mdn-searching!"
//         }
//     } 
      

    switch (command) {
        case helpers.WELCOME_COMMAND:
            return  {
                "mrkdwn": true,
                "response_type": "in_channel",
                "text":"Hello " + message.originalRequest.user_name + "! I am MDN bot and will make your developers life easier, by searching MDN for you. \n */mdnbot-search [searchTerm] [searchTopic]* will give results visible only to you. \n */mdnbot-show [searchTerm] [searchTopic] [itemNumber]* command will make particular item visible for all. \n */mdnbot-random* will do a random search \n */mdnbot* will display this welcome text. Happy mdn-searching!"
            };
        // case SHOW_COMMAND:
        //     return handleShowCommand(reqArr);
        // case SEARCH_COMMAND:
        //     return handleSearchCommand(reqArr);
        // case RANDOM_COMMAND:
        //     return handleRandomCommand(reqArr);
        // case TUTORIAL_COMMAND:
        //     return handleTutorialCommand(reqArr);
        default:
            return handleNoCommand(reqArr,command);
            //console.log("No command was identified!");
    };

}, { platforms: ['slackSlashCommand'] });

