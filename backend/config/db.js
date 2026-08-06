const { Pool } = require("pg");
require("dotenv").config();

// If DATABASE_URL is set (e.g. on Render/Railway), use it with SSL.
// Otherwise fall back to local DB_* variables (no SSL) for development.
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

pool.connect()
    .then((client) => {
        console.log("✅ PostgreSQL Connected");
        client.release();
    })
    .catch((err) => {
        console.error("❌ Database Connection Failed");
        console.error(err.message);
    });

module.exports = pool;
