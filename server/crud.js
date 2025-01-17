const { Pool } = require("pg");
const pool = new Pool();

async function getAllUsers() {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    return result.rows;
}

async function createUser(user) {
    const { first_name, last_name, email, phone } = user;
    const result = await pool.query(
        "INSERT INTO users (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
        [first_name, last_name, email, phone]
    );
    return result.rows[0];
}

async function updateUser(userId, updatedFields) {
    const setClauses = Object.keys(updatedFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
    const values = Object.values(updatedFields);

    const result = await pool.query(
        `UPDATE users SET ${setClauses} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, userId]
    );

    return result.rows[0];
}

async function deleteUser(userId) {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    return result.rowCount > 0;
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
