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

function Readiness() {
  const skills = [
    { name: "Python", score: 85, status: "Strong" },
    { name: "Networking", score: 78, status: "Strong" },
    { name: "Linux", score: 32, status: "Needs Work" },
    { name: "Web Security", score: 48, status: "Learning" },
    { name: "SIEM", score: 15, status: "Needs Work" },
    { name: "Incident Response", score: 10, status: "Needs Work" },
  ];

  const milestones = [
    {
      title: "Networking Fundamentals",
      status: "completed",
    },
    {
      title: "Linux Fundamentals",
      status: "completed",
    },
    {
      title: "Security Fundamentals",
      status: "current",
    },
    {
      title: "SIEM & Log Analysis",
      status: "upcoming",
    },
  ];

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
                  strokeDashoffset="69"
                  strokeLinecap="round"
                  className="text-blue-500"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">
                  78%
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
                Cybersecurity Engineer
              </h2>

              <p className="text-sm text-slate-400 mt-3">
                You're making good progress toward your target career.
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
              Your foundations in Python and Networking are strong.
              Your biggest readiness blockers are Linux, SIEM and
              Incident Response.
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
            2
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
            3
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
            42%
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
            38h
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
                      skill.score >= 70
                        ? "text-emerald-600"
                        : skill.score >= 40
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {skill.score}%
                </span>

              </div>

              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className={`h-full rounded-full ${
                    skill.score >= 70
                      ? "bg-emerald-500"
                      : skill.score >= 40
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${skill.score}%`,
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

            {milestones.map((item) => (

              <div
                key={item.title}
                className="flex items-center gap-4"
              >

                {item.status === "completed" ? (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                ) : item.status === "current" ? (
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
                    {item.status}
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
            Strengthen Linux Fundamentals
          </h2>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Improving your Linux skills will increase your career
            readiness and unlock the next stages of your roadmap.
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
            <Clock3 size={16} />
            Estimated: 7 hours
          </div>

          <button
            onClick={() =>
              (window.location.href = "/roadmap")
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