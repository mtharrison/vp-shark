var url  = require('url');
var http = require('http');
var path = require('path');
var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Server = function(endpoint) {

	this.endpoint = endpoint;
	this.child = null;
	this.started;

	if(arguments.length === 2){
		this.url = arguments[1];
		this._endpointType = Server.ENDPOINT_TYPE_PATH;
	} else {
		this.url = this.endpoint;
		this._endpointType = Server.ENDPOINT_TYPE_URL;
	}

};

util.inherits(Server, EventEmitter);

Server.prototype.start = function(callback) {


	if(this._endpointType === Server.ENDPOINT_TYPE_URL){
		 callback && callback();
		 this.emit('started');
		 return this;
	}

	this.child = exec('node ' +  this.endpoint, 
		{cwd: path.dirname(this.endpoint)},
		function(error, stdout, stderr){
			// Ignore the SIGTERM, it's just us killing the server
			// intentionally
			if(error && error.signal !== "SIGTERM") console.log(error);
	});

	// Once we get data from stdout, we know we're up
	this.child.stdout.on('data', function(data){
		if(!this.started) callback();
		this.emit('started');
		this.started = true;
	});

	return this;

};

// Constants
Server.ENDPOINT_TYPE_PATH = 1;
Server.ENDPOINT_TYPE_URL  = 2;

module.exports = Server;
