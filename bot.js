var botBuilder = require('claudia-bot-builder');
var slackTemplate = botBuilder.slackTemplate;
var req= require('request');

module.exports = botBuilder(function (request) {
	if(request.text) {
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
		return req(url, function (error, response, body) {
			if(!error && response.statusCode == 200) {
				var data = JSON.parse(body);
				return `Recived ${data["documents"][0]["title"]}`;
			}
		});
	} else {
		 return {
				"response_type": "in_channel",
				"text":"Thanks for sending " + request.text  + ". Your message is very important to us, but we're not functional yet"
	  			}
	}
});

// exports.handler = function (event, context) {
// 	console.log(event);
// 	context.succeed('hello ' + event.name);
// };

