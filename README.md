#Shark

===

	npm install vp-shark

and:

	var Shark = require('vp-shark');

This module is a high level wrapper around selenium js webkit, fabricJS and the Videopoker APIs. It exposes a simple API of methods, callbacks and events to automate the playing of games and custom assertions for super simple and clean testing. It is intended to allow you to write expressive succinct tests without worrying about directly interfacing with the canvas API or the selenium API.

There are 3 main objects you will want to use:

`Shark.Server` - A server object, manages starting/killing the server process

`Shark.Game` - An game object, manages opening a game and all the normal functionality for dealing/drawing/holding cards and interfacing with the canvas

`Shark.Tester` - A testing object, contains specific assertions like `assertHasDealt`, `assertCardsHeld(2)` etc

## Example using Mocha
---

	var Shark = require('vp-shark'),
	    server, 
	    game, 
	    tester;
	
	before(function(){
	    server = new Shark.Server();
	});
	
	beforeEach(function(){
	    game = new Shark.Game(server, '3-5-10', 'H3F10SF1');
	    tester = new Shark.Tester();
	});
	
	after(function(){
	    server.kill();
	});
	
	describe('3-5-10', function(){
	
	    it('Should deal correctly', function(done){
	        game.betMax(function(){
	            tester.assertGameState(2);
	            done();
	        });
	    });
	
	    it('Should hold cards correctly', function(done){
	        game.betMax(function(){
	            game.hold(0,2,3)
	            tester.assertCardsHeld(0,2,3);
	            done();
	        });
	    });
	
	});


## API
---

##Shark.Server



##Public methods

###_constructor_

*returns* **Shark.Server**

You will need to call this method in your tests `setup` method. It will launch a child process of the server and return you an instance of `Shark.Server`

	var server = new Shark.Server();

###kill()

You should call this in the teardown method of you tests to make sure the resources are freed up properly and your test script exits properly.

	server.kill();
	
##errors

###ServerNotReady

If a server is used for an action but it is not ready, it will throw this error.

##Shark.Game

---

##public methods

###_constructor_

*param* **server** _Shark.Server_ - The server 

*param* **identifier** _string_ - The identifier of the game you want to start e.g. '3-5-10'

*param* **fsf** _string_ - The family/subfamily of the game you want to start

*returns* **Shark.Game**

Will start up a new game ready for playing

	var game = new Shark.Game(server, '3-5-10', 'F01SF10');
	
###bet()

*param* **bets** _array/integer_ - An array of the bets for each hand or a single number for all hands

_chainable_

The following 2 examples are interchangable.

	var game = game.bet([5,5,5]);
	
or
	
	var game = game.bet(5);

###betMax()

*param* **callback** _function_ - A callback to invoke at the end of the deal phase

_chainable_

Will bet max and start deal phase.

	game.betMax(function(){
		console.log("Finished dealing!");
	});
	
###deal()

*param* **callback** _function_ - A callback to invoke at the end of the deal phase

_chainable_

Will start deal phase

	game.bet(6).deal(function(){
		console.log("Finished dealing!");
	});
	
###hold()

*param* **pattern** _array_ - The hold pattern to make

_chainable_

The following will hold cards 1,3,5

	game.betMax(function(){
		game.hold([0,2,4]).draw();
	});
	
###draw()

*param* **callback** _function_ - A callback to invoke at the end of the draw phase

_chainable_

Will start draw phase

	game.draw(function(){
		console.log("Finished drawing!");
	});
	
##errors

###GameActionNotPermitted

Any action on a game which is not permitted at that point will throw this error

##Shark.Tester

---

###_constructor_

*param* **game** Shark.Game - The game we're testing

*returns* **Shark.Tester**

Returns an instance of `Shark.Tester` for a given game

	var tester = new Shark.Tester(game);

###assertHasDealt()
###assertCardsHeld()
###assertGameState()
###assertBet()

Please extend this library to support other features.

##Feature suggestions:

- Support for Wheel
- Support for view seepays/help
- Support for gaffing 
- Support for asserting winnings
- Support for sound testing(how???)

