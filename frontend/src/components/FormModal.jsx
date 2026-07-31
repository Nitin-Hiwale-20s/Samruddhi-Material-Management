import { useState, useEffect } from "react";

export default function FormModal({ fields, initialData, onSave, onClose, title }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const base = {};
    fields.forEach((f) => (base[f.name] = initialData?.[f.name] ?? ""));
    setFormData(base);
  }, [initialData, fields]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div className="form-group" key={f.name}>
              <label>{f.label}{f.required && " *"}</label>
              {f.type === "textarea" ? (
                <textarea
                  value={formData[f.name] || ""}
                  required={f.required}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              ) : f.type === "select" ? (
                <select
                  value={formData[f.name] || ""}
                  required={f.required}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={formData[f.name] || ""}
                  required={f.required}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
