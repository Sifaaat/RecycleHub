const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
    createProduct,
    getAllProducts,
    getProductById,
    getMyProducts,
    deleteProduct
} = require("../controllers/productController");

// Specific route first (so it isn't caught by "/:id")
router.get("/user/mine", verifyToken, getMyProducts);

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected
router.post("/", verifyToken, createProduct);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
