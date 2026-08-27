const express = require("express");

const {
  updateProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.put("/", updateProfile);

module.exports = router;