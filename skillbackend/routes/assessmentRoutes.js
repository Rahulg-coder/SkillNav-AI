const express = require("express");

const { submitAssessment } = require("../controllers/assessmentController");

const router = express.Router();

router.post("/", submitAssessment);

module.exports = router;
