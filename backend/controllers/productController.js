const pool = require("../config/db");

// ===============================
// Create Product (protected)
// ===============================
const createProduct = async (req, res) => {
    try {
        const { name, category, price, quantity, location, description } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({
                success: false,
                message: "Name, category and price are required."
            });
        }

        // multer keeps the uploaded file in memory (req.file.buffer).
        // Store it as a base64 data URI directly in the database so it
        // survives redeploys (no reliance on an ephemeral disk).
        const image = req.file
            ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
            : null;

        const result = await pool.query(
            `INSERT INTO products
             (user_id, name, category, price, quantity, location, description, image)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                req.user.id,
                name,
                category,
                price,
                quantity || 0,
                location || null,
                description || null,
                image
            ]
        );

        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===============================
// Get All Products (public, with optional ?search= &category=)
// ===============================
const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = "SELECT * FROM products";
        const conditions = [];
        const values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(name ILIKE $${values.length} OR location ILIKE $${values.length})`);
        }
        if (category) {
            values.push(category);
            conditions.push(`category = $${values.length}`);
        }
        if (conditions.length) {
            query += " WHERE " + conditions.join(" AND ");
        }
        query += " ORDER BY created_at DESC";

        const result = await pool.query(query, values);
        res.json({ success: true, count: result.rows.length, products: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===============================
// Get Single Product (public, with seller info)
// ===============================
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT p.*, u.full_name AS seller_name, u.phone AS seller_phone
             FROM products p
             LEFT JOIN users u ON p.user_id = u.id
             WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        res.json({ success: true, product: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===============================
// Get My Products (protected)
// ===============================
const getMyProducts = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json({ success: true, count: result.rows.length, products: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===============================
// Delete Product (protected, own only)
// ===============================
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const check = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        if (check.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not allowed to delete this product." });
        }

        await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json({ success: true, message: "Product deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getMyProducts,
    deleteProduct
};
