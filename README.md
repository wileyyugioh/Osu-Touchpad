#Osu!Touchpad

A tablet emulator for mobile devices.

Extensively tested on an iPad air. Still needs to be tested with other devices.

#Installation

Download the compiled code

https://github.com/wileyyugioh/Osu-Touchpad/releases

and run it

#Dependencies for building

npm

nw.js (also known as node-webkit)

nw-gyp

##NOTE A:
If you are building, you have to compile ROBOTJS with nw-gyp. Also, check out the dependencies it requires. https://github.com/octalmage/robotjs

#Installation if building
```
npm install

cd node_modules/robotjs && nw-gyp configure --target=$(npm show nw version) && nw-gyp build && cd -

or all in one:

npm install && cd node_modules/robotjs && nw-gyp configure --target=$(npm show nw version) && nw-gyp build && cd -

---


type nw in root directory to run.

```
##Installation on Windows 10

Windows 10 is a tricky bugger, so check out https://github.com/nwjs/nw.js/issues/4033 to get it working with Visual Studio 2015.

##TODO

video documentation!

test more devices!

~~nicer packaging!~~ DONE

~~add QR Code support!~~ DONE

~~Figure out how to disable rubber banding on safari!~~ DONE


#License: MIT

Don't steal credit or I'll sue.
