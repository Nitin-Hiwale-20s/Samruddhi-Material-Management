import { useEffect, useState } from "react";
import api from "../api/axios";
import FormModal from "./FormModal";
import { exportToExcel, exportToPDF } from "../utils/exportHelpers";

export default function DataTable({ moduleKey, config }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/${config.endpoint}`);
      setRows(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey]);

  const handleSave = async (formData) => {
    try {
      if (editRow) {
        await api.put(`/${config.endpoint}/${editRow._id}`, formData);
      } else {
        await api.post(`/${config.endpoint}`, formData);
      }
      setShowForm(false);
      setEditRow(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/${config.endpoint}/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredRows = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>{config.title}</h2>
        <div className="page-actions">
          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline" onClick={() => exportToExcel(filteredRows, config.endpoint)}>
            Download Excel
          </button>
          <button className="btn btn-outline" onClick={() => exportToPDF(filteredRows, config.endpoint, config.title)}>
            Download PDF
          </button>
          <button className="btn btn-primary" onClick={() => { setEditRow(null); setShowForm(true); }}>
            + Add New
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {config.fields.map((f) => <th key={f.name}>{f.label}</th>)}
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr><td colSpan={config.fields.length + 2}>No records found</td></tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row._id}>
                    {config.fields.map((f) => <td key={f.name}>{String(row[f.name] ?? "")}</td>)}
                    <td>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ""}</td>
                    <td className="actions-cell">
                      <button className="btn-link" onClick={() => { setEditRow(row); setShowForm(true); }}>Edit</button>
                      <button className="btn-link danger" onClick={() => handleDelete(row._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <FormModal
          title={editRow ? `Edit ${config.title}` : `Add ${config.title}`}
          fields={config.fields}
          initialData={editRow}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditRow(null); }}
        />
      )}
    </div>
  );
}
