import React from "react";

export function SkillsBadgeList({ title, skills, variant = "matched" }) {
  const styles = {
    matched: "bg-emerald-50 text-emerald-700 border-emerald-200",
    preferred: "bg-indigo-50 text-indigo-700 border-indigo-200",
    missing: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const icons = {
    matched: "✓",
    preferred: "★",
    missing: "✕",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
          {skills?.length || 0}
        </span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills && skills.length > 0 ? (
          skills.map((skill, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${styles[variant]}`}
            >
              <span className="mr-1.5 font-bold">{icons[variant]}</span>
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400 italic">None listed</span>
        )}
      </div>
    </div>
  );
}
