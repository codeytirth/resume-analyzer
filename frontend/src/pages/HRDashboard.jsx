import React, { useState, useEffect } from "react";
import api from "../api/client";
import { FileUpload } from "../components/FileUpload";
import { AnalysisResults } from "../components/AnalysisResults";
import { analyzeResume } from "../api/analyze";

export function HRDashboard() {
  const [requirements, setRequirements] = useState(null);
  const [roleTitle, setRoleTitle] = useState("");
  const [reqSkills, setReqSkills] = useState("");
  const [prefSkills, setPrefSkills] = useState("");
  const [minExp, setMinExp] = useState(2);

  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      setLoadingReqs(true);
      const res = await api.get("/hr/requirements");
      setRequirements(res.data);
      setRoleTitle(res.data.role || "");
      setReqSkills(res.data.required_skills ? res.data.required_skills.join(", ") : "");
      setPrefSkills(res.data.preferred_skills ? res.data.preferred_skills.join(", ") : "");
      setMinExp(res.data.min_experience_years || 0);
    } catch (err) {
      console.error("Failed to load requirements", err);
    } finally {
      setLoadingReqs(false);
    }
  };

  const handleSaveRequirements = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    try {
      const payload = {
        role: roleTitle,
        required_skills: reqSkills.split(",").map((s) => s.trim()).filter(Boolean),
        preferred_skills: prefSkills.split(",").map((s) => s.trim()).filter(Boolean),
        min_experience_years: parseInt(minExp, 10) || 0,
      };
      await api.post("/hr/requirements", payload);
      setSaveStatus("Requirements updated successfully!");
      fetchRequirements();
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setSaveStatus("Error updating requirements");
    }
  };

  const handleEvaluateApplicant = async (file) => {
    const result = await analyzeResume(file);
    const candidateData = result.candidate || result.candidate_info || {};
    const newApplicant = {
      id: Date.now(),
      filename: file.name,
      candidate_name: candidateData.name || "Candidate",
      email: candidateData.email || "N/A",
      score: result.good_fit_score ?? result.score ?? 0,
      analysis: result,
      evaluated_at: new Date().toLocaleTimeString(),
    };

    setApplicants((prev) => [newApplicant, ...prev]);
    setSelectedApplicant(newApplicant);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">HR Recruiter Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Define job criteria, evaluate incoming applicant resumes, and rank candidates automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Requirement Configurator */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center justify-between">
            <span>⚙️ Job Requirements Config</span>
          </h2>
          {loadingReqs ? (
            <p className="text-xs text-slate-400">Loading requirement criteria...</p>
          ) : (
            <form onSubmit={handleSaveRequirements} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <textarea
                  rows={3}
                  value={reqSkills}
                  onChange={(e) => setReqSkills(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Skills (Comma separated)</label>
                <textarea
                  rows={2}
                  value={prefSkills}
                  onChange={(e) => setPrefSkills(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Min. Experience (Years)</label>
                <input
                  type="number"
                  value={minExp}
                  onChange={(e) => setMinExp(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>

              {saveStatus && (
                <p className="text-xs text-indigo-600 font-medium">{saveStatus}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
              >
                Update Job Criteria
              </button>
            </form>
          )}
        </div>

        {/* Applicant Batch Evaluation & Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800">📄 Evaluate New Applicant Resume</h2>
            <FileUpload onUploadSuccess={handleEvaluateApplicant} />
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">Candidate Leaderboard</h3>
              <span className="text-xs text-slate-400">{applicants.length} evaluated</span>
            </div>
            {applicants.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No candidate resumes evaluated yet. Upload a resume above to screen applicants.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">File</th>
                      <th className="p-3">Time</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applicants
                      .sort((a, b) => b.score - a.score)
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-800">{app.candidate_name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                              app.score >= 75 ? "bg-emerald-100 text-emerald-700" :
                              app.score >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                            }`}>
                              {app.score}/100
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{app.filename}</td>
                          <td className="p-3 text-slate-400 font-mono">{app.evaluated_at}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedApplicant(app)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Applicant Inspection Modal/View */}
      {selectedApplicant && (
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Detailed Analysis: {selectedApplicant.candidate_name}
            </h2>
            <button
              onClick={() => setSelectedApplicant(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Close Details ✕
            </button>
          </div>
          <AnalysisResults data={selectedApplicant.analysis} />
        </div>
      )}
    </div>
  );
}
