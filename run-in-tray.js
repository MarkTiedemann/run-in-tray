var argc = WScript.Arguments.length;

if (argc === 0) {
	WScript.StdErr.WriteLine("Missing arguments");
	WScript.Quit(1);
}

var exe = "";
var args = "";

for (var i = 0; i < argc; i++) {
	if (i === 0) {
		exe = WScript.Arguments.Item(i);
	} else if (i === argc - 1) {
		args += WScript.Arguments.Item(i);
	} else {
		args += WScript.Arguments.Item(i) + " ";
	}
}

var shell = new ActiveXObject("WScript.Shell");

var trayIcon = shell.expandEnvironmentStrings("%tray_icon%");
var trayTooltip = shell.expandEnvironmentStrings("%tray_tooltip%");

if (trayIcon === "") {
	WScript.StdErr.WriteLine("Missing tray_icon");
	WScript.Quit(1);
}

if (trayTooltip === "") {
	WScript.StdErr.WriteLine("Missing tray_tooltip");
	WScript.Quit(1);
}

var script = "";

script += "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null;";
script += "[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null;";

script += "$Process = [System.Diagnostics.Process]::New();";
script += "$StartInfo = $Process.StartInfo;";
script += "$StartInfo.FileName = '" + exe + "';";
if (args !== "") {
	script += "$StartInfo.Arguments = '" + args + "';";
}
script += "$StartInfo.UseShellExecute = $false;";
script += "$StartInfo.CreateNoWindow = $true;";
script += "$Process.Start();";

script += "$NotifyIcon = [System.Windows.Forms.NotifyIcon]::New();";
script += "$NotifyIcon.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon('" + trayIcon + "');";
script += "$NotifyIcon.Text = '" + trayTooltip + "';";
script += "$NotifyIcon.Visible = $true;";
script += "$NotifyIcon.Add_Click({";
	script += "if (!$Process.HasExited) {";
		script += "$Process.Kill();";
	script += "}";
	script += "$ApplicationContext.ExitThread();";
script += "});";

script += "$ApplicationContext = [System.Windows.Forms.ApplicationContext]::New();";
script += "[System.Windows.Forms.Application]::Run($ApplicationContext);";

var HIDE_WINDOW = 0;
var WAIT_ON_RETURN = false;

shell.run('powershell -c "' + script + '"', HIDE_WINDOW, WAIT_ON_RETURN);
