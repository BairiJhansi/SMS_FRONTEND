import axios from "axios";

// Get user with Moodle password
export const getUserWithMoodlePassword = async (userId) => {
  const response = await axios.get(`/api/auth/user-with-moodle-password/${userId}`);
  return response.data;
};

// Moodle authentication
export const authenticateWithMoodle = async (username, password) => {
  const response = await axios.post("/api/auth/moodle-login", {
    username,
    password
  });
  return response.data;
};
