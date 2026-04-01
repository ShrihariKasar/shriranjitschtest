import "../../styles/dashboard.css";
import { useState, useEffect } from "react";

export default function Alumni() {
  const [tab, setTab] = useState("students");

  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);

  // LOAD DATA
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
    const storedStaff = JSON.parse(localStorage.getItem("staff")) || [];

    setStudents(storedStudents);
    setStaff(storedStaff);
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Alumni</h1>

      {/* 🔥 TABS */}
      <div className="subject-tabs hw-tabs-modern">
        <span
          className={tab === "students" ? "active" : ""}
          onClick={() => setTab("students")}
        >
          Students
        </span>

        <span
          className={tab === "staff" ? "active" : ""}
          onClick={() => setTab("staff")}
        >
          Staff
        </span>
      </div>

      {/* ================= STUDENTS ================= */}
      {tab === "students" && (
        <div className="table-container">
          <div className="staff-table">

            <div className="staff-header">
              <div>Student ID</div>
              <div>Name</div>
              <div>Class</div>
              <div>Phone</div>
              <div>Gender</div>
              <div>Blood</div>
              <div>DOB</div>
              <div>Action</div>
            </div>

            {students.length === 0 && (
              <div className="empty-state">No alumni students</div>
            )}

            {students.map((item) => (
              <div key={item.id} className="staff-row">

                <div>{item.id}</div>
                <div className="name">{item.name}</div>
                <div>{item.class}</div>
                <div>{item.phone}</div>
                <div>{item.gender}</div>
                <div>{item.blood}</div>
                <div>{item.dob}</div>

                <div className="actions">
                  <span>👁️</span>
                  <span>✏️</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= STAFF ================= */}
      {tab === "staff" && (
        <div className="table-container">
          <div className="staff-table">

            <div className="staff-header">
              <div>Staff ID</div>
              <div>Staff Name</div>
              <div>Phone No.</div>
              <div>Role</div>
              <div>Gender</div>
              <div>Blood Group</div>
              <div>DOB</div>
              <div>Action</div>
            </div>

            {staff.length === 0 && (
              <div className="empty-state">No alumni staff</div>
            )}

            {staff.map((item) => (
              <div key={item.id} className="staff-row">

                <div>{item.id}</div>
                <div className="name">{item.name}</div>
                <div>{item.phone}</div>

                <div>
                  <span className={`role-pill ${item.role?.toLowerCase()}`}>
                    {item.role}
                  </span>
                </div>

                <div>{item.gender}</div>
                <div>{item.blood}</div>
                <div>{item.dob}</div>

                <div className="actions">
                  <span>👁️</span>
                  <span>✏️</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}