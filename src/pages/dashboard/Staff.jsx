import "../../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTabs from "../../components/DashboardTabs";

export default function Staff() {
  const navigate = useNavigate();
  const [sameAddress, setSameAddress] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const initialState = {
    name: "",
    phone: "",
    role: "",
    picture: "",
    joiningDate: "",
    salary: "",
    fatherName: "",
    nationalId: "",
    religion: "",
    education: "",
    gender: "",
    blood: "",
    experience: "",
    email: "",
    dob: "",
    currentAddress: "",
    permanentAddress: "",
    accountName: "",
    accountNumber: "",
    bank: "",
    ifsc: "",
  };

  const [form, setForm] = useState(initialState);

  const [isEdit, setIsEdit] = useState(false);

useEffect(() => {
  const editData = JSON.parse(localStorage.getItem("editStaff"));
  if (editData) {
    setForm(editData);
    setIsEdit(true); // ✅ IMPORTANT
    localStorage.removeItem("editStaff");
  }
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm(initialState);
    setSameAddress(false);
  };

  const handleSubmit = () => {
  if (!form.name || !form.phone) {
    alert("Name and Phone are required");
    return;
  }

  const existing = JSON.parse(localStorage.getItem("staff")) || [];

  if (isEdit) {
    // ✅ UPDATE EXISTING
    const updated = existing.map((item) =>
      item.id === form.id ? form : item
    );

    localStorage.setItem("staff", JSON.stringify(updated));
  } else {
    // ✅ CREATE NEW
    const newStaff = {
  id: "STF-" + (existing.length + 1).toString().padStart(5, "0"),
  ...form,
  active: isActive, // 🔥 ADD THIS
};

    localStorage.setItem("staff", JSON.stringify([...existing, newStaff]));
  }

  navigate("/staff/list");
};

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text
        .split("\n")
        .filter((r) => r.trim() !== "")
        .map((row) => row.split(","));

      const headers = rows[0];

      const data = rows.slice(1).map((row) => {
        let obj = {};
        headers.forEach((h, i) => {
          obj[h.trim()] = row[i]?.trim();
        });
        return obj;
      });

      const existing = JSON.parse(localStorage.getItem("staff")) || [];

      const formatted = data.map((item, index) => ({
        id: "STF-" + (existing.length + index + 1).toString().padStart(5, "0"),
        name: item.name || "",
        phone: item.phone || "",
        role: item.role || "",
        gender: item.gender || "",
        blood: item.blood || "",
        dob: item.dob || "",
        email: item.email || "",
        experience: item.experience || "",
        currentAddress: item.currentAddress || "",
        permanentAddress: item.permanentAddress || "",
        bank: item.bank || "",
        accountNumber: item.accountNumber || "",
        ifsc: item.ifsc || "",
      }));

      localStorage.setItem("staff", JSON.stringify([...existing, ...formatted]));
      navigate("/staff/list");
    };

    reader.readAsText(file);
  };

  return (
    <div className="page">
      <DashboardTabs />

      <div className="header-row">
  <h1 className="page-title center">Employee Form</h1>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

    {/* BULK UPLOAD */}
    <label className="bulk-btn">
      📄 Bulk Upload
      <input type="file" accept=".csv" hidden onChange={handleBulkUpload} />
    </label>

  </div>
</div>

      {/* BASIC */}
      <div className="section-title">Basic information</div>
      <div className="form-card">
        <div className="form-grid">

          <div>
            <label className="form-label">Name of staff</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Phone no.</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Staff role</label>
            <select name="role" value={form.role} onChange={handleChange} className="input-box">
              <option value="">Select Role</option>
              <option>Teaching</option>
              <option>Non Teaching</option>
              <option>Admin</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">Picture</label>

            <label className="file-upload">
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    setForm({ ...form, picture: reader.result });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>

            {form.picture && (
              <img src={form.picture} alt="preview" className="image-preview" />
            )}
          </div>

          <div>
            <label className="form-label">Date of joining</label>
            <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Monthly salary</label>
            <input name="salary" value={form.salary} onChange={handleChange} className="input-box" />
          </div>

        </div>
      </div>

      {/* PERSONAL */}
      <div className="section-title">Personal information</div>
      <div className="form-card">
        <div className="form-grid">

          <div>
            <label className="form-label">Father / Husband Name</label>
            <input name="fatherName" value={form.fatherName} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">National ID</label>
            <input name="nationalId" value={form.nationalId} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Religion</label>
            <input name="religion" value={form.religion} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Education</label>
            <input name="education" value={form.education} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Date of Birth</label>
            <input name="dob" type="date" value={form.dob} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Experience (Years)</label>
            <input name="experience" type="number" value={form.experience} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="input-box">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">Blood Group</label>
            <select name="blood" value={form.blood} onChange={handleChange} className="input-box">
              <option value="">Select</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option>
              <option>AB+</option><option>AB-</option>
            </select>
          </div>

          {/* ADDRESS */}
          <div className="full-width">
            <div className="address-row">
              <div className="address-col">
                <label className="form-label">Current Address</label>
                <textarea
  name="currentAddress"
  rows={3}
  value={form.currentAddress}
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
              </div>

              <div className="address-col">
                <label className="form-label">Permanent Address</label>
                <textarea
  name="permanentAddress"
  rows={3}
  value={form.permanentAddress}
  onChange={handleChange}
  className="input-box"
  disabled={sameAddress}
/>
              </div>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSameAddress(checked);

                  setForm((prev) => ({
                    ...prev,
                    permanentAddress: checked ? prev.currentAddress : "",
                  }));
                }}
              />
              <span>Same as Current Address</span>
            </div>
          </div>

        </div>
      </div>

      {/* ACCOUNT */}
      <div className="section-title">Account details</div>
      <div className="form-card">
        <div className="form-grid">

          <div>
            <label className="form-label">Account Holder’s Name</label>
            <input name="accountName" value={form.accountName} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Bank Name</label>
            <input name="bank" value={form.bank} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">IFSC Code</label>
            <input name="ifsc" value={form.ifsc} onChange={handleChange} className="input-box" />
          </div>

          <div>
            <label className="form-label">Account Number</label>
            <input name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-box" />
          </div>
          <div>
            <label className="form-label">Confirm Account Number</label>
            <input name="confirmAccountNumber" value={form.confirmAccountNumber} onChange={handleChange} className="input-box" />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button className="reset-btn" onClick={handleReset}>Reset</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        <button className="cancel-btn" onClick={() => navigate("/staff/list")}>Cancel</button>
         {/* ACTIVE / INACTIVE TOGGLE */}
    <button
      className={`status-btn ${isActive ? "active" : "inactive"}`}
      onClick={() => setIsActive(!isActive)}
    >
      {isActive ? "🟢 Active" : "🔴 Inactive"}
    </button>
      </div>
    </div>
  );
}