'use strict';

var botBuilder = require('claudia-bot-builder'),
    slackTemplate = botBuilder.slackTemplate,
    promise = require('request-promise'),
    helpers = require("./helpers"),
    setOptions = helpers.setOptions,
    randomData = helpers.randomData;

module.exports = botBuilder(function (message) {

    var reqArr = message.text.split(" ");
    command = message.originalRequest.command;
    // topic = reqArr.length > 2 ? requestParams.splice(reqArr.length - 1)[0] : "",
    // q = requestParams.slice(1).join(" "), //this takes all params except the last as search terms
    // url = baseURL + "?q=" + q,
    // url = topic !== "" ? url + "&topic=" + topic : url,
    // title = "The result of search for: " + q;
    // title = topic !== "" ? title + " topic: " + topic : title; // add topic to title text if a topic has been given as an argument by the user
    var publicResultWithTopic = new slackTemplate("Command not found");
    return publicResultWithTopic.addAttachment('A1').addTitle("not found !").addText("test").channelMessage(true).get();
    //  handleNoCommand(reqArr,command);
    /*
        switch (command) {
            case WELCOME_COMMAND:
                return handleWelcomeCommand(message);
            case SHOW_COMMAND:
                return handleShowCommand(reqArr);
            case SEARCH_COMMAND:
                return handleSearchCommand(reqArr);
            case RANDOM_COMMAND:
                return handleRandomCommand(reqArr);
            case TUTORIAL_COMMAND:
                return handleTutorialCommand(reqArr);
            default:
                return handleNoCommand(reqArr,command);
                //console.log("No command was identified!");
        };
    */
}, { platforms: ['slackSlashCommand'] });