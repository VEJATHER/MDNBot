'use strict';
const randomSearches = [ 
		 "from()", "concat()", "every()", "fill()", 
		 "filter()", "pop()", "push()", "reverse()", 
		 "shift()", "sort()", "splice()", "unshift()", 
	 	 "forEach()", "map()", "reduce()", "keys()", 
		 "some()", "join()", "toString()", "Element", 
		 "Event", "NodeList", "box-model", "animation", 
		 "p", "div", "span", "ul", "ol", "li", "img", 
		 "form", "input", "color", "background", "width", 
		 "arguments", "apply()", "bind()", "call()", 
		 "Object.assign()", "Object.create()", "values()", 
		 "hasOwnProperty()", "defineProperty()", "new", "const"
	 ];
module.exports = {
    "BASE_URL": "https://developer.mozilla.org/en-US/search.json",
    "WELCOME_COMMAND": "/mdnbot",
    "SHOW_COMMAND": "/mdnbot-show",
    "SEARCH_COMMAND": "/mdnbot-search",
    "RANDOM_COMMAND": "/mdnbot-random",
    "TUTORIAL_COMMAND": "/mdnbot-tutorial",
    randomData: randomSearches,
    setOptions: setOptions,
    welcome: handleWelcomeCommand,
    show: handleShowCommand,
    search: handleSearchCommand,
    random: handleRandomCommand,
    tutorial: handleTutorialCommand,
    noCommand: handleNoCommand

};

function setOptions(url) {
	return {
	    uri: url,
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true // Automatically parses the JSON string in the response 
	};
}

function handleWelcomeCommand(message) {
    var username = message.originalRequest.user_name;
    return {
        "mrkdwn": true,
        "response_type": "in_channel",
        "text": getWelcomMessage(username)
    };
}

function handleShowCommand(requestParams) {
    var parssedIndex = parseInt(reqArr[reqArr.length - 1]),
        index = parssedIndex !== NaN && parssedIndex >= 1 && parssedIndex <= 10 ? parssedIndex - 1 : 0;

    return promise(setOptions(url)).then(function (data) {
        var publicResultWithTopic = new slackTemplate(title);
        return publicResultWithTopic.addAttachment('A1').addTitle(data.documents[index].title, data.documents[index].url).addText(sanitizeExerpt(data.documents[index].excerpt)).channelMessage(true).get();
    }).catch(function (err) {
        return console.log(err);
    });
}

function handleSearchCommand(requestParams) {
    return promise(setOptions(url)).then(function (data) {
        var privatResultWithTopic = new slackTemplate(title);
        data.documents.forEach(function (entry, i) {
            i++;
            return privatResultWithTopic.addAttachment('A1').addTitle(i + ". " + entry.title, entry.url).addText(sanitizeExerpt(entry.excerpt));
        });
        return privatResultWithTopic.get();
    }).catch(function (err) {
        return console.log(err);
    });
}

function handleRandomCommand(requestParams) {
    q = randomData[Math.floor(Math.random() * randomData.length)];
    url = "https://developer.mozilla.org/en-US/search.json?q=" + q;
    return rp(setOptions(url)).then(function (data) {
        var randomResult = new slackTemplate("The results of search for: " + q);
        data.documents.forEach(function (entry, i) {
            i = i + 1;
            return randomResult.addAttachment('A1').addTitle(i + ". " + entry.title, entry.url).addText(entry.excerpt.replace(/(<([^>]+)>)/ig, ""));
        });
        return randomResult.get();
    }).catch(function (err) {
        console.log(err);
    });
}

function handleNoCommand(requestParams, command) {
    var publicResultWithTopic = new slackTemplate("Command not found");
    return publicResultWithTopic.addAttachment('A1').addTitle(command + "not found !").addText(requestParams).channelMessage(false).get();
}

function handleTutorialCommand(message) {
    //TODO
}

function sanitizeExerpt(text) {
    return text.replace(/(<([^>]+)>)/ig, "");
}

function getWelcomeMessage(username) {
	return "Hello " + username +
		"! I am MDN bot and will make your developers life easier, by searching MDN for you. "+
		"\n `*/mdnbot-search [searchTerm] [searchTopic]*` will give results visible only to you."+
		" \n `*/mdnbot-show [searchTerm] [searchTopic] [itemNumber]*` command will make particular item visible for all. "+
		"\n `*/mdnbot-random*` will do a random search \n */mdnbot* will display this welcome text. Happy mdn-searching!";
}