import Sidebar from "../components/Sidebar";
import StaffNav from "../components/StaffNav";
import { Outlet } from "react-router-dom";
import "../styles/staff.css";

export default function StaffLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <StaffNav /> {/* ✅ Only here */}

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}