const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const appsPath = path.resolve(__dirname, "../apps.json");

exports.getApps = () => {
  const apps = JSON.parse(fs.readFileSync(appsPath, "utf8"));
  return apps;
};

exports.addApp = (app) => {
  const apps = JSON.parse(fs.readFileSync(appsPath, "utf8"));
  apps.push(app);
  fs.writeFileSync(appsPath, JSON.stringify(apps, null, 2));
};

exports.removeApp = (appName) => {
  let apps = JSON.parse(fs.readFileSync(appsPath, "utf8"));
  apps = apps.filter((app) => app.name !== appName);
  fs.writeFileSync(appsPath, JSON.stringify(apps, null, 2));
};

exports.terminateApp = (appName, callback) => {
  const psCommand = `Stop-Process -Name "${appName}"`;

  exec(psCommand, { shell: "powershell.exe" }, (error, stdout, stderr) => {
    if (error || stderr) {
      callback({
        success: false,
        error: error?.message || stderr || "Launch failed",
      });
    } else {
      callback({
        success: true,
        message: "Application Terminated Launched successfully",
      });
    }
  });
};

exports.launchApp = (appName, url, callback) => {
  const psCommand = `Start-Process "${appName}" "${url}"`;

  exec(psCommand, { shell: "powershell.exe" }, (error, stdout, stderr) => {
    if (error || stderr) {
      callback({
        success: false,
        error: error?.message || stderr || "Launch failed",
      });
    } else {
      callback({
        success: true,
        message: "Application launched successfully",
      });
    }
  });
};

exports.getInstalledApps = () => {
  return new Promise((resolve, reject) => {
    const powershellScript = ` function Get-InstalledApps {
     $paths = @(
         "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*",
         "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*",
         "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*"
     )
     
     $apps = $paths | ForEach-Object {
         Get-ItemProperty $_ | Where-Object {
             $_.DisplayName -and $_.UninstallString
         } | Select-Object @(
             @{
                 Name='name';
                 Expression={$_.DisplayName}
             },
             @{
                 Name='path';
                 Expression={
                     try {
                         $path = if ($_.DisplayIcon) {
                             $_.DisplayIcon -replace '"',''
                         } elseif ($_.UninstallString -match '"([^"]+)"') {
                             $matches[1]
                         }
                         
                         # Extract just the executable name and remove ",0"
                         if ($path) {
                             $fileName = [System.IO.Path]::GetFileName($path)
                             $fileName -replace ',0$',''
                         }
                     } catch {
                         $null
                     }
                 }
             }
         )
     } | Where-Object { $_.path } | Sort-Object name -Unique
     
     return $apps | ConvertTo-Json
 }
 
 Get-InstalledApps `;

    const tempScriptPath = path.join(__dirname, "get-installed-apps.ps1");
    fs.writeFileSync(tempScriptPath, powershellScript);

    const command = `powershell -ExecutionPolicy Bypass -File "${tempScriptPath}"`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      fs.unlinkSync(tempScriptPath);

      if (error) {
        reject(`Error executing PowerShell: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`PowerShell stderr: ${stderr}`);
        return;
      }

      try {
        const apps = JSON.parse(stdout);
        resolve(apps);
      } catch (parseError) {
        reject(`Failed to parse PowerShell output: ${parseError.message}`);
      }
    });
  });
};

exports.getAllApps = () => {
  return new Promise((resolve, reject) => {
    const powershellScript = ` function Get-AllWindowsApps {
     # Combine Win32 and UWP apps with more comprehensive retrieval
     $win32Apps = @(
         "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*",
         "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*",
         "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*"
     ) | ForEach-Object {
         Get-ItemProperty $_ | Where-Object { 
             $_.DisplayName -and 
             ($_.DisplayName -notlike '*Update*') -and 
             ($_.DisplayName -notlike '*Patch*')
         } | Select-Object @{
             Name='name'; Expression={$_.DisplayName}
         }, @{
             Name='version'; Expression={$_.DisplayVersion}
         }
     }

     # Get all UWP apps, including system apps
     $uwpApps = Get-AppxPackage -AllUsers | Select-Object @{
         Name='name'; Expression={$_.Name}
     }, @{
         Name='version'; Expression={$_.Version}
     }

     # Combine apps from different sources
     $allApps = ($win32Apps + $uwpApps) | 
         Where-Object { $_.name } | 
         Sort-Object name -Unique
     
     return $allApps | ConvertTo-Json
 }
 
 Get-AllWindowsApps `;

    const tempScriptPath = path.join(__dirname, "get-windows-apps.ps1");
    fs.writeFileSync(tempScriptPath, powershellScript);

    const command = `powershell -ExecutionPolicy Bypass -File "${tempScriptPath}"`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      fs.unlinkSync(tempScriptPath);

      if (error) {
        reject(`Error executing PowerShell: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`PowerShell stderr: ${stderr}`);
        return;
      }

      try {
        const apps = JSON.parse(stdout);
        resolve(apps);
      } catch (parseError) {
        reject(`Failed to parse PowerShell output: ${parseError.message}`);
      }
    });
  });
};
