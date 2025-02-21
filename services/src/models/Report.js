const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: [true, "Contract address is required"],
    trim: true,
  },
  threats: [
    {
      type: String,
      required: [true, "At least one threat type is required"],
    },
  ],
  reporter: {
    type: String,
    required: true,
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.index({ contractAddress: 1 });
reportSchema.index({ reportDate: -1 });
reportSchema.index({ reporter: 1 });

reportSchema.index({ contractAddress: 1, reporter: 1 }, { unique: true });

module.exports = mongoose.model("Report", reportSchema);
