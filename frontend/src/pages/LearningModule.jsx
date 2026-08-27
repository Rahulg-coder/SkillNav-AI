import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function LearningModule() {
  const navigate = useNavigate();
  const location = useLocation();

  const phase = location.state?.phase;
  const roadmapTitle = location.state?.roadmapTitle;
  const targetRole = location.state?.targetRole;

  if (!phase) {
    return (
      <div className="max-w-3xl mx-auto">

        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">

          <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
            <Lock
              size={25}
              className="text-slate-400"
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-4">
            Learning module not found
          </h1>

          <p className="text-slate-500 mt-2">
            Please open this module from your Learning Roadmap.
          </p>

          <button
            onClick={() => navigate("/roadmap")}
            className="mt-5 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold"
          >
            Back to Roadmap
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back */}

      <button
        onClick={() => navigate("/roadmap")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft size={17} />
        Back to Learning Roadmap
      </button>

      {/* Header */}

      <section className="bg-slate-950 text-white rounded-3xl p-7 md:p-9">

        <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
          <Sparkles size={17} />
          AI-Personalized Learning
        </div>

        <h1 className="text-3xl font-bold mt-4">
          {phase.title}
        </h1>

        <p className="text-slate-300 mt-3 max-w-2xl">
          {phase.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-5">

          {phase.duration && (
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-sm">
              <Clock3 size={15} />
              {phase.duration}
            </span>
          )}

          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-sm">
            <BookOpen size={15} />
            {phase.skills?.length || 0} topics
          </span>

        </div>

      </section>

      {/* Current Progress */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Module Progress
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-1">
              {phase.progress || 0}%
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen size={23} />
          </div>

        </div>

        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mt-5">

          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{
              width: `${phase.progress || 0}%`,
            }}
          />

        </div>

      </section>

      {/* Topics */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <BookOpen size={20} />
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              What You'll Learn
            </h2>

            <p className="text-sm text-slate-500">
              Complete these topics in sequence.
            </p>

          </div>

        </div>

        <div className="space-y-3">

          {(phase.skills || []).map(
            (skill, index) => (
              <div
                key={`${skill}-${index}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition"
              >

                <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>

                <div className="flex-1">

                  <p className="font-semibold text-slate-800">
                    {skill}
                  </p>

                </div>

                <CheckCircle2
                  size={20}
                  className="text-slate-300"
                />

              </div>
            )
          )}

        </div>

      </section>

      {/* Prerequisites */}

      {phase.prerequisites?.length > 0 && (
        <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6">

          <h2 className="font-bold text-slate-900">
            Prerequisites
          </h2>

          <div className="mt-3 space-y-2">

            {phase.prerequisites.map(
              (item, index) => (
                <div
                  key={index}
                  className="text-sm text-slate-600"
                >
                  • {item}
                </div>
              )
            )}

          </div>

        </section>
      )}

      {/* Start Learning */}

      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <h2 className="font-bold text-slate-900">
              Ready to start?
            </h2>

            <p className="text-sm text-slate-600 mt-1">
              Begin learning this module and build your skills
              toward becoming a {targetRole}.
            </p>

          </div>

          <button
            onClick={() => {
              alert(
                `Starting ${phase.title}`
              );
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Start Learning
          </button>

        </div>

      </section>

    </div>
  );
}

export default LearningModule;