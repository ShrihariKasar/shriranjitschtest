import "../../styles/dashboard.css";
import { useState, useEffect } from "react";

export default function Examinations() {

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("schedule");
  const [subjects, setSubjects] = useState([]);
const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const emptyRow = {
    date: "",
    subject: "",
    examiner: "",
    type: "",
    location: "",
    info: "",
    passing: "",
    total: ""
  };

  const [rows, setRows] = useState([emptyRow]);
  const [exams, setExams] = useState([]);
useEffect(() => {
  if (selectedExam !== "" && students.length > 0) {
    const initial = students.map(() => ({
      marks: "",
      absent: false
    }));
    setResults(initial);
  }
}, [selectedExam, students]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("classes")) || [];
    setClasses(stored);

    // dummy students (replace with API later)
    setStudents([
      { id: 1, name: "Rahul" },
      { id: 2, name: "Amit" },
      { id: 3, name: "Sneha" }
    ]);
    setSubjects(["Math", "Science", "English", "Physics"]);
  setTeachers(["Mr. Sharma", "Ms. Patil", "Mr. Khan"]);
  }, []);

  useEffect(() => {
    setRows([emptyRow]);
  }, [mode]);

  /* ADD ROW */
  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };
  const deleteRow = (index) => {
  if (rows.length === 1) return; // prevent removing last row
  const updated = rows.filter((_, i) => i !== index);
  setRows(updated);
};

  /* HANDLE CHANGE */
