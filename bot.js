var botBuilder = require('claudia-bot-builder');
var slackTemplate = botBuilder.slackTemplate;
var rp= require('request-promise');
var setOptions = require("./helpers").setOptions;

module.exports = botBuilder(function (request) {
	return request.command;
	var q,
		topic,
		index,
		url,
		reqArr;
	if(request.command === "/mdnbot") {
		 return {
			"response_type": "in_channel",
			"text":"Hello! I am MDN bot and will make your developers life easier, by searching MDN for you. Start your search by typing /mdnbot <searchTerm>. Example: /mdnbot reduce. If you want to filter your search results by topic, type topic as last. Example: /mdnbot reduce js. By default the search results returned will be visible only to you. If you want to show certain link to another developer, type /mdnbot show <searchTerm> <searchTopic> and the very first result of my search will be displayed. Example: /mdnbot show reduce(). Happy search!"
	  	}
	} 
	if(request.command === "/mdnbot-show") {
		reqArr = request.text.split(" ");
		var parsedIndex = parseInt(reqArr[0]);
		index = parssedIndex !== NaN && parssedIndex >= 1 && parssedIndex <= 10 ? parssedIndex - 1 : 0;
		if(reqArr.length > 2) {
			topic = reqArr.splice(reqArr.length - 1)[0];
			q = reqArr.slice(1).join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q + "?topic=" + topic;
			return rp(setOptions(url))
			.then(function (data) {
				var publicResultWithTopic = new slackTemplate("The results of search for: " + request.text);
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
				var publicResult = new slackTemplate("The results of search for: " + q);
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
	 if(request.command === "/mdnbot-search") {
		 reqArr = request.text.split(" ");
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
				var privateResult = new slackTemplate("The results of search for: " + request.text);
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
});
