// ===============================
// Shared Validation Helpers
// ===============================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return phone.length >= 11;
}

function isStrongEnough(password) {
    return password.length >= 6;
}
