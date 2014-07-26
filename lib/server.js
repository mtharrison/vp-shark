var url = require('url');
var http = require('http');
var exec = require('child_process').exec;

var Server = function(endpoint) {

	this.endpoint = endpoint;
	this.child = null;

	if(arguments.length === 2){
		this.url = arguments[1];
	} else {
		this.url = this.endpoint;
	}

	var parsedUrl = url.parse(endpoint);

	if(parsedUrl.protocol){
		this._endpointType = Server.ENDPOINT_TYPE_URL;
	} else {
		this._endpointType = Server.ENDPOINT_TYPE_PATH;
	}

};

Server.prototype.start = function(callback) {
	this.child = exec('node ' +  this.endpoint);
	
	this.child.stdout.on('data', function(message){
		callback();
	});
};

Server.prototype.kill = function() {
	this.child && this.child.kill();
};


// Constants
Server.ENDPOINT_TYPE_PATH = 1;
Server.ENDPOINT_TYPE_URL  = 2;

module.exports = Server;