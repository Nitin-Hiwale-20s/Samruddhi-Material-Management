import { useState } from "react";
import api from "../api/axios";
import modulesConfig from "../config/modulesConfig";
import { exportToExcel, exportToPDF } from "../utils/exportHelpers";

export default function Reports() {
  const [selected, setSelected] = useState("inventory");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = modulesConfig[selected];

  const loadData = async (moduleKey) => {
    setSelected(moduleKey);
    setLoading(true);
    try {
      const { data } = await api.get(`/${modulesConfig[moduleKey].endpoint}`);
      setRows(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load report data");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Reports</h2>
      </div>

      <div className="report-tabs">
        {Object.entries(modulesConfig).map(([key, cfg]) => (
          <button
            key={key}
            className={"tab-btn" + (selected === key ? " active" : "")}
            onClick={() => loadData(key)}
          >
            {cfg.title}
          </button>
        ))}
      </div>

      <div className="page-actions" style={{ marginTop: "1rem" }}>
        <button className="btn btn-outline" onClick={() => exportToExcel(rows, `${selected}_report`)}>
          Download Excel
        </button>
        <button className="btn btn-outline" onClick={() => exportToPDF(rows, `${selected}_report`, config?.title)}>
          Download PDF
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : rows.length === 0 ? (
        <p>Select a module above to load and export its report.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {config.fields.map((f) => <th key={f.name}>{f.label}</th>)}
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id}>
                  {config.fields.map((f) => <td key={f.name}>{String(row[f.name] ?? "")}</td>)}
                  <td>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
