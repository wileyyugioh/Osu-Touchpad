//for orientation

var LANDSCAPE = "LANDSCAPE";
var PORTRAIT = "PORTRAIT";
var orientation;

function getOrientation()
{
	var orientation = Math.abs(window.orientation);
	//only works in ios
	if (orientation == 90 || orientation == -90)
	{
		orientation = LANDSCAPE;
	}
	else
	{
		orientation = PORTRAIT;
	}
}

//disables scroll?
document.body.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

//requires hammer.js
//requires sockets.io
var socket = io();

//hammer
var touchZone = document.getElementById("TouchZone");
var mc = Hammer(touchZone);

//initial values -1
var touch_x = -1;
var touch_y = -1;

function setXY(ev)
{
	//Used for setting touch x and y from hammer js pointer
	touch_x = ev.center.x;
	touch_y = ev.center.y;
}

socket.on('connect', function(ok)
{
	function sendXY()
	{
		var payload = {X: touch_x, Y: touch_y};
		//key is TOUCHPOS
		socket.emit('TOUCHPOS', payload);
	}
	console.log("Connected to server");

	socket.on('verify', function(k)
	{
		console.log("Verified connection to server!")
	})

	socket.emit('verify', {});

	//key is ORIENTATION
	getOrientation();
	socket.emit('ORIENTATION', {"orientation": orientation});

	//key is SCREEN_DIMENSION
	socket.emit('SCREEN_DIMENSION', {W: screen.width, H: screen.height})

	//on tap or drag
	mc.on("tap pan", function(ev)
	{
		setXY(ev);
		sendXY();
	})
})
