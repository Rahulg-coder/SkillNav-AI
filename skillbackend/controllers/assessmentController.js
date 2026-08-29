const User = require("../models/User");
const Assessment = require("../models/Assessment");

const {
  generateAssessment: generateAssessmentFromAI,
  analyzeAssessment,
} = require("../services/aiService");


// =====================================================
// GENERATE ASSESSMENT QUESTIONS
// =====================================================

const generateAssessment = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const profile = {
      name: user.name,
      targetRole: user.targetRole,
      experience: user.experience,
      skills: user.skills || "",
      learningHours: user.learningHours || "",
      profileCompleted: user.profileCompleted,
    };

    try {
      const aiResult =
        await generateAssessmentFromAI(profile);

      return res.json({
        success: true,
        data: aiResult,
      });

    } catch (aiError) {
      console.error(
        "Assessment generation error:",
        aiError.message
      );

      return res.status(503).json({
        success: false,
        error:
          "AI question generation service unavailable",
      });
    }

  } catch (error) {
    next(error);
  }
};


// =====================================================
// SUBMIT + ANALYZE ASSESSMENT
// =====================================================

const submitAssessment = async (req, res, next) => {
  try {
    const {
      userId,
      targetRole,
      answers,
    } = req.body;

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

    // -------------------------------------------------
    // Create pending assessment
    // -------------------------------------------------

    const assessment = await Assessment.create({
      userId,
      targetRole,
      answers,
      status: "pending",
    });

    // -------------------------------------------------
    // Send to AI Engine
    // -------------------------------------------------

    try {
      const aiResult = await analyzeAssessment({
        profile: {
          name: user.name,
          targetRole,
          experience: user.experience,
          skills: user.skills || "",
          learningHours:
            user.learningHours || "",
          profileCompleted:
            user.profileCompleted,
        },
        answers,
      });

      assessment.score =
        aiResult.score || 0;

      assessment.aiAnalysis =
        aiResult;

      assessment.status =
        "completed";

      await assessment.save();

      // -------------------------------------------------
      // PERSIST SKILL DATA
      // -------------------------------------------------
      const Skill = require("../models/Skill");

      console.log("Persisting assessment skills for user:", userId);
      console.log("Strengths received:", aiResult.strengths);
      console.log("Skill gaps received:", aiResult.skillGaps);

      if (aiResult.strengths && Array.isArray(aiResult.strengths)) {
        for (const strength of aiResult.strengths) {
          await Skill.findOneAndUpdate(
            { userId, name: strength },
            { currentLevel: 85, requiredLevel: 80, category: "technical" },
            { upsert: true, new: true }
          );
          console.log("Skill upsert completed:", strength);
        }
      }

      if (aiResult.skillGaps && Array.isArray(aiResult.skillGaps)) {
        for (const gap of aiResult.skillGaps) {
          let currentLevel = 50;
          const prio = (gap.priority || "").toLowerCase();
          if (prio.includes("high")) currentLevel = 20;
          else if (prio.includes("low")) currentLevel = 70;

          await Skill.findOneAndUpdate(
            { userId, name: gap.skill },
            { currentLevel, requiredLevel: 80, category: "technical" },
            { upsert: true, new: true }
          );
          console.log("Skill upsert completed:", gap.skill);
        }
      }

      const savedSkills = await Skill.find({ userId });
      console.log("Skills found after assessment:", savedSkills.length);
      console.log(savedSkills);

      return res.status(201).json({
        success: true,

        data: {
          assessmentId:
            assessment._id,

          score:
            assessment.score,

          analysis:
            assessment.aiAnalysis,

          status:
            assessment.status,
        },
      });

    } catch (aiError) {

      console.error(
        "AI assessment analysis error:",
        aiError.message
      );

      assessment.status =
        "failed";

      await assessment.save();

      return res.status(503).json({
        success: false,

        error:
          "Assessment saved but AI analysis is currently unavailable",

        assessmentId:
          assessment._id,
      });
    }

  } catch (error) {
    next(error);
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  generateAssessment,
  submitAssessment,
};