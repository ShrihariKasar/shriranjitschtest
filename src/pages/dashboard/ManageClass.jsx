import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/dashboard.css";
import { useLocation } from "react-router-dom";

export default function ManageClass() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("teacher");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [classesData, setClassesData] = useState([]);
const [fromClass, setFromClass] = useState(id);
const [fromSection, setFromSection] = useState("");
const [toClass, setToClass] = useState("");
const [toSection, setToSection] = useState("");
const [students, setStudents] = useState([]);
const [studentName, setStudentName] = useState("");
const [rollNo, setRollNo] = useState("");
const [studentSection, setStudentSection] = useState("");
const location = useLocation();
const params = new URLSearchParams(location.search);
const [selectedStudents, setSelectedStudents] = useState([]);
const [classTimetable, setClassTimetable] = useState([]);
const [promoteSelected, setPromoteSelected] = useState([]);
const [markAsAlumni, setMarkAsAlumni] = useState(false);
const [selectedSection, setSelectedSection] = useState("");

  // SUBJECT STATES
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [activeSubjectTab, setActiveSubjectTab] = useState("standard");

  const subjectData = {
    standard: ["Mathematics", "Science", "English", "Social Studies"],
    optional: ["Computer", "Economics", "Psychology"],
    extra: ["Music", "Sports", "Dance"]
  };

  const [selectedSubjects, setSelectedSubjects] = useState({
    standard: [],
    optional: [],
    extra: []
  });

useEffect(() => {
  const loadTeachers = () => {
    const staff = JSON.parse(localStorage.getItem("staff")) || [];

    const teachersOnly = staff.filter(
      (s) =>
        s.role?.toLowerCase() === "teaching" ||
        s.role?.toLowerCase() === "class teacher"
    );

    setTeachers(teachersOnly);

    const savedTeacher = JSON.parse(
      localStorage.getItem(`class_teacher_${id}`)
    );

    if (savedTeacher) {
      setSelectedTeacher(savedTeacher);
    }
  };
const storedClasses = JSON.parse(localStorage.getItem("classes")) || [];
setClassesData(storedClasses);
const storedStudents =
  JSON.parse(localStorage.getItem("students")) || [];

setStudents(storedStudents);
  loadTeachers();
  // ✅ listen for updates
  window.addEventListener("staffUpdated", loadTeachers);

  return () => {
    window.removeEventListener("staffUpdated", loadTeachers);
  };
}, [id]);
useEffect(() => {
  const storedTT = JSON.parse(localStorage.getItem("timetables")) || {};

  if (!selectedSection) {
    setClassTimetable([]);
    return;
  }

  const key = `${id} - ${selectedSection}`;

  if (storedTT[key]) {
    setClassTimetable(storedTT[key]);
  } else {
    setClassTimetable([]);
  }
}, [id, selectedSection]);
const togglePromoteStudent = (id) => {
  setPromoteSelected((prev) =>
    prev.includes(id)
      ? prev.filter((s) => s !== id)
      : [...prev, id]
  );
};

const selectAllPromote = () => {
  const allIds = filteredPromoteStudents.map((s) => s.id);

  const allSelected = allIds.every((id) =>
    promoteSelected.includes(id)
  );

  setPromoteSelected(allSelected ? [] : allIds);
};
const assignTeacher = (teacher) => {
  const staff = JSON.parse(localStorage.getItem("staff")) || [];

  const prevTeacher = JSON.parse(
    localStorage.getItem(`class_teacher_${id}`)
  );

  const updatedStaff = staff.map((s) => {
    if (
  prevTeacher &&
  (s.id || s.staff_id) === (prevTeacher.id || prevTeacher.staff_id)
) {
      return { ...s, role: "Teaching" };
    }

    if ((s.id || s.staff_id) === (teacher.id || teacher.staff_id)) {
      return { ...s, role: "Class Teacher" };
    }

    return s;
  });

  localStorage.setItem("staff", JSON.stringify(updatedStaff));

  const newTeacher = { ...teacher, role: "Class Teacher" };

  localStorage.setItem(
    `class_teacher_${id}`,
    JSON.stringify(newTeacher)
  );

  setSelectedTeacher(newTeacher);
  setShowModal(false);

  // ✅ THIS is correct place for event
  window.dispatchEvent(new Event("staffUpdated"));
};
  /* SEARCH FILTER */
  const filteredTeachers = teachers.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* SUBJECT FUNCTIONS */
  const toggleSubject = (type, subject) => {
    setSelectedSubjects((prev) => {
      const exists = prev[type].includes(subject);

      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((s) => s !== subject)
          : [...prev[type], subject],
      };
    });
  };

  const handleSelectAll = (type) => {
    setSelectedSubjects((prev) => {
      const allSelected =
        prev[type].length === subjectData[type].length;

      return {
        ...prev,
        [type]: allSelected ? [] : subjectData[type],
      };
    });
  };
