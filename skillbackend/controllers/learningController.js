const User = require("../models/User");
const Roadmap = require("../models/Roadmap");
const Skill = require("../models/Skill");
const {
  generateLearningContent,
} = require("../services/aiService");

const {
  searchYouTubeVideos,
  searchDocumentation,
} = require("../services/youtubeService");


// =====================================================
// GENERATE LEARNING CONTENT
// =====================================================

const getLearningContent = async (req, res, next) => {

  try {

    const {
      userId,
      phaseTitle,
      description,
      skills,
      duration,
      prerequisites,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!userId) {

      return res.status(400).json({
        success: false,
        error: "userId is required",
      });

    }


    if (!phaseTitle) {

      return res.status(400).json({
        success: false,
        error: "phaseTitle is required",
      });

    }


    // =================================================
    // FIND USER
    // =================================================

    const user =
      await User.findById(userId);


    if (!user) {

      return res.status(404).json({
        success: false,
        error: "User not found",
      });

    }


    // =================================================
    // GENERATE AI CONTENT
    // =================================================

    console.log(
      "Generating AI learning content for:",
      phaseTitle
    );


    const content =
      await generateLearningContent({

        profile: {

          name:
            user.name || "",

          targetRole:
            user.targetRole || "",

          experience:
            user.experience || "",

          skills:
            Array.isArray(user.skills)
              ? user.skills
              : [],

        },


        roadmap: {

          targetRole:
            user.targetRole || "",

        },


        phase: {

          title:
            phaseTitle,

          description:
            description || "",

          skills:
            Array.isArray(skills)
              ? skills
              : [],

          duration:
            duration || "",

          prerequisites:
            Array.isArray(prerequisites)
              ? prerequisites
              : [],

        },

      });


    // =================================================
    // VALIDATE AI RESPONSE
    // =================================================

    if (
      !content ||
      typeof content !== "object"
    ) {

      return res.status(500).json({

        success: false,

        error:
          "AI Engine returned invalid learning content",

      });

    }


    // =================================================
    // LEARNING RESOURCES
    // =================================================

    if (
      !Array.isArray(content.resources)
    ) {

      content.resources = [];

    }


    console.log(
      "Learning resources received:",
      content.resources.length
    );


    // =================================================
    // STEP 1
    // YOUTUBE ENRICHMENT
    // =================================================

    try {

      content.resources =
        await searchYouTubeVideos(
          content.resources
        );


      if (
        !Array.isArray(content.resources)
      ) {

        content.resources = [];

      }


      console.log(
        "YouTube resource enrichment completed"
      );

    }

    catch (error) {

      console.error(
        "YouTube enrichment failed:",
        error.message
      );

      // Don't destroy resources if YouTube fails

      if (
        !Array.isArray(content.resources)
      ) {

        content.resources = [];

      }

    }


    // =================================================
    // STEP 2
    // DOCUMENTATION ENRICHMENT
    // =================================================

    const documentationResources = [];


    for (
      const resource of content.resources
    ) {

      if (!resource) {
        continue;
      }


      // -----------------------------------------------
      // ONLY DOCUMENTATION RESOURCES
      // -----------------------------------------------

      if (
        resource.type === "documentation" ||
        resource.type === "docs" ||
        resource.type === "document"
      ) {

        try {

          const documentation =
            await searchDocumentation(
              resource
            );


          documentationResources.push({

            ...resource,

            title:
              documentation?.title ||
              resource.title ||
              "Documentation",

            description:
              documentation?.description ||
              resource.description ||
              "Official documentation resource.",

            url:
              documentation?.url ||
              resource.url ||
              "",

            displayLink:
              documentation?.displayLink ||
              resource.url ||
              "",

            source:
              documentation?.source ||
              resource.source ||
              null,

          });

        }

        catch (error) {

          console.error(
            "Documentation enrichment failed:",
            error.message
          );


          documentationResources.push(
            resource
          );

        }

      }

      else {

        // Keep video / other resources unchanged

        documentationResources.push(
          resource
        );

      }

    }


    content.resources =
      documentationResources;


    console.log(
      "Documentation resource enrichment completed"
    );


    // =================================================
    // FINAL RESOURCE DEBUG
    // =================================================

    // console.log("Final learning resources:");
    // content.resources.forEach((resource, index) => {
    //   console.log(`${index + 1}.`, {
    //     type: resource.type,
    //     title: resource.title,
    //     searchQuery: resource.searchQuery || null,
    //     url: resource.url || null,
    //     video: resource.video?.videoId || null,
    //     source: resource.source || null,
    //   });
    // });


    // =================================================
    // RESPONSE
    // =================================================

    return res.json({

      success: true,

      data: content,

    });

  }


  // ===================================================
  // ERROR HANDLER
  // ===================================================

  catch (error) {

    console.error(
      "Learning content error:",
      error.response?.data ||
      error.message
    );


    next(error);

  }

};
// =====================================================
// COMPLETE LEARNING MODULE
// =====================================================

