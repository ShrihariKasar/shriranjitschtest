import { useState, useEffect } from "react";
import "../../styles/dashboard.css";

export default function Timetable() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [timetables, setTimetables] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState("");

  /* ================= LOAD CLASSES WITH SECTIONS ================= */

  useEffect(() => {
    const loadClasses = () => {
      const stored = JSON.parse(localStorage.getItem("classes")) || [];

      const formatted = stored.filter((cls) => cls.enabled !== false);
setClasses(formatted);

      const storedTT = JSON.parse(localStorage.getItem("timetables")) || {};
      const updatedTT = { ...storedTT };

      formatted.forEach((cls) => {
        if (!updatedTT[cls]) {
          updatedTT[cls] = [];
        }
      });

      setTimetables(updatedTT);

      if (formatted.length > 0 && !formatted.includes(selectedClass)) {
        setSelectedClass(formatted[0]);
      }
    };

    loadClasses();
    window.addEventListener("classesUpdated", loadClasses);

    return () =>
      window.removeEventListener("classesUpdated", loadClasses);
  }, []);

  const getNextTimeSlot = (lastTime, duration = 60) => {
    if (!lastTime) return "08:00 - 09:00";

    const [start, end] = lastTime.split(" - ");
    const [h, m] = end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(h, m, 0);

    const endDate = new Date(startDate.getTime() + duration * 60000);

    const format = (d) =>
      `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;

    return `${format(startDate)} - ${format(endDate)}`;
  };

  /* ================= SAVE ================= */

  useEffect(() => {
    localStorage.setItem("timetables", JSON.stringify(timetables));
  }, [timetables]);

  /* ================= CONSTANTS ================= */

  const days = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const subjectColors = {
    Math: "#3b82f6",
    English: "#8b5cf6",
    Physics: "#f97316",
    History: "#eab308",
    Biology: "#22c55e",
    Chemistry: "#ec4899",
    Geography: "#10b981",
    CS: "#06b6d4",
    Art: "#ef4444",
    PE: "#64748b",
    French: "#6366f1",
  };

  const key =
  selectedClass && selectedSection
    ? `${selectedClass} - ${selectedSection}`
    : "";

const currentTable = timetables[key] || [];

  /* ================= HANDLERS ================= */

  const updateTT = (updated) => {
    setTimetables({ ...updated });
  };

  const handleChange = (i, j, val) => {
    const updated = { ...timetables };
    updated[key][i].subjects[j] = val;
    updateTT(updated);
  };

  const handleTeacherChange = (i, j, val) => {
    const updated = { ...timetables };
    if (!updated[key][i].teachers) {
      updated[key][i].teachers = ["", "", "", "", ""];
    }
    updated[key][i].teachers[j] = val;
    updateTT(updated);
  };

  const handleTimeChange = (i, val) => {
    const updated = { ...timetables };
    updated[key][i].time = val;
    updateTT(updated);
  };

  const handleBreakLabelChange = (i, val) => {
    const updated = { ...timetables };
    updated[key][i].label = val;
    updateTT(updated);
  };

  const handleBreakTimeChange = (i, val) => {
    const updated = { ...timetables };
    updated[key][i].breakTime = val;
    updateTT(updated);
  };

const addRow = () => {
  const updated = { ...timetables };

  const lastEntry = [...updated[key]].reverse()[0];

  let nextStart = "08:00";

  if (lastEntry) {
    if (lastEntry.break) {
      // 🔥 take break END time
      nextStart = lastEntry.breakTime.split(" - ")[1];
    } else {
      nextStart = lastEntry.time.split(" - ")[1];
    }
  }

  const [h, m] = nextStart.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(h, m, 0);

  const endDate = new Date(startDate.getTime() + 60 * 60000);

  const format = (d) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;

  updated[key].push({
    time: `${format(startDate)} - ${format(endDate)}`,
    subjects: ["", "", "", "", ""],
    teachers: ["", "", "", "", ""],
  });

  updateTT(updated);
};

 const addBreak = () => {
  const updated = { ...timetables };

  const lastEntry = [...updated[key]].reverse()[0];

  let breakStart = "10:00";

  if (lastEntry) {
    if (lastEntry.break) {
      breakStart = lastEntry.breakTime.split(" - ")[1];
    } else {
      breakStart = lastEntry.time.split(" - ")[1];
    }
  }

  const [h, m] = breakStart.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(h, m, 0);

  const endDate = new Date(startDate.getTime() + 30 * 60000);

  const format = (d) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;

  updated[key].push({
    break: true,
    breakTime: `${format(startDate)} - ${format(endDate)}`,
    label: "SHORT BREAK",
  });

  updateTT(updated);
};

  const deleteRow = (i) => {
    const updated = { ...timetables };
    updated[key].splice(i, 1);
    updateTT(updated);
  };

  const createTimetable = () => {
  if (!selectedClass || !selectedSection) return;

  const k = `${selectedClass} - ${selectedSection}`;

  const updated = { ...timetables };

  updated[k] = [
    {
      time: "08:00 - 09:00",
      subjects: ["", "", "", "", ""],
      teachers: ["", "", "", "", ""],
    },
  ];

  updateTT(updated);
  setIsEditing(true);
};
const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m+=15) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();
const subjectOptions = [
  "Math", "English", "Physics", "Chemistry",
  "Biology", "History", "Geography", "CS", "Art", "PE"
];

const teacherOptions = [
  "Mr. Sharma", "Ms. Patil", "Dr. Rao",
  "Mrs. Kulkarni", "Mr. Khan", "Ms. Joshi"
];
  /* ================= UI ================= */

  return (
    <div className="page">

      <h1 className="page-title">Class Timetable</h1>
      {/* ✅ UPDATED RIGHT CORNER */}
        <div className="actions" style={{ display: "flex", gap: "10px" }}>
          <button
            className="outline-btn"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Create
          </button>

          <button
            className="outline-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "💾 Save" : "✏ Edit"}
          </button>
          <button className="outline-btn">📄 Print</button>
        </div>

      <div className="page-header">
        <div>
          <h1>Weekly Timetable</h1>
          
          <p className="sub-text">
  {selectedClass
    ? `Class ${selectedClass}`
    : "Select Class & Section"} | Academic Year 2025–2026
</p>
        </div>
      </div>

      {/* CLASS FILTER */}
<div className="filter-card">

  <div className="filter-row">

    {/* CLASS */}
    <div className="filter-group">
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

    {/* SECTION */}
    <div className="filter-group">
      <label>Section</label>
      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        disabled={!selectedClass}
      >
        <option value="">Select Section</option>

        {selectedClass &&
          Object.entries(
            classes.find((c) => c.id == selectedClass)?.sections || {}
          )
            .filter(([_, v]) => v)
            .map(([sec]) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
      </select>
    </div>

  </div>

</div>
      {/* TABLE (UNCHANGED) */}
      {currentTable.length > 0 && (
        <div className="timetable-card">
          <div className="tt-header">
            {days.map((d, i) => <div key={i}>{d}</div>)}
          </div>

          {currentTable.map((row, i) => {
            if (row.break) {
  return (
    <div key={i} className="break-row">
      {isEditing ? (
        <>
          <input
            value={row.label}
            onChange={(e) =>
              handleBreakLabelChange(i, e.target.value)
            }
          />

          <input
            value={row.breakTime}
            onChange={(e) =>
              handleBreakTimeChange(i, e.target.value)
            }
          />

          {/* 🔥 ADD THIS */}
          {isEditing && (
                  <button onClick={() => deleteRow(i)}>❌</button>
                )}
        </>
      ) : (
        `${row.label} (${row.breakTime})`
      )}
    </div>
  );
}

            return (
              <div key={i} className="tt-row">
                <div className="time">
  {isEditing ? (
    <div className="time-wrapper">

      {/* DISPLAY / MANUAL INPUT */}
      <input
        className="time-display"
        value={row.time}
        onChange={(e) => handleTimeChange(i, e.target.value)}
        placeholder="08:00 - 09:00"
      />

      {/* DROPDOWNS BELOW */}
      <div className="time-dropdowns">

        <select
          value={row.time.split(" - ")[0] || ""}
          onChange={(e) => {
            const start = e.target.value;
            const end = row.time.split(" - ")[1] || "09:00";
            handleTimeChange(i, `${start} - ${end}`);
          }}
        >
          <option value="">Start</option>
          {timeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={row.time.split(" - ")[1] || ""}
          onChange={(e) => {
            const end = e.target.value;
            const start = row.time.split(" - ")[0] || "08:00";
            handleTimeChange(i, `${start} - ${end}`);
          }}
        >
          <option value="">End</option>
          {timeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

      </div>
    </div>
  ) : (
    row.time
  )}
</div>

                {row.subjects.map((sub, j) => (
                  <div key={j} className="tt-cell">
                    {isEditing ? (
                      <>
                        <div className="cell-input-group">

  {/* SUBJECT */}
  <select
    value={sub}
    onChange={(e) => handleChange(i, j, e.target.value)}
  >
    <option value="">Select Subject</option>
    {subjectOptions.map((s) => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>

  {/* TEACHER */}
  <select
    value={row.teachers?.[j] || ""}
    onChange={(e) => handleTeacherChange(i, j, e.target.value)}
  >
    <option value="">Select Teacher</option>
    {teacherOptions.map((t) => (
      <option key={t} value={t}>{t}</option>
    ))}
  </select>

</div>
                      </>
                    ) : (
                      <>
  <span
    style={{
      backgroundColor: subjectColors[sub] || "#e5e7eb",
      color: "white",
      padding: "4px 6px",
      borderRadius: "6px",
      display: "inline-block",
      fontSize: "12px"
    }}
  >
    {sub || "—"}
  </span>

  <p>👨‍🏫 {row.teachers?.[j] || "-"}</p>
</>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <button onClick={() => deleteRow(i)}>❌</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ADD ROW / BREAK (UNCHANGED) */}
      {isEditing && currentTable.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={addRow}>➕ Add Row</button>
          <button onClick={addBreak}>⏸ Add Break</button>
        </div>
      )}

      {/* ✅ MODAL ADDED (NO LOGIC CHANGED) */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Class & Section</h3>

            {/* CLASS */}
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

{/* SECTION */}
<select
  value={selectedSection}
  onChange={(e) => setSelectedSection(e.target.value)}
  disabled={!selectedClass}
>
  <option value="">Select Section</option>

  {selectedClass &&
    Object.entries(
      classes.find((c) => c.id == selectedClass)?.sections || {}
    )
      .filter(([_, v]) => v)
      .map(([sec]) => (
        <option key={sec} value={sec}>
          {sec}
        </option>
      ))}
</select>

            <div style={{ marginTop: "15px", display: "flex", gap: "10px" ,justifyContent: "center" }}>
  <button
    className="outline-btn"
    onClick={() => {
      if (!selectedClass || !selectedSection) {
        alert("Select class and section");
        return;
      }

      createTimetable();
      setShowCreateModal(false);
    }}
  >
    Create
  </button>

  <button
    className="cancel-btn"
    onClick={() => setShowCreateModal(false)}
  >
    Cancel
  </button>
</div>
          </div>
        </div>
      )}
    </div>
  );
}