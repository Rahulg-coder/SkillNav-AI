import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const userId = localStorage.getItem("skillpath_user_id");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError("User session not found. Please login again.");
          return;
        }

        const response = await API.get(`/roadmap?userId=${userId}`);

        if (!response.data.success) {
          setError(
            response.data.error || "Unable to load roadmap."
          );
          return;
        }

        setRoadmap(response.data.data);
      } catch (err) {
        console.error("Roadmap error:", err);

        setError(
          err.response?.data?.error ||
            "Unable to load your roadmap."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [userId]);

  // =====================================================
  // OPEN LEARNING MODULE
  // =====================================================

  const openLearningModule = (phase) => {
    if (!phase) {
      console.error("Learning phase is missing");
      return;
    }

    if (!phase._id) {
      console.error("Learning phase ID is missing:", phase);
      setError(
        "Learning module information is incomplete. Please regenerate the roadmap."
      );
      return;
    }

    navigate(`/learning/${phase._id}`, {
      state: {
        phase,
        roadmapTitle: roadmap?.title || "",
        targetRole: roadmap?.targetRole || "",
      },
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Sparkles size={30} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-5">
            Building Your Learning Roadmap
          </h1>

          <p className="text-slate-500 mt-2">
            SkillPath-AI is organizing your skill gaps into a
            personalized learning sequence.
          </p>

          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !roadmap) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="font-bold text-red-700">
          Unable to Load Roadmap
        </h2>

        <p className="text-sm text-red-600 mt-2">
          {error || "No roadmap is available yet."}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const phases = roadmap.phases || [];

  const completedCount = phases.filter(
    (phase) => phase.status === "completed"
  ).length;

  const currentPhase =
    phases.find(
      (phase) => phase.status === "in-progress"
    ) || phases[0];

  const totalHours = phases.reduce((sum, phase) => {
    const match = phase.duration?.match(
      /(\d+(\.\d+)?)/
    );

    return sum + (match ? Number(match[1]) : 0);
  }, 0);

  const getStatus = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        };

      case "in-progress":
        return {
          label: "Learning Now",
          color: "text-blue-600",
          bg: "bg-blue-50",
        };

      default:
        return {
          label: "Upcoming",
          color: "text-amber-600",
          bg: "bg-amber-50",
        };
    }
  };

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section>
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
          <Sparkles size={17} />
          AI-Generated Learning Path
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Your Learning Roadmap
            </h1>

            <p className="text-slate-500 mt-2">
              A personalized sequence designed for your{" "}
              {roadmap.targetRole} goal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={17} />

            Estimated total:{" "}
            {totalHours > 0
              ? `${totalHours} hours`
              : "AI estimated"}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* AI RECOMMENDATION */}
      {/* ================================================= */}

      <section className="bg-slate-950 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div className="flex gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Sparkles size={23} />
            </div>

            <div>
              <p className="text-sm text-blue-300 font-semibold">
                AI RECOMMENDATION
              </p>

              <h2 className="text-xl font-bold mt-1">
                {currentPhase
                  ? `Continue ${currentPhase.title}`
                  : "Start your learning journey"}
              </h2>

              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                {currentPhase
                  ? `You are currently working on ${currentPhase.title}. Complete this phase to unlock the next stage.`
                  : "Follow the personalized sequence generated for your target role."}
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* FIXED TOP CONTINUE BUTTON */}
          {/* ================================================= */}

          {currentPhase && (
            <button
              onClick={() =>
                openLearningModule(currentPhase)
              }
              className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Continue
              <ArrowRight size={17} />
            </button>
          )}

        </div>
      </section>

      {/* ================================================= */}
      {/* PROGRESS */}
      {/* ================================================= */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Overall */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Overall Progress
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {roadmap.overallProgress || 0}%
          </p>

          <div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${roadmap.overallProgress || 0}%`,
              }}
            />
          </div>
        </div>

        {/* Milestones */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Milestones Completed
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {completedCount} / {phases.length}
          </p>

          <p className="text-sm text-emerald-600 mt-3">
            Keep building momentum
          </p>
        </div>

        {/* Target Role */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Target Role
          </p>

          <p className="text-xl font-bold text-slate-900 mt-2">
            {roadmap.targetRole}
          </p>

          <div className="flex items-center gap-2 text-sm text-blue-600 mt-3">
            <Target size={16} />
            Personalized path
          </div>
        </div>

      </section>

      {/* ================================================= */}
      {/* LEARNING JOURNEY */}
      {/* ================================================= */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="mb-7">
          <h2 className="text-lg font-bold text-slate-900">
            Learning Journey
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Complete each milestone to unlock the next stage.
          </p>
        </div>

        <div className="relative">

          <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200" />

          <div className="space-y-7">

            {phases.map((item, index) => {

              const status = getStatus(item.status);

              return (
                <div
                  key={item._id || item.title}
                  className="relative flex gap-5"
                >

                  {/* ================================================= */}
                  {/* ICON */}
                  {/* ================================================= */}

                  <div className="relative z-10 shrink-0">

                    {item.status === "completed" ? (

                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-white">
                        <CheckCircle2 size={22} />
                      </div>

                    ) : item.status === "in-progress" ? (

                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-lg shadow-blue-100">
                        <BookOpen size={21} />
                      </div>

                    ) : (

                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-4 border-white">
                        <Lock size={19} />
                      </div>

                    )}

                  </div>

                  {/* ================================================= */}
                  {/* CONTENT */}
                  {/* ================================================= */}

                  <div
                    className={`flex-1 border rounded-2xl p-5 ${
                      item.status === "in-progress"
                        ? "border-blue-200 bg-blue-50/40"
                        : "border-slate-200"
                    }`}
                  >

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2 flex-wrap">

                          <h3 className="font-bold text-slate-900">
                            {index + 1}. {item.title}
                          </h3>

                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                          >
                            {status.label}
                          </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                          {item.description}
                        </p>

                      </div>

                      {item.duration && (
                        <div className="text-sm text-slate-400 shrink-0">
                          {item.duration}
                        </div>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* SKILLS */}
                    {/* ================================================= */}

                    {item.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">

                        {item.skills.map(
                          (skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    {/* ================================================= */}
                    {/* PREREQUISITES */}
                    {/* ================================================= */}

                    {item.prerequisites?.length > 0 && (
                      <div className="mt-4 text-xs text-slate-400">

                        <span className="font-semibold">
                          Prerequisites:
                        </span>{" "}

                        {item.prerequisites.join(", ")}

                      </div>
                    )}

                    {/* ================================================= */}
                    {/* PROGRESS */}
                    {/* ================================================= */}

                    {item.status !== "pending" && (
                      <div className="mt-4">

                        <div className="flex justify-between text-xs mb-2">

                          <span className="text-slate-500">
                            Progress
                          </span>

                          <span className="font-semibold text-slate-700">
                            {item.progress || 0}%
                          </span>

                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                          <div
                            className={`h-full rounded-full ${
                              item.status === "completed"
                                ? "bg-emerald-500"
                                : "bg-blue-600"
                            }`}
                            style={{
                              width: `${item.progress || 0}%`,
                            }}
                          />

                        </div>

                      </div>
                    )}

                    {/* ================================================= */}
                    {/* FOOTER */}
                    {/* ================================================= */}

                    <div className="flex items-center justify-between mt-4">

                      <span className="text-xs text-slate-400">
                        {item.resources ||
                          item.skills?.length ||
                          0}{" "}
                        learning resources
                      </span>

                      {/* ================================================= */}
                      {/* BOTTOM CONTINUE */}
                      {/* ================================================= */}

                      {item.status === "in-progress" && (
                        <button
                          onClick={() =>
                            openLearningModule(item)
                          }
                          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                        >
                          Continue
                          <ArrowRight size={15} />
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* ADAPTIVE LEARNING */}
      {/* ================================================= */}

      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <div className="flex gap-4">

          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              Your roadmap adapts as you learn
            </h2>

            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              SkillPath-AI will update this roadmap based on
              your assessment results, completed learning
              activities and progress. Strong areas can be
              accelerated while weak areas receive additional
              practice.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Roadmap;