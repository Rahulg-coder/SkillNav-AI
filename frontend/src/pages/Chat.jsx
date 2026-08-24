import { useState } from "react";
import {
  ArrowUp,
  Bot,
  Sparkles,
  User,
  RotateCcw,
} from "lucide-react";

function Chat() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Hi! I'm your SkillPath AI mentor. What career or learning goal are you working toward?",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: getAIResponse(input),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 700);
  };

  const getAIResponse = (message) => {
    const text = message.toLowerCase();

    if (text.includes("cyber")) {
      return "Great choice! Based on your goal, I can help you build skills in networking, Linux, security fundamentals, web security, SIEM and incident response. Let's first understand your current skill level.";
    }

    if (text.includes("developer") || text.includes("full stack")) {
      return "Great! For a Full Stack Developer path, we'll typically look at HTML, CSS, JavaScript, React, Node.js, databases, APIs and deployment. I'll personalize the sequence based on your current skills.";
    }

    if (text.includes("data") || text.includes("machine learning")) {
      return "Excellent! We can build a path around Python, statistics, data analysis, machine learning and projects. I'll identify your current gaps before deciding what you should learn next.";
    }

    return "Got it! I'll analyze your goal along with your current skills and learning history to suggest the most suitable next step.";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        role: "ai",
        text: "Hi! I'm your SkillPath AI mentor. What career or learning goal are you working toward?",
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Bot size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AI Mentor
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              SkillPath AI is ready
            </div>
          </div>

        </div>

        <button
          onClick={resetChat}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <RotateCcw size={16} />
          New conversation
        </button>

      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {message.role === "ai" && (
                <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-950 text-white flex items-center justify-center">
                  <Sparkles size={17} />
                </div>
              )}

              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-slate-100 text-slate-700 rounded-bl-md"
                }`}
              >
                {message.text}
              </div>

              {message.role === "user" && (
                <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <User size={17} />
                </div>
              )}

            </div>
          ))}

        </div>

        {/* Suggested prompts */}
        <div className="px-6 pb-3">

          <p className="text-xs text-slate-400 mb-2">
            Try asking:
          </p>

          <div className="flex flex-wrap gap-2">

            {[
              "I want to become a cybersecurity engineer",
              "I want to become a full stack developer",
              "I want to learn machine learning",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                {prompt}
              </button>
            ))}

          </div>

        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4">

          <div className="flex items-end gap-3">

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell your AI mentor about your goal..."
              rows="1"
              className="flex-1 resize-none px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowUp size={20} />
            </button>

          </div>

          <p className="text-[11px] text-slate-400 text-center mt-2">
            SkillPath AI will personalize recommendations based on your
            goals, skills and progress.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Chat;