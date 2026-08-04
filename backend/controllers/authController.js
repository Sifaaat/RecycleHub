const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===============================
// Register User
// ===============================

const registerUser = async (req, res) => {

    try {

        const {
            full_name,
            email,
            phone,
            password
        } = req.body;

        // Check Empty Fields

        if (!full_name || !email || !phone || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        // Check Existing Email

        const emailCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (emailCheck.rows.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });

        }

        // Hash Password

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User

        await pool.query(

            `INSERT INTO users
            (full_name, email, phone, password)
            VALUES ($1, $2, $3, $4)`,

            [
                full_name,
                email,
                phone,
                hashedPassword
            ]

        );

        res.status(201).json({

            success: true,
            message: "Registration Successful."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===============================
// Login User
// ===============================

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Email and Password are required."

            });

        }

        // Find User

        const result = await pool.query(

            "SELECT * FROM users WHERE email = $1",

            [email]

        );

        if (result.rows.length === 0) {

            return res.status(401).json({

                success: false,
                message: "Email not found."

            });

        }

        const user = result.rows[0];

        // Compare Password

        const isMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!isMatch) {

            return res.status(401).json({

                success: false,
                message: "Incorrect Password."

            });

        }

        // Generate JWT Token

        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        // Success Response

        res.status(200).json({

            success: true,
            message: "Login Successful.",

            token,

            user: {

                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===============================
// Export
// ===============================

module.exports = {

    registerUser,
    loginUser

};