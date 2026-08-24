const { calculateSkillGap } = require("../services/skillGapService");

const { calculateReadiness } = require("../services/readinessService");

const getReadiness = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const skillGapData = await calculateSkillGap(userId);

    const readiness = await calculateReadiness(userId, skillGapData);

    res.json({
      success: true,
      data: readiness,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReadiness,
};
