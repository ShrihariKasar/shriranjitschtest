import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  navigate("/");
};

  /* ================= ADMIN MENU ================= */
  const adminMenu = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "General Settings", path: "/admin/profile" },
  { name: "Classes", path: "/admin/classes" },
  { name: "Live Classes", path: "/admin/live-class" },
  { name: "Staff", path: "/admin/staff/list" },
  { name: "Students", path: "/admin/students" },
  { name: "Attendance", path: "/admin/attendance" },
  { name: "Homework", path: "/admin/homework" },
  { name: "Examinations", path: "/admin/examinations" },
  { name: "Announcements", path: "/admin/announcements" },
  { name: "Communications", path: "/admin/communications" },
  { name: "Holidays", path: "/admin/holidays" },
  { name: "Timetable", path: "/admin/timetable" },
  { name: "Alumni", path: "/admin/alumni" },
];

  /* ================= STAFF MENU ================= */
  const staffMenu = [
    { name: "Dashboard", path: "/staff/dashboard" },
    { name: "Attendance", path: "/staff/attendance" },
    { name: "Timetable", path: "/staff/timetable" },
    { name: "Assignment", path: "/staff/assignment" },
    { name: "Examination", path: "/staff/examination" },
    { name: "Reports", path: "/staff/reports" },
    { name: "Live Class", path: "/staff/live-class" },
    { name: "Holidays", path: "/staff/holidays" },
    { name: "Communications", path: "/staff/communications" },
    { name: "Announcement", path: "/staff/announcement" },
    { name: "Leaves", path: "/staff/leaves" },
  ];

  /* ================= SELECT MENU ================= */
  const menuItems =
  role === "teacher" || role === "staff"
    ? staffMenu
    : adminMenu;

  return (
    <div
      style={{
        width: "250px",
        background: "linear-gradient(180deg, #3C91E0, #2A6FB5)",
        color: "white",
        height: "100vh",
        padding: "20px 12px",
        position: "fixed",
        top: 0,
        left: 0
      }}
    >
      {/* SCROLLABLE CONTAINER */}
      <div
        className="sidebar-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background: "#ffffff",
              margin: "0 auto",
              marginBottom: "8px",
            }}
          />
          <p style={{ fontSize: "14px", fontWeight: "500" }}>
            School By Northmark
          </p>
        </div>

        {/* MENU */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
          }}
        >
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li
                key={index}
                onClick={() => navigate(item.path)}
                style={{
                  padding: "11px 16px",
                  marginBottom: "6px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: isActive
                    ? "rgba(255,255,255,0.25)"
                    : "transparent",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        {/* LOGOUT (NOW INSIDE SCROLL) */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "#ff5b5b",
            border: "none",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#ff3b3b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#ff5b5b")
          }
        >
          Logout
        </button>
      </div>
    </div>
  );
}