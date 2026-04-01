import "../../styles/dashboard.css";
import { useState, useEffect } from "react";

export default function Homework() {
  const [tab, setTab] = useState("assign");

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [attachments, setAttachments] = useState([]); // ✅ NEW
  const [homeworks, setHomeworks] = useState([]);

  // ✅ Load classes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("classes")) || [];
    setClasses(stored);
  }, []);

  // ✅ Assign Homework
  const handleAssign = () => {
    if (!title || !selectedClass || !selectedSection) {
      alert("Fill all fields");
      return;
    }

    const newHW = {
      id: Date.now(),
      title,
      description,
      class: selectedClass,
      section: selectedSection,
      dueDate,
      attachments, // ✅ INCLUDE FILES
      status: "ongoing",
    };

    setHomeworks([...homeworks, newHW]);

    // reset
    setTitle("");
    setDescription("");
    setDueDate("");
    setAttachments([]);
  };

  // ✅ Mark complete
  const markComplete = (id) => {
    setHomeworks((prev) =>
      prev.map((hw) =>
        hw.id === id ? { ...hw, status: "completed" } : hw
      )
    );
  };

  return (
    <div className="page">
      <h1 className="page-title">Homework / Assignments</h1>

      {/* ✅ PREMIUM TABS */}
      <div className="subject-tabs hw-tabs-modern">
        <span
          className={tab === "assign" ? "active" : ""}
          onClick={() => setTab("assign")}
        >
          Assign
        </span>

        <span
          className={tab === "ongoing" ? "active" : ""}
          onClick={() => setTab("ongoing")}
        >
          Ongoing
        </span>

        <span
          className={tab === "completed" ? "active" : ""}
          onClick={() => setTab("completed")}
        >
          Completed
        </span>
      </div>

      {/* ================= ASSIGN ================= */}
      {tab === "assign" && (
        <div className="hw-card">
          <div className="hw-grid">
            <div>
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSection("");
                }}
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {selectedClass &&
                  Object.entries(
                    classes.find((c) => c.id == selectedClass)?.sections || {}
                  )
                    .filter(([_, v]) => v)
                    .map(([sec]) => (
                      <option key={sec}>{sec}</option>
                    ))}
              </select>
            </div>

            <div>
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="hw-input">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter homework title"
            />
          </div>

          <div className="hw-input">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter details"
            />
          </div>

          {/* ✅ ATTACHMENTS */}
          <div className="hw-input">
            <label>Attachments</label>

            <div className="hw-upload-box">
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setAttachments((prev) => [
                    ...prev,
                    ...Array.from(e.target.files),
                  ])
                }
              />
              <p>Upload PDF, Images, Word, Video, etc.</p>
            </div>

            <div className="hw-file-list">
              {attachments.map((file, i) => (
                <div key={i} className="hw-file-item">
                  {file.name}
                  <button
                    onClick={() =>
                      setAttachments((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="hw-action">
            <button onClick={handleAssign}>Assign Homework</button>
          </div>
        </div>
      )}

      {/* ================= ONGOING ================= */}
      {tab === "ongoing" && (
        <div className="hw-card">
          {homeworks.filter((h) => h.status === "ongoing").length === 0 && (
            <div className="empty-state">No ongoing assignments</div>
          )}

          {homeworks
            .filter((h) => h.status === "ongoing")
            .map((hw) => (
              <div key={hw.id} className="hw-row">
                <div>
                  <strong>{hw.title}</strong>
                  <p>
                    Class {hw.class} - {hw.section}
                  </p>

                  {hw.attachments?.length > 0 && (
                    <div className="hw-attach-preview">
                      📎 {hw.attachments.length} file(s)
                    </div>
                  )}
                </div>

                <button onClick={() => markComplete(hw.id)}>
                  Mark Complete
                </button>
              </div>
            ))}
        </div>
      )}

      {/* ================= COMPLETED ================= */}
      {tab === "completed" && (
        <div className="hw-card">
          {homeworks.filter((h) => h.status === "completed").length === 0 && (
            <div className="empty-state">No completed assignments</div>
          )}

          {homeworks
            .filter((h) => h.status === "completed")
            .map((hw) => (
              <div key={hw.id} className="hw-row done">
                <div>
                  <strong>{hw.title}</strong>
                  <p>
                    Class {hw.class} - {hw.section}
                  </p>

                  {hw.attachments?.length > 0 && (
                    <div className="hw-attach-preview">
                      📎 {hw.attachments.length} file(s)
                    </div>
                  )}
                </div>

                <span className="completed-tag">Done</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}