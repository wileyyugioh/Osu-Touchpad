//requires Osu!Touchpad
//requires qrcodejs
var main = require('../Osu!Touchpad.js');

//1 second
var UPDATE = 1000;

function printToLog(data) {
	var log_list = document.getElementById("Log");
	var entry = document.createElement("li");
	entry.appendChild(document.createTextNode(data) );
	log_list.appendChild(entry);
};

//for console
document.getElementById("console_form").addEventListener("submit", function()
	{
		var in_text = document.getElementById("console_get");
		main.setCommand(in_text.value);
		printToLog("> " + in_text.value);
		in_text.value = "";
	});

var qr_ran = false;

function update()
{
	var print_data = main.getQueue();
	for(var i = 0; i < print_data.length; i++)
	{
		printToLog(print_data[i]);
	}

	if(main.getIp() != "null" && !qr_ran)
	{
		new QRCode(document.getElementById("qrcode"), main.getIp() );
		qr_ran = true;
	}
}

window.setInterval(update, UPDATE);