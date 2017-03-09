var botBuilder = require('claudia-bot-builder');
var slackTemplate = botBuilder.slackTemplate;
var rp= require('request-promise');
var setOptions = require("./helpers").setOptions;

module.exports = botBuilder(function (request) {
	if(request.text.length === 0 && !request.text.trim()) {
		 return {
			"response_type": "in_channel",
			"text":"Hello! I am MDN bot and will make your developers life easier, by searching MDN for you."
	  	}
	} else {
		var q,
			topic,
			url,
			reqArr = request.text.split(" ");
		if(reqArr.length > 2 && reqArr[0] === "show") {
			topic = reqArr.splice(reqArr.length - 1)[0];
			q = reqArr.slice(1).join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q + "?topic=" + topic;
			return rp(setOptions(url))
			.then(function (data) {
				var publicResultWithTopic = new slackTemplate("The results of search for: " + request.text);
				return publicResultWithTopic
				.addAttachment('A1')
				.addTitle(data.documents[0].title, data.documents[0].url)
				.addText(data.documents[0].excerpt.replace(/(<([^>]+)>)/ig,"")).channelMessage(true).get();
			})
			.catch(function (err) {
				console.log(err); 
			});
		} else if(reqArr.length > 1 && reqArr[0] === "show") {
			q = reqArr.slice(1).join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q;
			return rp(setOptions(url))
			.then(function (data) {
				var publicResult = new slackTemplate("The results of search for: " + request.text);
				return publicResult
				.addAttachment('A1')
				.addTitle(data.documents[0].title, data.documents[0].url)
				.addText(data.documents[0].excerpt.replace(/(<([^>]+)>)/ig,"")).channelMessage(true).get();
			})
			.catch(function (err) {
				console.log(err); 
			});
		} else if(reqArr.length > 1) {
			topic = reqArr.splice(reqArr.length - 1)[0];
			q = reqArr.join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q + "?topic=" + topic;
			return rp(setOptions(url))
			.then(function (data) {
				var privatResultWithTopic = new slackTemplate("The results of search for: " + request.text);
				data.documents.forEach(function (entry) {
					return privatResultWithTopic.addAttachment('A1').addTitle(entry.title, entry.url).addText(entry.excerpt.replace(/(<([^>]+)>)/ig,""));
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
				data.documents.forEach(function (entry) {
					return privateResult.addAttachment('A1').addTitle(entry.title, entry.url).addText(entry.excerpt.replace(/(<([^>]+)>)/ig,""));
				});
				return privateResult.get();
			})
			.catch(function (err) {
				console.log(err); 
			});
		}
	}
});
