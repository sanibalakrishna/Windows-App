const { exec } = require("child_process");

const mediaPlayerControls = {
  launch: (videoPath, callback) => {
    const psCommand = `Start-Process "${videoPath}"`;

    exec(psCommand, { shell: "powershell.exe" }, (error, stdout, stderr) => {
      callback({
        success: !error && !stderr,
        message:
          error || stderr ? "Launch failed" : "Video launched successfully",
      });
    });
  },

  controls: {
    focusMediaPlayer: (callback) => {
      const psCommand = `
        Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        public class User32 {
            [DllImport("user32.dll")]
            [return: MarshalAs(UnmanagedType.Bool)]
            public static extern bool SetForegroundWindow(IntPtr hWnd);
        }
"@

        $processes = Get-Process | Where-Object { 
            $_.MainWindowTitle -like "*Media Player*" -or 
            $_.MainWindowTitle -like "*VLC*" -or 
            $_.MainWindowTitle -like "*Windows Media Player*" -or
            $_.ProcessName -in @("wmplayer", "vlc")
        }

        if ($processes) {
            $process = $processes | Select-Object -First 1
            [User32]::SetForegroundWindow($process.MainWindowHandle)
            exit 0
        } else {
            exit 1
        }
      `;

      exec(`powershell -Command "${psCommand}"`, (error, stdout, stderr) => {
        if (callback) callback(!error && !stderr);
      });
    },

    _sendKeys: (keys, callback) => {
      const psCommand = `
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait('${keys}')
      `;

      exec(`powershell -Command "${psCommand}"`, (error, stdout, stderr) => {
        if (callback) callback(!error && !stderr);
      });
    },

    play: (callback) => {
      mediaPlayerControls.controls._sendKeys(" ", callback);
    },

    pause: (callback) => {
      mediaPlayerControls.controls._sendKeys(" ", callback);
    },

    // Other methods remain the same...
  },
};

// Example usage:
const videoPath =
  "C:\\Users\\balaa\\Videos\\Screen Recordings\\Screen Recording 2025-01-24 152246.mp4"; // Replace with your video file path
mediaPlayerControls.launch(videoPath, (result) => {
  console.log(result.message);

  // Add a delay to ensure the media player is ready
  setTimeout(() => {
    // Play the video after launching
    mediaPlayerControls.controls.play((success) => {
      console.log(success ? "Play command sent" : "Play command failed");
    });

    // Pause the video after 5 seconds
    setTimeout(() => {
      mediaPlayerControls.controls.pause((success) => {
        console.log(success ? "Pause command sent" : "Pause command failed");
      });
    }, 5000);
  }, 2000); // 2-second delay
});

module.exports = mediaPlayerControls;
