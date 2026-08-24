const axios = require("axios");

const AI_ENGINE_URL = process.env.AI_ENGINE_URL;

const analyzeAssessment = async (assessmentData) => {
  try {
    const response = await axios.post(
      `${AI_ENGINE_URL}/assessment`,
      assessmentData,
      {
        timeout: 30000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("AI assessment error:", error.message);

    throw new Error("AI Engine assessment service unavailable");
  }
};

const chatWithAI = async (chatData) => {
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/chat`, chatData, {
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error("AI chat error:", error.message);

    throw new Error("AI Engine chat service unavailable");
  }
};

module.exports = {
  analyzeAssessment,
  chatWithAI,
};
