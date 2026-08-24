const User = require("../models/User");
const Assessment = require("../models/Assessment");

const { analyzeAssessment } = require("../services/aiService");

const submitAssessment = async (req, res, next) => {
  try {
    const { userId, targetRole, answers } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        error: "targetRole is required",
      });
    }

    if (!answers) {
      return res.status(400).json({
        success: false,
        error: "answers are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const assessment = await Assessment.create({
      userId,
      targetRole,
      answers,
      status: "pending",
    });

    try {
      const aiResult = await analyzeAssessment({
        userId,
        targetRole,
        answers,
      });

      assessment.score = aiResult.score || 0;

      assessment.aiAnalysis = aiResult;

      assessment.status = "completed";

      await assessment.save();

      return res.status(201).json({
        success: true,

        data: {
          assessmentId: assessment._id,

          score: assessment.score,

          analysis: assessment.aiAnalysis,

          status: assessment.status,
        },
      });
    } catch (aiError) {
      assessment.status = "failed";

      await assessment.save();

      return res.status(503).json({
        success: false,

        error: "Assessment saved but AI analysis is currently unavailable",

        assessmentId: assessment._id,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAssessment,
};
