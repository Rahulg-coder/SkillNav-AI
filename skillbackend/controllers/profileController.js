const User = require("../models/User");

const updateProfile = async (req, res, next) => {
  try {
    const {
      userId,
      goal,
      experience,
      skills,
      hours,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    if (!goal) {
      return res.status(400).json({
        success: false,
        error: "Career goal is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update learner profile
    user.targetRole = goal;
    user.experience = experience || "Beginner";
    user.skills = skills || "";
    user.learningHours = hours || "1-2";
    user.profileCompleted = true;

    await user.save();

    return res.json({
      success: true,
      message: "Learning profile updated successfully",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experience: user.experience,
          skills: user.skills,
          learningHours: user.learningHours,
          profileCompleted: user.profileCompleted,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
};