import React, { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please fill out all required fields.");
      return;
    }
    if (isRegister && !email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? { username: username.trim(), email: email.trim(), password, role }
        : { username: username.trim(), password, role };

      const response = await api.post(endpoint, payload);
      login(response.data);
    } catch (err) {
      const msg = err.response?.data?.detail || "Authentication failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-indigo-100 text-indigo-600 p-3 rounded-2xl mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457-.312-2.841-.873-4.084" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isRegister ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? "Register your SQL account to save resume evaluation history"
              : "Sign in with your SQL database account"}
          </p>
        </div>

        {/* Tab Toggle between Sign In and Create Account */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isRegister ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isRegister ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="e.g. tirth"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-indigo-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="e.g. tirth@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("candidate")}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center space-y-1 ${
                  role === "candidate"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span>🎯 Job Seeker</span>
                <span className="text-[10px] font-normal text-slate-400">Optimize My Resume</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("hr")}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center space-y-1 ${
                  role === "hr"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span>💼 HR Recruiter</span>
                <span className="text-[10px] font-normal text-slate-400">Evaluate Applicants</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            {loading ? "Processing..." : isRegister ? "Create SQL Account" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
