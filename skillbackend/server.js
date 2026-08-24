require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const dashboardRoutes = require("./routes/dashboardRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const readinessRoutes = require("./routes/readinessRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const chatRoutes = require("./routes/chatRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillNav Backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "SkillNav Backend",
    status: "healthy",
  });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/readiness", readinessRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/ai/chat", chatRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SkillNav Backend running on port ${PORT}`);
});
