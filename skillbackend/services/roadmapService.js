const Roadmap = require("../models/Roadmap");

const generateRoadmap = async (userId, targetRole, skillGapData) => {
  const highPrioritySkills = skillGapData.skills.filter(
    (skill) => skill.priority === "high",
  );

  const mediumPrioritySkills = skillGapData.skills.filter(
    (skill) => skill.priority === "medium",
  );

  const phases = [];

  if (highPrioritySkills.length > 0) {
    phases.push({
      title: "Critical Skill Development",

      description: "Focus on skills with the highest identified gaps.",

      order: 1,

      status: "in-progress",

      skills: highPrioritySkills.map((skill) => skill.name),

      progress: 0,
    });
  }

  if (mediumPrioritySkills.length > 0) {
    phases.push({
      title: "Intermediate Skill Development",

      description: "Improve skills with medium-level gaps.",

      order: 2,

      status: "pending",

      skills: mediumPrioritySkills.map((skill) => skill.name),

      progress: 0,
    });
  }

  phases.push({
    title: "Interview Preparation",

    description: "Prepare for technical and behavioral interviews.",

    order: phases.length + 1,

    status: "pending",

    skills: ["Problem Solving", "Communication", "Interview Preparation"],

    progress: 0,
  });

  const roadmap = await Roadmap.findOneAndUpdate(
    { userId },
    {
      userId,
      title: `${targetRole} Career Roadmap`,
      targetRole,
      phases,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return roadmap;
};

module.exports = {
  generateRoadmap,
};
