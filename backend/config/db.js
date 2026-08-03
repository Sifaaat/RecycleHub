const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME

});

// Test Connection
pool.connect()
    .then((client) => {

        console.log("✅ PostgreSQL Connected Successfully");

        client.release();

    })
    .catch((err) => {

        console.error("❌ Database Connection Failed");

        console.error(err.message);

    });

module.exports = pool;