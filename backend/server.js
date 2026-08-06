const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const pool = require("./config/db");

// Ensure database tables exist (safe to run on every startup)
const ensureTables = require("./database/init");
ensureTables().catch((err) => console.error("Table setup error:", err.message));

// Middleware
app.use(cors());
app.use(express.json());

// Serve the frontend (so http://localhost:5000 opens your site)
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve uploaded images/files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/contact", require("./routes/contact"));

// API welcome
app.get("/api", (req, res) => {
    res.json({ success: true, message: "Welcome to RecycleHub API" });
});

// Database test
app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            success: true,
            message: "Database Connected",
            serverTime: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Error handler (e.g. multer file-too-big / wrong-type errors)
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(400).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("================================");
    console.log("RecycleHub Backend Running");
    console.log(`http://localhost:${PORT}`);
    console.log("================================");
});
