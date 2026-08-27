const axios = require("axios");

const AI_ENGINE_URL = process.env.AI_ENGINE_URL;

// =====================================================
// GENERATE ASSESSMENT QUESTIONS
// =====================================================

const generateAssessment = async (profile) => {
  try {
    const response = await axios.post(
      `${AI_ENGINE_URL}/assessment/generate`,
      {
        profile,
      },
      {
        timeout: 60000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI assessment generation error:",
      error.response?.data || error.message
    );

    throw new Error(
      "AI Engine assessment generation service unavailable"
    );
  }
};


// =====================================================
// ANALYZE ASSESSMENT
// =====================================================

const analyzeAssessment = async (assessmentData) => {
  try {
    const response = await axios.post(
      `${AI_ENGINE_URL}/assessment`,
      assessmentData,
      {
        timeout: 60000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI assessment error:",
      error.response?.data || error.message
    );

    throw new Error(
      "AI Engine assessment service unavailable"
    );
  }
};


// =====================================================
// AI CHAT
// =====================================================

const chatWithAI = async (chatData) => {
  try {
    const response = await axios.post(
      `${AI_ENGINE_URL}/chat`,
      chatData,
      {
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI chat error:",
      error.response?.data || error.message
    );

    throw new Error(
      "AI Engine chat service unavailable"
    );
  }
};


module.exports = {
  generateAssessment,
  analyzeAssessment,
  chatWithAI,
};