module.exports = {
    setOptions: function (url) {
        return {
				uri: url,
				headers: {
					'User-Agent': 'Request-Promise'
				},
				json: true // Automatically parses the JSON string in the response 
			};
    },
	randomData: ["from()", "concat()", "every()", "fill()", "filter()", "pop()", "push()", "reverse()", "shift()", "sort()", "splice()", "unshift()", "forEach()", "map()", "reduce()", "keys()", "some()", "join()", "toString()", "Element", "Event", "NodeList", "box-model", "animation", "p", "div", "span", "ul", "ol", "li", "img", "form", "input", "color", "background", "width", "arguments", "apply()", "bind()", "call()", "Object.assign()", "Object.create()", "values()", "hasOwnProperty()", "defineProperty()", "new", "const"]
};