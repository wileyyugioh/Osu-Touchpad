//requires Osu!Touchpad
//requires qrcodejs
var main = require('../Osu!Touchpad.js');

//1/4 second
var UPDATE = 250;

var log_list = document.getElementById("Log");
var in_text = document.getElementById("console_get");
var ip_text = document.getElementById("ip_text");

function printToLog(data) {
	var entry = document.createElement("li");
	entry.appendChild(document.createTextNode(data) );
	log_list.appendChild(entry);

	//scroll to bottom of page
	window.scrollTo(0, document.body.scrollHeight);
};

//for console
document.getElementById("console_form").addEventListener("submit", function()
	{
		switch(in_text.value)
		{
			case "clear":
				while(log_list.firstChild)
				{
					log_list.removeChild(log_list.firstChild);
				}
				flag = true;
				in_text.value=""
				return;
			default:
				break;
		}


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
		ip_text.innerHTML = "IP: " + main.getIp();
		qr_ran = true;
	}
}

window.setInterval(update, UPDATE);