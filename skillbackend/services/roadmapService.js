const Roadmap = require("../models/Roadmap");
const Assessment = require("../models/Assessment");

const generateRoadmap = async (
  userId,
  targetRole,
  skillGapData,
) => {
  // =====================================================
  // GET LATEST AI ASSESSMENT
  // =====================================================

  const latestAssessment =
    await Assessment.findOne({
      userId,
      status: "completed",
    }).sort({
      createdAt: -1,
    });

  const aiAnalysis =
    latestAssessment?.aiAnalysis || {};

  const aiRoadmap =
    Array.isArray(aiAnalysis.roadmap)
      ? aiAnalysis.roadmap
      : [];

  // =====================================================
  // IF AI ROADMAP EXISTS
  // =====================================================

  let phases = [];

  if (aiRoadmap.length > 0) {
    phases = aiRoadmap.map(
      (item, index) => ({
        title:
          item.milestone ||
          `Learning Phase ${index + 1}`,

        description:
          Array.isArray(item.topics) &&
          item.topics.length > 0
            ? `Learn ${item.topics.join(", ")}.`
            : "Build the skills required for your target role.",

        order: index + 1,

        duration:
          item.duration || "",

        prerequisites:
          Array.isArray(item.prerequisites)
            ? item.prerequisites
            : [],

        status:
          index === 0
            ? "in-progress"
            : "pending",

        skills:
          Array.isArray(item.topics)
            ? item.topics
            : [],

        progress: 0,

        resources:
          Array.isArray(item.topics)
            ? item.topics.length
            : 0,
      }),
    );
  }

  // =====================================================
  // FALLBACK
  // =====================================================

  if (phases.length === 0) {
    const highPrioritySkills =
      skillGapData.skills.filter(
        (skill) =>
          skill.priority === "high",
      );

    const mediumPrioritySkills =
      skillGapData.skills.filter(
        (skill) =>
          skill.priority === "medium",
      );

    if (highPrioritySkills.length > 0) {
      phases.push({
        title:
          "Critical Skill Development",

        description:
          "Focus on the highest-priority skill gaps identified from your profile.",

        order: 1,

        duration: "",

        prerequisites: [],

        status: "in-progress",

        skills:
          highPrioritySkills.map(
            (skill) => skill.name,
          ),

        progress: 0,

        resources:
          highPrioritySkills.length,
      });
    }

    if (mediumPrioritySkills.length > 0) {
      phases.push({
        title:
          "Intermediate Skill Development",

        description:
          "Strengthen skills with medium-level gaps.",

        order: phases.length + 1,

        duration: "",

        prerequisites:
          phases.length > 0
            ? [
                phases[0].title,
              ]
            : [],

        status: "pending",

        skills:
          mediumPrioritySkills.map(
            (skill) => skill.name,
          ),

        progress: 0,

        resources:
          mediumPrioritySkills.length,
      });
    }

    phases.push({
      title:
        "Interview Preparation",

      description:
        "Prepare for technical and behavioral interviews.",

      order: phases.length + 1,

      duration: "",

      prerequisites:
        phases.length > 0
          ? [phases[phases.length - 1].title]
          : [],

      status: "pending",

      skills: [
        "Problem Solving",
        "Communication",
        "Interview Preparation",
      ],

      progress: 0,

      resources: 3,
    });
  }

  // =====================================================
  // PRESERVE EXISTING PROGRESS
  // =====================================================

  const existingRoadmap =
    await Roadmap.findOne({
      userId,
    });

  if (existingRoadmap) {
    phases = phases.map(
      (newPhase) => {
        const oldPhase =
          existingRoadmap.phases.find(
            (phase) =>
              phase.title ===
              newPhase.title,
          );

        if (!oldPhase) {
          return newPhase;
        }

        return {
          ...newPhase,
          progress:
            oldPhase.progress || 0,

          status:
            oldPhase.status ||
            newPhase.status,
        };
      },
    );
  }

  // =====================================================
  // CALCULATE OVERALL PROGRESS
  // =====================================================

  const overallProgress =
    phases.length === 0
      ? 0
      : Math.round(
          phases.reduce(
            (sum, phase) =>
              sum + phase.progress,
            0,
          ) / phases.length,
        );

  // =====================================================
  // SAVE ROADMAP
  // =====================================================

  const roadmap =
    await Roadmap.findOneAndUpdate(
      { userId },

      {
        userId,

        title:
          `${targetRole} Career Roadmap`,

        targetRole,

        overallProgress,

        phases,
      },

      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

  return roadmap;
};

module.exports = {
  generateRoadmap,
};