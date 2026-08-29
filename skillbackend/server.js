require("dotenv").config();

const express = require("express");
const cors = require("cors");
const learningRoutes = require("./routes/learningRoutes");
const connectDB = require("./config/db");
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const readinessRoutes = require("./routes/readinessRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const chatRoutes = require("./routes/chatRoutes");

const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");
const helmet = require("helmet");

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(helmet({ crossOriginResourcePolicy: false }));

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillNav Backend API is running",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "SkillNav Backend",
    status: "healthy",
  });
});

// =====================================================
// AUTHENTICATION
// =====================================================

app.use("/api/auth", authRoutes);
//============================================
//USER PROFILE
//============================================
app.use("/api/profile", authMiddleware, profileRoutes);

// =====================================================
// APPLICATION APIs
// =====================================================

app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/skill-gap", authMiddleware, skillGapRoutes);
app.use("/api/roadmap", authMiddleware, roadmapRoutes);
app.use("/api/readiness", authMiddleware, readinessRoutes);
app.use("/api/assessment", authMiddleware, assessmentRoutes);
app.use("/api/learning", authMiddleware, learningRoutes);

// =====================================================
// AI CHAT
// =====================================================

app.use("/api/ai/chat", authMiddleware, chatRoutes);

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SkillNav Backend running on port ${PORT}`);
});