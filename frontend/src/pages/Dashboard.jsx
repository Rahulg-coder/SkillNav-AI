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

function Dashboard() {
  const skills = [
    {
      name: "Python",
      score: 85,
      status: "Strong",
    },
    {
      name: "Networking",
      score: 78,
      status: "Strong",
    },
    {
      name: "Linux",
      score: 32,
      status: "Needs Work",
    },
    {
      name: "Web Security",
      score: 48,
      status: "Learning",
    },
    {
      name: "SIEM",
      score: 15,
      status: "Skill Gap",
    },
  ];

  const learningPath = [
    {
      title: "Networking Fundamentals",
      status: "completed",
      progress: 100,
    },
    {
      title: "Linux Fundamentals",
      status: "completed",
      progress: 100,
    },
    {
      title: "Security Fundamentals",
      status: "current",
      progress: 62,
    },
    {
      title: "SIEM & Log Analysis",
      status: "locked",
      progress: 0,
    },
    {
      title: "Incident Response",
      status: "locked",
      progress: 0,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome Section */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
            <Sparkles size={16} />
            AI-powered learning assistant
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Good morning, Saravana 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Here's what your AI mentor recommends for your learning journey.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3 size={16} />
          <span>2 hours learning time available today</span>
        </div>
      </section>

      {/* Top Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Career Readiness */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Career Readiness
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                78%
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Target size={24} />
            </div>
          </div>

          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "78%" }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-2">
            22% remaining to reach your target role
          </p>
        </div>

        {/* Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Skills Mastered
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                6 / 10
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Brain size={24} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <TrendingUp size={16} />
            <span>Improving consistently</span>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Learning Streak
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                5 days
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Zap size={24} />
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Keep going — you're building momentum.
          </p>
        </div>
      </section>

      {/* AI Recommendation */}
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
                Complete Linux Fundamentals
              </h2>

              <p className="text-slate-300 mt-2 leading-relaxed">
                Based on your target role, current skill profile and
                recent progress, Linux is your highest-priority skill gap.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  High Priority
                </span>

                <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  Prerequisite for SIEM
                </span>

                <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  ~7 hours
                </span>
              </div>
            </div>

            <button className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-xl font-semibold hover:bg-slate-100 transition">
              Continue Learning
              <ArrowRight size={18} />
            </button>

          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Skill Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Skill Progress
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your current skill profile
              </p>
            </div>

            <Brain size={20} className="text-blue-600" />
          </div>

          <div className="space-y-5">

            {skills.map((skill) => (
              <div key={skill.name}>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-slate-800">
                      {skill.name}
                    </span>

                    <span className="ml-2 text-xs text-slate-400">
                      {skill.status}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    {skill.score}%
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      skill.score >= 70
                        ? "bg-emerald-500"
                        : skill.score >= 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

              </div>
            ))}

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

            <button className="text-sm text-blue-600 font-medium flex items-center gap-1">
              View Full Path
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">

            {learningPath.map((item, index) => (
              <div
                key={item.title}
                className="flex items-start gap-4"
              >

                <div className="flex flex-col items-center">

                  {item.status === "completed" ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={18} />
                    </div>
                  ) : item.status === "current" ? (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Brain size={17} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                  )}

                  {index !== learningPath.length - 1 && (
                    <div className="w-px h-8 bg-slate-200 mt-1" />
                  )}

                </div>

                <div className="flex-1 pb-2">

                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-semibold ${
                        item.status === "locked"
                          ? "text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {item.status === "current" && (
                      <span className="text-xs text-blue-600 font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  {item.status === "current" && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${item.progress}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        {item.progress}% complete
                      </p>
                    </div>
                  )}

                </div>
              </div>
            ))}

          </div>
        </div>

      </section>

      {/* AI Insight */}
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
              You're strong in Python and Networking. Your biggest
              current gap is Linux. Strengthening Linux first will
              unlock SIEM and Incident Response in your personalized
              learning path.
            </p>
          </div>

        </div>

      </section>

      {/* AI Mentor CTA */}
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

        <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Start Conversation
          <ArrowRight size={18} />
        </button>

      </section>

    </div>
  );
}

export default Dashboard;