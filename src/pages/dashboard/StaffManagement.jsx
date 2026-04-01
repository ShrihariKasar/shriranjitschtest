import "../../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function StaffManagement() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const cardRef = useRef();

  // LOAD DATA
  useEffect(() => {
  const loadStaff = () => {
    const stored = JSON.parse(localStorage.getItem("staff")) || [];
    setData([...stored]); // 🔥 force new reference
  };

  loadStaff();

  // ✅ custom event (main fix)
  window.addEventListener("staffUpdated", loadStaff);

  return () => {
    window.removeEventListener("staffUpdated", loadStaff);
  };
}, []);
  // DELETE
  const handleDelete = (id) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    localStorage.setItem("staff", JSON.stringify(updated));
    window.dispatchEvent(new Event("staffUpdated"));
  };

  // VIEW (NOW MODAL)
  const handleView = (item) => {
    setSelectedStaff(item);
  };

  // EDIT
  const handleEdit = (item) => {
    localStorage.setItem("editStaff", JSON.stringify(item));
    navigate("/staff");
  };

  // DOWNLOAD ID CARD
  const downloadCard = async () => {
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement("a");
    link.download = `${selectedStaff.name}-id-card.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
<div className="page">

  <div className="header-row">
    <h1 className="page-title">Staff Management</h1>

    <div className="top-actions">

      {/* ADD STAFF */}
      <button
        className="submit-btn"
        onClick={() => navigate("/staff")}
      >
        + Add Staff
      </button>

    </div>
  </div>

      {/* TABLE */}
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

        {data.length === 0 && (
          <div className="empty-state">No staff added yet</div>
        )}

        {data.map((item) => (
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
              <span onClick={() => handleView(item)}>👁️</span>
              <span onClick={() => handleEdit(item)}>✏️</span>
              <span onClick={() => handleDelete(item.id)}>🗑️</span>
            </div>

          </div>
        ))}
      </div>
      </div>

{/* 🔥 ID CARD MODAL */}
{selectedStaff && (
  <div className="modal-overlay">
    <div className="idcard-modal">

      {/* CARD */}
      <div className="idcard" ref={cardRef}>

        {/* HEADER */}
        <div className="id-header">
          <h3>School Name</h3>
          <p>Staff ID Card</p>
        </div>

        {/* BODY */}
        <div className="id-body">

          {/* PHOTO */}
          <div className="id-photo">
            <img
              src={selectedStaff.picture || "https://placehold.co/100x120"}
              alt="profile"
            />
          </div>

          {/* INFO */}
          <div className="id-info">
            <div>
              <strong>ID:</strong> <span>{selectedStaff.id}</span>
            </div>
            <div>
              <strong>Name:</strong> <span>{selectedStaff.name}</span>
            </div>
            <div>
              <strong>Role:</strong> <span>{selectedStaff.role}</span>
            </div>
            <div>
              <strong>Phone:</strong> <span>{selectedStaff.phone}</span>
            </div>
            <div>
              <strong>Gender:</strong> <span>{selectedStaff.gender || "-"}</span>
            </div>
            <div>
              <strong>Blood:</strong> <span>{selectedStaff.blood || "-"}</span>
            </div>
            <div>
              <strong>DOB:</strong> <span>{selectedStaff.dob || "-"}</span>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="id-footer">
          <span>Valid Till: 2026</span>
          <span>Authorized Sign</span>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="modal-actions">
        <button onClick={downloadCard} className="primary-btn">
          Download
        </button>

        <button
          onClick={() => setSelectedStaff(null)}
          className="secondary-btn"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}