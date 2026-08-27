const Chat = require("../models/Chat");
const User = require("../models/User");

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
      // Send request to AI service
      const aiResponse = await chatWithAI({
        message: message.trim(),

        profile: {
          name: user.name,
          targetRole: user.targetRole,
          experience: user.experience,
          profileCompleted: user.profileCompleted,
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

module.exports = {
  sendMessage,
};