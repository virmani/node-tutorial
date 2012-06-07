function route(pathName, handle, response, request) {
	console.log("Routing the request for ", pathName);
	if(typeof(handle[pathName]) == "function") {
		handle[pathName](response, request);
	} else {
		console.log("No request handler found for " + pathName);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write(pathName + " Not Found");
		response.end();
	}
	
}

exports.route = route;