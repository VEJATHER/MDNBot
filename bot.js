var botBuilder = require('claudia-bot-builder');
var slackTemplate = botBuilder.slackTemplate;
var requestPromise = require('minimal-request-promise');

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
			requestPromise.get(url).then(function (response) {
				var message = new slackTemplate();
				response.documents.forEach(function (entry) {
					message.addAtachment("A1").addTitle(entry.title, entry.url).get();
				});
    			return message;
  			},
  			function (response) {
    			console.log('got error');
  			}
		);
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

