import {
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleAlert,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function Results() {
  const score = 60;

  const strengths = [
    "Networking Fundamentals",
    "Security Concepts",
  ];

  const weakAreas = [
    {
      name: "Linux",
      score: 32,
      target: 80,
    },
    {
      name: "SIEM",
      score: 15,
      target: 70,
    },
    {
      name: "Incident Response",
      score: 10,
      target: 70,
    },
  ];

  const recommendations = [
    {
      title: "Linux Fundamentals",
      reason: "Your Linux proficiency is below the required level.",
      priority: "High",
    },
    {
      title: "SIEM & Log Analysis",
      reason: "SIEM is an important skill for your target role.",
      priority: "High",
    },
    {
      title: "Incident Response",
      reason: "Recommended after building Linux and SIEM foundations.",
      priority: "Medium",
    },
  ];

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

            {strengths.map((strength) => (
              <div
                key={strength}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <CheckCircle2
                  size={16}
                  className="text-emerald-500"
                />
                {strength}
              </div>
            ))}

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
              Your assessment shows that you have a reasonable
              cybersecurity foundation, but Linux, SIEM and Incident
              Response require additional learning. SkillPath-AI has
              prioritized these areas and will use them to refine your
              learning roadmap.
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

          {weakAreas.map((skill) => {

            const gap = skill.target - skill.score;

            return (
              <div key={skill.name}>

                <div className="flex items-center justify-between mb-2">

                  <span className="font-semibold text-slate-800">
                    {skill.name}
                  </span>

                  <span className="text-sm text-slate-500">
                    {skill.score}% / {skill.target}%
                  </span>

                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${skill.score}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-red-500 mt-2">
                  {gap}% gap remaining
                </p>

              </div>
            );
          })}

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

          {recommendations.map((item) => (

            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-2xl p-5"
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

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {item.reason}
              </p>

              <button className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                Start learning
                <ArrowRight size={16} />
              </button>

            </div>

          ))}

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
            onClick={() =>
              (window.location.href = "/roadmap")
            }
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