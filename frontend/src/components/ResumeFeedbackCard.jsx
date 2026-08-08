import React from "react";

export function ResumeFeedbackCard({ missingSkills, candidateInfo }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">AI Resume Improvement Recommendations</h3>
          <p className="text-xs text-slate-500">Personalized feedback to boost your job application success</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 space-y-2">
          <h4 className="text-xs font-bold text-amber-800 flex items-center">
            <span className="mr-2">💡</span> Priority Skills to Add
          </h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            The target job requirements highlight the following missing skills. Consider acquiring certification or highlighting relevant project experience in these areas:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingSkills && missingSkills.length > 0 ? (
              missingSkills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-amber-900 border border-amber-300 shadow-2xs">
                  + {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-semibold">Great job! You match all required skills.</span>
            )}
          </div>
        </div>

        <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-2">
          <h4 className="text-xs font-bold text-indigo-900 flex items-center">
            <span className="mr-2">📝</span> Format & Content Advice
          </h4>
          <ul className="text-xs text-indigo-800 space-y-1.5 list-disc list-inside">
            <li>Quantify achievement metrics in experience bullet points (e.g., "Increased performance by 30%").</li>
            <li>Ensure technical skills keywords appear naturally in summary and bullet points.</li>
            <li>Keep experience formatting standardized with clear date ranges and job titles.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
