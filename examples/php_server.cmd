@echo off
setlocal

::if not exist run-in-tray.js (
::	curl -O https://raw.githubusercontent.com/MarkTiedemann/run-in-tray/refs/heads/master/run-in-tray.js
::)

set tray_tooltip=Close server
for /f %%i in ('where php.exe') do set tray_icon=%%i

cscript //nologo run-in-tray.js php.exe -S localhost:8000 -t test
