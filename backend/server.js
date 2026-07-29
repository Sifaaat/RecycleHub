const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log("=== RECYCLEHUB SERVER STARTED ===");

// Home Route
app.get("/", (req, res) => {
  res.send("HELLO RECYCLEHUB TEST");
});

// Test Route
app.get("/hello", (req, res) => {
  res.json({
    success: true,
    message: "Hello Route Works",
  });
});

// Database Test Route
app.get("/test-db", async (req, res) => {
  console.log("Request received at /test-db");

  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Database Connected Successfully",
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database Error:", error);

    res.status(500).json({
      success: false,
      message: "Database Connection Failed",
      error: error.message,
    });
  }
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});