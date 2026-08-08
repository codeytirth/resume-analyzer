import React from "react";

export function ScoreCard({ score, details }) {
  let colorClass = "text-emerald-600 bg-emerald-50 border-emerald-200";
  let badgeText = "Excellent Match";

  if (score < 50) {
    colorClass = "text-rose-600 bg-rose-50 border-rose-200";
    badgeText = "Needs Improvement";
  } else if (score < 75) {
    colorClass = "text-amber-600 bg-amber-50 border-amber-200";
    badgeText = "Moderate Match";
  }

  return (
    <div className={`p-6 rounded-2xl border ${colorClass} flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
        Overall Good Fit Score
      </span>
      <div className="text-5xl font-black my-2 tracking-tight">
        {score}
        <span className="text-2xl font-normal text-slate-400">/100</span>
      </div>
      <span className="mt-1 px-3 py-1 text-xs font-bold rounded-full border bg-white/80 shadow-xs">
        {badgeText}
      </span>
      {details && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 w-full grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-700">Req. Skills:</span> {details.matched_required_skills?.length || 0}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Pref. Skills:</span> {details.matched_preferred_skills?.length || 0}
          </div>
        </div>
      )}
    </div>
  );
}
