import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  Sparkles,
  Target,
} from "lucide-react";

function Roadmap() {
  const roadmap = [
    {
      title: "Networking Fundamentals",
      description: "Build the networking foundation required for cybersecurity.",
      duration: "5 hours",
      progress: 100,
      status: "completed",
      resources: 4,
    },
    {
      title: "Linux Fundamentals",
      description: "Learn Linux commands, permissions and system administration.",
      duration: "7 hours",
      progress: 100,
      status: "completed",
      resources: 5,
    },
    {
      title: "Security Fundamentals",
      description: "Understand threats, vulnerabilities, authentication and security principles.",
      duration: "8 hours",
      progress: 62,
      status: "current",
      resources: 6,
    },
    {
      title: "Web Security",
      description: "Learn common web vulnerabilities and secure application practices.",
      duration: "10 hours",
      progress: 0,
      status: "upcoming",
      resources: 7,
    },
    {
      title: "SIEM & Log Analysis",
      description: "Learn security monitoring, logs and threat detection using SIEM concepts.",
      duration: "12 hours",
      progress: 0,
      status: "locked",
      resources: 8,
    },
    {
      title: "Incident Response",
      description: "Learn how to detect, investigate and respond to security incidents.",
      duration: "10 hours",
      progress: 0,
      status: "locked",
      resources: 6,
    },
    {
      title: "Cybersecurity Capstone Project",
      description: "Apply your skills by building a practical cybersecurity project.",
      duration: "20 hours",
      progress: 0,
      status: "locked",
      resources: 3,
    },
  ];

  const getStatus = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        };

      case "current":
        return {
          label: "Learning Now",
          color: "text-blue-600",
          bg: "bg-blue-50",
        };

      case "upcoming":
        return {
          label: "Upcoming",
          color: "text-amber-600",
          bg: "bg-amber-50",
        };

      default:
        return {
          label: "Locked",
          color: "text-slate-400",
          bg: "bg-slate-100",
        };
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
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
              A personalized sequence designed for your Cybersecurity Engineer goal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={17} />
            Estimated total: 72 hours
          </div>

        </div>
      </section>

      {/* AI Recommendation */}
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
                Continue Security Fundamentals
              </h2>

              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                You're 62% through this module. Completing it will unlock
                Web Security and move you closer to your target role.
              </p>
            </div>

          </div>

          <button className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition">
            Continue
            <ArrowRight size={17} />
          </button>

        </div>

      </section>

      {/* Progress */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Overall Progress
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            42%
          </p>

          <div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "42%" }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Milestones Completed
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            2 / 7
          </p>

          <p className="text-sm text-emerald-600 mt-3">
            Keep building momentum
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Target Role
          </p>

          <p className="text-xl font-bold text-slate-900 mt-2">
            Cybersecurity Engineer
          </p>

          <div className="flex items-center gap-2 text-sm text-blue-600 mt-3">
            <Target size={16} />
            Personalized path
          </div>
        </div>

      </section>

      {/* Roadmap */}
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

          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200" />

          <div className="space-y-7">

            {roadmap.map((item, index) => {

              const status = getStatus(item.status);

              return (
                <div
                  key={item.title}
                  className="relative flex gap-5"
                >

                  {/* Icon */}
                  <div className="relative z-10 shrink-0">

                    {item.status === "completed" ? (
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-white">
                        <CheckCircle2 size={22} />
                      </div>
                    ) : item.status === "current" ? (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-lg shadow-blue-100">
                        <BookOpen size={21} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-4 border-white">
                        <Lock size={19} />
                      </div>
                    )}

                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 border rounded-2xl p-5 ${
                      item.status === "current"
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

                      <div className="text-sm text-slate-400 shrink-0">
                        {item.duration}
                      </div>

                    </div>

                    {/* Progress */}
                    {item.status !== "locked" && (
                      <div className="mt-4">

                        <div className="flex justify-between text-xs mb-2">

                          <span className="text-slate-500">
                            Progress
                          </span>

                          <span className="font-semibold text-slate-700">
                            {item.progress}%
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
                              width: `${item.progress}%`,
                            }}
                          />

                        </div>

                      </div>
                    )}

                    {/* Resources */}
                    <div className="flex items-center justify-between mt-4">

                      <span className="text-xs text-slate-400">
                        {item.resources} learning resources
                      </span>

                      {item.status === "current" && (
                        <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
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

      {/* Adaptive Learning */}
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
              SkillPath-AI will update this roadmap based on your
              assessment results, completed resources and feedback.
              Strong areas can be accelerated while weak areas receive
              additional practice.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Roadmap;