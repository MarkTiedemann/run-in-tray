$ErrorActionPreference = 'Stop';

[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null;
[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null;

$TrayTooltip = [System.Environment]::GetEnvironmentVariable('tray_tooltip');
if ($TrayTooltip -eq $null) {
	$TrayTooltip = 'Close';
}

$TrayIcon = [System.Environment]::GetEnvironmentVariable('tray_icon');
if ($TrayIcon -eq $null) {
	$TrayIcon = [System.Environment]::ExpandEnvironmentVariables('%SystemRoot%\System32\cmd.exe');
}

try {
	$Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($TrayIcon);
} catch {
	$Icon = [System.Drawing.Icon]::ExtractAssociatedIcon([System.Environment]::ExpandEnvironmentVariables('%SystemRoot%\System32\cmd.exe'));
}

$XmlArguments = [xml]'<arguments><argument>--eval</argument><argument>&#34;fs.writeFileSync(&#39;test.txt&#39;, &#39;&#60;xml&#62;&#39;)&#34;</argument></arguments>';
$Arguments = Select-Xml -Xml:$XmlArguments -XPath:'//argument//text()';

$Process = [System.Diagnostics.Process]::New();
$StartInfo = $Process.StartInfo;
$StartInfo.FileName = 'node.exe';
$StartInfo.Arguments = $Arguments -join ' ';
$StartInfo.UseShellExecute = $false;
$StartInfo.CreateNoWindow = $true;
$Process.Start() | Out-Null;

$NotifyIcon = [System.Windows.Forms.NotifyIcon]::New();
$NotifyIcon.Text = $TrayTooltip;
$NotifyIcon.Icon = $Icon;
$NotifyIcon.Visible = $true;
$NotifyIcon.Add_Click({
	if (!$Process.HasExited) {
		$Process.Kill();
	}
	$ApplicationContext.ExitThread();
});

$ApplicationContext = [System.Windows.Forms.ApplicationContext]::New();
[System.Windows.Forms.Application]::Run($ApplicationContext);
