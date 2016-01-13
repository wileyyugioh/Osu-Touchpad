var main = require('../Osu!Touchpad.js');

//1 second
var UPDATE = 1000;

function printToLog(data) {
	var log_list = document.getElementById("Log");
	var entry = document.createElement("li");
	entry.appendChild(document.createTextNode(data) );
	log_list.appendChild(entry);
};

function update()
{
	var print_data = main.getQueue();
	for(var i = 0; i < print_data.length; i++)
	{
		printToLog(print_data[i]);
	}
}

window.setInterval(update, UPDATE);