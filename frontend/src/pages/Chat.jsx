import { useState, useEffect, useRef } from "react";
import {
  ArrowUp,
  Bot,
  Sparkles,
  User,
  RotateCcw,
} from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("skillpath_user_id");

  useEffect(() => {
    if (!userId) {
      setError("User session not found. Please login again.");
      setInitializing(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await API.get(`/ai/chat?userId=${userId}`);
        if (response.data.success && response.data.data.messages.length > 0) {
          const formattedHistory = response.data.data.messages.map((m, idx) => ({
            id: idx,
            role: m.role === "assistant" ? "ai" : "user",
            text: m.message,
          }));
          setMessages(formattedHistory);
        } else {
          setMessages([
            {
              id: 0,
              role: "ai",
              text: "Hi! I'm your personalized SkillPath AI mentor. How can I help you with your learning goals today?",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
        setMessages([
          {
            id: 0,
            role: "ai",
            text: "Hi! I'm your personalized SkillPath AI mentor. How can I help you with your learning goals today?",
          },
        ]);
      } finally {
        setInitializing(false);
      }
    };

    fetchHistory();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !userId) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/ai/chat", {
        userId,
        message: userMessage.text,
      });

      if (response.data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: "ai",
          text: response.data.data.reply,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setError(response.data.error || "Failed to get AI response.");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.response?.data?.error || "Unable to connect to AI Mentor.");
    } finally {
      setLoading(false);
    }
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
        id: Date.now(),
        role: "ai",
        text: "Hi! I'm your personalized SkillPath AI mentor. How can I help you with your learning goals today?",
      },
    ]);
  };

  if (initializing) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

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

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col min-h-0">

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
                    ? "bg-blue-600 text-white rounded-br-md whitespace-pre-wrap"
                    : "bg-slate-100 text-slate-700 rounded-bl-md"
                }`}
              >
                {message.role === "user" ? (
                  message.text
                ) : (
                  <div className="prose prose-sm max-w-none text-slate-700">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-left border-collapse" {...props} />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead className="bg-slate-50 border-b border-slate-200" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th className="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-4 py-3 border-b border-slate-100 text-sm text-slate-600 last:border-0" {...props} />
                        ),
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 mb-3 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-slate-900 mt-5 mb-3" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-slate-900 mt-4 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-base font-bold text-slate-900 mt-3 mb-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-700 hover:underline font-medium" {...props} />,
                        code: ({ node, inline, ...props }) =>
                          inline ? (
                            <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                          ) : (
                            <pre className="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-x-auto my-4 text-xs font-mono">
                              <code {...props} />
                            </pre>
                          ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <User size={17} />
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex gap-3 justify-start">
               <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-950 text-white flex items-center justify-center">
                 <Sparkles size={17} />
               </div>
               <div className="px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-700 rounded-bl-md flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="px-6 pb-3">
          <p className="text-xs text-slate-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What should I learn today?",
              "What are my biggest skill gaps?",
              "Am I ready for my target role?",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                disabled={loading}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4 shrink-0">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask your AI mentor for personalized advice..."
              rows="1"
              className="flex-1 resize-none px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowUp size={20} />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            SkillPath AI personalizes recommendations based on your unique goals, skills, and progress.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Chat;