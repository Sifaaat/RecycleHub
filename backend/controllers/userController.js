const pool = require("../config/db");

// ===============================
// Get User Profile
// ===============================

const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(

            `SELECT
                id,
                full_name,
                email,
                phone,
                role,
                created_at
             FROM users
             WHERE id = $1`,

            [userId]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        res.status(200).json({

            success: true,
            user: result.rows[0]

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

module.exports = {

    getProfile

};