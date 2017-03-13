'use strict';

let 	botBuilder = require('claudia-bot-builder'),
    	slackTemplate = botBuilder.slackTemplate,
    	requestPromise = require('request-promise'),
    	setOptions = require("./helpers").setOptions;

const   BASE_URL = "https://developer.mozilla.org/en-US/search.json",
 	    WELCOME_COMMAND = "/mdnbot",
 	    SHOW_COMMAND = "/mdnbot-show",
 	    SEARCH_COMMAND = "/mdnbot-search",
 	    RANDOM_COMMAND ="/mdnbot-random",
 	    TUTORIAL_COMMAND = "/mdnbot-tutorial";
	
module.exports = botBuilder(function (message) {

	let	reqArr = message.text.split(" ");
		command = message.originalRequest.command;
        topic = reqArr.length > 2 ? requestParams.splice(reqArr.length - 1)[0] : "",
		q = requestParams.slice(1).join(" "), //this takes all params except the last as search terms
		url = baseURL+"?q="+q,
		url = topic !== "" ? url + "&topic=" + topic : url,
		title = "The result of search for: " + q;
		title = topic !== "" ? title + " topic: " + topic : title,// add topic to title text if a topic has been given as an argument by the user


		switch(command){
			case WELCOME_COMMAND:  
				let username = message.originalRequest.user_name;
				return { 
					"mrkdwn": true,
					"response_type": "in_channel",
					"text": getWelcomMessage(username);
				};
			case SHOW_COMMAND: 	  
				 handleShowCommand(reqArr);
				 break;
			case SEARCH_COMMAND: 
				 handleSearchCommand(reqArr);
				 break;
			case RANDOM_COMMAND: 
				 handleRandomCommand(reqArr);
				 break;
			case TUTORIAL_COMMAND: 
				 handleTutorialCommand(reqArr);
				 break;
			default:
			     console.log("No command was identified!");
				 break;					  					  					  					  					  

		};

}, { platforms: ['slackSlashCommand'] });


function handleShowCommand(requestParams){
		let parsedIndex = parseInt(requestParams[0]),
   		    index = parsedIndex !== NaN && parsedIndex >= 1 && parsedIndex <= 10 ? parsedIndex - 1 : 0;

		return requestPromise(setOptions(url))
			   	.then((data) => {
				    const publicResultWithTopic = new slackTemplate(title);
					return publicResultWithTopic.addAttachment('A1')
												.addTitle(data.documents[index].title, data.documents[index].url)
												.addText(sanitizeExerpt(data.documents[index].excerpt))
												.channelMessage(true)
												.get();
					})
				.catch(err =>console.log(err));
}
function handleSearchCommand(requestParams){
			return requestPromise(setOptions(url))
			.then((data) =>{
				let privatResultWithTopic = new slackTemplate(title);
				data.documents.forEach((entry, i)=> {
					i++;
					return privatResultWithTopic.addAttachment('A1')
												.addTitle(i + ". " + entry.title, entry.url)
												.addText(sanitizeExerpt(entry.excerpt));
				});
				return privatResultWithTopic.get();
			})
			.catch(err =>console.log(err));
}
function handleRandomCommand(requestParams){
	//TODO
}

function handleTutorialCommand(message) {
	//TODO
}

function sanitizeExerpt(text) {
	return text.replace(/(<([^>]+)>)/ig, "");
}
function getWelcomeMessage(username){
	return "Hello " + username + "! \n I am MDN bot and will make your developers life easier, by searching MDN for you. \n If you use */mdnbot-search* you'll get results visible only to you. Example: `/mdnbot-search window.open js` \n If you want to show some of the results to a fellow developer use */mdnbot-show* command and I'll show the result you asked me to. Example: `/mdnbot-show 2 window.open js` \n It helps if you type a topic as last word. Happy mdn-searching!"
}