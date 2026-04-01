import "../../styles/dashboard.css";
import { useState, useEffect } from "react";

export default function Attendance() {
  const [viewType, setViewType] = useState("student");
  const [staffType, setStaffType] = useState("teaching");

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [attendance, setAttendance] = useState({});

  /* ================= DUMMY DATA ================= */

  const classes = [
    { id: "1", sections: { A: true, B: true, C: true } },
    { id: "2", sections: { A: true, B: true, C: true } },
    { id: "3", sections: { A: true, B: true, C: true } },
  ];

  const dummyStudents = [
    { id: 1, name: "Aarav Sharma", class: "1", section: "A" },
    { id: 2, name: "Ishita Patil", class: "1", section: "A" },
    { id: 3, name: "Rohan Deshmukh", class: "1", section: "B" },
    { id: 4, name: "Sneha Kulkarni", class: "2", section: "A" },
    { id: 5, name: "Aditya Joshi", class: "2", section: "C" },
    { id: 6, name: "Pooja Mehta", class: "3", section: "B" },
    { id: 7, name: "Kunal Verma", class: "3", section: "C" },
  ];

  const dummyStaff = [
    { id: 101, name: "Mr. Patil", type: "teaching" },
    { id: 102, name: "Mrs. Shah", type: "teaching" },
    { id: 103, name: "Mr. Joshi", type: "teaching" },
    { id: 104, name: "Office Clerk", type: "non-teaching" },
    { id: 105, name: "Peon Ram", type: "non-teaching" },
  ];

  /* ================= FILTER ================= */

  const filteredData =
    viewType === "student"
      ? dummyStudents.filter(
          (s) =>
            (!selectedClass || s.class === selectedClass) &&
            (!selectedSection || s.section === selectedSection)
        )
      : dummyStaff.filter((s) => s.type === staffType);

  /* ================= AUTO FILL (FIX FOR 0 ISSUE) ================= */

  useEffect(() => {
    if (filteredData.length > 0) {
      const initial = {};

      filteredData.forEach((item, index) => {
        if (index % 3 === 0) initial[item.id] = "P";
        else if (index % 3 === 1) initial[item.id] = "A";
        else initial[item.id] = "L";
      });

      setAttendance(initial);
    }
  }, [selectedClass, selectedSection, viewType, staffType]);

  /* ================= STATUS ================= */

  const markStatus = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const presentCount = Object.values(attendance).filter((s) => s === "P").length;
  const absentCount = Object.values(attendance).filter((s) => s === "A").length;
  const leaveCount = Object.values(attendance).filter((s) => s === "L").length;

  /* ================= UI ================= */

  return (
    <div className="page">
      <h1 className="page-title">Attendance</h1>

      {/* TOGGLE */}
      <div className="att-toggle">
        <button
          className={viewType === "student" ? "active" : ""}
          onClick={() => setViewType("student")}
        >
          Student
        </button>
        <button
          className={viewType === "staff" ? "active" : ""}
          onClick={() => setViewType("staff")}
        >
          Staff
        </button>
      </div>

      {/* FILTER */}
      <div className="att-card">
        <div className="att-grid">

          {viewType === "staff" && (
            <div>
              <label>Staff Type</label>
              <select
                value={staffType}
                onChange={(e) => setStaffType(e.target.value)}
              >
                <option value="teaching">Teaching</option>
                <option value="non-teaching">Non Teaching</option>
              </select>
            </div>
          )}

          {viewType === "student" && (
            <>
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
            </>
          )}
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
        <div className="att-header">
          <span>Name</span>
          <span>Status</span>
        </div>

        {filteredData.map((item) => (
          <div key={item.id} className="att-row">
            <span>{item.name}</span>

            <div className="att-actions">
              <button
                className={`present ${attendance[item.id] === "P" ? "active" : ""}`}
                onClick={() => markStatus(item.id, "P")}
              >
                P
              </button>

              <button
                className={`absent ${attendance[item.id] === "A" ? "active" : ""}`}
                onClick={() => markStatus(item.id, "A")}
              >
                A
              </button>

              <button
                className={`leave ${attendance[item.id] === "L" ? "active" : ""}`}
                onClick={() => markStatus(item.id, "L")}
              >
                L
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT */}
      <div className="att-submit">
        <button>Save Attendance</button>
      </div>
    </div>
  );
}