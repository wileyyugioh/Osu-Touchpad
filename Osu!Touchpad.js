//This file is for nw.js version ONLY
//For pure checkout the pure branch
//PURE branch is most likely deprecated.

//includes
var app = require('express')();
var path = require('path');
var html = require('http').Server(app);
var io = require('socket.io')(html);
var robot = require('robotjs');
var ip = require('ip');
var parser = require('ua-parser-js');
var fs = require('fs');

//constants
var HTML_PATH = "/index.html";
var CSS_PATH = "/html deps/index.css"
var HAMMER_PATH = "/lib/hammer.min.js";
var HTML_JS_PATH = "/html deps/index.js";
var SETTING_NAME = "/Osu!Touchpad_settings.json"
var SETTING_PATH = __dirname + SETTING_NAME;
var PORT = 3000;

//later sets by settings or autoYPos
var iOS_Y_COMP = 0;
var LANDSCAPE = "LANDSCAPE";
var PORTRAIT = "PORTRAIT";
var server_ip = "null";
var pos_log = false;
var Y_COMP_VALUES = {
	"iPad" : {
		"LANDSCAPE" : 97,
		"PORTRAIT" : 97,
	},

	"iPhone" : {
		"LANDSCAPE" : 43,
		"PORTRAIT" : 64,
	},

	"Android" : {
		"LANDSCAPE" : 80,
		"PORTRAIT" : 81,
	}
}

//global
var ua_data;
//defaults landscape
var orientation = LANDSCAPE;
//ratios of client screen to server screen in pixels
var w_ratio, h_ratio;
//I <3 RobotJS!
var screen_size = robot.getScreenSize();
var OS_NAME, MODEL_NAME;
var auto_y_pos = false;
var auto_y_pos_val = 0;

var setting_data = {
	Y_COMP : 0,
}

var queue = [];
function printToLog(data) {
	queue.push(data);
};

printToLog("Found a server screen width of " + screen_size.width);
printToLog("Found a server screen height of " + screen_size.height);


module.exports = {
	getQueue : function()
	{
		var temp = queue;
		queue = [];
		return temp;
	},
	getIp : function()
	{
		return "http://" + server_ip;
	},

	setCommand : function(data)
	{
		commands(data);
	}
}

function commands(data)
{
	var format = data.split(/[ ]+/);

	var help_str = `
Commands:
	setHeightMultiplier: sets the height multiplier of the client screen to the server.
	setWidthMultiplier: sets the width multiplier from the client screen to the server.
	setYComp: sets Y compensation from top of screen.
	posLogging [0] [1]: disables/enables printing of x and y touch coordinates. Takes in either 0 for false and 1 for true.
	loadSettings: loads settings
	startAutoYPos: Starts collection to calibrate screen. Touch in the middle of the screen and scroll as high as you can while staying on the screen.
	stopAutoYPos: Ends collection to calibrate screen.
	for every set, there is also a get which returns the value
	help: prints help
	clear: clears the log
`;

	function printHelp()
	{
		var frmt = help_str.replace(/(\t\t)/g, '').split(/(\n)/g);

		for(var i = 0; i < frmt.length; i++)
		{
			if(frmt[i] == '')
			{
				continue;
			}
			printToLog(frmt[i]);
		}
	}

	//I could have used case, but it's too late now. 
	if(format[0] == "help")
	{
		printHelp();
	}
	else if(format[0] == "setYComp")
	{
		if(format[1] == null)
		{
			return;
		}
		iOS_Y_COMP = format[1];
	}
	else if(format[0] == "getYComp")
	{
		printToLog(iOS_Y_COMP);
	}
	else if(format[0] == "setHeightMultiplier")
	{
		if(format[1] == null)
		{
			return;
		}
		h_ratio = format[1];
	}
	else if(format[0] == "getHeightMultiplier")
	{
		printToLog(h_ratio);
	}
	else if(format[0] == "setWidthMultiplier")
	{
		if(format[1] == null)
		{
			return;
		}
		w_ratio = format[1];
	}
	else if(format[0] == "getWidthMultiplier")
	{
		printToLog(w_ratio);
	}
	else if(format[0] == "posLogging")
	{
		pos_log = (format[1] == 0) ? false : true;
	}
	else if(format[0] == "loadSettings")
	{
		//lets load settings
		fs.readFile(SETTING_PATH, function(err, data)
		{
			if(err)
			{
				printToLog("No settings file has been saved yet!");
			}
			printToLog("Loading saved settings");
			setting_data = JSON.parse(data);
			printToLog("Y_COMP is now " + setting_data.Y_COMP);
			iOS_Y_COMP = setting_data.Y_COMP;
		})
	}
	else if(format[0] == "saveSettings")
	{
		setting_data.Y_COMP = iOS_Y_COMP;

		printToLog("Saving settings");
		//write to save file
		fs.writeFile(SETTING_PATH, JSON.stringify(setting_data), function(err)
		{
			if(err)
			{
				console.log("Failed to save settings");
				printToLog("Failed to save settings");
				console.log(err.message);
			}	
		});
	}
	else if(format[0] == "startAutoYPos")
	{
		auto_y_pos = true;
		printToLog("Move your finger as high as you can go, into the url bar!")
		printToLog("Type 'stopAutoYPos' to end collection");
	}
	else if(format[0] == "stopAutoYPos")
	{
		auto_y_pos = false;
		iOS_Y_COMP = Math.abs(auto_y_pos_val);
	}
	else
	{
		printToLog("Unknown command " + format[0]);
		printHelp();
	}
}

