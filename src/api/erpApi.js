import axios from "axios";
import { getToken, getUser } from "../utils/auth";

const BASE_URL = "http://localhost:5002/api/student";

const getHeaders = () => {
  const token = getToken();
  const user = getUser();

  return {
    Authorization: `Bearer ${token}`,
    "x-user-id": user.user_id
  };
};

export const getStudentProfile = async () =>
  axios.get(`${BASE_URL}/profile`, { headers: getHeaders() });

export const getStudentAttendance = async () =>
  axios.get(`${BASE_URL}/attendance`, { headers: getHeaders() });

export const getStudentResults = async () =>
  axios.get(`${BASE_URL}/results`, { headers: getHeaders() });

export const getStudentFees = async () =>
  axios.get(`${BASE_URL}/fees`, { headers: getHeaders() });

export const getStudentLeave = async () =>
  axios.get(`${BASE_URL}/leave`, { headers: getHeaders() });

export const getStudentFeedback = async () =>
  axios.get(`${BASE_URL}/feedback`, { headers: getHeaders() });

export const updateStudentAdmission = async (data) =>
  axios.put(`${BASE_URL}/student/admission`, data, { headers: getHeaders() });

export const getCommunicationDetails = async () =>
  axios.get(`${BASE_URL}/communication`, { headers: getHeaders() });

export const updateIdentityDetails = async (data) =>
  axios.put(`${BASE_URL}/student/identity`, data, { headers: getHeaders() });

export const getQualifications = async () =>
  axios.get(`${BASE_URL}/qualification`, { headers: getHeaders() });

// ✅ ADD new qualification
export const addQualification = async (data) =>
  axios.post(`${BASE_URL}/qualification`, data, { headers: getHeaders() });

// ✅ DELETE qualification
export const deleteQualification = async (id) =>
  axios.delete(`${BASE_URL}/qualification/${id}`, { headers: getHeaders() });

// ✅ UPDATE qualification (for future edit feature)
export const updateQualification = async (id, data) =>
  axios.put(`${BASE_URL}/qualification/${id}`, data, { headers: getHeaders() });

export const getDetailedAttendance = async () =>
  axios.get(`${BASE_URL}/attendance/detailed`, { headers: getHeaders() });

export const getSubjectAttendance = async () =>
  axios.get(`${BASE_URL}/attendance/subjects`, { headers: getHeaders() });