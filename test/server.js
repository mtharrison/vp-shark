var assert = require("assert");
var Shark = require('../index.js');
var http = require('http');

describe('Shark.Server', function(){

	describe('constructor', function(){

		it('Should be able to determine whether the arg is a path or URL', function(){			
			var server = new Shark.Server(__dirname + '/some/path/to/server');
			assert(server._endpointType === Shark.Server.ENDPOINT_TYPE_PATH);

			var server = new Shark.Server('http://server.com');
			assert(server._endpointType === Shark.Server.ENDPOINT_TYPE_URL);
		});

		it('Should set a URL', function(){			
			var server = new Shark.Server(
				__dirname + '/some/path/to/server',
				'http://localhost:3000'
				);

			assert(server.url === 'http://localhost:3000');

			var server = new Shark.Server(
				'http://localhost:3001'
				);

			assert(server.url === 'http://localhost:3001');

		});

	});

	describe('start()', function(){

		it('Should start up the server if given a path endpoint', function(done){
			var server = new Shark.Server(
				__dirname + '/resources/mockServer.js',
				'http://localhost:3005'
			);

			server.start(function(){
				http.get(server.url, function(res){
					var body = "";

					res.on('data', function(chunk){
						body += chunk;
					});

					res.on('end', function(){
						server.kill();
						assert(body === "Hello world!");
						done();
					});

					res.on('error', function(){
						server.kill();
						done();
					});

				});
			});

			assert(server._endpointType === Shark.Server.ENDPOINT_TYPE_PATH);
		});

	});

	describe('kill()', function(){

		it('Should be able to kill a server', function(done){
			var server = new Shark.Server(
				__dirname + '/resources/mockServer.js',
				'http://localhost:3005'
			);

			server.start(function(){
				assert(server.child.killed === false);
				server.kill();
				assert(server.child.killed === true);
				done();
			});

		});

	});

});