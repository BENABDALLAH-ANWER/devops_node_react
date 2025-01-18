const express = require("express");
const pool = require("./keys");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getAllUsers, createUser, updateUser, deleteUser } = require("./crud");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const createUsersTable = async () => {
  const query = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Table 'users' supprimée et recréée avec succès.");
  } catch (err) {
    console.error("Erreur lors de la recréation de la table 'users':", err);
  }
};


createUsersTable();

app.get("/", (req, res) => {
  res.send("User CRUD API");
});

app.get("/users/all", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
});

app.put("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedFields = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const updatedUser = await updateUser(userId, updatedFields);
    if (updatedUser) {
      res.status(200).json({ success: true, data: updatedUser });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const deleted = await deleteUser(userId);
    if (deleted) {
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
}