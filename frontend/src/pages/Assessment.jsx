import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Assessment() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [answers, setAnswers] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [score, setScore] = useState(0);

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // USER PROFILE
  // =====================================================

  const userId =
    localStorage.getItem("skillpath_user_id");

  const storedProfile =
    localStorage.getItem("skillpath_profile");

  const profile = storedProfile
    ? JSON.parse(storedProfile)
    : {};

  // =====================================================
  // GENERATE AI QUESTIONS
  // =====================================================

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError(
            "User session not found. Please login again."
          );

          setLoading(false);
          return;
        }

        const response = await API.post(
          "/assessment/generate",
          {
            userId,
          }
        );

        if (!response.data.success) {
          setError(
            response.data.error ||
              "Unable to generate assessment."
          );

          return;
        }

        const generatedQuestions =
          response.data.data?.questions || [];

        if (
          !Array.isArray(generatedQuestions) ||
          generatedQuestions.length === 0
        ) {
          setError(
            "AI did not generate any assessment questions."
          );

          return;
        }

        setQuestions(generatedQuestions);

      } catch (err) {
        console.error(
          "Question generation error:",
          err
        );

        setError(
          err.response?.data?.error ||
            "Unable to generate your assessment."
        );
      } finally {
        setLoading(false);
      }
    };

    generateQuestions();
  }, [userId]);

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const question =
    questions[currentQuestion];

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const handleSelect = (option) => {
    setSelectedAnswer(option);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  // =====================================================
  // NEXT / SUBMIT
  // =====================================================

  const nextQuestion = async () => {
    if (!selectedAnswer || submitting) {
      return;
    }

    if (
      currentQuestion <
      questions.length - 1
    ) {
      const nextIndex =
        currentQuestion + 1;

      setCurrentQuestion(nextIndex);

      setSelectedAnswer(
        answers[nextIndex] || ""
      );

      return;
    }

    await submitAssessment();
  };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const previousQuestion = () => {
    if (
      currentQuestion === 0 ||
      submitting
    ) {
      return;
    }

    const previousIndex =
      currentQuestion - 1;

    setCurrentQuestion(previousIndex);

    setSelectedAnswer(
      answers[previousIndex] || ""
    );
  };

  // =====================================================
  // SUBMIT ASSESSMENT TO AI
  // =====================================================

  const submitAssessment = async () => {
    try {
      setSubmitting(true);
      setError("");

      if (!userId) {
        setError(
          "User session not found. Please login again."
        );

        return;
      }

      const targetRole =
        profile.goal ||
        profile.targetRole;

      if (!targetRole) {
        setError(
          "Target role not found. Please complete onboarding."
        );

        return;
      }

      // -------------------------------------------------
      // Format answers
      // -------------------------------------------------

      const formattedAnswers =
        questions.map(
          (questionItem, index) => ({
            question:
              questionItem.question,

            options:
              questionItem.options,

            answer:
              answers[index] || "",
          })
        );

      // -------------------------------------------------
      // Send to backend
      // -------------------------------------------------

      const response = await API.post(
        "/assessment",
        {
          userId,
          targetRole,
          answers: formattedAnswers,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.error ||
            "Assessment submission failed."
        );

        return;
      }

      const result =
        response.data.data;

      // -------------------------------------------------
      // Store AI result
      // -------------------------------------------------

      setScore(
        result.score || 0
      );

      setAnalysis(
        result.analysis || null
      );

      localStorage.setItem(
        "skillpath_assessment",
        JSON.stringify(result)
      );

      setSubmitted(true);

    } catch (err) {
      console.error(
        "Assessment submission error:",
        err
      );

      setError(
        err.response?.data?.error ||
          "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // RETAKE
  // =====================================================

  const restartAssessment = async () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setAnalysis(null);
    setError("");

    // Generate a fresh AI assessment
    try {
      setLoading(true);

      const response = await API.post(
        "/assessment/generate",
        {
          userId,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.error ||
            "Unable to generate assessment."
        );

        return;
      }

      const generatedQuestions =
        response.data.data?.questions || [];

      setQuestions(
        generatedQuestions
      );

    } catch (err) {
      console.error(
        "Retake generation error:",
        err
      );

      setError(
        err.response?.data?.error ||
          "Unable to generate new questions."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">

        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Sparkles size={30} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-5">
            Generating Your Assessment
          </h1>

          <p className="text-slate-500 mt-2">
            SkillPath-AI is creating questions based on your
            target role, experience and current skills.
          </p>

          <div className="mt-6 flex justify-center">

            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (
    error &&
    questions.length === 0
  ) {
    return (
      <div className="max-w-3xl mx-auto">

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

          <div className="flex gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              ⚠
            </div>

            <div>

              <h2 className="font-bold text-red-700">
                Unable to Generate Assessment
              </h2>

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-5 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // RESULT SCREEN
  // =====================================================

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}

        <div className="text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Brain size={30} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-5">
            Assessment Complete
          </h1>

          <p className="text-slate-500 mt-2">
            SkillPath-AI analyzed your answers using your
            personalized learner profile.
          </p>

        </div>

        {/* Score */}

        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">

          <p className="text-sm text-slate-500">
            AI Assessment Score
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

            <div className="flex-1">

              <h2 className="font-bold text-slate-900">
                AI Learning Analysis
              </h2>

              {analysis ? (
                <div className="mt-3 space-y-4 text-sm text-slate-600">

                  {analysis.summary && (
                    <p>
                      {analysis.summary}
                    </p>
                  )}

                  {Array.isArray(
                    analysis.strengths
                  ) &&
                    analysis.strengths.length >
                      0 && (
                      <div>

                        <p className="font-semibold text-slate-800">
                          Strengths
                        </p>

                        <ul className="list-disc ml-5 mt-1 space-y-1">
                          {analysis.strengths.map(
                            (strength, index) => (
                              <li key={index}>
                                {strength}
                              </li>
                            )
                          )}
                        </ul>

                      </div>
                    )}

                  {Array.isArray(
                    analysis.skillGaps
                  ) &&
                    analysis.skillGaps.length >
                      0 && (
                      <div>

                        <p className="font-semibold text-slate-800">
                          Skill Gaps
                        </p>

                        <div className="mt-2 space-y-2">

                          {analysis.skillGaps.map(
                            (gap, index) => (
                              <div
                                key={index}
                                className="bg-white border border-blue-100 rounded-xl p-3"
                              >

                                <div className="flex items-center justify-between gap-3">

                                  <span className="font-semibold text-slate-800">
                                    {gap.skill}
                                  </span>

                                  {gap.priority && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium">
                                      {gap.priority}
                                    </span>
                                  )}

                                </div>

                                {gap.reason && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {gap.reason}
                                  </p>
                                )}

                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                  {analysis.nextAction && (
                    <div className="bg-white border border-blue-100 rounded-xl p-4">

                      <p className="font-semibold text-slate-800">
                        Next Best Action
                      </p>

                      <p className="mt-1">
                        {analysis.nextAction}
                      </p>

                    </div>
                  )}

                </div>
              ) : (
                <p className="text-sm text-slate-600 mt-2">
                  Your assessment has been analyzed successfully.
                </p>
              )}

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
              navigate("/dashboard")
            }
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // ASSESSMENT SCREEN
  // =====================================================

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

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
          SkillPath-AI generated this assessment based on
          your target role, experience and current skills.
        </p>

      </section>

      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Assessment Card */}

      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8">

        {/* Top Info */}

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} />
            ~5 minutes
          </div>

          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestion + 1} /{" "}
            {questions.length}
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
            {question?.question}
          </h2>

          <div className="mt-7 space-y-3">

            {question?.options?.map(
              (option, index) => {

                const selected =
                  selectedAnswer === option;

                return (
                  <button
                    key={`${option}-${index}`}
                    onClick={() =>
                      handleSelect(option)
                    }
                    disabled={submitting}
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
              }
            )}

          </div>

        </div>

        {/* Navigation */}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">

          <button
            onClick={previousQuestion}
            disabled={
              currentQuestion === 0 ||
              submitting
            }
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-600 font-medium disabled:opacity-30"
          >
            <ArrowLeft size={17} />
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={
              !selectedAnswer ||
              submitting
            }
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >

            {submitting
              ? "Analyzing with AI..."
              : currentQuestion ===
                questions.length - 1
              ? "Submit Assessment"
              : "Next"}

            {!submitting && (
              <ArrowRight size={17} />
            )}

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
          These questions were generated dynamically by
          SkillPath-AI based on your learner profile.
          Your answers will be analyzed to identify
          skill gaps and personalize your roadmap.
        </p>

      </div>

    </div>
  );
}

export default Assessment;