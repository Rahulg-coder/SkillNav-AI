const Assessment = require("../models/Assessment");

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

  const strengths = skillGapData.skills
    .filter((skill) => skill.gap < 15)
    .map((skill) => skill.name);

  const improvements = skillGapData.skills
    .filter((skill) => skill.gap >= 15)
    .map((skill) => skill.name);

  return {
    score: readinessScore,
    level,
    strengths,
    improvements,
  };
};

module.exports = {
  calculateReadiness,
};
