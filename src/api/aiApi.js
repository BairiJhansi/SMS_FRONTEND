import axios from "axios";

export const sendMessageToAI = async (message) => {
  return axios.post(
    "http://localhost:5005/api/ai/chat",
    { message },
    {
      headers: {
        "x-user-id": localStorage.getItem("userId"),
      },
    }
  );
};