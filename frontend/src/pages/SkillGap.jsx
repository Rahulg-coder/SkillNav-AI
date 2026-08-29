import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function SkillGap() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("skillpath_user_id");

  useEffect(() => {
    const fetchSkillGap = async () => {
      if (!userId) {
        setError("User session not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await API.get(`/skill-gap?userId=${userId}`);

        if (!response.data.success) {
          setError(response.data.error || "Unable to load skill gap data.");
          return;
        }

        setData(response.data.data);
      } catch (err) {
        console.error("Skill gap error:", err);
        setError(
          err.response?.data?.error || "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, [userId]);

  const getStatus = (gap) => {
    if (gap >= 30) {
      return {
        label: "Skill Gap",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: CircleAlert,
        type: "gap"
      };
    }

    if (gap > 0) {
      return {
        label: "Learning",
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: TrendingUp,
        type: "learning"
      };
    }

    return {
      label: "Strong",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle2,
      type: "strong"
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 mt-4">Analyzing your skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="font-bold text-red-700">Unable to load skill gap</h2>
        <p className="text-sm text-red-600 mt-2">{error}</p>
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

  if (!data || !data.skills || data.skills.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Brain size={26} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-4">No Skill Data Found</h2>
        <p className="text-slate-500 mt-2">
          Complete an assessment to generate your skill gap analysis.
        </p>
        <button
          onClick={() => navigate("/assessment")}
          className="mt-6 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Take Assessment
        </button>
      </div>
    );
  }

  const { targetRole, overallScore, skills, topPriority } = data;

  // Build AI analysis string
  const strongSkills = skills.filter(s => s.gap === 0).map(s => s.name);
  const weakSkills = skills.filter(s => s.gap >= 30).map(s => s.name);

  let aiSummary = "";
  if (strongSkills.length > 0) {
    aiSummary += `You already have strong foundations in ${strongSkills.join(" and ")}. `;
  }
  if (weakSkills.length > 0) {
    aiSummary += `Your biggest gaps are ${weakSkills.join(", ")}. `;
  }
  if (topPriority) {
    aiSummary += `${topPriority} should be your next priority to reach your target career goals.`;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <section>
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
          <Brain size={17} />
          AI Skill Analysis
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Your Skill Gap
        </h1>

        <p className="text-slate-500 mt-2">
          SkillPath-AI compares your current abilities with the skills
          required for your target career.
        </p>
      </section>

      {/* Target Role */}
      <section className="bg-slate-950 rounded-2xl p-6 text-white">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Target size={23} />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Target Career
              </p>

              <h2 className="text-xl font-bold mt-1">
                {targetRole}
              </h2>
            </div>

          </div>

          <div>
            <p className="text-sm text-slate-400">
              Overall Skill Match
            </p>

            <p className="text-3xl font-bold mt-1">
              {overallScore}%
            </p>
          </div>

        </div>

      </section>

      {/* AI Summary */}
      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

        <div className="flex gap-4">

          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              AI Analysis
            </h2>

            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {aiSummary || "We have analyzed your skills and prepared recommendations for your learning journey."}
            </p>

          </div>

        </div>

      </section>

      {/* Skill Cards */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Skill Breakdown
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current level vs target level
            </p>
          </div>

          <span className="text-sm text-slate-400">
            {skills.length} skills analyzed
          </span>

        </div>

        <div className="space-y-7">

          {skills.map((skill) => {

            const status = getStatus(skill.gap);
            const StatusIcon = status.icon;

            return (
              <div key={skill.name}>

                {/* Skill header */}
                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-3">

                    <h3 className="font-semibold text-slate-800">
                      {skill.name}
                    </h3>

                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                    >
                      <StatusIcon size={13} />
                      {status.label}
                    </span>

                  </div>

                  <div className="text-sm">
                    <span className="font-semibold text-slate-800">
                      {skill.currentLevel}%
                    </span>

                    <span className="text-slate-400">
                      {" "}
                      / {skill.requiredLevel}%
                    </span>
                  </div>

                </div>

                {/* Progress */}
                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">

                  {/* Current level */}
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full ${status.type === "strong"
                      ? "bg-emerald-500"
                      : status.type === "learning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                      }`}
                    style={{
                      width: `${skill.currentLevel}%`,
                    }}
                  />

                  {/* Required marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-slate-800"
                    style={{
                      left: `${skill.requiredLevel}%`,
                    }}
                  />

                </div>

                <div className="flex justify-between mt-2">

                  <p className="text-xs text-slate-400">
                    Current proficiency
                  </p>

                  <p className="text-xs text-slate-400">
                    Target: {skill.requiredLevel}%
                  </p>

                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {status.type === "strong"
                    ? "You have reached the required level."
                    : status.type === "learning"
                      ? "You are building this skill."
                      : `${skill.name} is currently a skill gap.`}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* Priority Gaps */}
      <section>

        <div className="flex items-center gap-2 mb-4">
          <CircleAlert size={19} className="text-red-500" />

          <h2 className="text-lg font-bold text-slate-900">
            Priority Skill Gaps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {skills
            .filter((skill) => getStatus(skill.gap).type === "gap")
            .slice(0, 3)
            .map((skill, index) => (

              <div
                key={skill.name}
                className="bg-white border border-slate-200 rounded-2xl p-5"
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    Priority {index + 1}
                  </span>

                  <span className="text-sm text-slate-400">
                    Gap: {skill.gap}%
                  </span>

                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-4">
                  {skill.name}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Current: {skill.currentLevel}% · Target: {skill.requiredLevel}%
                </p>

                <button
                  onClick={() => navigate("/roadmap")}
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View recommended learning
                  <ArrowRight size={16} />
                </button>

              </div>

            ))}

        </div>

      </section>

    </div>
  );
}

export default SkillGap;