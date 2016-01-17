SETLOCAL ENABLEDELAYEDEXPANSION

where /q nw
IF ERRORLEVEL 1 (
    ECHO nw.js is missing. Ensure it is installed and placed in your PATH.
    EXIT /B
)

where /q npm
IF ERRORLEVEL 1 (
    ECHO npm is missing. Ensure it is installed and placed in your PATH.
    EXIT /B
)

where /q nw-gyp
IF ERRORLEVEL 1 (
    ECHO nw-gyp is missing. Ensure it is installed and placed in your PATH.
    EXIT /B
)

set "switch=no"
set "python=no"
set "arch=no"

GOTO loop

:loop
	IF "[%1]"=="[]" GOTO afterloop

	IF "[%1]"=="[--python]" (
		set "switch=python"
		GOTO Continue
		)
	IF "[%1]"=="[--arch]" (
		set "switch=arch"
		GOTO Continue
	)
	IF "%switch%"=="python" (
		set "python=%1"
		echo Setting python
		GOTO Continue
	)
	IF "%switch%"=="arch" (
		set "arch=%1"
		set "TRUE="
		IF NOT %arch% == "x64" set TRUE=1
		IF NOT %arch% == "ia32" set TRUE=1

		IF NOT defined TRUE (
			set "string_list = %arch% "is not a valid architecure" "
			ECHO %string_list%
			ECHO "Valid options are 'ia32' and 'x64'"
		EXIT /B
		)
	)
:Continue
	shift
	goto loop
	
:afterloop
	echo Done
	
call npm install

cd ./node_modules/robotjs

set "version="
for /f "delims=" %%a in ('npm show nw version') do @set version=%%a

echo %python%

IF NOT "%arch%"=="no" GOTO archtrue

IF NOT "%python%"=="no" GOTO pytrue

call nw-gyp clean configure build --target=%version%
GOTO end

:archtrue
	IF NOT "%python%"=="no" GOTO bothtrue
	call nw-gyp clean configure build --target=%version% --arch=%arch%
	GOTO end

:pytrue
	call nw-gyp clean configure build --target=%version% --python=%python%
	GOTO end
:bothtrue
	nw-gyp clean configure build --target=%version% --arch=%arch% --python=%python%
	GOTO end
:end
	echo end

pause