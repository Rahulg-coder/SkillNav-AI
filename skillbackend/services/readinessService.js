const Assessment = require("../models/Assessment");
const Roadmap = require("../models/Roadmap");

const calculateReadiness = async (userId, skillGapData) => {
  const latestAssessment = await Assessment.findOne({ userId }).sort({
    createdAt: -1,
  });

  const skillScore = skillGapData.overallScore || 0;
  const assessmentScore = latestAssessment?.score || 0;
  const readinessScore = Math.round(skillScore * 0.6 + assessmentScore * 0.4);

  let level;
  if (readinessScore >= 80) {
    level = "Excellent";
  } else if (readinessScore >= 65) {
    level = "Good";
  } else if (readinessScore >= 50) {
    level = "Needs Improvement";
  } else {
    level = "Not Ready";
  }

  // Get roadmap data
  const roadmap = await Roadmap.findOne({ userId });
  let milestones = [];
  let learningProgress = 0;
  
  if (roadmap && roadmap.phases) {
    learningProgress = roadmap.overallProgress || 0;
    milestones = roadmap.phases.map(phase => ({
      title: phase.title,
      status: phase.status,
      duration: phase.duration
    }));
  }

  return {
    score: readinessScore,
    level,
    targetRole: skillGapData.targetRole,
    skills: skillGapData.skills, // array of skills with currentLevel, requiredLevel, gap
    milestones,
    learningProgress
  };
};

module.exports = {
  calculateReadiness,
};