const addStudent = () => {
  if (!studentName || !studentSection) {
    alert("Fill all fields");
    return;
  }

  const newStudent = {
    id: Date.now(),
    name: studentName,
    rollNo,
    classId: id, // 🔥 IMPORTANT
    section: studentSection,
  };

  const updated = [...students, newStudent];

  setStudents(updated);
  localStorage.setItem("students", JSON.stringify(updated));

  // reset
  setStudentName("");
  setRollNo("");
  setStudentSection("");
};
const assignStudentsToClass = () => {
  if (!studentSection) {
    alert("Select section");
    return;
  }

  const updatedStudents = students.map((s) => {
    if (selectedStudents.includes(s.id)) {
      return {
        ...s,
        classId: id,
        section: studentSection,
      };
    }
    return s;
  });

  setStudents(updatedStudents);
  localStorage.setItem("students", JSON.stringify(updatedStudents));

  setSelectedStudents([]);
  alert("Students assigned successfully");
};
const toggleStudent = (id) => {
  setSelectedStudents((prev) =>
    prev.includes(id)
      ? prev.filter((s) => s !== id)
      : [...prev, id]
  );
};

const selectAllStudents = (list) => {
  const allIds = list.map((s) => s.id);

  const allSelected = allIds.every((id) =>
    selectedStudents.includes(id)
  );
  setSelectedStudents(allSelected ? [] : allIds);
};
const filteredPromoteStudents = students.filter(
  (s) =>
    s.classId == fromClass &&
    fromSection &&
    s.section === fromSection
);
  return (
<div className="page">

  {/* HEADER */}
  <div className="header-row">
    <h1 className="page-title">
      Manage Class : Grade {id}
      {selectedSection && ` - ${selectedSection}`}
    </h1>

    {/* SECTION SELECT */}
    <div>
      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="input-box"
      >
        <option value="">Select Section</option>

        {Object.entries(
          classesData.find((c) => c.id == id)?.sections || {}
        )
          .filter(([_, v]) => v)
          .map(([sec]) => (
            <option key={sec}>{sec}</option>
          ))}
      </select>
    </div>
  </div>

      <div className="main-card">
        <div className="manage-layout">

          {/* SIDEBAR */}
          <div className="manage-sidebar">
            {[
              "teacher",
              "timetable",
              "subject",
              "fees",
              "students",
              "promote",
            ].map((tab) => (
              <div
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "teacher" && "Class Teacher"}
                {tab === "timetable" && "Time Table"}
                {tab === "subject" && "Subject"}
                {tab === "fees" && "Fees Structure"}
                {tab === "students" && "Add Students"}
                {tab === "promote" && "Promote Class"}
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div className="manage-content">

            {/* TEACHER */}
            {activeTab === "teacher" && (
              <>
                <h3>Set Class Teacher</h3>
                <p className="sub-text">
                  Assign a faculty member as primary lead
                </p>

                {selectedTeacher ? (
                  <div className="teacher-card-wrapper">

                    <div className="teacher-card-header">
                      <span className="assigned-badge">
                        Currently Assigned
                      </span>
                    </div>

                    <div className="teacher-card-body">

                      <div className="teacher-profile-card">
                        <img
                          src={selectedTeacher.picture || "https://placehold.co/80"}
                          alt="profile"
                        />

                        <div>
                          <h4>{selectedTeacher.name}</h4>
                          <p className="role">
                            {selectedTeacher.role || "Teacher"}
                          </p>
                          <span className="muted">
                            Joined {selectedTeacher.dob || "—"}
                          </span>
                        </div>
                      </div>

                      <div
                        className="teacher-reassign-card"
                        onClick={() => setShowModal(true)}
                      >
                        🔁 Reassign Teacher
                      </div>

                    </div>

                  </div>
                ) : (
                  <div
                    className="add-teacher-card"
                    onClick={() => setShowModal(true)}
                  >
                    <div className="circle">+</div>
                    <span>Add Class Teacher</span>
                  </div>
                )}
              </>
            )}
{/* TIMETABLE */}
{activeTab === "timetable" && (
  <>
    <h3>Class Timetable</h3>
    <p className="sub-text">
      View timetable for this class
    </p>

    {classTimetable.length === 0 ? (
      <div className="empty-state">
        No timetable created for this class
      </div>
    ) : (
      <div className="timetable-card">

        <div className="tt-header">
          {["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {classTimetable.map((row, i) => {
          if (row.break) {
            return (
              <div key={i} className="break-row">
                {row.label} ({row.breakTime})
              </div>
            );
          }

          return (
            <div key={i} className="tt-row">

              <div className="time">{row.time}</div>

              {row.subjects.map((sub, j) => (
                <div key={j} className="tt-cell">
                  <span>{sub}</span>
                  <p>👨‍🏫 {row.teachers?.[j]}</p>
                </div>
              ))}

            </div>
          );
        })}

      </div>
    )}
  </>
)}
{/* PROMOTE CLASS */}
{activeTab === "promote" && (
  <>
    <h3>Promote Class</h3>
    <p className="sub-text">
      Configure and assign academic subjects across all grades.
    </p>

    <div className="promote-card">

      <div className="promote-grid">

        {/* FROM */}
        <div>
          <h4>From Class</h4>

          <select
            value={fromClass}
            onChange={(e) => {
              setFromClass(e.target.value);
              setFromSection("");
            }}
          >
            <option value="">Class</option>
            {classesData.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.id}
              </option>
            ))}
          </select>

          <select
            value={fromSection}
            onChange={(e) => setFromSection(e.target.value)}
          >
            <option value="">Section</option>
            {fromClass &&
              Object.entries(
                classesData.find((c) => c.id == fromClass)?.sections || {}
              )
                .filter(([_, v]) => v)
                .map(([sec]) => (
                  <option key={sec}>{sec}</option>
                ))}
          </select>

          <div className="student-table" style={{ marginTop: "10px" }}>

  {/* HEADER */}
  <div className="student-header">
    <span>
      <input
        type="checkbox"
        onChange={selectAllPromote}
        checked={
          filteredPromoteStudents.length > 0 &&
          filteredPromoteStudents.every((s) =>
            promoteSelected.includes(s.id)
          )
        }
      />
    </span>
    <span>ID</span>
    <span>Name</span>
    <span>Roll No</span>
  </div>

  {/* ROWS */}
  {filteredPromoteStudents.map((s) => (
    <div key={s.id} className="student-row">
      <span>
        <input
          type="checkbox"
          checked={promoteSelected.includes(s.id)}
          onChange={() => togglePromoteStudent(s.id)}
        />
      </span>
      <span>{s.id}</span>
      <span>{s.name}</span>
      <span>{s.rollNo || "-"}</span>
    </div>
  ))}

  {filteredPromoteStudents.length === 0 && (
    <div className="empty-state">
      No students found for selected class & section
    </div>
  )}

</div>
        </div>

        {/* ARROW */}
        <div className="promote-arrow">➤➤</div>

        {/* TO */}
        <div>
          <h4>To Class</h4>
<div className="alumni-checkbox">
  <input
    type="checkbox"
    id="alumni"
    checked={markAsAlumni}
    onChange={(e) => setMarkAsAlumni(e.target.checked)}
  />
  <label htmlFor="alumni">Mark as Alumni</label>
</div>

          <select
            value={toClass}
            disabled={markAsAlumni}
            onChange={(e) => {
              setToClass(e.target.value);
              setToSection("");
            }}
          >
            <option value="">Class</option>
            {classesData.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.id}
              </option>
            ))}
          </select>

          <select
            value={toSection}
            disabled={markAsAlumni}
            onChange={(e) => setToSection(e.target.value)}
          >
            <option value="">Section</option>
            {toClass &&
              Object.entries(
                classesData.find((c) => c.id == toClass)?.sections || {}
              )
                .filter(([_, v]) => v)
                .map(([sec]) => (
                  <option key={sec}>{sec}</option>
                ))}
          </select>
        </div>

      </div>

      {/* BUTTON */}
      <div className="promote-action">
        <button
          className="primary-btn"
