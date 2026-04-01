import "../../styles/dashboard.css";
import { useState } from "react";

export default function Holidays() {

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("long");

  const [holidays, setHolidays] = useState([]);
  const [showRecent, setShowRecent] = useState(false);

  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [desc, setDesc] = useState("");
  const [banner, setBanner] = useState("");

  const [editId, setEditId] = useState(null);

  /* IMAGE */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBanner(reader.result);
    reader.readAsDataURL(file);
  };

  /* END DATE CALC */
  const calculateEndDate = (start, duration) => {
    if (!start) return "-";

    const d = new Date(start);
    const days = parseInt(duration || 1);
    d.setDate(d.getDate() + days - 1);

    return d.toISOString().split("T")[0];
  };

  /* SAVE */
  const handleSave = () => {
    if (!date || !desc) return alert("Date & Description required");

    const newHoliday = {
      id: editId || Date.now(),
      mode,
      date,
      duration,
      desc,
      banner,
    };

    if (editId) {
      setHolidays((prev) =>
        prev.map((h) => (h.id === editId ? newHoliday : h))
      );
    } else {
      setHolidays([...holidays, newHoliday]);
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setDate("");
    setDuration("");
    setDesc("");
    setBanner("");
    setEditId(null);
  };

  /* EDIT */
  const handleEdit = (h) => {
    setMode(h.mode);
    setDate(h.date);
    setDuration(h.duration);
    setDesc(h.desc);
    setBanner(h.banner || "");
    setEditId(h.id);
    setShowModal(true);
  };

  /* DELETE */
  const handleDelete = (id) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const filtered = holidays.filter((h) => h.mode === mode);

  const recentHolidays = [...holidays]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="page">

      <h1 className="page-title">Holidays</h1>

      <div className="top-bar">

        {/* TOGGLE */}
        <div className="att-toggle">
          <button
            className={`${!showRecent ? "active" : ""}`}
            onClick={() => setShowRecent(false)}
          >
            Holidays
          </button>

          <button
            className={`${showRecent ? "active" : ""}`}
            onClick={() => setShowRecent(true)}
          >
            🕒 Recent
          </button>
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button className="outline-btn">📥 Import</button>

          <button
            className="outline-btn"
            onClick={() => setShowModal(true)}
          >
            ➕ Create
          </button>

          <button className="outline-btn">📄 Print</button>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>Create Holiday</h3>

            <div className="ex-grid">
              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label>Duration (days)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="hl-input">
              <label>Occasion</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              gap: "10px"
            }}>
              <button className="outline-btn" onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= RECENT ================= */}
      {showRecent && (
        <div className="ex-card">

          <h3 style={{ marginBottom: "10px" }}>Recent Holidays</h3>

          {holidays.length === 0 ? (
            <div className="empty-state">
              No holidays added yet. Click "Create".
            </div>
          ) : (
            <div className="exam-preview-table">

              <div className="exam-preview-row header">
                <span>Start</span>
                <span>End</span>
                <span>Occasion</span>
                <span>Duration</span>
                <span>Action</span>
              </div>

              {recentHolidays.map((h) => (
                <div key={h.id} className="exam-preview-row">
                  <span>{h.date}</span>
                  <span>{calculateEndDate(h.date, h.duration)}</span>
                  <span>{h.desc}</span>
                  <span>{h.duration || 1} days</span>
                  {/* ✅ ADD ACTIONS */}
    <span className="table-actions">
      <button
                      className="action-btn edit"
                      onClick={() => handleEdit(h)}
                    >
                      ✏ Edit
                    </button>
      <button
        className="action-btn delete"
        onClick={() => handleDelete(h.id)}
      >
        🗑 Delete
      </button>
    </span>
                </div>
                
              ))}

            </div>
          )}

        </div>
      )}

      {/* ================= ALL ================= */}
      {!showRecent && (
        <div className="ex-card">

          {filtered.length === 0 && (
            <div className="empty-state">
              No holidays added
            </div>
          )}

          {filtered.map((h) => (
            <div key={h.id} className="exam-preview-card">

              <div className="exam-preview-header">
                <h4>{h.date}</h4>
                <span className="badge">Holiday</span>
              </div>

              <div className="exam-preview-table">

                <div className="exam-preview-row header">
                  <span>Start</span>
                  <span>End</span>
                  <span>Occasion</span>
                  <span>Duration</span>
                  <span>Actions</span>
                </div>

                <div className="exam-preview-row">
                  <span>{h.date}</span>
                  <span>{calculateEndDate(h.date, h.duration)}</span>
                  <span>{h.desc}</span>
                  <span>{h.duration || 1} days</span>

                  <span className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(h)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(h.id)}
                    >
                      🗑 Delete
                    </button>
                  </span>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}