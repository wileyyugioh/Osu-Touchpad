//includes
var app = require('express')();
var path = require('path');
var html = require('http').Server(app);
var io = require('socket.io')(html);
var robot = require('robotjs');
var ip = require('ip');

//constants
var HTML_PATH = "/index.html";
var HAMMER_PATH = "/lib/hammer.min.js";
var HTML_JS_PATH = "/html deps/index.js";
var PORT = 3000;

//lets load that html file
app.get('/', function(req, res)
{
	//index.html
	res.sendFile(path.join(__dirname + HTML_PATH) );
})

app.get('/hammer.min.js', function(req, res)
{
	//hammer.min.js
	res.sendFile(path.join(__dirname + HAMMER_PATH) );
})

app.get('/index.js', function(req, res)
{
	//index.js
	res.sendFile(path.join(__dirname + HTML_JS_PATH) );
})

//sockest
io.on('connection', function(socket)
{
	var client_w, client_h;
	var w_ratio, h_ratio;
	console.log("A user connected");

	//send verification message
	io.emit('verify', {});

	socket.on('verify', function(data)
	{
		//verfify connection
		console.log("Verfied connection to client!");
	})

	//lets grab that screen width & height
	//key is SCREEN_DIMENSION
	socket.on('SCREEN_DIMENSION', function(data)
	{
		client_w = data.W;
		client_h = data.H;

		console.log("Found screen width of " + client_w.toString() );
		console.log("Found screen height of " + client_h.toString() );

		//lets calculate what the proportional thing would be on the server's screen
		//I <3 RobotJS!

		w_ratio = (robot.getScreenSize().width / client_w);
		h_ratio = (robot.getScreenSize().height / client_h);
	})

	//Key is TOUCHPOS
	socket.on('TOUCHPOS', function(data)
	{
		var touch_x = data.X;
		var touch_y = data.Y;

		//did I mention I <3 RobotJS?
		robot.moveMouse(touch_x * w_ratio, touch_y * h_ratio);
	})
})

html.listen(PORT, "0.0.0.0", function()
	{
		console.log("Running @ " + ip.address() + ":" + PORT.toString() );
	});

console.log("CTRL + C TO EXIT OUT");