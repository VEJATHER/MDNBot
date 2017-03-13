var botBuilder = require('claudia-bot-builder');
var slackTemplate = botBuilder.slackTemplate;
var rp= require('request-promise');
var setOptions = require("./helpers").setOptions;

module.exports = botBuilder(function (message) {
	var q,
		topic,
		index,
		url,
		reqArr,
		baseURL="https://developer.mozilla.org/en-US/search.json";
	if(message.originalRequest.command === "/mdnbot") {
		 return {
			"mrkdwn": true,
			"response_type": "in_channel",
			"text":"Hello " + message.originalRequest.user_name + "! \n I am MDN bot and will make your developers life easier, by searching MDN for you. \n If you use */mdnbot-search* you'll get results visible only to you. Example: `/mdnbot-search window.open js` \n If you want to show some of the results to a fellow developer use */mdnbot-show* command and I'll show the result you asked me to. Example: `/mdnbot-show 2 window.open js` \n It helps if you type a topic as last word. Happy mdn-searching!"
	  	}
	} 
	if(message.originalRequest.command === "/mdnbot-show") {
		reqArr = message.text.split(" ");
		var parssedIndex = parseInt(reqArr[0]);
		index = parssedIndex !== NaN && parssedIndex >= 1 && parssedIndex <= 10 ? parssedIndex - 1 : 0;
		if(reqArr.length > 2) {
			topic = reqArr.splice(reqArr.length - 1)[0];
			q = reqArr.slice(1).join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q + "&topic=" + topic;
			return rp(setOptions(url))
			.then(function (data) {
				var publicResultWithTopic = new slackTemplate("The result of search for: " + q + " topic: " + topic);
				return publicResultWithTopic
				.addAttachment('A1')
				.addTitle(data.documents[index].title, data.documents[index].url)
				.addText(data.documents[index].excerpt.replace(/(<([^>]+)>)/ig,"")).channelMessage(true).get();
			})
			.catch(function (err) {
				console.log(err); 
			});
		} else {
			q = reqArr.slice(1).join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q;
			return rp(setOptions(url))
			.then(function (data) {
				var publicResult = new slackTemplate("The result of search for: " + q);
				return publicResult
				.addAttachment('A1')
				.addTitle(data.documents[index].title, data.documents[index].url)
				.addText(data.documents[index].excerpt.replace(/(<([^>]+)>)/ig,"")).channelMessage(true).get();
			})
			.catch(function (err) {
				console.log(err); 
			});
		}
	 } 
	 if(message.originalRequest.command === "/mdnbot-search") {
		 reqArr = message.text.split(" ");
		 if(reqArr.length > 1) {
			topic = reqArr.splice(reqArr.length - 1)[0];
			q = reqArr.join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q + "?topic=" + topic;
			return rp(setOptions(url))
			.then(function (data) {
				var privatResultWithTopic = new slackTemplate("The results of search for: " + q + " topic: " + topic);
				data.documents.forEach(function (entry, i) {
					i = i + 1;
					return privatResultWithTopic.addAttachment('A1').addTitle(i + ". " + entry.title, entry.url).addText(entry.excerpt.replace(/(<([^>]+)>)/ig,""));
				});
				return privatResultWithTopic.get();
			})
			.catch(function (err) {
				console.log(err); 
			});
		} else {
			q = reqArr.join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q;
			return rp(setOptions(url))
			.then(function (data) {
				var privateResult = new slackTemplate("The results of search for: " + message.text);
				data.documents.forEach(function (entry, i) {
					i = i + 1;
					return privateResult.addAttachment('A1').addTitle(i + ". " + entry.title, entry.url).addText(entry.excerpt.replace(/(<([^>]+)>)/ig,""));
				});
				return privateResult.get();
			})
			.catch(function (err) {
				console.log(err); 
			});
		}
	}
}, { platforms: ['slackSlashCommand'] });

function tutorialCommand(message){
	 reqArr = message.text.split(" ");
	 if(reqArr.length > 1) {
		var topic = "lessons" 
		searchTerm = reqArr.join(" ");
		url = baseURL+"?q=" + searchTerm + "&topic=" + topic;
		return rp(setOptions(url))
		.then(function (data) {
			var privatResultWithTopic = new slackTemplate("The tutorial results for your : " + searchTerm + " search are:");
			data.documents.forEach(function (entry, i) {
				i = i + 1;
				return privatResultWithTopic.addAttachment('A1').addTitle(entry.title, entry.url).addText(entry.excerpt);
			});
			return privatResultWithTopic.get();
		})
		.catch(function (err) {
			console.log(err); 
		});
	}
}
function sanitizeExerpt(text){
  return text.replace(/(<([^>]+)>)/ig,"");
}