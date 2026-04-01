import "../../styles/dashboard.css";
import { useState } from "react";
import DashboardTabs from "../../components/DashboardTabs";

export default function Subjects() {
  const [tab, setTab] = useState("standard");

  const [subjects, setSubjects] = useState({
    standard: [
      { id: 1, name: "Mathematics", desc: "Core logical reasoning..." },
      { id: 2, name: "Natural Science", desc: "Physics, chemistry..." },
      { id: 3, name: "English Literature", desc: "Grammar & writing..." },
    ],
    optional: [],
    extra: [],
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newSubject, setNewSubject] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  /* ===== ADD / UPDATE ===== */
  const handleSubmit = () => {
    if (!newSubject) return;

    if (isEdit) {
      setSubjects((prev) => ({
        ...prev,
        [tab]: prev[tab].map((s) =>
          s.id === editId ? { ...s, name: newSubject, desc: newDesc } : s
        ),
      }));
    } else {
      const newItem = {
        id: Date.now(),
        name: newSubject,
        desc: newDesc,
      };

      setSubjects((prev) => ({
        ...prev,
        [tab]: [...prev[tab], newItem],
      }));
    }

    resetForm();
  };

  /* ===== EDIT ===== */
  const handleEdit = (sub) => {
    setNewSubject(sub.name);
    setNewDesc(sub.desc);
    setEditId(sub.id);
    setIsEdit(true);
    setShowPopup(true);
  };

  /* ===== DELETE ===== */
  const confirmDelete = () => {
    setSubjects((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((s) => s.id !== deleteId),
    }));
    setDeleteId(null);
    resetForm();
  };

  const resetForm = () => {
    setNewSubject("");
    setNewDesc("");
    setEditId(null);
    setIsEdit(false);
    setShowPopup(false);
  };

  return (
    <div className="page">
      <DashboardTabs />
      <h1 className="page-title">Subject Management</h1>

      {/* TABS */}
      <div className="sb-tabs">
        <span
          className={tab === "standard" ? "sb-active" : ""}
          onClick={() => setTab("standard")}
        >
          Standard Subjects
        </span>
        <span
          className={tab === "optional" ? "sb-active" : ""}
          onClick={() => setTab("optional")}
        >
          Optional Subjects
        </span>
        <span
          className={tab === "extra" ? "sb-active" : ""}
          onClick={() => setTab("extra")}
        >
          Extra-curricular
        </span>
      </div>

      {/* GRID */}
      <div className="sb-grid">
        {subjects[tab].map((sub) => (
          <div key={sub.id} className="sb-card">
            <h3>{sub.name}</h3>
            <p>{sub.desc}</p>

            <span className="sb-tag">Mandatory</span>

            <div className="sb-actions">
              <button
                className="sb-edit-btn"
                onClick={() => handleEdit(sub)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}

        {/* ADD CARD */}
        <div
          className="sb-add-card"
          onClick={() => {
            resetForm();
            setShowPopup(true);
          }}
        >
          <div className="sb-plus">+</div>
          <p>Add Subject</p>
        </div>
      </div>

      {/* ADD / EDIT POPUP */}
      {showPopup && (
        <div className="sb-popup">
          <div className="sb-popup-box">
            <h3>{isEdit ? "Edit Subject" : "Add Subject"}</h3>

            <input
              placeholder="Subject Name"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />

            <textarea
              placeholder="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />

            <div className="sb-popup-actions">
              <button onClick={handleSubmit}>
                {isEdit ? "Update" : "Add"}
              </button>

              {/* ✅ DELETE INSIDE EDIT (your requirement) */}
              {isEdit && (
                <button
                  style={{ background: "red" }}
                  onClick={() => {
                    setDeleteId(editId);
                    setShowPopup(false);
                  }}
                >
                  Delete
                </button>
              )}

              <button onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="sb-popup">
          <div className="sb-popup-box">
            <h3>Are you sure?</h3>
            <p>Do you really want to delete this subject?</p>

            <div className="sb-popup-actions">
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}