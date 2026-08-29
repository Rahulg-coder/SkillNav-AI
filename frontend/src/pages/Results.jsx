import {
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleAlert,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Results() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [strengths, setStrengths] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("skillpath_user_id");
        if (!userId) {
          setError("User session not found.");
          setLoading(false);
          return;
        }

        const [dashboardRes, skillGapRes, roadmapRes] = await Promise.all([
          API.get(`/dashboard?userId=${userId}`),
          API.get(`/skill-gap?userId=${userId}`),
          API.get(`/roadmap?userId=${userId}`)
        ]);

        if (dashboardRes.data?.success) {
          setScore(dashboardRes.data.data.overallScore);
        }

        if (skillGapRes.data?.success) {
          const skills = skillGapRes.data.data.skills || [];
          
          const str = skills.filter(s => s.gap === 0).map(s => s.name);
          setStrengths(str);

          const weak = skills.filter(s => s.gap > 0).sort((a, b) => b.gap - a.gap);
          setWeakAreas(weak);

          const recs = [];
          const phases = roadmapRes.data?.data?.phases || [];

          // Generate recommendations for the top 3 weak areas
          const topWeak = weak.slice(0, 3);
          for (const w of topWeak) {
            // Find a phase that includes this skill
            const matchingPhase = phases.find(p => p.skills.some(s => s.toLowerCase() === w.name.toLowerCase()));
            
            recs.push({
              title: matchingPhase ? matchingPhase.title : `${w.name} Fundamentals`,
              reason: matchingPhase ? matchingPhase.description : `Your ${w.name} proficiency is below the required target level. Focus on this skill to close the gap.`,
              priority: w.priority === 'high' ? 'High' : (w.priority === 'medium' ? 'Medium' : 'Low'),
              moduleId: matchingPhase ? matchingPhase._id : null,
              phase: matchingPhase || null
            });
          }
          setRecommendations(recs);
        }
      } catch (err) {
        console.error("Results load error:", err);
        setError("Unable to load assessment results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleStartLearning = (rec) => {
    if (rec.moduleId && rec.phase) {
      navigate(`/learning/${rec.moduleId}`, {
        state: { phase: rec.phase }
      });
    } else {
      navigate("/roadmap");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading your assessment results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <CircleAlert size={48} className="text-red-500" />
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200">
          Try Again
        </button>
      </div>
    );
  }

  if (weakAreas.length === 0 && strengths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <CheckCircle2 size={48} className="text-emerald-500" />
        <p className="text-slate-600 font-medium">No assessment results available.</p>
        <button onClick={() => navigate("/assessment")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Take Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <section>
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
          <Sparkles size={17} />
          AI Assessment Analysis
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Your Assessment Results
        </h1>

        <p className="text-slate-500 mt-2">
          SkillPath-AI analyzed your answers and identified the areas
          you should focus on next.
        </p>
      </section>

      {/* Score + Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Score */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 flex flex-col items-center justify-center">

          <p className="text-sm text-slate-400">
            Assessment Score
          </p>

          <div className="text-6xl font-bold mt-3">
            {score}%
          </div>

          <div className="mt-4 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-sm">
            Needs Improvement
          </div>

        </div>

        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center gap-2">
            <CheckCircle2
              size={20}
              className="text-emerald-500"
            />

            <h2 className="font-bold text-slate-900">
              Your Strengths
            </h2>
          </div>

          <div className="mt-5 space-y-3">

            {strengths.length > 0 ? (
              strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500"
                  />
                  {strength}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No specific strengths identified yet.</p>
            )}

          </div>

        </div>

        {/* Skill Gaps */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center gap-2">
            <CircleAlert
              size={20}
              className="text-red-500"
            />

            <h2 className="font-bold text-slate-900">
              Skill Gaps Found
            </h2>
          </div>

          <p className="text-3xl font-bold text-slate-900 mt-4">
            {weakAreas.length}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Priority areas identified by AI
          </p>

        </div>

      </section>

      {/* AI Analysis */}
      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <div className="flex gap-4">

          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              AI Analysis
            </h2>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Your assessment shows that you have a foundation in certain areas, but{" "}
            {weakAreas.length > 0
              ? `${weakAreas.slice(0, 3).map(w => w.name).join(", ")} require additional learning.`
              : "there are no significant skill gaps identified."}
            {" "}SkillPath-AI has prioritized these areas and used them to dynamically refine your learning roadmap.
          </p>

          </div>

        </div>

      </section>

      {/* Weak Areas */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center gap-2 mb-6">

          <TrendingUp
            size={20}
            className="text-blue-600"
          />

          <div>
            <h2 className="font-bold text-slate-900">
              Identified Skill Gaps
            </h2>

            <p className="text-sm text-slate-500">
              Current proficiency compared with target level
            </p>
          </div>

        </div>

        <div className="space-y-6">

          {weakAreas.length > 0 ? (
            weakAreas.map((skill) => {
              const gap = skill.gap;
              
              return (
                <div key={skill.name}>

                  <div className="flex items-center justify-between mb-2">

                    <span className="font-semibold text-slate-800">
                      {skill.name}
                    </span>

                    <span className="text-sm text-slate-500">
                      {skill.currentLevel}% / {skill.requiredLevel}%
                    </span>

                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${gap >= 30 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{
                        width: `${skill.currentLevel}%`,
                      }}
                    />

                  </div>

                  <p className={`text-xs mt-2 ${gap >= 30 ? 'text-red-500' : 'text-amber-500'}`}>
                    {gap}% gap remaining
                  </p>

                </div>
              );
            })
          ) : (
            <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-emerald-700 font-medium">No significant skill gaps identified!</p>
              <p className="text-sm text-emerald-600 mt-1">You are well prepared for your target role.</p>
            </div>
          )}

        </div>

      </section>

      {/* AI Recommendations */}
      <section>

        <div className="flex items-center gap-2 mb-4">

          <Brain
            size={20}
            className="text-purple-600"
          />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Recommended Actions
            </h2>

            <p className="text-sm text-slate-500">
              Personalized based on your assessment
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {recommendations.length > 0 ? (
            recommendations.map((item, idx) => (

              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col"
              >

                <div className="flex items-center justify-between">

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.priority} Priority
                  </span>

                  <Sparkles
                    size={17}
                    className="text-blue-500"
                  />

                </div>

                <h3 className="font-bold text-slate-900 mt-4">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-1">
                  {item.reason}
                </p>

                <button 
                  onClick={() => handleStartLearning(item)}
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 w-fit"
                >
                  Start learning
                  <ArrowRight size={16} />
                </button>

              </div>

            ))
          ) : (
            <div className="col-span-full text-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
              No recommendations available based on current skill gaps.
            </div>
          )}

        </div>

      </section>

      {/* Roadmap Updated */}
      <section className="bg-slate-950 rounded-2xl p-6 text-white">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex gap-4">

            <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <RefreshCw size={21} />
            </div>

            <div>

              <p className="text-sm text-blue-300 font-semibold">
                ADAPTIVE LEARNING
              </p>

              <h2 className="text-xl font-bold mt-1">
                Your roadmap can now be updated
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Your assessment identified new priorities.
                SkillPath-AI can reorder your next learning steps.
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/roadmap")}
            className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition"
          >
            View Updated Roadmap
            <ArrowRight size={17} />
          </button>

        </div>

      </section>

    </div>
  );
}

export default Results;