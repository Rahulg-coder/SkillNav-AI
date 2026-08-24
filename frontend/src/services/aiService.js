import API from "./api";

export const sendMessageToAI = async (message) => {
  const response = await API.post("/ai/chat", {
    message,
  });

  return response.data;
};