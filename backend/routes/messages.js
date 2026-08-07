const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
    sendMessage,
    getThread,
    getConversations
} = require("../controllers/messageController");

// All message routes require a logged-in user
router.get("/conversations", verifyToken, getConversations);
router.get("/thread", verifyToken, getThread);
router.post("/", verifyToken, sendMessage);

module.exports = router;
