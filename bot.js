var botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(function (request) {
      return {
				"response_type": "in_channel",
				"text":"Thanks for sending " + request.text  + 
      ". Your message is very important to us, but we're not functional yet"
	  }
});

// exports.handler = function (event, context) {
// 	console.log(event);
// 	context.succeed('hello ' + event.name);
// };
