# run-in-tray

**Run a Windows program in the background. Close it by clicking a tray icon.**

- No dependencies, no installation, just download the script
- Customizable: change tray icon and tooltip
- Licensed as [CC0](https://creativecommons.org/publicdomain/zero/1.0/), no copyright

**Download:**

```
curl -O https://raw.githubusercontent.com/MarkTiedemann/run-in-tray/refs/heads/master/run-in-tray.js
```

**Configuration:**

To configure the script, you may set the following environment variables:

- `tray_tooltip`
	- The tooltip text shown when hovering over the tray icon
	- Default: `Close`
- `tray_icon`
	- The file path from which the icon will be extracted
	- Default: `%SystemRoot%\System32\cmd.exe`

**Example usage:**

`serve.cmd`: Run a PHP server in the background. Close it by clicking the PHP icon in the tray.

```bat
@echo off
setlocal

if not exist run-in-tray.js (
	curl -O https://raw.githubusercontent.com/MarkTiedemann/run-in-tray/refs/heads/master/run-in-tray.js
)

set tray_tooltip=Close server
for /f %%i in ('where php.exe') do set tray_icon=%%i

cscript //nologo run-in-tray.js php.exe -S localhost:8000 -t test
```
