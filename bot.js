var botBuilder = require('claudia-bot-builder');
var slackTemplate = botBuilder.slackTemplate;
var rp= require('request-promise');

module.exports = botBuilder(function (request) {
	if(request.text.length === 0 && !request.text.trim()) {
		 return {
			"response_type": "in_channel",
			"text":"Thanks for sending " + request.text  + ". Your message is very important to us, but we're not functional yet"
	  	}
	} else {
		var q,
			topic,
			url,
			reqArr = request.text.split(" ");
		if(reqArr.length > 1) {
			topic = reqArr.splice(reqArr.length - 1)[0];
			q = reqArr.join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q + "?topic=" + topic;
		} else {
			q = reqArr.join(" ");
			url = "https://developer.mozilla.org/en-US/search.json?q=" + q;
		}
		var options = {
    		uri: url,
			headers: {
				'User-Agent': 'Request-Promise'
			},
			json: true // Automatically parses the JSON string in the response 
		};
		return rp(options)
		.then(function (data) {
			var searchResults = new slackTemplate("The results of search for: " + request.text);
			data.documents.forEach(function (entry) {
				return searchResults.addAttachment('A1').addTitle(entry.title, entry.url).addText(entry.excerpt);
			});
			return searchResults.channelMessage(true).get();
		})
		.catch(function (err) {
			console.log(err); 
		});
	}
});

// exports.handler = function (event, context) {
// 	console.log(event);
// 	context.succeed('hello ' + event.name);
// };

