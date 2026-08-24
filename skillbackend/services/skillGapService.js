const Skill = require("../models/Skill");

const calculateSkillGap = async (userId) => {
  const skills = await Skill.find({ userId });

  const processedSkills = skills.map((skill) => {
    const gap = Math.max(skill.requiredLevel - skill.currentLevel, 0);

    let priority = "low";

    if (gap >= 30) {
      priority = "high";
    } else if (gap >= 15) {
      priority = "medium";
    }

    return {
      id: skill._id,
      name: skill.name,
      currentLevel: skill.currentLevel,
      requiredLevel: skill.requiredLevel,
      gap,
      category: skill.category,
      priority,
    };
  });

  processedSkills.sort((a, b) => b.gap - a.gap);

  const overallScore =
    processedSkills.length === 0
      ? 0
      : Math.round(
          processedSkills.reduce((sum, skill) => sum + skill.currentLevel, 0) /
            processedSkills.length,
        );

  return {
    overallScore,
    totalSkills: processedSkills.length,
    skills: processedSkills,
    topPriority: processedSkills.length > 0 ? processedSkills[0].name : null,
  };
};

module.exports = {
  calculateSkillGap,
};