//lets load that html file
app.get('/', function(req, res)
{
	//lets get that header
	ua_data = parser(req.headers['user-agent']);
	OS_NAME = ua_data.os.name;
	console.log("OS: " + OS_NAME);
	printToLog("OS Found: " + OS_NAME);
	MODEL_NAME = ua_data.device.model;
	printToLog("Model: " + MODEL_NAME);

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

app.get('/index.css', function(req, res)
{
	//index.css
	res.sendFile(path.join(__dirname + CSS_PATH) ); 
})

//sockest
io.on('connection', function(socket)
{
	//client w and h unlikely to change
	var client_w, client_h;

	console.log("A user connected");
	printToLog("A user connected");

	//send verification message
	io.emit('verify', {});

	socket.on('verify', function(data)
	{
		//verfify connection
		console.log("Verfied connection to client!");
		printToLog("Verfied connection to client!");
	})

	socket.on('ORIENTATION', function(data)
	{
		var orient = Math.floor(data.orientation);
		if(orient == 90 || orient == -90)
		{
			orientation = LANDSCAPE;
		}
		else
		{
			orientation = PORTRAIT;
		}

		printToLog("Updated orientation to " + orientation);
	})

	//lets grab that screen width & height
	//key is SCREEN_DIMENSION
	socket.on('SCREEN_DIMENSION', function(data)
	{
		//lets calculate what the proportional thing would be on the server's screen
		client_w = data.W;
		client_h = data.H;

		//tested on ios
		//assumes portrait mode
		if((orientation == PORTRAIT && OS_NAME == "iOS") || (OS_NAME == "Android") )
		{
			w_ratio = (screen_size.width / client_w);
			h_ratio = (screen_size.height / client_h);
		}
		else
		{
			//landscape
			w_ratio = (screen_size.width / client_h);
			h_ratio = (screen_size.height / client_w);
		}

		console.log("Found screen width of " + client_w.toString() );
		printToLog("Found screen width of " + client_w.toString() );
		console.log("Found screen height of " + client_h.toString() );
		printToLog("Found screen height of " + client_h.toString() );

		console.log("Found a server screen width of " + screen_size.width);
		console.log("Found a server screen height of " + screen_size.height)

		console.log("Found a width ratio of " + w_ratio.toString() );
		console.log("Found a height ratio of " + h_ratio.toString() );
	})

	//Key is TOUCHPOS
	socket.on('TOUCHPOS', function(data)
	{
		var touch_x = data.X;
		var touch_y = data.Y;

		//iOS returns negative? coordinates which is strange.
		if((OS_NAME == 'iOS') && (auto_y_pos != true) && (iOS_Y_COMP == 0) )
		{
			//console.log("Y_COMP_VALUES." + MODEL_NAME + "." + orientation)
			touch_y += eval("Y_COMP_VALUES." + MODEL_NAME + "." + orientation);
		}
		else if((OS_NAME == "Android") && (auto_y_pos != true) && (iOS_Y_COMP == 0) )
		{
			//specifically for android chrome only
			touch_y += eval("Y_COMP_VALUES." + OS_NAME + "." + orientation);
		}
		else
		{
			touch_y += iOS_Y_COMP;
		}

		var move_x;
		var move_y;

		move_x = touch_x * w_ratio;
		move_y = touch_y * h_ratio;

		if(pos_log)
		{
			printToLog("X: " + touch_x.toString() );
			printToLog("Y: " + touch_y.toString() );
		}

		if(auto_y_pos)
		{
			if(auto_y_pos_val > touch_y)
			{
				auto_y_pos_val = touch_y;
				printToLog("Found minimum " + auto_y_pos_val);
			}
		}
		//console.log("X: " + touch_x.toString() );
		//console.log("Y: " + touch_y.toString() );

		//did I mention I <3 RobotJS?
		robot.moveMouse(move_x, move_y);

		if(pos_log)
		{
			printToLog("Calc X: " + (touch_x * w_ratio).toString() );
			printToLog("Calc Y: " + (touch_y * h_ratio).toString() );
		}

		//console.log("Calc X: " + (touch_x * w_ratio).toString() );
		//console.log("Calc Y: " + (touch_y * h_ratio).toString() )
	})

	socket.on('disconnect', function(data)
	{
		console.log("Client disconnected")
		printToLog("Client disconnected");
	})
})

html.listen(PORT, "0.0.0.0", function()
	{
		server_ip = ip.address() + ":" + PORT.toString();
		console.log("Running @ " + server_ip);
	});

console.log("CTRL + C TO EXIT OUT");