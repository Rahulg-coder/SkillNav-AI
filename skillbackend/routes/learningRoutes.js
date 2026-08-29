const express = require("express");

const {
  getLearningContent,
  completeLearningModule,
} = require("../controllers/learningController");

const router = express.Router();


// =====================================================
// GENERATE LEARNING CONTENT
// =====================================================

router.post(
  "/generate",
  getLearningContent
);


// =====================================================
// COMPLETE LEARNING MODULE
// =====================================================

router.post(
  "/complete",
  completeLearningModule
);


module.exports = router;