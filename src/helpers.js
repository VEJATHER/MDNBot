'use strict';
let botBuilder = require('claudia-bot-builder');
let slackTemplate = botBuilder.slackTemplate;
let promise = require('request-promise');


let randomSearches = ["from", "concat", "every", "fill",
    "filter", "pop", "push", "reverse",
    "shift", "sort", "splice", "unshift",
    "forEach", "map", "reduce", "keys", "some",
    "join", "toString", "Element", "Event", "NodeList",
    "box-model", "animation", "p", "div", "span",
    "ul", "ol", "li", "img", "form", "input", "color",
    "background", "width", "arguments", "apply", "bind",
    "call", "Object.assign", "Object.create",
    "values", "hasOwnProperty", "defineProperty", "new", "const"
];


function setOptions(url) {
    return {
            uri: url,
            headers: { 'User-Agent': 'Request-Promise'},
            json: true // Automatically parses the JSON string in the response 
    };
}


function handleWelcomeCommand(username) {
    let text = getWelcomeMessage(username);
    return {
        "mrkdwn": true,
        "response_type": "in_channel",
        "text": text
    };

}

function handleShowCommand(url, title,index) {
    return promise(setOptions(url)).then((data) =>{
        let publicResultWithTopic = new slackTemplate(title);
        return publicResultWithTopic.addAttachment('A1')
            .addTitle(data.documents[index].title, data.documents[index].url)
            .addText(sanitizeExerpt(data.documents[index].excerpt))
            .channelMessage(true)
            .get();
    }).catch(err => console.log(err));
}

function handleSearchCommand(url,title) {
    return promise(setOptions(url)).then((data) =>{
        if(data.documents.length > 0){
            let privatResultWithTopic = new slackTemplate(title);
                data.documents.forEach(function(entry, i) {
                i++;
                return privatResultWithTopic.addAttachment('A'+i)
                    .addTitle(i + ". " + entry.title, entry.url)
                    .addText(sanitizeExerpt(entry.excerpt));
            });
            return privatResultWithTopic.get();        
        }else{
              return {
                "text": "No results found!"
            };
        } 
    }).catch(err => console.log(err));
}


function sanitizeExerpt(text) {
    return text.replace(/(<([^>]+)>)/ig, "");
}

function getWelcomeMessage(username) {
    return "Hello " + username +
           "! I am MDN bot and will make your developers life easier, by searching MDN for you. "
            + "\n */mdnbot-search [searchTerm] [searchTopic]* will give results visible only to you." 
            + " \n */mdnbot-show [searchTerm] [searchTopic] [itemNumber]`* command will make particular item visible for all. " 
            + "\n */mdnbot-random* will do a random search " 
            + "\n */mdnbot* will display this welcome text. Happy mdn-searching!";
}

module.exports = {
    //constants
    "BASE_URL": "https://developer.mozilla.org/en-US/search.json",
    "WELCOME_COMMAND": "/mdnbot",
    "SHOW_COMMAND": "/mdnbot-show",
    "SEARCH_COMMAND": "/mdnbot-search",
    "RANDOM_COMMAND": "/mdnbot-random",
    "TUTORIAL_COMMAND": "/mdnbot-tutorial",
    //utility functions
    randomData: randomSearches,
    setOptions: setOptions,
    welcome: handleWelcomeCommand,
    show: handleShowCommand,
    search: handleSearchCommand
};
