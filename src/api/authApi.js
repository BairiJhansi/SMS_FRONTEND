import axios from "axios";

const BASE_URL = "http://localhost:5001"; // Updated to auth-service port

export const loginUser = async (data) => {
  const res = await axios.post(`${BASE_URL}/login`, data);
  return res.data;
};

// Get user with actual password from erd_db
export const getUserWithPassword = async (userId) => {
  const res = await axios.get(`${BASE_URL}/user-password/${userId}`);
  return res.data;
};

// Get user by username with actual password
export const getUserByUsername = async (username) => {
  const res = await axios.get(`${BASE_URL}/user-by-username/${username}`);
  return res.data;
};