onClick={() => {

  if (promoteSelected.length === 0) {
    alert("Select students");
    return;
  }

  const alumni = JSON.parse(localStorage.getItem("alumni")) || [];

  const updatedStudents = students.map((s) => {

    if (promoteSelected.includes(s.id)) {

      if (markAsAlumni) {
        // 🔥 MOVE TO ALUMNI
        alumni.push({
          ...s,
          passedOutYear: new Date().getFullYear()
        });

        return null; // remove from students
      }

      // 🔥 NORMAL PROMOTION
      return {
        ...s,
        classId: toClass,
        section: toSection,
      };
    }

    return s;
  }).filter(Boolean); // remove nulls

  localStorage.setItem("students", JSON.stringify(updatedStudents));
  localStorage.setItem("alumni", JSON.stringify(alumni));

  setStudents(updatedStudents);
  setPromoteSelected([]);
  setMarkAsAlumni(false);

  alert(markAsAlumni ? "Moved to Alumni" : "Students promoted");

}}
        >
          PROMOTE
        </button>
      </div>

    </div>
  </>
)}
{/* STUDENTS */}
{activeTab === "students" && (
  <>
    <h3>Assign Students</h3>
    <p className="sub-text">
      Select students and assign them to this class
    </p>

    {/* SECTION SELECT */}
    <div className="student-form">
      <select
        value={studentSection}
        onChange={(e) => setStudentSection(e.target.value)}
      >
        <option value="">Select Section</option>
        {Object.entries(
          classesData.find((c) => c.id == id)?.sections || {}
        )
          .filter(([_, v]) => v)
          .map(([sec]) => (
            <option key={sec}>{sec}</option>
          ))}
      </select>
    </div>

    {/* STUDENT TABLE */}
    <div className="student-table">

      {/* HEADER */}
      <div className="student-header">
        <span>
          <input
            type="checkbox"
            onChange={() => selectAllStudents(students)}
            checked={
              students.length > 0 &&
              students.every((s) =>
                selectedStudents.includes(s.id)
              )
            }
          />
        </span>
        <span>Student ID</span>
        <span>Name</span>
        <span>Roll No</span>
      </div>

      {/* ROWS */}
      {students.map((s) => (
        <div key={s.id} className="student-row">
          <span>
            <input
              type="checkbox"
              checked={selectedStudents.includes(s.id)}
              onChange={() => toggleStudent(s.id)}
            />
          </span>

          <span>{s.id}</span>
          <span>{s.name}</span>
          <span>{s.rollNo || "-"}</span>
        </div>
      ))}

    </div>

    {/* ACTION BUTTON */}
    <div style={{ marginTop: "15px" }}>
      <button
        className="primary-btn"
        onClick={assignStudentsToClass}
      >
        Assign Selected Students
      </button>
    </div>
  </>
)}
            {/* SUBJECT */}
            {activeTab === "subject" && (
              <>
                <div className="subject-header">
                  <div>
                    <h3>Subject Management</h3>
                    <p className="sub-text">
                      Configure subjects for class
                    </p>
                  </div>

                  <button
                    className="primary-btn-dark"
                    onClick={() => setShowSubjectModal(true)}
                  >
                    + Add Subject
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* SUBJECT MODAL */}
      {showSubjectModal && (
        <div className="popup-overlay">
          <div className="popup large">

            <div className="popup-header">
              <h3>Subject Management</h3>
              <span onClick={() => setShowSubjectModal(false)}>✕</span>
            </div>

            <div className="subject-tabs">
              {["standard", "optional", "extra"].map((tab) => (
                <span
                  key={tab}
                  className={activeSubjectTab === tab ? "active" : ""}
                  onClick={() => setActiveSubjectTab(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>

            <div className="subject-box">
              {subjectData[activeSubjectTab].map((sub, i) => (
                <label key={i} className="subject-item">
                  <input
                    type="checkbox"
                    checked={selectedSubjects[activeSubjectTab].includes(sub)}
                    onChange={() =>
                      toggleSubject(activeSubjectTab, sub)
                    }
                  />
                  {sub}
                </label>
              ))}

              <label className="subject-item muted">
                <input
                  type="checkbox"
                  checked={
                    selectedSubjects[activeSubjectTab].length ===
                    subjectData[activeSubjectTab].length
                  }
                  onChange={() =>
                    handleSelectAll(activeSubjectTab)
                  }
                />
                Select All
              </label>

              <button
                className="done-btn"
                onClick={() => setShowSubjectModal(false)}
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
      {/* TEACHER MODAL */}
      {showModal && (
        <div className="popup-overlay">
          <div className="popup large">

            <div className="popup-header">
              <h3>Select Class Teacher</h3>
              <span onClick={() => setShowModal(false)}>✕</span>
            </div>

            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <div className="teacher-list-table">

              <div className="teacher-header">
                <span>ID</span>
                <span>Name</span>
                <span>Phone</span>
                <span>Role</span>
                <span>Action</span>
              </div>

              {filteredTeachers.map((t) => (
                <div key={t.id} className="teacher-row">
                  <span>{t.staff_id || t.id}</span>
                  <span>{t.name}</span>
                  <span>{t.phone || "-"}</span>
                  <span>{t.role || "Teaching"}</span>

                  <button
                    className="assign-btn"
                    onClick={() => assignTeacher(t)}
                  >
                    Select
                  </button>
                </div>
              ))}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}