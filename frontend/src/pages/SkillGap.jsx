import {
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

function SkillGap() {
  const skills = [
    {
      name: "Python",
      current: 85,
      required: 80,
      status: "strong",
      description: "You have reached the required level.",
    },
    {
      name: "Networking",
      current: 78,
      required: 75,
      status: "strong",
      description: "Your networking fundamentals are strong.",
    },
    {
      name: "Linux",
      current: 32,
      required: 80,
      status: "gap",
      description: "Linux is currently one of your biggest gaps.",
    },
    {
      name: "Web Security",
      current: 48,
      required: 75,
      status: "learning",
      description: "You have started building this skill.",
    },
    {
      name: "SIEM",
      current: 15,
      required: 70,
      status: "gap",
      description: "SIEM is currently a major skill gap.",
    },
    {
      name: "Incident Response",
      current: 10,
      required: 70,
      status: "gap",
      description: "This should be learned after SIEM fundamentals.",
    },
  ];

  const getStatus = (status) => {
    if (status === "strong") {
      return {
        label: "Strong",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        icon: CheckCircle2,
      };
    }

    if (status === "learning") {
      return {
        label: "Learning",
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: TrendingUp,
      };
    }

    return {
      label: "Skill Gap",
      color: "text-red-600",
      bg: "bg-red-50",
      icon: CircleAlert,
    };
  };

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
                Cybersecurity Engineer
              </h2>
            </div>

          </div>

          <div>
            <p className="text-sm text-slate-400">
              Overall Skill Match
            </p>

            <p className="text-3xl font-bold mt-1">
              58%
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
              You already have strong foundations in Python and
              Networking. Your biggest gaps are Linux, SIEM and
              Incident Response. Linux should be your next priority
              because it is a prerequisite for several advanced
              cybersecurity skills.
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
            6 skills analyzed
          </span>

        </div>

        <div className="space-y-7">

          {skills.map((skill) => {

            const status = getStatus(skill.status);
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
                      {skill.current}%
                    </span>

                    <span className="text-slate-400">
                      {" "}
                      / {skill.required}%
                    </span>
                  </div>

                </div>

                {/* Progress */}
                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">

                  {/* Current level */}
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full ${
                      skill.status === "strong"
                        ? "bg-emerald-500"
                        : skill.status === "learning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${skill.current}%`,
                    }}
                  />

                  {/* Required marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-slate-800"
                    style={{
                      left: `${skill.required}%`,
                    }}
                  />

                </div>

                <div className="flex justify-between mt-2">

                  <p className="text-xs text-slate-400">
                    Current proficiency
                  </p>

                  <p className="text-xs text-slate-400">
                    Target: {skill.required}%
                  </p>

                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {skill.description}
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
            .filter((skill) => skill.status === "gap")
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
                    Gap: {skill.required - skill.current}%
                  </span>

                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-4">
                  {skill.name}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Current: {skill.current}% · Target: {skill.required}%
                </p>

                <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
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