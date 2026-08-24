import API from "./api";

export const submitAssessment = async (answers) => {
  const response = await API.post("/assessment", {
    answers,
  });

  return response.data;
};