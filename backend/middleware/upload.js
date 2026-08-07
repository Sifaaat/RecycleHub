const multer = require("multer");
const path = require("path");

// Keep the uploaded file in memory (req.file.buffer) so we can store it
// directly in the database as base64. Nothing is written to disk — this
// survives redeploys on hosts with an ephemeral filesystem (e.g. Render).
const storage = multer.memoryStorage();

// Allow images and PDF only
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);

    if (extOk && mimeOk) {
        cb(null, true);
    } else {
        cb(new Error("Only image files and PDF are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

module.exports = upload;
