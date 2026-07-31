import { useEffect, useState } from "react";
import api from "../api/axios";
import FormModal from "../components/FormModal";

const userFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "password", label: "Password (leave blank to keep unchanged)", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "role", label: "Role", type: "select", options: ["admin", "manager", "staff"], required: true },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (formData) => {
    try {
      if (editRow) {
        await api.put(`/users/${editRow._id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      setShowForm(false);
      setEditRow(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => { setEditRow(null); setShowForm(true); }}>
          + Add User
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Active</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.phone}</td>
                  <td>{u.active ? "Yes" : "No"}</td>
                  <td className="actions-cell">
                    <button className="btn-link" onClick={() => { setEditRow(u); setShowForm(true); }}>Edit</button>
                    <button className="btn-link danger" onClick={() => handleDelete(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <FormModal
          title={editRow ? "Edit User" : "Add User"}
          fields={editRow ? userFields : [...userFields.map((f) => f.name === "password" ? { ...f, label: "Password", required: true } : f)]}
          initialData={editRow}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditRow(null); }}
        />
      )}
    </div>
  );
}
