var argc = WScript.Arguments.length;

if (argc === 0) {
	WScript.StdErr.WriteLine("Missing arguments");
	WScript.Quit(1);
}

var exe = WScript.Arguments.Item(0);

var xmlArguments = "<arguments>";
for (var i = 1; i < argc; i++) {
	var escapedArgument = escapeArgument(WScript.Arguments.Item(i));
	xmlArguments += "<argument>" + escapeXml(escapedArgument) + "</argument>";
}
xmlArguments += "</arguments>";

function escapeArgument(s) {
	for (var i = 0; i < s.length; i++) {
		if (s.charAt(i) === " ") {
			return '"' + s + '"';
		}
	}
	return s;
}

function escapeXml(s) {
	return s.replace(/[&<>"']/g, function(m) {
		return "&#" + m.charCodeAt(0) + ";";
	});
}

var shell = new ActiveXObject("WScript.Shell");

var script = "";

script += "$ErrorActionPreference = 'Stop';";

script += "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null;";
script += "[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null;";

script += "$TrayTooltip = [System.Environment]::GetEnvironmentVariable('tray_tooltip');";
script += "if ($TrayTooltip -eq $null) {";
	script += "$TrayTooltip = 'Close';";
script += "}";

script += "$TrayIcon = [System.Environment]::GetEnvironmentVariable('tray_icon');";
script += "if ($TrayIcon -eq $null) {";
	script += "$TrayIcon = [System.Environment]::ExpandEnvironmentVariables('%SystemRoot%\\System32\\cmd.exe');";
script += "}";

script += "try {";
	script += "$Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($TrayIcon);";
script += "} catch {";
	script += "$Icon = [System.Drawing.Icon]::ExtractAssociatedIcon([System.Environment]::ExpandEnvironmentVariables('%SystemRoot%\\System32\\cmd.exe'));";
script += "}";

script += "$XmlArguments = [xml]'" + xmlArguments + "';";
script += "$Arguments = Select-Xml -Xml:$XmlArguments -XPath:'//argument//text()';";

script += "$Process = [System.Diagnostics.Process]::New();";
script += "$StartInfo = $Process.StartInfo;";
script += "$StartInfo.FileName = '" + exe + "';";
script += "$StartInfo.Arguments = $Arguments -join ' ';";
script += "$StartInfo.UseShellExecute = $false;";
script += "$StartInfo.CreateNoWindow = $true;";
script += "$Process.Start() | Out-Null;";

script += "$NotifyIcon = [System.Windows.Forms.NotifyIcon]::New();";
script += "$NotifyIcon.Text = $TrayTooltip;";
script += "$NotifyIcon.Icon = $Icon;";
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
