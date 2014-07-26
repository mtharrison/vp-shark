var webdriver = require('selenium-webdriver')
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var seleniumLocation = __dirname + '/../vendor/selenium-server-standalone-2.37.0.jar';
var fs = require('fs');

var Game = function(server, identifier, fsf) {

	// Check selenium is there
	if(!fs.existsSync(seleniumLocation)){
		console.log("No selenium is present please download from \
		http://mattharrison.s3.amazonaws.com/selenium-server-standalone-2.37.0.jar \
		and copy to ./vendor/selenium-server-standalone-2.37.0.jar");
		process.exit(1);
	}

	var server = new SeleniumServer(seleniumLocation, {port: 4444});
	server.start();

	var driver = new webdriver.Builder()
	.usingServer(server.address())
	.withCapabilities(webdriver.Capabilities.chrome())
	.build();

	driver.get('http://localhost:4000/?game=3-5-10&hfsf=all&training=false');

	driver.wait(function(){
		return driver.executeScript(function(){ return typeof(loadGame) }).then(function(type){ return type === 'function' })
	}, 10000);	

};

module.exports = Game;