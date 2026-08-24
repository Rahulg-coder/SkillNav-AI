import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Clock3,
  Target,
  Sparkles,
} from "lucide-react";

function Onboarding() {
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [hours, setHours] = useState("1-2");
  const [skills, setSkills] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      goal,
      experience,
      hours,
      skills,
    });

    alert("Your personalized learning path will be generated!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm mb-4">
            <Sparkles size={16} />
            AI-Powered Personalization
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">
            Let's build your learning path
          </h1>

          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Tell SkillPath-AI about your goals and current skills.
            We'll create a roadmap designed specifically for you.
          </p>

        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Goal */}
            <div className="md:col-span-2">

              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Target size={18} className="text-blue-600" />
                What is your career goal?
              </label>

              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Cybersecurity Engineer"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* Experience */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Brain size={18} className="text-purple-600" />
                Experience Level
              </label>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

            </div>

            {/* Learning Time */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Clock3 size={18} className="text-emerald-600" />
                Learning Time Per Day
              </label>

              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="less-than-1">Less than 1 hour</option>
                <option value="1-2">1–2 hours</option>
                <option value="2-4">2–4 hours</option>
                <option value="4+">4+ hours</option>
              </select>

            </div>

            {/* Current Skills */}
            <div className="md:col-span-2">

              <label className="text-sm font-semibold mb-2 block">
                What skills do you already know?
              </label>

              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, Networking, HTML, SQL..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-slate-400 mt-2">
                Don't worry if you're a complete beginner. AI will help
                identify your skill gaps.
              </p>

            </div>

          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end">

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Generate My Learning Path
              <ArrowRight size={18} />
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Onboarding;