import "../../styles/dashboard.css";
import { useState, useEffect } from "react";

export default function Attendance() {

  /* MODE */
  const [viewType, setViewType] = useState("mark"); // mark / view

  /* CLASS + SECTION */
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [attendance, setAttendance] = useState({});

  /* ================= CLASS FETCH LOGIC ================= */

  const classes = [
    { id: "1", sections: { A: true, B: true, C: true } },
    { id: "2", sections: { A: true, B: true, C: true } },
    { id: "3", sections: { A: true, B: true, C: true } },
  ];

  /* ================= STUDENTS ================= */

  const dummyStudents = [
    { id: 1, name: "Aarav Sharma", class: "1", section: "A" },
    { id: 2, name: "Ishita Patil", class: "1", section: "A" },
    { id: 3, name: "Rohan Deshmukh", class: "1", section: "B" },
    { id: 4, name: "Sneha Kulkarni", class: "2", section: "A" },
  ];

  /* ================= FILTER ================= */

  const filteredData = dummyStudents.filter(
    (s) =>
      (!selectedClass || s.class === selectedClass) &&
      (!selectedSection || s.section === selectedSection)
  );

  /* ================= AUTO FILL ================= */

  useEffect(() => {
    if (filteredData.length > 0) {
      const initial = {};
      filteredData.forEach((item) => {
        initial[item.id] = "P";
      });
      setAttendance(initial);
    }
  }, [selectedClass, selectedSection]);

  /* ================= MARK ================= */

  const markStatus = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  /* ================= COUNT ================= */

  const presentCount = Object.values(attendance).filter((s) => s === "P").length;
  const absentCount = Object.values(attendance).filter((s) => s === "A").length;
  const leaveCount = Object.values(attendance).filter((s) => s === "L").length;

  /* ================= UI ================= */

  return (
    <div className="page">

      <h1 className="page-title">Attendance</h1>

      {/* MODE SWITCH */}
      <div className="att-toggle">
        <button
          className={viewType === "mark" ? "active" : ""}
          onClick={() => setViewType("mark")}
        >
          Mark Attendance
        </button>

        <button
          className={viewType === "view" ? "active" : ""}
          onClick={() => setViewType("view")}
        >
          View Attendance
        </button>
      </div>

      {/* CLASS + SECTION */}
      <div className="att-card">
        <div className="att-grid">

          {/* CLASS */}
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

          {/* SECTION */}
          <div>
            <label>Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select Section</option>
              {selectedClass &&
                Object.entries(
                  classes.find((c) => c.id === selectedClass)?.sections || {}
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

      {/* OVERVIEW */}
      <div className="att-overview">
        <div className="card present">
          <h3>{presentCount}</h3>
          <p>Present</p>
        </div>
        <div className="card absent">
          <h3>{absentCount}</h3>
          <p>Absent</p>
        </div>
        <div className="card leave">
          <h3>{leaveCount}</h3>
          <p>Leave</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="att-card">

        {!selectedClass || !selectedSection ? (
          <p style={{ textAlign: "center" }}>
            Select class and section
          </p>
        ) : (
          <>
            <div className="att-header">
              <span>Name</span>
              <span>Status</span>
            </div>

            {filteredData.map((item) => (
              <div key={item.id} className="att-row">

                <span>{item.name}</span>

                <div className="att-actions">

                  {(viewType === "mark" || attendance[item.id] === "P") && (
                    <button
                      className={`present ${
                        attendance[item.id] === "P" ? "active" : "faint"
                      }`}
                      onClick={() =>
                        viewType === "mark" && markStatus(item.id, "P")
                      }
                    >
                      P
                    </button>
                  )}

                  {(viewType === "mark" || attendance[item.id] === "A") && (
                    <button
                      className={`absent ${
                        attendance[item.id] === "A" ? "active" : "faint"
                      }`}
                      onClick={() =>
                        viewType === "mark" && markStatus(item.id, "A")
                      }
                    >
                      A
                    </button>
                  )}

                  {(viewType === "mark" || attendance[item.id] === "L") && (
                    <button
                      className={`leave ${
                        attendance[item.id] === "L" ? "active" : "faint"
                      }`}
                      onClick={() =>
                        viewType === "mark" && markStatus(item.id, "L")
                      }
                    >
                      L
                    </button>
                  )}

                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* SAVE */}
      {viewType === "mark" && (
        <div className="att-submit">
        <button>Save Attendance</button>
      </div>  
      )}

    </div>
  );
}