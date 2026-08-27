const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    targetRole: {
      type: String,
      default: "Software Developer",
      trim: true,
    },

    experience: {
      type: String,
      default: "Beginner",
      enum: ["Beginner", "Intermediate", "Advanced"],
    },

    skills: {
      type: String,
      default: "",
      trim: true,
    },

    learningHours: {
      type: String,
      default: "1-2",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);