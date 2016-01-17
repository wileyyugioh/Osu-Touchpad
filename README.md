#Osu!Touchpad

A tablet emulator for mobile devices.

Extensively tested on an iPad air. Still needs to be tested with other devices.

#Installation

Download the compiled code

https://github.com/wileyyugioh/Osu-Touchpad/releases

and run it

#Installation

Download the binaries at https://github.com/wileyyugioh/Osu-Touchpad/releases

#Usage
Run the application/exe/nw

An ip address should appear and a qr code like
```
Running @ 192.168.29.10:3000
```

Connect to the ip address in a default browser or scan the qr code.

Enjoy!

##Fixing configs

iPad and iPhone should work out of the box, as does some Android.

How some browsers work is that the y coordinate equals zero at the bottom of the url bar.

This can be set by typing startAutoYPos into the console while connected, and scroll the highest you can go.

After you feel enough data has been collected, type endAutoYPos to stop collection.


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
```

##Building on Windows 10

Windows 10 is a tricky bugger, so check out https://github.com/nwjs/nw.js/issues/4033 to get it working with Visual Studio 2015.

Then compile robotjs with:
```
mw-gyp rebuild --msvs_version=2015 --target=$(npm show nw version)
```

##TODO

video documentation!

test more devices!

~~nicer packaging!~~ DONE

~~add QR Code support!~~ DONE

~~Figure out how to disable rubber banding on safari!~~ DONE


#License: MIT

Don't steal credit or I'll sue.