const handleChange = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    setRows(updated);
  };

  /* SAVE */
  const handleSave = () => {
    if (!selectedClass || !selectedSection) {
      alert("Select class & section");
      return;
    }

    if (mode === "schedule") {

      for (let r of rows) {
        if (Number(r.passing) > Number(r.total)) {
          alert("Passing marks cannot be greater than total marks");
          return;
        }
      }

      const newExam = {
        id: Date.now(),
        mode,
        selectedClass,
        selectedSection,
        exams: rows
      };

      setExams([...exams, newExam]);

    } else {
      const newResult = {
        id: Date.now(),
        selectedClass,
        selectedSection,
        selectedExam,
        results
      };

      console.log(newResult);
      alert("Result Saved ✅");
    }

    setShowModal(false);
    setSelectedClass("");
    setSelectedSection("");
    setSelectedExam("");
    setResults([]);
  };

  const filteredExams = exams.filter((e) => e.mode === "schedule");

  const selectedExamData = filteredExams.find(
    (e) =>
      e.selectedClass == selectedClass &&
      e.selectedSection == selectedSection
  );

  return (
    <div className="page">

      <h1 className="page-title">Examinations</h1>

      <div className="top-bar">

        <div className="att-toggle">
          <button
            className={mode === "schedule" ? "active" : ""}
            onClick={() => setMode("schedule")}
          >
            Schedule
          </button>

          <button
            className={mode === "result" ? "active" : ""}
            onClick={() => setMode("result")}
          >
            Result
          </button>
        </div>

        <div className="actions">
          <button className="outline-btn">📥 Import</button>

          <button className="outline-btn" onClick={() => setShowModal(true)}>
            ➕ Add {mode === "schedule" ? "Schedule" : "Result"}
          </button>

          <button className="outline-btn">📄 Print</button>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlayy">
          <div className="modal large">

            <h3>
              Create {mode === "schedule" ? "Schedule" : "Result"}
            </h3>

            {/* CLASS + SECTION */}
            <div className="ex-grid">
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
            </div>

            {/* ================= SCHEDULE UI ================= */}
            {mode === "schedule" && (
              <>
                {rows.map((row, i) => (
                  <div key={i} className="exam-row">

                    <input type="date" value={row.date}
                      onChange={(e) => handleChange(i, "date", e.target.value)} />

                    {/* SUBJECT */}
                <select
  value={row.subject}
  onChange={(e) => handleChange(i, "subject", e.target.value)}
  disabled={mode === "result"}
>
                  <option value="">Select Subject</option>
                  {subjects.map((s, idx) => (
                    <option key={idx}>{s}</option>
                  ))}
                </select>
  <select
    value={row.examiner}
    onChange={(e) => handleChange(i, "examiner", e.target.value)}
  >
    <option value="">Select Teacher</option>
    {teachers.map((t, idx) => (
      <option key={idx}>{t}</option>
    ))}
  </select>

                    <select value={row.type}
                      onChange={(e) => handleChange(i, "type", e.target.value)}>
                      <option value="">Type</option>
                      <option>UT</option>
                      <option>Mid</option>
                      <option>Prelim</option>
                    </select>

                    <input placeholder="Passing Marks" type="number"
                      value={row.passing}
                      onChange={(e) => handleChange(i, "passing", e.target.value)} />

                    <input placeholder="Total Marks" type="number"
                      value={row.total}
                      onChange={(e) => handleChange(i, "total", e.target.value)} />

                    <input placeholder="Location"
                      value={row.location}
                      onChange={(e) => handleChange(i, "location", e.target.value)} />

                    <input placeholder="Additional Info"
                      value={row.info}
                      onChange={(e) => handleChange(i, "info", e.target.value)} />
                      <button
  className="delete-row-btn"
  onClick={() => deleteRow(i)}
>
  ❌
</button>

                  </div>
                ))}

                <button onClick={addRow}>➕ Add More Exam</button>
              </>
            )}

            {/* ================= RESULT UI ================= */}
            {mode === "result" && (
              <>

                {/* SELECT EXAM */}
                <div className="ex-grid">
                  <div>
                    <label>Select Exam</label>
                    <select
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                    >
                      <option value="">Select Exam</option>
                      {selectedExamData?.exams?.map((ex, i) => (
                        <option key={i} value={i}>
                          {ex.subject} ({ex.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* EXAM CARD */}
                {selectedExam !== "" && (
                  <div className="exam-preview-card">
                    <div className="exam-preview-row header">
                      <span>Date</span>
                      <span>Examiner</span>
                      <span>Location</span>
                      <span>Passing</span>
                      <span>Total</span>
                    </div>

                    <div className="exam-preview-row">
                      <span>{selectedExamData.exams[selectedExam].date}</span>
                      <span>{selectedExamData.exams[selectedExam].examiner}</span>
                      <span>{selectedExamData.exams[selectedExam].location}</span>
                      <span>{selectedExamData.exams[selectedExam].passing}</span>
                      <span>{selectedExamData.exams[selectedExam].total}</span>
                    </div>
                  </div>
                )}

                {/* STUDENTS */}
                {selectedExam !== "" && (
                  <div className="student-result-list">

                  {students.map((s, i) => {

  const totalMarks =
    selectedExamData?.exams?.[selectedExam]?.total || 0;

  return (
    <div key={i} className="result-row">

      <span>{s.id}</span>
      <span>{s.name}</span>

      <select
  value={results[i]?.marks || ""}
  disabled={results[i]?.absent === true}
  onChange={(e) => {
    setResults(prev => {
      const updated = [...prev];
      updated[i] = {
        marks: e.target.value,
        absent: false
      };
      return updated;
    });
  }}
>
  <option value="">Marks</option>
  {[...Array(Number(totalMarks) + 1)].map((_, m) => (
    <option key={m}>{m}</option>
  ))}
</select>

<button
  className={`abs-btn ${results[i]?.absent ? "active" : ""}`}
  onClick={() => {
    setResults(prev => {
      const updated = [...prev];
      updated[i] = {
        marks: "",
        absent: !prev[i]?.absent
      };
      return updated;
    });
  }}
>
  A
</button>

    </div>
  );
})}

                  </div>
                )}

              </>
            )}

            <div className="modal-actionss">
              <button className="outline-btn" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DISPLAY */}
      <div className="ex-card">

        {filteredExams.length === 0 && (
          <div className="empty-state">
            No schedule exams added
          </div>
        )}

        {filteredExams.map((e) => (
          <div key={e.id} className="exam-preview-card">

            <div className="exam-preview-header">
              <h4>Class {e.selectedClass} - {e.selectedSection}</h4>
              <span className="badge schedule">Schedule</span>
            </div>

            <div className="exam-preview-table">

              <div className="exam-preview-row header">
                {["Date","Subject","Examiner","Type","Passing","Total","Location","Details"]
                  .map((h, i) => <span key={i}>{h}</span>)}
              </div>

              {e.exams.map((r, i) => (
                <div key={i} className="exam-preview-row">
                  <span>{r.date}</span>
                  <span>{r.subject}</span>
                  <span>{r.examiner}</span>

                  <span className={`tag ${r.type?.toLowerCase()}`}>
                    {r.type}
                  </span>

                  <span>{r.passing}</span>
                  <span>{r.total}</span>
                  <span>{r.location}</span>
                  <span>{r.info}</span>
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}