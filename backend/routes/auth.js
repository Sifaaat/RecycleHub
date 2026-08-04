const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

// ===============================
// Register Route
// ===============================

router.post("/register", registerUser);

// ===============================
// Login Route
// ===============================

router.post("/login", loginUser);

// ===============================
// Test Route
// ===============================

router.get("/test", (req, res) => {

    res.status(200).json({

        success: true,
        message: "Auth Route Working"

    });

});

module.exports = router;