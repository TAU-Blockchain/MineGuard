const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const discussionRoutes = require("./routes/discussionRoutes");
const scanRoutes = require("./routes/scanRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Basic security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? ["http://localhost:5173", "http://127.0.0.1:5173"]
      : process.env.ALLOWED_ORIGINS?.split(","),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/discussions", discussionRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/reports", reportRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

module.exports = app;
