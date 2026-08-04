const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

const app = express();

// ===============================
// Database
// ===============================

const pool = require("./config/db");

// ===============================
// Routes
// ===============================

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const contactRoutes = require("./routes/contact");

// ===============================
// Middlewares
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,
        message: "Welcome to RecycleHub API"

    });

});

// ===============================
// Database Test
// ===============================

app.get("/api/test-db", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.status(200).json({

            success: true,
            message: "Database Connected Successfully",
            serverTime: result.rows[0].now

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// ===============================
// 404 Route
// ===============================

app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "Route Not Found"

    });

});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log("RecycleHub Backend Started");
    console.log(`Running : http://localhost:${PORT}`);
    console.log("=================================");

});