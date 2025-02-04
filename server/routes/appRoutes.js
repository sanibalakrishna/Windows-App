const express = require("express");
const appController = require("../controllers/appController");
const router = express.Router();

router.get("/", appController.getApps);

router.get("/installed", appController.getInstalledApps);

router.post("/add", appController.addApp);
router.post("/remove", appController.removeApp);
router.post("/launch", appController.launchApp);
router.post("/terminate", appController.terminateApp);

module.exports = router;
