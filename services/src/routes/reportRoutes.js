const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Save report
router.post("/", reportController.saveReport);

// Get reports for a contract
router.get("/contract/:contractAddress", reportController.getReports);

// Get reports by a reporter
router.get("/reporter/:reporter", reportController.getReportsByReporter);

// Get threat statistics for a contract
router.get("/contract/:contractAddress/stats", reportController.getThreatStats);

module.exports = router;
