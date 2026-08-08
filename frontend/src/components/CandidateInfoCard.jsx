import React from "react";

export function CandidateInfoCard({ candidate }) {
  if (!candidate) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{candidate.name || "Candidate Name"}</h2>
          <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500">
            {candidate.email && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {candidate.email}
              </span>
            )}
            {candidate.phone && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {candidate.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {candidate.summary && (
        <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
          <span className="font-semibold text-slate-700 block mb-1">Professional Summary</span>
          {candidate.summary}
        </div>
      )}
    </div>
  );
}
