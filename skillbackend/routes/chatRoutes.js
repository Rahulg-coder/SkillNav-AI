const express = require("express");

const { sendMessage, getChatHistory } = require("../controllers/chatController");

const router = express.Router();

router.get("/", getChatHistory);
router.post("/", sendMessage);

module.exports = router;
