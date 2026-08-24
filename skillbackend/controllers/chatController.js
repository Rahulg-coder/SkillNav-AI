const Chat = require("../models/Chat");

const { chatWithAI } = require("../services/aiService");

const sendMessage = async (req, res, next) => {
  try {
    const { userId, message } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "message is required",
      });
    }

    let chat = await Chat.findOne({
      userId,
    });

    if (!chat) {
      chat = await Chat.create({
        userId,
        messages: [],
      });
    }

    chat.messages.push({
      role: "user",
      message: message.trim(),
    });

    await chat.save();

    const history = chat.messages.map((item) => ({
      role: item.role,
      message: item.message,
    }));

    try {
      const aiResponse = await chatWithAI({
        userId,
        message: message.trim(),
        history,
      });

      const reply =
        aiResponse.reply || aiResponse.message || "Unable to generate response";

      chat.messages.push({
        role: "assistant",
        message: reply,
      });

      await chat.save();

      return res.json({
        success: true,

        data: {
          reply,
          chatId: chat._id,
        },
      });
    } catch (aiError) {
      return res.status(503).json({
        success: false,
        error: "AI service is currently unavailable",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
};
