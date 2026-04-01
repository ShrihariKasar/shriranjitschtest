import "../../styles/staff.css";
import { useState, useEffect } from "react";

export default function Leaves() {

  const [showModal, setShowModal] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const [leaves, setLeaves] = useState([]);

  const [leaveType, setLeaveType] = useState("");
  const [fromTeacher, setFromTeacher] = useState("");
  const [toTeacher, setToTeacher] = useState("");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState(null);

  /* Dummy teachers */
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    setTeachers([
      "Mr. Sharma",
      "Ms. Patil",
      "Mr. Khan",
      "Mrs. Joshi"
    ]);
  }, []);

  /* SAVE */
  const handleSave = () => {
    if (!leaveType || !fromTeacher || !toTeacher || !date) {
      return alert("Fill all fields");
    }

    const newLeave = {
      id: editId || Date.now(),
      leaveType,
      fromTeacher,
      toTeacher,
      date
    };

    if (editId) {
      setLeaves(prev =>
        prev.map(l => (l.id === editId ? newLeave : l))
      );
    } else {
      setLeaves([...leaves, newLeave]);
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setLeaveType("");
    setFromTeacher("");
    setToTeacher("");
    setDate("");
    setEditId(null);
  };

  /* EDIT */
  const handleEdit = (l) => {
    setLeaveType(l.leaveType);
    setFromTeacher(l.fromTeacher);
    setToTeacher(l.toTeacher);
    setDate(l.date);
    setEditId(l.id);
    setShowModal(true);
  };

  /* DELETE */
  const handleDelete = (id) => {
    setLeaves(prev => prev.filter(l => l.id !== id));
  };

  /* RECENT */
  const recentLeaves = [...leaves]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="page">

      <h1 className="page-title">Leaves</h1>

      <div className="top-bar">

        {/* TOGGLE */}
        <div className="att-toggle">
          <button
            className={`${!showRecent ? "active" : ""}`}
            onClick={() => setShowRecent(false)}
          >
            Leave
          </button>

          <button
            className={`${showRecent ? "active" : ""}`}
            onClick={() => setShowRecent(true)}
          >
            🕒 Recent Leave
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

            <h3>Create Leave</h3>

            <div className="ex-grid">

              <div>
                <label>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option>Sick</option>
                  <option>Casual</option>
                  <option>Emergency</option>
                </select>
              </div>

              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label>From Teacher</label>
                <select
                  value={fromTeacher}
                  onChange={(e) => setFromTeacher(e.target.value)}
                >
                  <option value="">Select</option>
                  {teachers.map((t, i) => (
                    <option key={i}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>To Teacher</label>
                <select
                  value={toTeacher}
                  onChange={(e) => setToTeacher(e.target.value)}
                >
                  <option value="">Select</option>
                  {teachers.map((t, i) => (
                    <option key={i}>{t}</option>
                  ))}
                </select>
              </div>

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
        <div className="ex-card recent-table">

          <h3 style={{ marginBottom: "10px" }}>Recent Leaves</h3>

          {leaves.length === 0 ? (
            <div className="empty-state">No leaves found</div>
          ) : (
            <div className="exam-preview-table">

              <div className="exam-preview-row header">
                <span>Type</span>
                <span>From</span>
                <span>To</span>
                <span>Date</span>
                <span>Actions</span>
              </div>

              {recentLeaves.map((l) => (
                <div key={l.id} className="exam-preview-row">

                  <span>{l.leaveType}</span>
                  <span>{l.fromTeacher}</span>
                  <span>{l.toTeacher}</span>
                  <span>{l.date}</span>

                  <span className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(l)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(l.id)}
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

          {leaves.length === 0 && (
            <div className="empty-state">No leaves added</div>
          )}

          {leaves.map((l) => (
            <div key={l.id} className="exam-preview-card">

              <div className="exam-preview-table">

                <div className="exam-preview-row header">
                  <span>Type</span>
                  <span>From</span>
                  <span>To</span>
                  <span>Date</span>
                  <span>Actions</span>
                </div>

                <div className="exam-preview-row">

                  <span>{l.leaveType}</span>
                  <span>{l.fromTeacher}</span>
                  <span>{l.toTeacher}</span>
                  <span>{l.date}</span>

                  <span className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(l)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(l.id)}
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