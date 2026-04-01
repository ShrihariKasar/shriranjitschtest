import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "../pages/auth/Login";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import StaffLayout from "../layouts/StaffLayout";


/* ADMIN */
import Dashboard from "../pages/dashboard/Dashboard";
import Classes from "../pages/dashboard/Classes";
import SchoolProfile from "../pages/dashboard/SchoolProfile";
import Staff from "../pages/dashboard/Staff";
import StaffManagement from "../pages/dashboard/StaffManagement";
import Subject from "../pages/dashboard/Subject";
import Rules from "../pages/dashboard/Rules";
import ClassesGrid from "../pages/dashboard/ClassesGrid";
import ManageClass from "../pages/dashboard/ManageClass";
import Students from "../pages/dashboard/Students";
import Timetable from "../pages/dashboard/timetable";
import Financial from "../pages/dashboard/Financial";
import Attenddance from "../pages/dashboard/Attendance";
import Homework from "../pages/dashboard/Homework";
import Examination from "../pages/dashboard/Examination";
import Announcements from "../pages/dashboard/Announcements";
import AdminCommunications from "../pages/dashboard/AdminCommunications";
import Holidays from "../pages/dashboard/Holidays";
import LiveClass from "../pages/dashboard/liveclass";
import Alumni from "../pages/dashboard/Alumni";

/* STAFF */
import StaffDashboard from "../pages/staff_dashboard/StaffDashboard";
import StaffAttendance from "../pages/staff_dashboard/Attendance";
import StaffTimetable from "../pages/staff_dashboard/Timetable";
import StaffAssignment from "../pages/staff_dashboard/Assignment";
import StaffExamination from "../pages/staff_dashboard/Examination";
import StaffReports from "../pages/staff_dashboard/Reports";
import StaffLiveClass from "../pages/staff_dashboard/LiveClass";
import StaffHolidays from "../pages/staff_dashboard/Holidays";
import StaffCommunications from "../pages/staff_dashboard/StaffCommunications";
import StaffAnnouncement from "../pages/staff_dashboard/Announcement";
import StaffLeaves from "../pages/staff_dashboard/Leaves";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<SchoolProfile />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff/list" element={<StaffManagement />} />
          <Route path="subject" element={<Subject />} />
          <Route path="classes" element={<ClassesGrid />} />
          <Route path="classes/manage" element={<Classes />} />
          <Route path="classes/manage/:id" element={<ManageClass />} />
          <Route path="financial" element={<Financial />} />
          <Route path="rules" element={<Rules />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attenddance />} />
          <Route path="homework" element={<Homework />} />
          <Route path="examinations" element={<Examination />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="communications" element={<AdminCommunications />} /> 
          <Route path="holidays" element={<Holidays />} />
          <Route path="live-class" element={<LiveClass />} />
          <Route path="alumni" element={<Alumni />} />
        </Route>

        {/* ================= STAFF PANEL ================= */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffLayout  />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="attendance" element={<StaffAttendance />} />
          <Route path="timetable" element={<StaffTimetable />} />
          <Route path="assignment" element={<StaffAssignment />} />
          <Route path="examination" element={<StaffExamination />} />
          <Route path="reports" element={<StaffReports />} />
          <Route path="live-class" element={<StaffLiveClass />} />
          <Route path="holidays" element={<StaffHolidays />} />
          <Route path="communications" element={<StaffCommunications />} />
          <Route path="announcement" element={<StaffAnnouncement />} />
          <Route path="leaves" element={<StaffLeaves />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}