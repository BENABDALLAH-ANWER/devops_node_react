import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./MainComponent.css";

const MainComponent = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("/api/users/all");
      console.log("ugbgygybu",response.data.data)
      setUsers(response.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update existing user
        await axios.put(`/api/users/${editingUser.id}`, formData);
      } else {
        // Create new user
        await axios.post("/api/users", formData);
      }

      setFormData({ first_name: "", last_name: "", email: "", phone: "" });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
    });
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h1>User Management</h1>

      {/* User List */}
      <div className="user-list">
        <h2>All Users</h2>
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div>
              <strong>{user.first_name} {user.last_name}</strong> ({user.email}, {user.phone})
            </div>
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* User Form */}
      <div className="user-form">
        <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <button type="submit">{editingUser ? "Update" : "Add"} User</button>
          {editingUser && (
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setFormData({ first_name: "", last_name: "", email: "", phone: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MainComponent;

