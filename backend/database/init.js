// ===============================
// Database Setup (safe / non-destructive)
// - Runs automatically on server startup (see server.js)
// - Can also be run manually:  npm run setup
// Creates tables only if they don't already exist.
// ===============================

const pool = require("../config/db");

const createTables = async () => {
    // ===== Users =====
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ===== Products =====
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(150) NOT NULL,
            category VARCHAR(50) NOT NULL,
            price NUMERIC(10,2) NOT NULL,
            quantity NUMERIC(10,2) DEFAULT 0,
            location VARCHAR(100),
            description TEXT,
            image TEXT,
            status VARCHAR(20) DEFAULT 'Available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Widen the image column on databases created before images were
    // stored as base64 (was VARCHAR(255)). Safe to run every startup.
    await pool.query(`ALTER TABLE products ALTER COLUMN image TYPE TEXT`);

    // ===== Contact Messages =====
    await pool.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            subject VARCHAR(150),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ===== Messages (buyer <-> seller chat per product) =====
    await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
            sender_id   INTEGER REFERENCES users(id)    ON DELETE CASCADE,
            receiver_id INTEGER REFERENCES users(id)    ON DELETE CASCADE,
            content     TEXT NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("✅ Tables ready: users, products, contact_messages, messages");
};

module.exports = createTables;

// If run directly (npm run setup), execute then close the pool.
if (require.main === module) {
    createTables()
        .catch((err) => console.error("❌ Setup failed:", err.message))
        .finally(() => pool.end());
}
