import React from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth() || {};

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            ResumeAI <span className="text-indigo-400 font-normal text-sm">Pro</span>
          </span>
        </div>

        {user && (
          <div className="flex items-center space-x-6">
            {/* Display Active Role Badge & Title */}
            <div className="px-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">
                {user.role === "candidate" ? "🎯 Job Seeker Portal" : "💼 HR Recruiter Portal"}
              </span>
            </div>

            <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 font-mono border border-slate-700 uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs font-semibold"
                title="Sign out"
              >
                <span>Logout</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
