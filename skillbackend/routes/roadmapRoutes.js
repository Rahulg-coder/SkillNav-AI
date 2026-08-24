const express = require("express");

const { getRoadmap } = require("../controllers/roadmapController");

const router = express.Router();

router.get("/", getRoadmap);

module.exports = router;
