import { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";
import "../../styles/dashboard.css";
import DashboardTabs from "../../components/DashboardTabs";

export default function ManageClasses() {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loaded, setLoaded] = useState(false); // ✅ IMPORTANT

  const [showPopup, setShowPopup] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [deleteId, setDeleteId] = useState(null);

useEffect(() => {
  fetchClasses();
}, []);

const fetchClasses = async () => {
  try {
    const res = await fetch(
      "https://northmarkschoolerp.pythonanywhere.com/api/school/classes/"
    );

    const result = await res.json();

    // convert API → UI format
    const formatted = result.map((item) => ({
      id: item.id,
      enabled: true,
      sections: {}, // backend doesn't store sections yet
    }));

    setClasses(formatted);

    // static sections (until backend supports it)
    setSections(["A", "B", "C", "D"]);

  } catch (err) {
    console.error(err);
  }
};
  // ✅ TOGGLE SECTION
  const toggleSection = (classId, sec) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              sections: {
                ...c.sections,
                [sec]: !c.sections?.[sec],
              },
            }
          : c
      )
    );
  };

const addClass = async () => {
  try {
    const res = await fetch(
      "https://northmarkschoolerp.pythonanywhere.com/api/school/classes/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: (classes.length + 1).toString(),
        }),
      }
    );

    if (res.ok) {
      fetchClasses(); // refresh
    } else {
      alert("Failed to add class");
    }
  } catch (err) {
    console.error(err);
  }
};
  // ✅ DELETE CLASS
const confirmDelete = async () => {
  try {
    const res = await fetch(
      `https://northmarkschoolerp.pythonanywhere.com/api/school/classes/${deleteId}/`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      fetchClasses();
      setDeleteId(null);
    } else {
      alert("Delete failed");
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="page">
      <DashboardTabs />
      <h1 className="page-title">Classes</h1>

      <div className="mc-wrapper">
        {/* TABLE */}
        <div className="mc-card">
          <div className="mc-table">
            <div className="mc-header">
              <div className="mc-col-class">Class</div>
              <div className="mc-col-sec">Section</div>
            </div>

            {classes.map((cls) => (
              <div key={cls.id} className="mc-row">
                <div className="mc-col-class">
                  {cls.id}
                  <Trash
                    size={14}
                    className="mc-delete"
                    onClick={() => setDeleteId(cls.id)}
                  />
                </div>

                <div className="mc-col-sec">
                  {sections.map((sec) => (
                    <div
                      key={sec}
                      className={`mc-pill ${
                        cls.sections?.[sec] ? "active" : ""
                      }`}
                      onClick={() => toggleSection(cls.id, sec)}
                    >
                      {sec}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="mc-sidebar-wrapper">
          <div className="mc-sidebar-title">Sections</div>

          <div className="mc-sidebar">
            {sections.map((s) => (
              <div key={s} className="mc-side-pill">
                {s}
              </div>
            ))}

            <div className="mc-add-sec" onClick={() => setShowPopup(true)}>
              +
            </div>
          </div>
        </div>
      </div>

      {/* ADD CLASS */}
      <div className="mc-add-class">
        <button onClick={addClass}>
          <Plus size={16} /> Add Class
        </button>
      </div>

      {/* ADD SECTION POPUP */}
      {showPopup && (
        <div className="mc-popup">
          <div className="mc-popup-box">
            <h3>Add Section</h3>
            <input
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="Enter section"
            />
            <div className="mc-popup-btns">
              <button onClick={addSection}>Add</button>
              <button onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {deleteId && (
        <div className="mc-popup">
          <div className="mc-popup-box">
            <h3>Delete class?</h3>
            <div className="mc-popup-btns">
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}