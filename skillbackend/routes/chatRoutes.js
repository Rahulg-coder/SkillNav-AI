const express = require("express");

const { sendMessage, getChatHistory } = require("../controllers/chatController");
const { aiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.get("/", getChatHistory);
router.post("/", aiLimiter, sendMessage);

module.exports = router;
