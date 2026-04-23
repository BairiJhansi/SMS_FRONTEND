import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import GradesPage from "./pages/GradesPage";
// import StudentERPDashboard from "./pages/StudentERPDashboard";
import FacultyERP from "./pages/FacultyERPDashboard";
import AdminERPDashboard from "./pages/AdminERPDashboard";
import StudentDashboard from "./pages/StudentDashboard"
import FacultyAttendance from "./pages/FacultyAttendance"
import SubjectAttendance from "./pages/SubjectAttendance";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRouter from "./components/DashboardRouter";
import Chatbot from "./components/Chatbot";
import StudentERPDashboard from "./pages/StudentDashboardV2";
import FacultyLMSDashboard from "./pages/FacultyLMSDashboard";
import StudentAdmission from "./pages/StudentAdmission";
import Communication from "./pages/Communication";
import FacultyDetails,{FacultyAchDetails} from "./components/FacultyDetails";
import FeeDashboard from "./pages/FeeDashboard";
import ResultsDashboard from "./pages/ResultsDashboard";
import AdminFeeNotifications from "./pages/AdminFeeNotifications";
import AdminPromotion from "./pages/AdminPromotion";
import AddStudent from "./pages/AdminAddStudent";
import FacultyManagement from "./pages/AdminAddFaculty";
import AdminStudents from "./pages/AdminStudents";
import FacultyMarks from "./pages/FacultyMarks";
import AdminResults from "./pages/AdminResults";
import StudentResults from "./pages/StudentResults";

import NLPSidebar from "./pages/NLPSidebar";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardRouter />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/promote" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminPromotion />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/add-student" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AddStudent />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/faculty/marks" element={
          <ProtectedRoute>
            <DashboardLayout>
              <FacultyMarks />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/results" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminResults />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/faculty" element={
          <ProtectedRoute>
            <DashboardLayout>
              <FacultyManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-lms" element={
          <ProtectedRoute>
            <DashboardLayout><FacultyLMSDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/students" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AdminStudents />
          </DashboardLayout>
        </ProtectedRoute>
      } />
        <Route path="/student-admission" element={
        <ProtectedRoute>
          <DashboardLayout>
            <StudentAdmission />
          </DashboardLayout>
        </ProtectedRoute>
      } />

        <Route path="/courses" element={
          <ProtectedRoute>
            <DashboardLayout><CoursesPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/assignments" element={
          <ProtectedRoute>
            <DashboardLayout><AssignmentsPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/grades" element={
          <ProtectedRoute>
            <DashboardLayout><GradesPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Role-based ERP Dashboards */}
        

        <Route path="/faculty-dashboard" element={
          <ProtectedRoute>
            <DashboardLayout><FacultyERP /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-attendance" element={
          <ProtectedRoute>
            <DashboardLayout><FacultyAttendance /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/faculty-attendance/:courseId" element={
          <ProtectedRoute>
            <DashboardLayout><SubjectAttendance /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <DashboardLayout><AdminERPDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Fallback route for old erp-dashboard URL */}
        <Route path="/erp-dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>🔄 Redirecting to your dashboard...</h3>
                <p>Please wait while we redirect you to the appropriate dashboard.</p>
                <div style={{ marginTop: '20px' }}>
                  <a href="/student-erp-dashboard" style={{ margin: '0 10px', color: '#2196f3' }}>Student Dashboard</a>
                  <a href="/faculty-dashboard" style={{ margin: '0 10px', color: '#9c27b0' }}>Faculty Dashboard</a>
                  <a href="/admin-dashboard" style={{ margin: '0 10px', color: '#f44336' }}>Admin Dashboard</a>
                </div>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard" element={
        <ProtectedRoute>
          <DashboardLayout><StudentDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty-details" element={
        <ProtectedRoute>
          <DashboardLayout>
            <FacultyDetails />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/faculty-ach-details" element={
        <ProtectedRoute>
          <DashboardLayout>
            <FacultyAchDetails />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/fees" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AdminFeeNotifications />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/communication" element={
        <ProtectedRoute>
          <DashboardLayout><Communication /></DashboardLayout>
        </ProtectedRoute> } />

        <Route path="/fees" element={
        <ProtectedRoute>
          <DashboardLayout><FeeDashboard /></DashboardLayout>
        </ProtectedRoute> } />

      <Route path="/student/internal-results" element={
          <ProtectedRoute>
            <DashboardLayout><ResultsDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/student/results" element={
          <ProtectedRoute>
            <DashboardLayout><StudentResults /></DashboardLayout>
          </ProtectedRoute>
        } />

      <Route path="/student-erp-dashboard" element={
        <ProtectedRoute>
          <DashboardLayout><StudentERPDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      </Routes>
      <Chatbot />
      <NLPSidebar />
    </BrowserRouter>
  );
}

export default App;