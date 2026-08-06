const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getProfile
} = require("../controllers/userController");

// ======================================
// User Profile
// ======================================

router.get("/profile", verifyToken, getProfile);

module.exports = router;