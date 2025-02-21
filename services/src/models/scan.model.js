const mongoose = require("mongoose");

const contractDetailsSchema = new mongoose.Schema({
  status: {
    isSelfDestructed: Boolean,
    isProxy: Boolean,
  },
  contractType: {
    canWrite: Boolean,
  },
});

const scanSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: [true, "Contract address is required"],
    trim: true,
  },
  isContract: {
    type: Boolean,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  isScam: {
    type: Boolean,
    required: true,
  },
  contractDetails: contractDetailsSchema,
  scanDate: {
    type: Date,
    default: Date.now,
  },
  scannedBy: {
    type: String,
    required: true,
  },
});

scanSchema.index({ contractAddress: 1 });
scanSchema.index({ scanDate: -1 });

module.exports = mongoose.model("Scan", scanSchema);
