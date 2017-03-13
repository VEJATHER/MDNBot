'use strict';

module.exports = {
	setOptions: function setOptions(url) {
		return {
			uri: url,
			headers: {
				'User-Agent': 'Request-Promise'
			},
			json: true // Automatically parses the JSON string in the response 
		};
	}
};