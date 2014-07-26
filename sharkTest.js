var Shark = require('./index');

var server = new Shark.Server(
	'/Users/matt/Developer/node/html5-vp/server.js',
	'http://localhost:4000'
	);

server.start(function(){

	console.log("Server running");

	setInterval(function(){}, 100000);

	//new Shark.Game();
});