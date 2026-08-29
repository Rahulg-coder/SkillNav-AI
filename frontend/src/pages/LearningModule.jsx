import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Lock,
  Play,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function LearningModule() {
  const navigate = useNavigate();
  const location = useLocation();

  const phase = location.state?.phase;
  const roadmapTitle = location.state?.roadmapTitle;
  const targetRole = location.state?.targetRole;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");

  const userId = localStorage.getItem("skillpath_user_id");

  // =====================================================
  // LOAD AI COURSE
  // =====================================================

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError("User session not found. Please login again.");
          return;
        }

        if (!phase) {
          setError("Learning module information is missing.");
          return;
        }

        const response = await API.post("/learning/generate", {
          userId,

          phaseTitle: phase.title || "Learning Module",

          description: phase.description || "",

          skills: Array.isArray(phase.skills) ? phase.skills : [],

          duration: phase.duration || "",

          prerequisites: Array.isArray(phase.prerequisites)
            ? phase.prerequisites
            : [],
        });

        if (!response.data?.success) {
          throw new Error(
            response.data?.error ||
              "Unable to generate learning content."
          );
        }

        setContent(response.data.data);
      } catch (err) {
        console.error("Learning module error:", err);

        setError(
          err.response?.data?.error ||
            err.message ||
            "Unable to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [phase, userId]);

  // =====================================================
  // SELECT QUIZ ANSWER
  // =====================================================

  const selectAnswer = (questionIndex, option) => {
    if (quizSubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  // =====================================================
  // SUBMIT QUIZ
  // =====================================================

  const submitQuiz = () => {
    if (!content?.quiz?.length) return;

    const unanswered = content.quiz.some(
      (_, index) => !answers[index]
    );

    if (unanswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correct = 0;

    content.quiz.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correct++;
      }
    });

    const score = Math.round(
      (correct / content.quiz.length) * 100
    );

    setQuizScore(score);
    setQuizSubmitted(true);
  };

  // =====================================================
  // RETAKE QUIZ
  // =====================================================

  const retakeQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

 // =====================================================
// COMPLETE MODULE + UNLOCK NEXT MODULE
// =====================================================

const completeModule = async () => {
  if (!userId) {
    alert("User session not found. Please login again.");
    return;
  }

  if (!phase?._id) {
    alert(
      "Module ID is missing. Please regenerate the roadmap."
    );
    return;
  }

  if (!quizSubmitted) {
    alert(
      "Please complete the Knowledge Check first."
    );
    return;
  }

  if (quizScore < 60) {
    alert(
      "You need at least 60% to complete this module. Please review the lessons and retake the quiz."
    );
    return;
  }

  try {
    setCompleting(true);

    const response = await API.post(
      "/learning/complete",
      {
        userId,
        phaseId: phase._id,
        score: quizScore,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.error ||
          "Unable to complete module."
      );
    }

    // ============================================
    // MODULE COMPLETED
    // ============================================

    setCompleted(true);

    setCompletionMessage(
      response.data?.message ||
        "Module completed successfully!"
    );

    // ============================================
    // DEBUG BACKEND RESPONSE
    // ============================================

    console.log(
      "Module completion response:",
      response.data
    );

    // ============================================
    // NEXT MODULE
    // ============================================

    const nextPhase =
      response.data?.data?.nextPhase ||
      response.data?.nextPhase ||
      null;

    if (nextPhase) {
      console.log(
        "Next module unlocked:",
        nextPhase
      );
    } else {
      console.log(
        "No next module returned. This may be the final module."
      );
    }

  } catch (err) {
    console.error(
      "Module completion error:",
      err
    );

    alert(
      err.response?.data?.error ||
        err.message ||
        "Unable to complete module."
    );
  } finally {
    setCompleting(false);
  }
};

  // =====================================================
  // NO PHASE
  // =====================================================

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
            className="mt-5 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Back to Roadmap
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">

        <button
          onClick={() => navigate("/roadmap")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={17} />
          Back to Learning Roadmap
        </button>

        <section className="bg-slate-950 text-white rounded-3xl p-8">

          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
            <Sparkles size={17} />
            AI-Personalized Learning
          </div>

          <h1 className="text-3xl font-bold mt-4">
            {phase.title}
          </h1>

          <p className="text-slate-300 mt-3">
            Generating your personalized learning course...
          </p>

        </section>

        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

          <div className="w-12 h-12 mx-auto border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            AI is preparing your course
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Creating lessons, practice tasks, videos and quiz
            questions based on your learning path.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">

        <button
          onClick={() => navigate("/roadmap")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={17} />
          Back to Learning Roadmap
        </button>

        <section className="bg-slate-950 text-white rounded-3xl p-8">

          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
            <Sparkles size={17} />
            AI-Personalized Learning
          </div>

          <h1 className="text-3xl font-bold mt-4">
            {phase.title}
          </h1>

          <p className="text-slate-300 mt-3">
            {phase.description}
          </p>

        </section>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

          <div className="flex items-start gap-3">

            <XCircle
              size={22}
              className="text-red-600 mt-0.5"
            />

            <div>
              <h2 className="font-bold text-red-700">
                Unable to load course
              </h2>

              <p className="text-sm text-red-600 mt-2">
                {error}
              </p>
            </div>

          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // COURSE
  // =====================================================

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* =================================================
          BACK
      ================================================= */}

      <button
        onClick={() => navigate("/roadmap")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft size={17} />
        Back to Learning Roadmap
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-slate-950 text-white rounded-3xl p-7 md:p-9">

        <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
          <Sparkles size={17} />
          AI-Personalized Learning
        </div>

        <h1 className="text-3xl font-bold mt-4">
          {content?.title || phase.title}
        </h1>

        <p className="text-slate-300 mt-3 max-w-3xl leading-relaxed">
          {content?.overview || phase.description}
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
            {content?.lessons?.length || 0} Lessons
          </span>

          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-sm">
            <Target size={15} />
            {targetRole || roadmapTitle || "Career Development"}
          </span>

        </div>

      </section>

      {/* =================================================
          WHAT YOU WILL LEARN
      ================================================= */}

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
              Topics from your personalized roadmap.
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

                <div className="w-9 h-9 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>

                <p className="font-semibold text-slate-800 flex-1">
                  {skill}
                </p>

                <CheckCircle2
                  size={20}
                  className="text-slate-300"
                />

              </div>
            )
          )}

        </div>

      </section>

      {/* =================================================
          LESSONS
      ================================================= */}

      <section className="space-y-5">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Course Lessons
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Learn these concepts in sequence.
          </p>
        </div>

        {(content?.lessons || []).map(
          (lesson, index) => (
            <article
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >

              <div className="flex gap-4">

                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <div className="flex-1">

                  <h3 className="text-lg font-bold text-slate-900">
                    {lesson.title}
                  </h3>

                  <p className="text-slate-600 mt-3 leading-relaxed">
                    {lesson.content}
                  </p>

                  {lesson.keyPoints?.length > 0 && (
                    <div className="mt-5">

                      <p className="text-sm font-bold text-slate-800 mb-3">
                        Key Points
                      </p>

                      <div className="space-y-2">

                        {lesson.keyPoints.map(
                          (point, pointIndex) => (
                            <div
                              key={pointIndex}
                              className="flex gap-2 text-sm text-slate-600"
                            >

                              <CheckCircle2
                                size={17}
                                className="text-blue-600 shrink-0 mt-0.5"
                              />

                              <span>
                                {point}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>

              </div>

            </article>
          )
        )}

      </section>

      {/* =================================================
          PRACTICE
      ================================================= */}

      {content?.practice?.length > 0 && (
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Play size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Practice Tasks
              </h2>

              <p className="text-sm text-slate-500">
                Apply what you learned.
              </p>
            </div>

          </div>

          <div className="space-y-3">

            {content.practice.map(
              (task, index) => (
                <div
                  key={index}
                  className="bg-white border border-blue-100 rounded-xl p-4"
                >

                  <div className="flex gap-3">

                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                      {index + 1}
                    </span>

                    <p className="text-sm text-slate-700">
                      {task}
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </section>
      )}

      {/* =================================================
          LEARNING RESOURCES
      ================================================= */}

      {content?.resources?.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recommended Learning Resources
              </h2>

              <p className="text-sm text-slate-500">
                Curated videos and documentation for this module.
              </p>
            </div>

          </div>

          <div className="space-y-6">

            {content.resources.map(
              (resource, index) => {

                const video = resource?.video;

                return (
                  <div
                    key={`${resource.title || "resource"}-${index}`}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
                  >

                    {/* =================================================
                        VIDEO RESOURCE
                    ================================================= */}

                    {resource.type === "video" ? (

                      <div>

                        {video?.videoId ? (

                          <div className="bg-black">

                            <div className="aspect-video">

                              <iframe
                                className="w-full h-full"
                                src={
                                  video.embedUrl ||
                                  `https://www.youtube.com/embed/${video.videoId}`
                                }
                                title={
                                  video.title ||
                                  resource.title ||
                                  "Learning Video"
                                }
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />

                            </div>

                          </div>

                        ) : (

                          <div className="aspect-video bg-slate-100 flex items-center justify-center">

                            <div className="text-center px-6">

                              <div className="w-14 h-14 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center">
                                <Play
                                  size={26}
                                  className="text-slate-400"
                                />
                              </div>

                              <h3 className="font-semibold text-slate-700 mt-4">
                                Video unavailable
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                No embeddable video was found for this topic.
                              </p>

                            </div>

                          </div>

                        )}

                        {/* VIDEO DETAILS */}

                        <div className="p-5">

                          <div className="flex items-start gap-4">

                            <div className="w-11 h-11 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                              <Play size={20} />
                            </div>

                            <div className="flex-1 min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="font-bold text-slate-900">
                                  {video?.title ||
                                    resource.title ||
                                    "Learning Video"}
                                </h3>

                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600">
                                  Video
                                </span>

                              </div>

                              {video?.channelTitle && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {video.channelTitle}
                                </p>
                              )}

                              {resource.description && (
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                  {resource.description}
                                </p>
                              )}

                              {/* EXTERNAL YOUTUBE LINK */}

                              {video?.watchUrl && (
                                <a
                                  href={video.watchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition"
                                >
                                  Watch on YouTube
                                  <ExternalLink size={15} />
                                </a>
                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    ) : (

                      /* =================================================
                          DOCUMENTATION RESOURCE
                      ================================================= */

                      <div className="p-5">

                        <div className="flex items-start gap-4">

                          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <BookOpen size={20} />
                          </div>

                          <div className="flex-1 min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="font-bold text-slate-900">
                                {resource.title}
                              </h3>

                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                                Documentation
                              </span>

                            </div>

                            {resource.description && (
                              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                {resource.description}
                              </p>
                            )}

                            {resource.url ? (

                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                              >
                                Open Documentation
                                <ArrowRight size={15} />
                              </a>

                            ) : (

                              <p className="text-xs text-slate-400 mt-3">
                                Documentation link unavailable.
                              </p>

                            )}

                          </div>

                        </div>

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

        </section>
      )}

      {/* =================================================
          KNOWLEDGE CHECK
      ================================================= */}

      {content?.quiz?.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Knowledge Check
              </h2>

              <p className="text-sm text-slate-500">
                Test your understanding of this module.
              </p>

            </div>

          </div>

          <div className="space-y-6">

            {content.quiz.map(
              (question, index) => {

                const selected = answers[index];

                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-5"
                  >

                    <p className="font-semibold text-slate-900">
                      {index + 1}. {question.question}
                    </p>

                    <div className="grid gap-2 mt-4">

                      {question.options?.map(
                        (option, optionIndex) => {

                          const isSelected =
                            selected === option;

                          const isCorrect =
                            quizSubmitted &&
                            option === question.answer;

                          const isWrong =
                            quizSubmitted &&
                            isSelected &&
                            option !== question.answer;

                          return (
                            <button
                              type="button"
                              key={optionIndex}
                              disabled={quizSubmitted}
                              onClick={() =>
                                selectAnswer(
                                  index,
                                  option
                                )
                              }
                              className={`w-full text-left p-3 rounded-lg border text-sm transition ${
                                isCorrect
                                  ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                                  : isWrong
                                  ? "bg-red-50 border-red-400 text-red-700"
                                  : isSelected
                                  ? "bg-blue-50 border-blue-500 text-blue-700"
                                  : "bg-slate-50 border-slate-100 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >

                              <div className="flex items-center justify-between">

                                <span>
                                  {String.fromCharCode(
                                    65 + optionIndex
                                  )}
                                  . {option}
                                </span>

                                {isCorrect && (
                                  <CheckCircle2 size={18} />
                                )}

                                {isWrong && (
                                  <XCircle size={18} />
                                )}

                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* =================================================
              QUIZ RESULT
          ================================================= */}

          {quizSubmitted && (
            <div
              className={`mt-6 rounded-2xl p-6 ${
                quizScore >= 60
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >

              <div className="flex items-center gap-4">

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    quizScore >= 60
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >

                  {quizScore >= 60 ? (
                    <Trophy size={24} />
                  ) : (
                    <XCircle size={24} />
                  )}

                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Quiz Score: {quizScore}%
                  </h3>

                  <p className="text-sm text-slate-600 mt-1">
                    {quizScore >= 60
                      ? "Great work! You can complete this module."
                      : "You need at least 60%. Review the lessons and try again."}
                  </p>

                </div>

              </div>

              {quizScore < 60 && (
                <button
                  onClick={retakeQuiz}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Retake Knowledge Check
                </button>
              )}

            </div>
          )}

          {/* =================================================
              SUBMIT QUIZ
          ================================================= */}

          {!quizSubmitted && (
            <button
              onClick={submitQuiz}
              className="mt-6 w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Submit Knowledge Check
            </button>
          )}

        </section>
      )}

      {/* =================================================
          COMPLETE MODULE
      ================================================= */}

      <section className="bg-slate-950 text-white rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <h2 className="font-bold text-lg">
              {completed
                ? "Module Completed 🎉"
                : "Ready to continue?"}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {completed
                ? completionMessage
                : `Complete this module and continue your ${
                    targetRole || "learning"
                  } journey.`}
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => navigate("/roadmap")}
              className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition"
            >
              Back to Roadmap
            </button>

            {!completed && (
              <button
                onClick={completeModule}
                disabled={
                  completing ||
                  !quizSubmitted ||
                  quizScore < 60
                }
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {completing
                  ? "Completing..."
                  : "Complete Module"}
              </button>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}

export default LearningModule;