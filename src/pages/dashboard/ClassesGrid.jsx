import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/dashboard.css";

export default function ClassesGrid() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("classes")) || [];

    const formatted = stored
      .filter((cls) => cls.enabled !== false)
      .map((cls) => {
        const enabledSections = Object.entries(cls.sections || {})
          .filter(([_, val]) => val === true)
          .map(([key]) => key);

        return {
          ...cls,
          enabledSections,
        };
      });

    setClasses(formatted);
  }, []);

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
                <span className="value">{cls.id}</span>
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