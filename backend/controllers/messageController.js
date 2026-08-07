const pool = require("../config/db");

// ===============================
// Send Message (protected)
// A "conversation" is a product + the two users talking about it.
// ===============================
const sendMessage = async (req, res) => {
    try {
        const { product_id, receiver_id, content } = req.body;
        const sender_id = req.user.id;

        if (!product_id || !receiver_id || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "product_id, receiver_id and content are required."
            });
        }

        if (Number(receiver_id) === Number(sender_id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot message yourself."
            });
        }

        const result = await pool.query(
            `INSERT INTO messages (product_id, sender_id, receiver_id, content)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [product_id, sender_id, receiver_id, content.trim()]
        );

        res.status(201).json({ success: true, message: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===============================
// Get Thread (protected)
// All messages between me and another user about one product.
// ?product=<id>&with=<other user id>
// ===============================
const getThread = async (req, res) => {
    try {
        const me = req.user.id;
        const product = req.query.product;
        const other = req.query.with;

        if (!product || !other) {
            return res.status(400).json({
                success: false,
                message: "product and with query params are required."
            });
        }

        const result = await pool.query(
            `SELECT * FROM messages
             WHERE product_id = $1
               AND ((sender_id = $2 AND receiver_id = $3)
                 OR (sender_id = $3 AND receiver_id = $2))
             ORDER BY created_at ASC`,
            [product, me, other]
        );

        res.json({ success: true, count: result.rows.length, messages: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===============================
// Get Conversations / Inbox (protected)
// Latest message for each (product, other user) pair I'm part of.
// ===============================
const getConversations = async (req, res) => {
    try {
        const me = req.user.id;

        const result = await pool.query(
            `SELECT DISTINCT ON (m.product_id, other_id)
                    m.product_id,
                    p.name AS product_name,
                    p.price AS product_price,
                    (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END) AS other_id,
                    u.full_name AS other_name,
                    m.content AS last_message,
                    m.created_at
             FROM messages m
             JOIN products p ON p.id = m.product_id
             JOIN users u
               ON u.id = (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
             WHERE m.sender_id = $1 OR m.receiver_id = $1
             ORDER BY m.product_id, other_id, m.created_at DESC`,
            [me]
        );

        res.json({ success: true, count: result.rows.length, conversations: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendMessage,
    getThread,
    getConversations
};
