import React, { useState } from "react";
import { FileUpload } from "../components/FileUpload";
import { CandidateInfoCard } from "../components/CandidateInfoCard";
import { SkillsBadgeList } from "../components/SkillsBadgeList";
import { ExperienceList } from "../components/ExperienceList";
import { ResumeFeedbackCard } from "../components/ResumeFeedbackCard";
import { analyzeResume } from "../api/analyze";

export function JobSeekerDashboard() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleUpload = async (file) => {
    const result = await analyzeResume(file);
    setAnalysisResult(result);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Job Seeker AI Resume Assistant</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume to get instant AI recommendations, discover missing skills, and improve your resume for target job descriptions.
        </p>
      </div>

      <FileUpload onUploadSuccess={handleUpload} />

      {analysisResult && (
        <div className="pt-4 border-t border-slate-200 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Your Resume AI Analysis</h2>
          
          <CandidateInfoCard candidate={analysisResult.candidate_info} />

          <ResumeFeedbackCard
            missingSkills={analysisResult.missing_skills}
            candidateInfo={analysisResult.candidate_info}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkillsBadgeList
              title="Matched Required Skills"
              skills={analysisResult.matched_required_skills}
              variant="matched"
            />
            <SkillsBadgeList
              title="Matched Preferred Skills"
              skills={analysisResult.matched_preferred_skills}
              variant="preferred"
            />
            <SkillsBadgeList
              title="Skills to Acquire (Missing)"
              skills={analysisResult.missing_skills}
              variant="missing"
            />
          </div>

          {analysisResult.candidate_info?.experiences && (
            <ExperienceList experiences={analysisResult.candidate_info.experiences} />
          )}
        </div>
      )}
    </div>
  );
}
