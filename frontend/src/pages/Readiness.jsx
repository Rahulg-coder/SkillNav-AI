import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Readiness() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("skillpath_user_id");

  useEffect(() => {
    const fetchReadiness = async () => {
      if (!userId) {
        setError("User session not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await API.get(`/readiness?userId=${userId}`);
        
        if (!response.data.success) {
          setError(response.data.error || "Unable to load readiness data.");
          return;
        }

        setData(response.data.data);
      } catch (err) {
        console.error("Readiness fetch error:", err);
        setError(
          err.response?.data?.error || "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReadiness();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 mt-4">Analyzing your readiness...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="font-bold text-red-700">Unable to load readiness</h2>
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

  if (!data || !data.skills) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Target size={26} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-4">No Data Found</h2>
        <p className="text-slate-500 mt-2">
          Complete an assessment to generate your career readiness.
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

  const { score, level, targetRole, skills, milestones, learningProgress } = data;

  const strongCount = skills.filter(s => s.gap === 0).length;
  const gapCount = skills.filter(s => s.gap > 0).length;

  const strongSkills = skills.filter(s => s.gap === 0).map(s => s.name);
  const weakSkills = skills.filter(s => s.gap >= 30).map(s => s.name);
  
  let aiSummary = "";
  if (strongSkills.length > 0) {
    aiSummary += `Your foundations in ${strongSkills.join(" and ")} are strong. `;
  }
  if (weakSkills.length > 0) {
    aiSummary += `Your biggest readiness blockers are ${weakSkills.join(", ")}.`;
  }

  const nextActionMilestone = milestones.find(m => m.status === 'upcoming' || m.status === 'in-progress' || m.status === 'current');

  return (
    <div className="space-y-6">

      {/* Header */}
      <section>
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
          <Target size={17} />
          AI Career Analysis
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Career Readiness
        </h1>

        <p className="text-slate-500 mt-2">
          See how prepared you are for your target career and what you
          should focus on next.
        </p>
      </section>

      {/* Main readiness card */}
      <section className="bg-slate-950 rounded-3xl p-7 text-white">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Score */}
          <div className="flex items-center gap-6">

            <div className="relative w-36 h-36 shrink-0">

              <svg
                className="w-36 h-36 -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-slate-800"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * score) / 100}
                  strokeLinecap="round"
                  className="text-blue-500"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">
                  {score}%
                </span>

                <span className="text-xs text-slate-400">
                  Ready
                </span>
              </div>

            </div>

            <div>
              <p className="text-sm text-slate-400">
                Target Role
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {targetRole || "Career"}
              </h2>

              <p className="text-sm text-slate-400 mt-3">
                {level === "Excellent" ? "You're exceptionally prepared." : 
                 level === "Good" ? "You're making good progress toward your target career." :
                 level === "Needs Improvement" ? "You have some work to do to be ready." :
                 "You are just getting started."}
              </p>
            </div>

          </div>

          {/* AI assessment */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

            <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold">
              <Sparkles size={17} />
              AI READINESS INSIGHT
            </div>

            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {aiSummary || "We have analyzed your readiness based on your latest assessment."}
            </p>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Skills Strong
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {strongCount}
          </p>

          <div className="flex items-center gap-1 text-sm text-emerald-600 mt-3">
            <CheckCircle2 size={15} />
            Good foundation
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Skill Gaps
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {gapCount}
          </p>

          <div className="flex items-center gap-1 text-sm text-red-600 mt-3">
            <CircleAlert size={15} />
            Needs attention
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Learning Progress
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {learningProgress}%
          </p>

          <div className="flex items-center gap-1 text-sm text-blue-600 mt-3">
            <TrendingUp size={15} />
            Improving
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Estimated Time
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            --
          </p>

          <div className="flex items-center gap-1 text-sm text-slate-500 mt-3">
            <Clock3 size={15} />
            Remaining
          </div>
        </div>

      </section>

      {/* Skill readiness */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center gap-2 mb-6">

          <Brain size={20} className="text-blue-600" />

          <div>
            <h2 className="font-bold text-slate-900">
              Skill Readiness
            </h2>

            <p className="text-sm text-slate-500">
              Your readiness across important career skills
            </p>
          </div>

        </div>

        <div className="space-y-5">

          {skills.map((skill) => (

            <div key={skill.name}>

              <div className="flex justify-between mb-2">

                <div>
                  <span className="text-sm font-semibold text-slate-800">
                    {skill.name}
                  </span>

                  <span
                    className={`ml-2 text-xs ${
                      skill.currentLevel >= 70
                        ? "text-emerald-600"
                        : skill.currentLevel >= 40
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {skill.gap === 0 ? "Strong" : skill.gap >= 30 ? "Needs Work" : "Learning"}
                  </span>
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {skill.currentLevel}%
                </span>

              </div>

              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className={`h-full rounded-full ${
                    skill.currentLevel >= 70
                      ? "bg-emerald-500"
                      : skill.currentLevel >= 40
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${skill.currentLevel}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Milestones */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h2 className="font-bold text-slate-900">
            Career Milestones
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your journey toward career readiness
          </p>

          <div className="mt-6 space-y-5">

            {milestones.length === 0 ? (
               <p className="text-sm text-slate-500">No milestones found.</p>
            ) : milestones.map((item) => (

              <div
                key={item.title}
                className="flex items-center gap-4"
              >

                {item.status === "completed" ? (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                ) : item.status === "current" || item.status === "in-progress" ? (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Brain size={18} />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Target size={17} />
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>

                  <p className="text-xs text-slate-400 mt-1 capitalize">
                    {item.status === "in-progress" ? "current" : item.status}
                  </p>
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Next action */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

          <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
            <Sparkles size={17} />
            AI NEXT ACTION
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-4">
            {nextActionMilestone ? `Complete ${nextActionMilestone.title}` : "Continue Learning"}
          </h2>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Completing your next milestone will increase your career
            readiness and unlock the next stages of your roadmap.
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
            <Clock3 size={16} />
            Estimated: {nextActionMilestone?.duration || "--"}
          </div>

          <button
            onClick={() =>
              navigate("/roadmap")
            }
            className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Continue Learning
            <ArrowRight size={17} />
          </button>

        </div>

      </section>

      {/* Final AI message */}
      <section className="bg-slate-950 rounded-2xl p-6 text-white">

        <div className="flex gap-4">

          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
            <Sparkles size={21} />
          </div>

          <div>

            <h2 className="font-bold">
              Your path is personalized continuously
            </h2>

            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              SkillPath-AI doesn't give every learner the same roadmap.
              Your recommendations can change as your skills,
              assessment results, learning progress and goals change.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Readiness;