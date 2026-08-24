import API from "./api";

export const getSkillGap = async () => {
  const response = await API.get("/skill-gap");
  return response.data;
};

export const getRoadmap = async () => {
  const response = await API.get("/roadmap");
  return response.data;
};

export const getReadiness = async () => {
  const response = await API.get("/readiness");
  return response.data;
};