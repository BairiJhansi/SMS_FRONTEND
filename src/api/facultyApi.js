import axios from "axios";

const BASE_URL = "http://localhost:5002/api/faculty";

export const getSlots = () =>
  axios.get(`${BASE_URL}/slots`);

export const markAttendance = (data) =>
  axios.post(`${BASE_URL}/attendance`, data);
export const getStudentsByCourse = (course_id) =>
  axios.get(`${BASE_URL}/students?course_id=${course_id}`);
export const getFacultyCourses = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return axios.get("http://localhost:5002/api/dashboard/faculty", {
    headers: {
      "x-user-id": user.user_id
    }
  });
};