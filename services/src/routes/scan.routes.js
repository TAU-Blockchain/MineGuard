const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scan.controller");

// Save scan result
router.post("/", scanController.saveScan);

// Get latest scan for a contract
router.get("/:contractAddress/latest", scanController.getLatestScan);

// Get scan history for a contract
router.get("/:contractAddress/history", scanController.getScanHistory);

module.exports = router;
