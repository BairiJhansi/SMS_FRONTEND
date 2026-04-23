import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const role = parseInt(localStorage.getItem("role_id"));

  // Not logged in
  if (!token) {
    return <Navigate to="/" />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;