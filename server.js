var http = require("http");
var url = require("url");

function start(route, handle)
{
	http.createServer(function(request, response) {
		var pathName = url.parse(request.url).pathname;
		route(pathName, handle, response, request);
	}).listen(8080);
}

exports.start = start;