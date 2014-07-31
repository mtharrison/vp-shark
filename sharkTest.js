var Shark = require('./index');

var server = new Shark.Server('http://localhost:4000');

server.on('started', function(){
	var game = new Shark.Game(server);

	game.start('3-5-10', 'H3F0SF1');

	game.on('started', game.betMax);

	game.on('dealt', function(){
		game.holdCards([0]);
	});

	game.on('held', game.draw);

});

server.start();