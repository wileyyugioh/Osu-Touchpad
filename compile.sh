#!/bin/bash
type nw >/dev/null 2>&1 || { echo >&2 "nw is not installed."; exit 1; }
type npm >/dev/null 2>&1 || { echo >&2 "npm is not installed."; exit 1; }
type nw-gyp >/dev/null 2>&1 || { echo >&2 "nw-gyp is not installed."; exit 1; }

PYTHON="null"
ARCH="null"
SWITCH="null"
IFS='='
multiple=false
NULL="null"

for var in "$@"; do
	multiple=false

	read -r begin end <<< "$var"

	if [ ${#end} -ne 0 ]; then
		multiple=true
	fi

	case "$begin" in 
		"--python" )
			SWITCH="python"
			;;
		"--arch" )
			SWITCH="arch"
			;;
		*)
			if [ "$SWITCH" == "$NULL" ]; then
				echo "Unknown argument $begin"
				exit 1;
			fi
	esac

	if [ ${#begin} == ${#var} ] && [ "$begin" != "--python" ] && [ "$begin" != "--arch" ] ; then
		continue
	fi

	if [ "$SWITCH" == "python" ]; then
		if [ "$multiple" == true ]; then
			PYTHON="$end"
			SWITCH="$NULL"
			continue
		else
			PYTHON="$begin"
			SWITCH="$NULL"
			continue
		fi
	fi

	if [ "$SWITCH" == "arch" ]; then
		if [ "$multiple" == true ]; then
			ARCH="$end"
			SWITCH="$NULL"
			continue
		else
			ARCH="$begin"
			SWITCH="$NULL"
			continue
		fi

		if [ "$ARCH" != "ia32" ] || [ "$ARCH" != "x64" ]; then
			echo "Arch needs to be either ia32 or x64"
			exit
		fi
	fi
done

echo "installing necessary packages"

npm "install"

cd "node_modules/robotjs"

echo "cd"

if [ "$ARCH" != "$NULL" ]; then
	if [ "$PYTHON" != "$NULL" ]; then
		echo "building robotjs with python and arch"
		nw-gyp clean configure build --target="$(npm show nw version)" --python="$PYTHON" --arch="$ARCH"
	else
		echo "building robotjs with arch"
		nw-gyp clean configure build --target="$(npm show nw version)" --arch="$ARCH"
	fi

	exit
fi

if [ "$PYTHON" != "$NULL" ]; then
	echo "building robotjs with python"
	nw-gyp clean configure build --target="$(npm show nw version)" --python="$PYTHON"
	exit
fi

echo "building robotjs"
nw-gyp clean configure build --target="$(npm show nw version)"
