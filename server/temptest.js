const { spawn, exec } = require("child_process");
const path = require("path");

class VLCController {
  constructor(videoPath) {
    this.videoPath = path.resolve(videoPath);
  }

  play() {
    exec(`start vlc "${this.videoPath}"`);
  }

  pause() {
    exec(
      `powershell -Command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys(' ')"`
    );
  }

  next() {
    exec(
      `powershell -Command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('^{RIGHT}')"`
    );
  }

  previous() {
    exec(
      `powershell -Command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('^{LEFT}')"`
    );
  }

  volumeUp() {
    // Ctrl + Up Arrow for volume up in VLC
    exec(
      `powershell -Command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('^{UP}')"`
    );
  }

  volumeDown() {
    // Ctrl + Down Arrow for volume down in VLC
    exec(
      `powershell -Command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('^{DOWN}')"`
    );
  }

  seekForward() {
    // Right Arrow for short seek forward
    exec(
      `powershell -Command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('{RIGHT}')"`
    );
  }

  seekBackward() {
    // Left Arrow for short seek backward
    exec(
      `powershell -Command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('{LEFT}')"`
    );
  }

  stop() {
    exec("taskkill /F /IM vlc.exe");
  }
  seekToTime(timeString) {
    // VLC Keyboard Shortcut: Ctrl + T to open time dialog
    exec(`powershell -Command "$wshell = New-Object -ComObject wscript.shell; 
        $wshell.SendKeys('^t'); 
        Start-Sleep -Milliseconds 500; 
        $wshell.SendKeys('${timeString}'); 
        Start-Sleep -Milliseconds 200; 
        $wshell.SendKeys('{ENTER}')"`);
  }
}

const videoController = new VLCController(
  "C:\\Users\\balaa\\Videos\\Screen Recordings\\Screen Recording 2025-01-24 152246.mp4"
);
videoController.play();
setTimeout(() => {
  console.log("Hello");
  videoController.seekToTime("00:36");
}, 5000);

setTimeout(() => {
  console.log("stop");
  videoController.volumeUp();
}, 5000);

// videoController.volumeUp();
