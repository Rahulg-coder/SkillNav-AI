const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    currentLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    requiredLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },

    category: {
      type: String,
      default: "technical",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Skill", skillSchema);
