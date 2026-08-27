import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("skillpath_user_id");
  const userName =
    localStorage.getItem("skillpath_user_name") || "Learner";

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!userId) {
        setError("User session not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await API.get(
          `/dashboard?userId=${userId}`
        );

        if (!response.data.success) {
          setError(
            response.data.error || "Unable to load dashboard."
          );
          return;
        }

        setDashboard(response.data.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.error ||
            "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-4">
            Loading your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="font-bold text-red-700">
          Unable to load dashboard
        </h2>

        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>

        {!userId && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Login Again
          </button>
        )}
      </div>
    );
  }

  const user = dashboard?.user || {};

  const readinessScore = dashboard?.readinessScore || 0;
  const roadmapProgress = dashboard?.roadmapProgress || 0;

  return (
    <div className="space-y-6">

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
            <Sparkles size={16} />
            AI-powered learning assistant
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Good morning, {user.name || userName} 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Here's what your AI mentor recommends for your
            learning journey.
          </p>

          {user.targetRole && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              <Target size={15} />
              {user.targetRole}
            </div>
          )}

        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3 size={16} />

          <span>
            Your personalized learning dashboard
          </span>
        </div>

      </section>


      {/* =====================================================
          TOP STATS
      ===================================================== */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Career Readiness */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Career Readiness
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {readinessScore}%
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Target size={24} />
            </div>

          </div>

          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{
                width: `${Math.min(readinessScore, 100)}%`,
              }}
            />

          </div>

          <p className="text-xs text-slate-500 mt-2">
            {readinessScore === 0
              ? "Complete the assessment to calculate your readiness."
              : `${100 - readinessScore}% remaining to reach your target role`}
          </p>

        </div>


        {/* Roadmap Progress */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Learning Progress
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {roadmapProgress}%
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Brain size={24} />
            </div>

          </div>

          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{
                width: `${Math.min(roadmapProgress, 100)}%`,
              }}
            />

          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

            <TrendingUp size={16} />

            <span>
              {roadmapProgress === 0
                ? "Your roadmap will appear after AI generation."
                : "Keep progressing through your roadmap."}
            </span>

          </div>

        </div>


        {/* Profile Status */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Learning Profile
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {dashboard?.profileCompleted ? "Ready" : "Incomplete"}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Zap size={24} />
            </div>

          </div>

          <p className="text-sm text-slate-500 mt-4">
            {dashboard?.profileCompleted
              ? "Your learning profile is successfully configured."
              : "Complete onboarding to personalize your journey."}
          </p>

        </div>

      </section>


      {/* =====================================================
          AI NEXT ACTION
      ===================================================== */}

      <section className="relative overflow-hidden rounded-2xl bg-slate-950 text-white p-6">

        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative">

          <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold">
            <Sparkles size={17} />
            AI NEXT BEST ACTION
          </div>

          <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="max-w-2xl">

              <h2 className="text-2xl font-bold">
                {readinessScore === 0
                  ? "Take your first AI assessment"
                  : "Continue your personalized learning"}
              </h2>

              <p className="text-slate-300 mt-2 leading-relaxed">

                {readinessScore === 0
                  ? `Complete an assessment so SkillPath-AI can identify your skill gaps for ${user.targetRole || "your target role"}.`
                  : "Your AI mentor will use your profile, assessment results and learning progress to recommend your next best action."}

              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  AI Personalized
                </span>

                {user.targetRole && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    {user.targetRole}
                  </span>
                )}

                <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  Profile Ready
                </span>

              </div>

            </div>

            <button
              onClick={() => navigate("/assessment")}
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              {readinessScore === 0
                ? "Start Assessment"
                : "Continue Learning"}

              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROFILE SUMMARY + ROADMAP
      ===================================================== */}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Profile */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Your Skill Profile
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Information collected during onboarding
              </p>

            </div>

            <Brain size={20} className="text-blue-600" />

          </div>

          <div className="space-y-4">

            <div className="p-4 bg-slate-50 rounded-xl">

              <p className="text-xs text-slate-400 uppercase font-semibold">
                Target Role
              </p>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {user.targetRole || "Not specified"}
              </p>

            </div>

            <div className="p-4 bg-slate-50 rounded-xl">

              <p className="text-xs text-slate-400 uppercase font-semibold">
                Experience Level
              </p>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {user.experience || "Not specified"}
              </p>

            </div>

            <div className="p-4 bg-slate-50 rounded-xl">

              <p className="text-xs text-slate-400 uppercase font-semibold">
                Profile Status
              </p>

              <div className="flex items-center gap-2 mt-1">

                <CheckCircle2
                  size={17}
                  className="text-emerald-500"
                />

                <p className="text-sm font-semibold text-emerald-600">
                  Profile Completed
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Learning Path */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Your Learning Path
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                AI-generated roadmap for your goal
              </p>

            </div>

            <button
              onClick={() => navigate("/learning-roadmap")}
              className="text-sm text-blue-600 font-medium flex items-center gap-1"
            >
              View Full Path
              <ChevronRight size={16} />
            </button>

          </div>

          {roadmapProgress === 0 ? (

            <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center">

              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles size={22} />
              </div>

              <h3 className="font-semibold text-slate-800 mt-4">
                Your AI roadmap is ready to be generated
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Complete the assessment to identify your skill
                gaps and generate a personalized learning roadmap.
              </p>

              <button
                onClick={() => navigate("/assessment")}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                Start Assessment
                <ArrowRight size={16} />
              </button>

            </div>

          ) : (

            <div className="p-5 bg-blue-50 rounded-xl">

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={22}
                  className="text-emerald-500"
                />

                <div>

                  <p className="font-semibold text-slate-800">
                    Roadmap in progress
                  </p>

                  <p className="text-sm text-slate-500">
                    {roadmapProgress}% completed
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          AI INSIGHT
      ===================================================== */}

      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <div className="flex gap-4">

          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Sparkles size={21} />
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              AI Learning Insight
            </h2>

            <p className="text-sm text-slate-600 mt-1 leading-relaxed">

              Your profile is now connected to SkillPath-AI.
              Once you complete the assessment, the AI engine
              will analyze your current skills against your target
              role and generate personalized skill gaps and
              learning recommendations.

            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          AI MENTOR CTA
      ===================================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center">
            <Sparkles size={22} />
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              Ask your AI Mentor
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Get help with your roadmap, skills or learning resources.
            </p>

          </div>

        </div>

        <button
          onClick={() => navigate("/ai-mentor")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Start Conversation
          <ArrowRight size={18} />
        </button>

      </section>

    </div>
  );
}

export default Dashboard;