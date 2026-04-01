import { useNavigate, useLocation } from "react-router-dom";

export default function DashboardTabs() {
  const navigate = useNavigate();
  const location = useLocation();

 const tabs = [
  { name: "Profile", path: "/admin/profile", icon: "fa-user" },
  { name: "Staff", path: "/admin/staff", icon: "fa-users" },
  { name: "Classes", path: "/admin/classes/manage", icon: "fa-school" },
  { name: "Subject", path: "/admin/subject", icon: "fa-book" },
  { name: "Financials", path: "/admin/financial", icon: "fa-wallet" },
  { name: "Rules and Regulations", path: "/admin/rules", icon: "fa-scale-balanced" },
];

  return (
    <div className="dashboard-tabs">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          onClick={() => navigate(tab.path)}
          className={`tab-item ${
            location.pathname.startsWith(tab.path) ? "active" : ""
          }`}
        >
          <i className={`fa-solid ${tab.icon}`}></i>
          <span>{tab.name}</span>
        </div>
      ))}
    </div>
  );
}