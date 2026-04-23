import axios from "axios";
import { getToken, getUser } from "../utils/auth";

const BASE_URL = "http://localhost:5002";

// Student Dashboard
export const getStudentDashboard = async () => {
  const token = getToken();
  const user = getUser();

  if (!user) throw new Error("User not logged in");

  return await axios.get(`${BASE_URL}/api/dashboard/student`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-user-id": user.user_id, // ✅ send user_id as expected
      
    },
  });
};

// Faculty Dashboard
export const getFacultyDashboard = async () => {
  const token = getToken();
  const user = getUser();

  if (!token) throw new Error("No token found");
  if (!user) throw new Error("User not logged in");
  return axios.get(`${BASE_URL}/api/dashboard/faculty`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-user-id": user.user_id || user.id
    }
  });
};