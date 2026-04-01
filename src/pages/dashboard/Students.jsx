import "../../styles/dashboard.css";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

export default function Students() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sameAddress, setSameAddress] = useState(false);
  const [editId, setEditId] = useState(null);

  const cardRef = useRef();

  const initialForm = {
  name: "",
  phone: "",
  class: "",
  picture: "",
  admissionDate: "",
  monthlySalary: "",  

  fatherName: "",
  dob: "",
  gender: "",

  previousSchool: "", 
  previousId: "",      

  blood: "",
  email: "",
  religion: "",
  caste: "",

  currentAddress: "",
  permanentAddress: "",

  guardianName: "",
  guardianPhone: "",
  guardianEducation: "",
  guardianOccupation: "",  
  guardianProfession: "",   
  guardianIncome: "",       
  motherName: "",
  motherPhone: "",
  motherEducation: "",
  motherOccupation: "",
  motherProfession: "",
  motherIncome: "",
};
  const [form, setForm] = useState(initialForm);

  // LOAD
  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem("students")) || [];
      setData([...stored]);
    };

    load();
    window.addEventListener("studentsUpdated", load);
    return () => window.removeEventListener("studentsUpdated", load);
  }, []);

  // CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, picture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // BULK UPLOAD
  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split("\n").slice(1);

      const newStudents = lines
        .map((line) => {
          const [name, phone, studentClass] = line.split(",");
          if (!name) return null;

          return {
            id: "STD-" + Date.now() + Math.floor(Math.random() * 1000),
            name: name?.trim() || "",
            phone: phone?.trim() || "",
            class: studentClass?.trim() || "",
          };
        })
        .filter(Boolean);

      const existing = JSON.parse(localStorage.getItem("students")) || [];
      const updated = [...existing, ...newStudents];

      localStorage.setItem("students", JSON.stringify(updated));
      window.dispatchEvent(new Event("studentsUpdated"));
    };

    reader.readAsText(file);
  };

  // SUBMIT (ADD + EDIT)
  const handleSubmit = () => {
    if (!form.name) return alert("Name required");

    const existing = JSON.parse(localStorage.getItem("students")) || [];

    let updated;

    if (editId) {
      updated = existing.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      );
    } else {
      const newStudent = {
        id: "STD-" + (existing.length + 1).toString().padStart(5, "0"),
        ...form,
      };
      updated = [...existing, newStudent];
    }

    localStorage.setItem("students", JSON.stringify(updated));
    window.dispatchEvent(new Event("studentsUpdated"));

    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setEditId(null);
    setSameAddress(false);
  };
  // VIEW
  const handleView = (item) => {
    setSelectedStudent(item);
  };

  // EDIT
  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  // DOWNLOAD CARD
  const downloadCard = async () => {
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement("a");
    link.download = `${selectedStudent.name}-id-card.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="page">

      {!showForm ? (
        <>
          <div className="header-row">
  <h1 className="page-title">Student Management</h1>

  <div className="top-actions">
    <button className="submit-btn" onClick={() => setShowForm(true)}>
      + Add Student
    </button>
  </div>
</div>

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

            {data.length === 0 && (
              <div className="empty-state">No students added yet</div>
            )}

            {data.map((item) => (
              <div key={item.id} className="staff-row">
                <div>{item.id}</div>
                <div className="name">{item.name}</div>
                <div>{item.class}</div>
                <div>{item.phone}</div>
                <div>{item.gender}</div>
                <div>{item.blood}</div>
                <div>{item.dob}</div>

                <div className="actions">
                  <span onClick={() => handleView(item)}>👁️</span>
                  <span onClick={() => handleEdit(item)}>✏️</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>

          <h1 className="page-title center">
            {editId ? "Edit Student" : "Student Form"}
          </h1>
          <div className="top-actionss">
  <label className="bulk-btnn">
    📄 Bulk Upload
    <input
      type="file"
      hidden
      accept=".csv"
      onChange={handleBulkUpload}
    />
  </label>
</div>

          {/* BASIC */}
          <div className="section-title">Basic information</div>
          <div className="form-card">
            <div className="form-grid">
              <input name="name" value={form.name} placeholder="Name" onChange={handleChange} className="input-box" />
              <input name="phone" value={form.phone} placeholder="Phone" onChange={handleChange} className="input-box" />
              <input name="class" value={form.class} placeholder="Class" onChange={handleChange} className="input-box" />

              <label className="file-upload">
                <span>Choose Image</span>
                <input type="file" hidden onChange={handleImage} />
              </label>

              <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} className="input-box" />
            </div>
          </div>

          {/* PERSONAL */}
          <div className="section-title">Personal information</div>
          <div className="form-card">
            <div className="form-grid">
              <input name="fatherName" value={form.fatherName} placeholder="Father Name" onChange={handleChange} className="input-box" />

              <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-box" />

              <select name="gender" value={form.gender} onChange={handleChange} className="input-box">
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <select name="blood" value={form.blood} onChange={handleChange} className="input-box">
                <option value="">Blood Group</option>
                <option>A+</option><option>B+</option>
                <option>O+</option><option>AB+</option>
              </select>

              <input name="email" value={form.email} placeholder="Email" onChange={handleChange} className="input-box" />
              <input name="religion" value={form.religion} placeholder="Religion" onChange={handleChange} className="input-box" />
              <input name="caste" value={form.caste} placeholder="Caste" onChange={handleChange} className="input-box" />
              <input name="previousSchool" placeholder="Previous School" onChange={handleChange} className="input-box" />
              <input name="previousId" placeholder="Previous ID" onChange={handleChange} className="input-box" />

            </div>

            {/* ADDRESS */}
            <div className="full-width">
              <div className="address-row">
                <textarea
                  name="currentAddress"
                  value={form.currentAddress}
                  placeholder="Current Address"
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({
                      ...form,
                      currentAddress: value,
                      permanentAddress: sameAddress ? value : form.permanentAddress,
                    });
                  }}
                  className="input-box"
                />

                <textarea
                  name="permanentAddress"
                  value={form.permanentAddress}
                  placeholder="Permanent Address"
                  disabled={sameAddress}
                  onChange={handleChange}
                  className="input-box"
                />
              </div>

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSameAddress(checked);

                    setForm({
                      ...form,
                      permanentAddress: checked ? form.currentAddress : "",
                    });
                  }}
                />
                <span>Same as Current Address</span>
              </div>
            </div>
          </div>
          <div className="section-title">Mother Information</div>
<div className="form-card">
  <div className="form-grid">
    <input name="motherName" placeholder="Mother Name" onChange={handleChange} className="input-box" />
    <input name="motherPhone" placeholder="Phone" onChange={handleChange} className="input-box" />
    <input name="motherEducation" placeholder="Education" onChange={handleChange} className="input-box" />

    <input name="motherOccupation" placeholder="Occupation" onChange={handleChange} className="input-box" />
    <input name="motherProfession" placeholder="Profession" onChange={handleChange} className="input-box" />
    <input name="motherIncome" placeholder="Income" onChange={handleChange} className="input-box" />
  </div>
</div>
          <div className="section-title">Guardian Information</div>
          <div className="form-card">
            <div className="form-grid">
              <input name="guardianName" placeholder="Guardian Name" onChange={handleChange} className="input-box" />
              <input name="guardianPhone" placeholder="Phone" onChange={handleChange} className="input-box" />
              <input name="guardianEducation" placeholder="Education" onChange={handleChange} className="input-box" />
              <input name="guardianOccupation" placeholder="Occupation" onChange={handleChange} className="input-box" />
              <input name="guardianProfession" placeholder="Profession" onChange={handleChange} className="input-box" />
              <input name="guardianIncome" placeholder="Income" onChange={handleChange} className="input-box" />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button className="reset-btn" onClick={() => setForm(initialForm)}>Reset</button>
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>

        </div>
      )}
    </div>
  );
}