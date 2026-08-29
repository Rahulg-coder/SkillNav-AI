const express = require("express");

const {
  generateAssessment,
  submitAssessment,
} = require("../controllers/assessmentController");

const { assessmentLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/generate", assessmentLimiter, generateAssessment);

router.post("/", assessmentLimiter, submitAssessment);

module.exports = router;