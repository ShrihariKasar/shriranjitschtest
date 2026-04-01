import Sidebar from "../components/Sidebar";
import StaffNav from "../components/StaffNav";
import { Outlet } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/staff.css";

export default function MainLayout() {
  return (
    <div className="layout">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="main">
        <div className="content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}