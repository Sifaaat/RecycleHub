// ===============================
// Shared Helper Functions
// ===============================

// Standard JSON response
function sendResponse(res, status, success, message, extra = {}) {
    return res.status(status).json({ success, message, ...extra });
}

// Simple email format check
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { sendResponse, isValidEmail };
