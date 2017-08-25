var http = require("http");
var getHello = require("./Hello").getHello;
var getWorld = require("./Hello").getWorld;
var getAllString = require("./Hello").getAllString;

http.createServer(function(req, res){
	if(req.url === "/"){
		res.statusCode = 404;
		res.end(getHello());
	}else if(req.url === "/me"){
		res.statusCode = 500;
		res.end(getWorld());
	}else{
		res.statusCode = 200;
		res.end(getAllString());
	}
}).listen(8080)