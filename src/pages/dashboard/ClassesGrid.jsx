import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/dashboard.css";

export default function ClassesGrid() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

useEffect(() => {
  fetchClasses();
}, []);

const fetchClasses = async () => {
  try {
    const res = await fetch(
      "https://northmarkschoolerp.pythonanywhere.com/api/school/classes/"
    );

    const result = await res.json();

    const formatted = result.map((item) => ({
      id: item.id,
      name: item.name,
      enabledSections: [], // ⚠️ backend not storing sections yet
    }));

    setClasses(formatted);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="page">
      <h1 className="page-title">Classes</h1>

      <div className="class-grid">
        {classes.length === 0 && (
          <div className="empty-state">No classes available</div>
        )}

        {classes.map((cls) => (
          <div key={cls.id} className="class-card">
            <div className="class-row">
              <div className="class-item">
                <span className="label">Class</span>
                <span className="value">{cls.name}</span>
              </div>

              <div className="class-item">
                <span className="label">Sections</span>
                <span className="value">
                  {cls.enabledSections.length > 0
                    ? cls.enabledSections.join(", ")
                    : "-"}
                </span>
              </div>
            </div>

            <div className="class-subject-line">
              <span className="label">Subject:</span>
              <span>
                Standard, Optional and Extra-curricular Subjects
              </span>
            </div>

            <button
              className="manage-btn"
              onClick={() => navigate(`/admin/classes/manage/${cls.id}`)}
            >
              Manage Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}