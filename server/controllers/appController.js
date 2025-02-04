const appService = require("../services/appService");

exports.getInstalledApps = (req, res) => {
  appService
    .getInstalledApps()
    .then((result) => {
      console.log("result", result);
      res.json(result);
    })
    .catch((error) => {
      console.error("Error fetching installed apps:", error);
      res.status(500).json({ error: error.message });
    });
};

exports.terminateApp = (req, res) => {
  const { appName } = req.body;

  if (!appName) {
    return res.status(400).json({ error: "App name is required" });
  }

  appService.terminateApp(appName, (result) => {
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  });
};

exports.getApps = (req, res) => {
  const apps = appService.getApps();
  res.json(apps);
};

exports.addApp = (req, res) => {
  const { name, path, icon } = req.body;
  appService.addApp({ name, path, icon });
  res.status(201).json({ message: "App added successfully" });
};

exports.removeApp = (req, res) => {
  const { name } = req.body;
  appService.removeApp(name);
  res.status(200).json({ message: "App removed successfully" });
};
exports.launchApp = (req, res) => {
  const { appPath, args } = req.body;

  if (!appPath) {
    return res.status(400).json({ error: "Application path is required" });
  }

  appService.launchApp(appPath, args || "", (result) => {
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  });
};