const completeLearningModule = async (req, res, next) => {
  try {
    const {
      userId,
      phaseId,
      score,
    } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    if (!phaseId) {
      return res.status(400).json({
        success: false,
        error: "phaseId is required",
      });
    }

    if (
      typeof score !== "number" ||
      Number.isNaN(score)
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid score is required",
      });
    }

    if (score < 60) {
      return res.status(400).json({
        success: false,
        error: "Minimum score of 60% is required",
      });
    }

    if (score > 100) {
      return res.status(400).json({
        success: false,
        error: "Score cannot be greater than 100",
      });
    }

    // Find roadmap
    const roadmap = await Roadmap.findOne({
      userId,
      "phases._id": phaseId,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: "Roadmap or learning phase not found",
      });
    }

    // Find current phase
    const phaseIndex =
      roadmap.phases.findIndex(
        (phase) =>
          phase._id.toString() ===
          phaseId.toString()
      );

    if (phaseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Learning phase not found",
      });
    }

    const currentPhase =
      roadmap.phases[phaseIndex];

    // Complete current phase
    currentPhase.progress = 100;
    currentPhase.status = "completed";
    currentPhase.score = score;
    currentPhase.completedAt = new Date();

    // Update Skills (Adaptive Learning Loop)
    if (Array.isArray(currentPhase.skills) && currentPhase.skills.length > 0) {
      for (const skillName of currentPhase.skills) {
        const skillDoc = await Skill.findOne({
          userId,
          name: new RegExp(`^${skillName}$`, "i"),
        });

        if (skillDoc) {
          const newLevel = Math.min(skillDoc.currentLevel + 15, skillDoc.requiredLevel);
          if (newLevel > skillDoc.currentLevel) {
            skillDoc.currentLevel = newLevel;
            await skillDoc.save();
          }
        }
      }
    }

    // Unlock next phase
    let nextPhase = null;

    if (
      phaseIndex + 1 <
      roadmap.phases.length
    ) {
      nextPhase =
        roadmap.phases[phaseIndex + 1];

      if (
        nextPhase.status !== "completed"
      ) {
        nextPhase.status = "in-progress";
      }

      if (
        typeof nextPhase.progress !== "number"
      ) {
        nextPhase.progress = 0;
      }
    }

    // Calculate overall progress
    const totalPhases =
      roadmap.phases.length;

    const completedPhases =
      roadmap.phases.filter(
        (phase) =>
          phase.status === "completed"
      ).length;

    roadmap.overallProgress =
      totalPhases === 0
        ? 0
        : Math.round(
            (completedPhases /
              totalPhases) *
              100
          );

    // Save
    await roadmap.save();

    // Response
    return res.json({
      success: true,

      message:
        "Learning module completed successfully",

      data: {
        phaseId,
        score,

        overallProgress:
          roadmap.overallProgress,

        completedPhases,
        totalPhases,

        currentPhase: {
          _id: currentPhase._id,
          title: currentPhase.title,
          status: currentPhase.status,
          progress: currentPhase.progress,
        },

        nextPhase: nextPhase
          ? {
              _id: nextPhase._id,
              title: nextPhase.title,
              description:
                nextPhase.description,
              skills:
                nextPhase.skills,
              duration:
                nextPhase.duration,
              prerequisites:
                nextPhase.prerequisites,
              status:
                nextPhase.status,
              progress:
                nextPhase.progress,
            }
          : null,
      },
    });

  } catch (error) {
    console.error(
      "Complete learning module error:",
      error.message
    );

    next(error);
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getLearningContent,
  completeLearningModule,
};