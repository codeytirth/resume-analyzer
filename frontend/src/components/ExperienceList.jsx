import React from "react";

export function ExperienceList({ experiences }) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-slate-800 flex items-center justify-between">
        <span>Work Experience</span>
        <span className="text-xs text-slate-400">{experiences.length} positions</span>
      </h3>
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative pl-6 border-l-2 border-slate-100 space-y-1">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900">{exp.title || "Position Title"}</h4>
            <p className="text-xs text-indigo-600 font-medium">{exp.company || "Company"}</p>
            {exp.duration && <p className="text-xs text-slate-400 font-mono">{exp.duration}</p>}
            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
                {exp.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx}>{resp}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
