import "../../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTabs from "../../components/DashboardTabs"; 

export default function SchoolProfile() {
  const navigate = useNavigate();

const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  country: "",
  logo: "",
});

  // LOAD DATA
  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const res = await fetch("https://northmarkschoolerp.pythonanywhere.com/api/school/profile/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
setForm({
  name: data.name || "",
  email: data.email || "",
  phone: data.phone || "",
  address: data.address || "",
  website: data.website || "",
  country: data.country || "",
  logo: data.logo || "",
});

  } catch (err) {
    console.error(err);
  }
};

fetchProfile();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOGO UPLOAD
const handleLogo = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setForm({ ...form, logo: file });
};

  // SAVE
const handleSave = async () => {
  try {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("website", form.website);
    formData.append("country", form.country);

    if (form.logo instanceof File) {
      formData.append("logo", form.logo);
    }

    const res = await fetch("https://northmarkschoolerp.pythonanywhere.com/api/school/profile/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile updated ✅");
    } else {
      alert(data.error || "Error saving profile");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
    <div className="page">
      <DashboardTabs />

      {/* TITLE */}
      <h1 className="page-title">Institute Profile</h1>

      {/* MAIN CARD */}
      <div className="profile-card">

        {/* LEFT SIDE (FORM) */}
        <div className="profile-left">

         <div className="logo-section">

  <div className="logo-circle">

    {/* IMAGE / PLACEHOLDER */}
    {form.logo ? (
      <img
  src={
    form.logo instanceof File
      ? URL.createObjectURL(form.logo)
      : form.logo
  }
  alt="logo"
/>
    ) : (
      <span className="logo-placeholder">Logo</span>
    )}
    {/* UPLOAD BUTTON OVERLAY */}
    <label className="upload-overlay">
      <i className="fa-solid fa-camera"></i>
      <input type="file" hidden onChange={handleLogo} />
    </label>

  </div>

</div> 

          <div className="form-group">
            <label className="form-label">Institute Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter institute name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone No.</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-input"
              placeholder="Full address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              className="form-input"
              placeholder="India"
            />
          </div>

          <button className="save-btnn" onClick={handleSave}>
            Save Changes
          </button>

        </div>

        {/* RIGHT SIDE (10X PREVIEW) */}
        <div className="profile-preview">

          <div className="preview-card">

            {/* HEADER */}
            <div className="preview-header">
              <div className="preview-logo">
                {form.logo ? (
                  <img
  src={
    form.logo instanceof File
      ? URL.createObjectURL(form.logo)
      : form.logo
  }
  alt="preview"
/>
                ) : (
                  <span>LOGO</span>
                )}
              </div>

              <div>
                <h2>{form.name || "Institute Name"}</h2>
                <p className="preview-sub">
                  {form.country || "Country"}
                </p>
              </div>
            </div>

            {/* GRID */}
            <div className="preview-grid">

              <div className="preview-item">
                <span>📞 Phone</span>
                <p>{form.phone || "Not provided"}</p>
              </div>
              <div className="preview-item">
                <span>📧 Email</span>
                <p>{form.email || "Not provided"}</p>
              </div>

              <div className="preview-item">
                <span>🌐 Website</span>
                <p>{form.website || "Not provided"}</p>
              </div>

              <div className="preview-item">
                <span>📍 Address</span>
                <p>{form.address || "Not provided"}</p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}