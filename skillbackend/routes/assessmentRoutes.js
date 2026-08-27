const express = require("express");

const {
  generateAssessment,
  submitAssessment,
} = require("../controllers/assessmentController");

const router = express.Router();

router.post("/generate", generateAssessment);

router.post("/", submitAssessment);

module.exports = router;