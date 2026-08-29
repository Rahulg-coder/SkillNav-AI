const Chat = require("../models/Chat");
const User = require("../models/User");
const Assessment = require("../models/Assessment");
const Roadmap = require("../models/Roadmap");
const { calculateSkillGap } = require("../services/skillGapService");
const { calculateReadiness } = require("../services/readinessService");

const { chatWithAI } = require("../services/aiService");

const sendMessage = async (req, res, next) => {
  try {
    const { userId, message } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "message is required",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      userId,
    });

    // Create chat if it doesn't exist
    if (!chat) {
      chat = await Chat.create({
        userId,
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({
      role: "user",
      message: message.trim(),
    });

    await chat.save();

    // Prepare conversation history
    const history = chat.messages.map((item) => ({
      role: item.role,
      message: item.message,
    }));

    try {
      // Fetch comprehensive user context
      const assessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });
      const roadmap = await Roadmap.findOne({ userId });
      let skillGapData = {};
      let readinessData = {};
      try {
        skillGapData = await calculateSkillGap(userId);
        readinessData = await calculateReadiness(userId, skillGapData);
      } catch (err) {
        console.error("Context fetch error:", err.message);
      }

      // Send request to AI service
      const aiResponse = await chatWithAI({
        message: message.trim(),

        profile: {
          name: user.name,
          targetRole: user.targetRole,
          experience: user.experience,
          profileCompleted: user.profileCompleted,
          assessment: assessment ? {
            score: assessment.score,
            strengths: assessment.aiAnalysis?.strengths,
            skillGaps: assessment.aiAnalysis?.skillGaps,
          } : null,
          skills: skillGapData?.skills || [],
          readiness: readinessData ? { score: readinessData.score, level: readinessData.level } : null,
          roadmap: roadmap ? (() => {
            const inProgressIdx = roadmap.phases?.findIndex(p => p.status === 'in-progress' || p.status === 'current') ?? -1;
            
            let currentPhase = null;
            let nextPhase = null;
            let completedPhases = [];

            if (roadmap.phases) {
               completedPhases = roadmap.phases.filter(p => p.status === 'completed').map(p => p.title);
            }

            if (inProgressIdx !== -1) {
              currentPhase = {
                title: roadmap.phases[inProgressIdx].title,
                status: roadmap.phases[inProgressIdx].status
              };
              if (inProgressIdx + 1 < roadmap.phases.length) {
                nextPhase = {
                  title: roadmap.phases[inProgressIdx + 1].title,
                  status: roadmap.phases[inProgressIdx + 1].status
                };
              }
            } else if (roadmap.phases) {
              const pendingIdx = roadmap.phases.findIndex(p => p.status === 'pending');
              if (pendingIdx !== -1) {
                nextPhase = {
                  title: roadmap.phases[pendingIdx].title,
                  status: roadmap.phases[pendingIdx].status
                };
              }
            }

            return {
              overallProgress: roadmap.overallProgress,
              completedPhases,
              currentPhase,
              nextPhase
            };
          })() : null
        },

        history,
      });

      // Extract AI response
      const reply =
        aiResponse.reply ||
        aiResponse.message ||
        "Unable to generate response";

      // Save AI response
      chat.messages.push({
        role: "assistant",
        message: reply,
      });

      await chat.save();

      // Send response to frontend
      return res.json({
        success: true,

        data: {
          reply,
          chatId: chat._id,
        },
      });

    } catch (aiError) {
      console.error("AI Service Error:", aiError);

      return res.status(503).json({
        success: false,
        error: "AI service is currently unavailable",
      });
    }

  } catch (error) {
    console.error("Chat Controller Error:", error);

    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }
    const chat = await Chat.findOne({ userId });
    res.json({
      success: true,
      data: { messages: chat ? chat.messages : [] }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
};