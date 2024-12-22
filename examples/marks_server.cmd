@echo off
setlocal

if not exist tools (
	md tools
)

if not exist tools\server.exe (
	curl -o tools\server.exe https://media.githubusercontent.com/media/MarkTiedemann/server-2/master/server.exe
)

if not exist tools\run-in-tray.js (
	curl -o tools\run-in-tray.js https://raw.githubusercontent.com/MarkTiedemann/run-in-tray/refs/heads/master/run-in-tray.js
)

set port=8000
set root=%cd%\test

set tray_tooltip=Close server
set tray_icon=%SystemRoot%\System32\newdev.exe

cscript //nologo tools\run-in-tray.js tools\server.exe
