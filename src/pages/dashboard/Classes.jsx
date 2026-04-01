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

  // ✅ LOAD DATA (RUN FIRST)
  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem("classes"));
    const storedSections = JSON.parse(localStorage.getItem("sections"));

    if (storedClasses && storedClasses.length > 0) {
      setClasses(storedClasses);
    } else {
      const initial = [
        { id: 1, enabled: true, sections: {} },
        { id: 2, enabled: true, sections: {} },
      ];
      setClasses(initial);
    }

    if (storedSections && storedSections.length > 0) {
      setSections(storedSections);
    } else {
      setSections(["A", "B", "C", "D"]);
    }

    setLoaded(true); // ✅ unlock saving
  }, []);

  // ✅ SAVE ONLY AFTER LOAD
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections, loaded]);

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

  // ✅ ADD SECTION
  const addSection = () => {
    if (!newSection.trim()) return;

    const sec = newSection.toUpperCase();
    if (sections.includes(sec)) return;

    const updatedSections = [...sections, sec];
    setSections(updatedSections);

    setClasses((prev) =>
      prev.map((c) => ({
        ...c,
        sections: {
          ...c.sections,
          [sec]: false,
        },
      }))
    );

    setNewSection("");
    setShowPopup(false);
  };

  // ✅ ADD CLASS (SAFE ID)
  const addClass = () => {
    const newId =
      classes.length > 0
        ? Math.max(...classes.map((c) => c.id)) + 1
        : 1;

    const secObj = {};
    sections.forEach((s) => (secObj[s] = false));

    setClasses([
      ...classes,
      {
        id: newId,
        enabled: true,
        sections: secObj,
      },
    ]);
  };

  // ✅ DELETE CLASS
  const confirmDelete = () => {
    setClasses(classes.filter((c) => c.id !== deleteId));
    setDeleteId(null);
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