var webdriver = require('selenium-webdriver')
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var seleniumLocation = __dirname + '/../vendor/selenium-server-standalone-2.37.0.jar';
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Game = function(server) {
  var self = this;

  this.sharkServer = server;

  // Check selenium is there
  if(!fs.existsSync(seleniumLocation)){
    console.log("No selenium is present please download from \
      http://mattharrison.s3.amazonaws.com/selenium-server-standalone-2.37.0.jar \
      and copy to ./vendor/selenium-server-standalone-2.37.0.jar");
    process.exit(1);
  }

  var server = new SeleniumServer(seleniumLocation, {port: 4444});

  server.start();

  self.driver = new webdriver.Builder()
  .usingServer(server.address())
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

  return this;
};

util.inherits(Game, EventEmitter);

Game.prototype.start = function(identifier, hfsf, callback) {
  var self = this;

  self.driver.get(this.sharkServer.url + '/?game=' + identifier + '&hfsf=' + hfsf + '&training=false');

  self.driver.wait(function(){
    return self.driver.executeScript(function(){ return typeof(Game) !== 'undefined' && Game.fullyLoaded })
  }, 10000);

  self.driver.executeScript(function(hfsf){
    loadGame(hfsf, {top: 0, left: 0});
  }, hfsf);

  self.driver.wait(function(){
    return self.driver.executeScript(function(){ return typeof(Game) }).then(function(type){ return type !== 'undefined' })
  }, 10000);

  self.driver.executeScript(function(){ Game.gameSpeed = 3 }).then(function(){
    callback && callback();
    self.emit('started');
  });

}

Game.prototype.betMax = function(callback) {
  var self = this;

  self.driver.wait(function(){
    return self.driver.executeScript(function(){ return Game.gameState }).then(function(state){ return state === 1 })
  }, 10000);

  self.driver.executeScript(function(){
    Game.betMax(); 
  });

  self.driver.wait(function(){
    return self.driver.executeScript(function(){return Game.gameState })
    .then(function(state){ return state === 3 })
    .then(function(){ callback && callback(); self.emit('dealt'); return true; })
  }, 10000);

  return self;
};

Game.prototype.draw = function(callback) {
  var self = this;

  self.driver.sleep(200);

  self.driver.executeScript(function(){
    Game.startDraw(); 
  });

  self.driver.wait(function(){
    return self.driver.executeScript(function(){return Game.gameState })
    .then(function(state){ return state === 1 })
    .then(function(){ callback && callback(); self.emit('drew'); return true; })
  }, 10000);

  return self;
};

Game.prototype.holdCards = function(cards, callback) {
  var self = this;

  self.driver.wait(function(){
        return self.driver.executeScript(function(){ return Game.gameState }).then(function(state){ return state === 3 })
    }, 10000);

  self.driver.executeScript(function(cards){
    for(var i = 0; i < cards.length; i++){
      Game.hands[0].cards[cards[i]].holdCard(); 
    }
  }, cards).then(function(){
    callback && callback();
    self.emit('held');
  });

};

module.exports = Game;
