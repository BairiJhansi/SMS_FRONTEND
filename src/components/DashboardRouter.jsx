import { getUser } from "../utils/auth";
import StudentERPDashboard from "../pages/StudentDashboardV2";
import FacultyERPDashboard from "../pages/FacultyERPDashboard";
import AdminERPDashboard from "../pages/AdminERPDashboard";

const DashboardRouter = () => {
  const user = getUser();

  if (!user) return <p>Loading...</p>;

  switch (user.role_id) {
    case 1:
      return <StudentERPDashboard />;

    case 2:
      return <FacultyERPDashboard />;

    case 3:
      return <AdminERPDashboard />;

    default:
      return <p>Unauthorized role</p>;
  }
};

export default DashboardRouter;