'use strict';

let botBuilder = require('claudia-bot-builder'),
    slackTemplate = botBuilder.slackTemplate,
    promise = require('request-promise'),
    setOptions = require("./helpers").setOptions,
    randomData = helpers.randomData;


const BASE_URL = "https://developer.mozilla.org/en-US/search.json",
    WELCOME_COMMAND = "/mdnbot",
    SHOW_COMMAND = "/mdnbot-show",
    SEARCH_COMMAND = "/mdnbot-search",
    RANDOM_COMMAND = "/mdnbot-random",
    TUTORIAL_COMMAND = "/mdnbot-tutorial";

module.exports = botBuilder(function(message) {

    let reqArr = message.text.split(" ");
    command = message.originalRequest.command;
    topic = reqArr.length > 2 ? requestParams.splice(reqArr.length - 1)[0] : "",
        q = requestParams.slice(1).join(" "), //this takes all params except the last as search terms
        url = baseURL + "?q=" + q,
        url = topic !== "" ? url + "&topic=" + topic : url,
        title = "The result of search for: " + q;
    title = topic !== "" ? title + " topic: " + topic : title; // add topic to title text if a topic has been given as an argument by the user

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
            console.log("No command was identified!");
    };

}, { platforms: ['slackSlashCommand'] });

function handleWelcomeCommand(message) {
    let username = message.originalRequest.user_name;
    return {
        "mrkdwn": true,
        "response_type": "in_channel",
        "text": getWelcomMessage(username)
    };
}

function handleShowCommand(requestParams) {
    let parssedIndex = parseInt(reqArr[reqArr.length - 1]),
		index = parssedIndex !== NaN && parssedIndex >= 1 && parssedIndex <= 10 ? parssedIndex - 1 : 0;

    return promise(setOptions(url))
        .then((data) => {
            const publicResultWithTopic = new slackTemplate(title);
            return publicResultWithTopic.addAttachment('A1')
                .addTitle(data.documents[index].title, data.documents[index].url)
                .addText(sanitizeExerpt(data.documents[index].excerpt))
                .channelMessage(true)
                .get();
        })
        .catch(err => console.log(err));
}

function handleSearchCommand(requestParams) {
    return promise(setOptions(url))
        .then((data) => {
            let privatResultWithTopic = new slackTemplate(title);
            data.documents.forEach((entry, i) => {
                i++;
                return privatResultWithTopic.addAttachment('A1')
                    .addTitle(i + ". " + entry.title, entry.url)
                    .addText(sanitizeExerpt(entry.excerpt));
            });
            return privatResultWithTopic.get();
        })
        .catch(err => console.log(err));
}

function handleRandomCommand(requestParams) {
  		q = randomData[Math.floor(Math.random() * randomData.length)];
		url = "https://developer.mozilla.org/en-US/search.json?q=" + q;
		return rp(setOptions(url))
		.then(function (data) {
			var randomResult = new slackTemplate("The results of search for: " + q);
			data.documents.forEach(function (entry, i) {
				i = i + 1;
				return randomResult.addAttachment('A1').addTitle(i + ". " + entry.title, entry.url).addText(entry.excerpt.replace(/(<([^>]+)>)/ig,""));
			});
			return randomResult.get();
		})
		.catch(function (err) {
			console.log(err); 
		});
}

function handleTutorialCommand(message) {
    //TODO
}

function sanitizeExerpt(text) {
    return text.replace(/(<([^>]+)>)/ig, "");
}

function getWelcomeMessage(username) {
    return "Hello " + message.originalRequest.user_name + "! I am MDN bot and will make your developers life easier, by searching MDN for you. \n */mdnbot-search [searchTerm] [searchTopic]* will give results visible only to you. \n */mdnbot-show [searchTerm] [searchTopic] [itemNumber]* command will make particular item visible for all. \n */mdnbot-random* will do a random search \n */mdnbot* will display this welcome text. Happy mdn-searching!";
}
