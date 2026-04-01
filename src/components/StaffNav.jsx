import "../styles/staff.css";

export default function StaffNav() {
  return (
    <div className="topbar">
      <div className="topbar-right">
        <i className="fa-solid fa-comment-dots"></i>
        <i className="fa-solid fa-bell"></i>

        <div className="profile-circle">
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
    </div>
  );
}