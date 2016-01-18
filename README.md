#Osu!Touchpad

A tablet emulator for mobile devices.

Extensively tested on an iPad air. Still needs to be tested with other devices.

#Installation

Download the compiled code

https://github.com/wileyyugioh/Osu-Touchpad/releases

and run it


#Usage
Run the application/exe/nw

An ip address should appear and a qr code.

Connect to the ip address in a browser or scan the qr code.

Enjoy!

##Guaranteed support

Supports:

	iOS: Safari

	Android: Chrome

	All others are not officially tested. Check out below for set up.

##Fixing configs

iPad and iPhone should work out of the box, as does some Android.

How some browsers work is that the y coordinate equals zero at the bottom of the url bar, and we need to find out where exactly is that y coordinate. 

This can be compensated for by typing startAutoYPos into the console while connected, and scroll the highest you can go.

After you feel enough data has been collected, type stopAutoYPos to stop collection.

##Saving Settings

If constantly typing startAutoYPos is annoying, you can save the settings!

Type into the console
```
saveSettings
```

to save them and to load the settings type
```
loadSettings
```

#Troubleshooting

##I can't connect to my pc!

Make sure that the program is going through your firewall. Also make sure your device and the pc is connected to the same network.

##The cursor goes off the screen!

Just run startAutoYPos as seen above in Fixing Configs and save the settings. It should automatically fix the problem for you.

##Something totally different and strange!

If you are truely stumped on how to do something, fill out an issue, and I'll take a look into it as soon as possible. 

#Dependencies for building

npm

nw.js (also known as node-webkit)

nw-gyp

##NOTE A:
If you are building, you have to compile ROBOTJS with nw-gyp. Also, check out the dependencies it requires. https://github.com/octalmage/robotjs

#Installation if building

Windows:
```
./compile.bat
```

*nix:
```
./compile.sh
```

type nw in root directory to run.

##The long way

Sometimes you want to run the specific commands, and that is okay

```
npm install

cd node_modules/robotjs

nw-gyp rebuild --target=$(npm show nw version)

for windows:
mw-gyp rebuild --target=NW_VERSION
where NW_VERSION is the version returned by 'npm show nw version'
```

##Building on Windows 10

Windows 10 is a tricky bugger, so check out https://github.com/nwjs/nw.js/issues/4033 to get it working with Visual Studio 2015.

Then compile robotjs with:
```
nw-gyp rebuild --msvs_version=2015 --target=NW_VERSION
```

##TODO

video documentation!

~~test more devices!~~ startAutoYPos is a lazy fix for this

~~nicer packaging!~~ DONE

~~add QR Code support!~~ DONE

~~Figure out how to disable rubber banding on safari!~~ DONE


#License: MIT

Don't steal credit or I'll sue.
