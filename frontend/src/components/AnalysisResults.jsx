import React from "react";
import { ScoreCard } from "./ScoreCard";
import { SkillsBadgeList } from "./SkillsBadgeList";
import { CandidateInfoCard } from "./CandidateInfoCard";
import { ExperienceList } from "./ExperienceList";

export function AnalysisResults({ data }) {
  if (!data) return null;

  const candidate = data.candidate || data.candidate_info || {};
  const score = data.good_fit_score ?? data.score ?? 0;
  const reqMatched = data.required_skills_matched || data.matched_required_skills || [];
  const prefMatched = data.preferred_skills_matched || data.matched_preferred_skills || [];
  const missing = data.missing_skills || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CandidateInfoCard candidate={candidate} />
        </div>
        <div>
          <ScoreCard
            score={score}
            details={{
              matched_required_skills: reqMatched,
              matched_preferred_skills: prefMatched,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkillsBadgeList
          title="Matched Required Skills"
          skills={reqMatched}
          variant="matched"
        />
        <SkillsBadgeList
          title="Matched Preferred Skills"
          skills={prefMatched}
          variant="preferred"
        />
        <SkillsBadgeList
          title="Missing Skills"
          skills={missing}
          variant="missing"
        />
      </div>

      {candidate?.experiences && (
        <ExperienceList experiences={candidate.experiences} />
      )}
    </div>
  );
}
