const express = require("express");
const http = require("http");

const WebSocket = require("ws");
const appRoutes = require("./routes/appRoutes");
const VLCController = require("./utils/VLCController");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use("/api/apps", appRoutes);
const wss = new WebSocket.Server({ server });

const vlcController = new VLCController();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const { action, payload } = data;

    switch (action) {
      case "play":
        vlcController.play(payload);
        break;
      case "pause":
        vlcController.pause();
        break;
      case "next":
        vlcController.next();
        break;
      case "previous":
        vlcController.previous();
        break;
      case "volumeUp":
        vlcController.volumeUp();
        break;
      case "volumeDown":
        vlcController.volumeDown();
        break;
      case "seekForward":
        vlcController.seekForward();
        break;
      case "seekBackward":
        vlcController.seekBackward();
        break;
      case "seekToTime":
        vlcController.seekToTime(payload);
        break;
      case "stop":
        vlcController.stop();
        break;
      default:
        console.log("Unknown action:", action);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = 2354;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
