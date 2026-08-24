const User = require("../models/User");
const Assessment = require("../models/Assessment");
const Roadmap = require("../models/Roadmap");

const getDashboard = async (req, res, next) => {
  try {
    const { userId } = req.query;

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

    const assessment = await Assessment.findOne({
      userId,
    }).sort({
      createdAt: -1,
    });

    const roadmap = await Roadmap.findOne({
      userId,
    });

    res.json({
      success: true,

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
        },

        overallScore: assessment?.score || 0,

        roadmapProgress: roadmap?.overallProgress || 0,

        readinessScore: assessment?.score || 0,

        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
