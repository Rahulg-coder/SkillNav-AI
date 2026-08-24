import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

function Assessment() {
  const questions = [
    {
      question:
        "Which protocol is commonly used for secure remote login to a Linux server?",
      options: ["FTP", "SSH", "HTTP", "SMTP"],
      answer: "SSH",
    },
    {
      question:
        "Which Linux command is commonly used to list files in a directory?",
      options: ["cd", "ls", "pwd", "mkdir"],
      answer: "ls",
    },
    {
      question:
        "What does the CIA triad in cybersecurity represent?",
      options: [
        "Control, Internet, Access",
        "Confidentiality, Integrity, Availability",
        "Cybersecurity, Intelligence, Authentication",
        "Code, Infrastructure, Access",
      ],
      answer: "Confidentiality, Integrity, Availability",
    },
    {
      question:
        "Which technology is commonly used to collect and analyze security logs?",
      options: ["SIEM", "HTML", "FTP", "DNS"],
      answer: "SIEM",
    },
    {
      question:
        "What is the primary purpose of a firewall?",
      options: [
        "Store passwords",
        "Block unauthorized network traffic",
        "Create websites",
        "Compress files",
      ],
      answer: "Block unauthorized network traffic",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const question = questions[currentQuestion];

  const handleSelect = (option) => {
    setSelectedAnswer(option);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);

      setSelectedAnswer(
        answers[currentQuestion + 1] || ""
      );
    } else {
      setSubmitted(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion === 0) return;

    const previous = currentQuestion - 1;

    setCurrentQuestion(previous);
    setSelectedAnswer(answers[previous] || "");
  };

  const calculateScore = () => {
    let score = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        score++;
      }
    });

    return Math.round((score / questions.length) * 100);
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers({});
    setSubmitted(false);
  };

  if (submitted) {
    const score = calculateScore();

    return (
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Brain size={30} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-5">
            Assessment Complete
          </h1>

          <p className="text-slate-500 mt-2">
            SkillPath-AI analyzed your answers.
          </p>

        </div>

        {/* Score */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">

          <p className="text-sm text-slate-500">
            Your Score
          </p>

          <div className="text-6xl font-bold text-blue-600 mt-3">
            {score}%
          </div>

          <p className="text-slate-500 mt-3">
            {score >= 80
              ? "Excellent! You have a strong foundation."
              : score >= 50
              ? "Good progress. A few areas need improvement."
              : "You have some important skill gaps to work on."}
          </p>

        </div>

        {/* AI Analysis */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

          <div className="flex gap-4">

            <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Sparkles size={20} />
            </div>

            <div>

              <h2 className="font-bold text-slate-900">
                AI Learning Analysis
              </h2>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Based on your assessment, SkillPath-AI will identify
                weak areas and adjust your personalized learning path.
                Additional practice can be added where needed.
              </p>

            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">

          <button
            onClick={restartAssessment}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
          >
            Retake Assessment
          </button>

          <button
            onClick={() =>
              (window.location.href = "/roadmap")
            }
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            View Updated Roadmap
          </button>

        </div>

      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <section>

        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
          <Sparkles size={17} />
          AI Skill Assessment
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Test Your Skills
        </h1>

        <p className="text-slate-500 mt-2">
          This short assessment helps SkillPath-AI understand your
          current knowledge and improve your learning path.
        </p>

      </section>

      {/* Assessment Card */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8">

        {/* Top Info */}
        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} />
            ~5 minutes
          </div>

          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestion + 1} / {questions.length}
          </span>

        </div>

        {/* Progress */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-8">

          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        {/* Question */}
        <div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-relaxed">
            {question.question}
          </h2>

          <div className="mt-7 space-y-3">

            {question.options.map((option) => {

              const selected = selectedAnswer === option;

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                    selected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >

                  <span className="font-medium">
                    {option}
                  </span>

                  {selected && (
                    <CheckCircle2 size={20} />
                  )}

                </button>
              );
            })}

          </div>

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-600 font-medium disabled:opacity-30"
          >
            <ArrowLeft size={17} />
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={!selectedAnswer}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1
              ? "Submit Assessment"
              : "Next"}

            <ArrowRight size={17} />
          </button>

        </div>

      </section>

      {/* AI Info */}
      <div className="flex items-start gap-3 px-4">

        <Sparkles
          size={17}
          className="text-blue-600 mt-0.5"
        />

        <p className="text-xs text-slate-500">
          Your assessment results can be used by the AI engine to
          identify skill gaps and adapt your roadmap.
        </p>

      </div>

    </div>
  );
}

export default Assessment;