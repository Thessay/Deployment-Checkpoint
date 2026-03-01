import React, { useEffect, useState } from "react";
import { getUsers, addUser } from "../api/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      console.error("err.response:", err.response);
      console.error("err.response.data:", err.response?.data);

      setError(
        err.response?.data?.message || "Could not fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await addUser({ name, email });
      const newUser = res.data;

      setUsers((prevUsers) => [...prevUsers, newUser]);
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Failed to add user:", err);
      console.error("err.response:", err.response);
      console.error("err.response.data:", err.response?.data);

      setError(
        err.response?.data?.message || "Could not add user. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>

      <form onSubmit={handleAddUser}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Add User</button>
      </form>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {Array.isArray(users) &&
          users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;