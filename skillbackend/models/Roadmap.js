const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  order: {
    type: Number,
    required: true,
  },

  duration: {
    type: String,
    default: "",
  },

  prerequisites: [
    {
      type: String,
    },
  ],

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },

  skills: [
    {
      type: String,
    },
  ],

  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },

  resources: {
    type: Number,
    default: 0,
  },

  score: {
    type: Number,
    default: null,
  },

  completedAt: {
    type: Date,
    default: null,
  },
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    phases: [phaseSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Roadmap", roadmapSchema);