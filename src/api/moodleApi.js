import axios from "axios";

const BASE_URL = "http://localhost:5004/api/moodle"; // ERP API Gateway

export const getCourseMaterials = async (courseId) => {
  return axios.get(`${BASE_URL}/course/${courseId}/materials`);
};