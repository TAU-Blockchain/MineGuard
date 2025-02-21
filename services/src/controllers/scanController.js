const Scan = require("../models/Scan");

// Save scan result
exports.saveScan = async (req, res) => {
  try {
    const scan = await Scan.create(req.body);

    res.status(201).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error saving scan result",
      error: error.message,
    });
  }
};

// Get latest scan for a contract
exports.getLatestScan = async (req, res) => {
  try {
    const { contractAddress } = req.params;

    const scan = await Scan.findOne({ contractAddress })
      .sort({ scanDate: -1 })
      .exec();

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "No scan found for this contract",
      });
    }

    res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching scan result",
      error: error.message,
    });
  }
};

// Get scan history for a contract
exports.getScanHistory = async (req, res) => {
  try {
    const { contractAddress } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const scans = await Scan.find({ contractAddress })
      .sort({ scanDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Scan.countDocuments({ contractAddress });

    res.status(200).json({
      success: true,
      data: scans,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalScans: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching scan history",
      error: error.message,
    });
  }
};
