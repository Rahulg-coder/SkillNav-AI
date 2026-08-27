import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        name,
        email,
        password,
      });

      if (!result.success) {
        setError(result.error || "Registration failed.");
        return;
      }

      const { token, user } = result.data;

      // Save authentication information
      localStorage.setItem("skillpath_token", token);
      localStorage.setItem("skillpath_user_id", user.id);
      localStorage.setItem("skillpath_user_name", user.name);
      localStorage.setItem("skillpath_user_email", user.email);
      localStorage.setItem("skillpath_logged_in", "true");

      // New users go to onboarding
      navigate("/onboarding");

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.error ||
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4">
            <Sparkles size={24} />
          </div>

          <h1 className="text-3xl font-bold text-white">
            SkillPath<span className="text-blue-400">-AI</span>
          </h1>

          <p className="text-slate-400 mt-2">
            Build your personalized learning journey
          </p>

        </div>

        <div className="bg-white rounded-3xl p-7 shadow-2xl">

          <h2 className="text-2xl font-bold text-slate-900">
            Create your account
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Let's personalize your learning experience.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}
            <div>

              <label className="text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <div className="relative mt-2">

                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Email */}
            <div>

              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>

              <div className="relative mt-2">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative mt-2">

                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Confirm Password */}
            <div>

              <label className="text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <div className="relative mt-2">

                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <p className="text-center text-sm text-slate-500 mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;