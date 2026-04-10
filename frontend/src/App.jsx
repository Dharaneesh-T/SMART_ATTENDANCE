import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PAGES ================= */

import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import FacultyLogin from "./pages/FacultyLogin";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import FacultyDashboard from "./pages/FacultyDashboard";

import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import LowAttendance from "./pages/LowAttendance";
import TodayAttendance from "./pages/TodayAttendance";

import AttendanceCalendar from "./pages/AttendanceCalendar";
import SubjectAnalytics from "./pages/SubjectAnalytics";
import GenerateQR from "./pages/GenerateQR";
import TopAttendance from "./pages/TopAttendance";
import AttendancePredictor from "./pages/AttendancePredictor";
import DepartmentAnalytics from "./pages/DepartmentAnalytics";
import ClassScheduler from "./pages/ClassScheduler";
import SystemOverview from "./pages/SystemOverview";
import ScanQR from "./pages/ScanQR";

/* ================= PROTECTED ROUTES ================= */

import AdminProtectedRoute from "./components/AdminProtectedRoute";
import StudentProtectedRoute from "./components/StudentProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ROUTES ================= */}

        <Route path="/" element={<Login />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <AdminProtectedRoute>
              <Students />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <AdminProtectedRoute>
              <Attendance />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <AdminProtectedRoute>
              <Reports />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/low-attendance"
          element={
            <AdminProtectedRoute>
              <LowAttendance />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/today-attendance"
          element={
            <AdminProtectedRoute>
              <TodayAttendance />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/generate-qr"
          element={
            <AdminProtectedRoute>
              <GenerateQR />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/top-attendance"
          element={
            <AdminProtectedRoute>
              <TopAttendance />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/attendance-predictor"
          element={
            <AdminProtectedRoute>
              <AttendancePredictor />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/department-analytics"
          element={
            <AdminProtectedRoute>
              <DepartmentAnalytics />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/class-scheduler"
          element={
            <AdminProtectedRoute>
              <ClassScheduler />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/system-overview"
          element={
            <AdminProtectedRoute>
              <SystemOverview />
            </AdminProtectedRoute>
          }
        />

        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/student-dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student-profile"
          element={
            <StudentProtectedRoute>
              <StudentProfile />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/attendance-calendar"
          element={
            <StudentProtectedRoute>
              <AttendanceCalendar />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/subject-analytics"
          element={
            <StudentProtectedRoute>
              <SubjectAnalytics />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/scan-qr"
          element={
            <StudentProtectedRoute>
              <ScanQR />
            </StudentProtectedRoute>
          }
        />

        {/* ================= FACULTY ROUTES ================= */}

        <Route
          path="/faculty-dashboard"
          element={<FacultyDashboard />}
        />

        {/* ================= UNKNOWN ROUTES ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </BrowserRouter>
  );

}

export default App;