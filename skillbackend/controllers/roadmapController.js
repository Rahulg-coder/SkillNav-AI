const User = require("../models/User");

const {
  calculateSkillGap,
} = require("../services/skillGapService");

const {
  generateRoadmap,
} = require("../services/roadmapService");

const getRoadmap = async (
  req,
  res,
  next,
) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const skillGapData =
      await calculateSkillGap(userId);

    const roadmap =
      await generateRoadmap(
        userId,
        user.targetRole,
        skillGapData,
      );

    return res.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
};