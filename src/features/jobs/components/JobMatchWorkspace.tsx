import { useState } from "react";
import {
  Briefcase,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  Copy,
  Check,
  FileText,
  ListPlus,
} from "lucide-react";
import {
  analyzeATSScore,
  improveResumeSection,
} from "../../../services/ai.service";
import type { ATSAnalysisResult } from "../../../services/ai.service";
import { useToast } from "../../../contexts/ToastContext";

interface JobMatchWorkspaceProps {
  skills: Portfolio.Skill[];
  experiences: Portfolio.Experience[];
  profile?: Portfolio.Profile;
  onAddSkill: (skillName: string) => Promise<void>;
}

export default function JobMatchWorkspace({
  skills,
  experiences,
  profile,
  onAddSkill,
}: JobMatchWorkspaceProps) {
  const { addToast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);

  // Cover Letter States
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copiedLetter, setCopiedLetter] = useState(false);

  const handleScanATS = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    setAtsResult(null);
    setCoverLetter(""); // Reset previous cover letter

    // Assemble resume content string to feed to ATS scanner
    const expText = experiences
      .map((e) => `${e.Position} at ${e.Company}: ${e.Description}`)
      .join("\n");
    const skillText = skills.map((s) => s.Name).join(", ");
    const resumeContent = `
      Name: ${profile?.FullName || "Pratyush"}
      Headline: ${profile?.Headline || ""}
      Summary: ${profile?.Summary || ""}
      Skills: ${skillText}
      Experience:
      ${expText}
    `;

    try {
      const result = await analyzeATSScore(resumeContent, jobDescription);
      setAtsResult(result);
      addToast("success", "ATS Scan complete!");
    } catch (err) {
      console.error(err);
      addToast("error", "Failed to run ATS scanner.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) return;
    setIsGeneratingLetter(true);
    setCoverLetter("");

    const expText = experiences
      .map((e) => `${e.Position} at ${e.Company}`)
      .join(", ");
    const skillText = skills.map((s) => s.Name).join(", ");
    const summaryInfo = `Name: ${profile?.FullName || "Candidate"}, Position: ${profile?.Headline || "Developer"}, Experience: ${expText}, Skills: ${skillText}`;

    try {
      const res = await improveResumeSection(
        summaryInfo,
        `Draft a highly professional and tailored cover letter for this candidate based on the following job description:\n\n${jobDescription}`,
      );
      setCoverLetter(res.result);
      addToast("success", "Cover Letter generated successfully!");
    } catch (err) {
      console.error(err);
      addToast("error", "Cover Letter generation failed.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleAddSkill = async (skillName: string) => {
    try {
      await onAddSkill(skillName);
      if (atsResult) {
        setAtsResult({
          ...atsResult,
          missingKeywords: atsResult.missingKeywords.filter(
            (k) => k !== skillName,
          ),
          matchedKeywords: [...atsResult.matchedKeywords, skillName],
        });
      }
      addToast("success", `Added ${skillName} to your skills!`);
    } catch {
      addToast("error", "Failed to add skill.");
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Upper area: Job Description input */}
      <div className="p-6 rounded-card bg-ascend-surface border border-ascend-border space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-ascend-primary" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Target Job Description
          </h3>
        </div>
        <p className="text-[11px] text-ascend-text-secondary leading-normal font-light">
          Paste the job posting description you are targeting. Ascend AI will
          analyze keywords, calculate compatibility, and draft a cover letter.
        </p>

        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job posting or requirements details here..."
          className="w-full p-4 bg-black/40 border border-ascend-border rounded-xl text-xs text-zinc-150 focus:outline-none focus:border-ascend-primary transition-colors resize-none font-sans"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleGenerateCoverLetter}
            disabled={isGeneratingLetter || !jobDescription.trim() || isLoading}
            className="px-5 py-2.5 rounded-button bg-ascend-ai/15 hover:bg-ascend-ai/25 border border-ascend-ai/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            {isGeneratingLetter ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Letter...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Cover Letter</span>
              </>
            )}
          </button>

          <button
            onClick={handleScanATS}
            disabled={isLoading || !jobDescription.trim() || isGeneratingLetter}
            className="px-6 py-2.5 rounded-button bg-linear-to-r from-ascend-primary to-ascend-ai hover:from-[#F5B301] hover:to-[#C08500] text-black text-xs font-black transition-all flex items-center gap-1.5 shadow-lg disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Analyzing Fit...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 stroke-[3px]" />
                <span>Scan ATS Compatibility</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: ATS Scanner result & Cover Letter block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ATS Results Panel */}
        {atsResult && (
          <div className="p-6 bg-ascend-surface border border-ascend-border rounded-card space-y-6 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-5">
              {/* Circular animated score */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="stroke-zinc-800 fill-none"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className={`fill-none transition-all duration-1000 ${
                      atsResult.score >= 80
                        ? "stroke-emerald-500"
                        : atsResult.score >= 55
                          ? "stroke-amber-500"
                          : "stroke-red-500"
                    }`}
                    strokeWidth="6"
                    strokeDasharray="213.6"
                    strokeDashoffset={213.6 - (213.6 * atsResult.score) / 100}
                  />
                </svg>
                <span className="absolute text-base font-bold text-white">
                  {atsResult.score}%
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  ATS Score Match
                </h4>
                <p className="text-[10.5px] text-ascend-text-secondary leading-normal font-light mt-0.5">
                  {atsResult.score >= 80
                    ? "Excellent match! Your resume structure is well aligned."
                    : atsResult.score >= 55
                      ? "Good base, but missing critical role keywords. Add them below."
                      : "Mismatched keywords. AI advises rewrite."}
                </p>
              </div>
            </div>

            {/* Missing vs Matched keywords */}
            <div className="space-y-4 pt-4 border-t border-ascend-border">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-ascend-primary uppercase tracking-wider flex items-center gap-1">
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Missing Keywords (Click to add to Resume)</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.missingKeywords.length > 0 ? (
                    atsResult.missingKeywords.map((kw, i) => (
                      <button
                        key={i}
                        onClick={() => handleAddSkill(kw)}
                        className="px-2.5 py-1 text-[10px] bg-ascend-primary/10 border border-ascend-primary/25 hover:border-ascend-primary/50 text-ascend-primary rounded-lg font-medium flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{kw}</span>
                      </button>
                    ))
                  ) : (
                    <span className="text-[10px] text-ascend-text-muted italic">
                      No missing core keywords!
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Matched Keywords</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.matchedKeywords.length > 0 ? (
                    atsResult.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-button font-medium"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-ascend-text-muted italic">
                      No matched keywords detected.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {atsResult.recommendations &&
              atsResult.recommendations.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-ascend-border">
                  <span className="text-[10px] font-bold text-ascend-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Actionable Profile Improvements</span>
                  </span>
                  <ul className="space-y-1.5 pl-1">
                    {atsResult.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="text-[10.5px] text-ascend-text-secondary list-disc list-inside leading-relaxed font-light"
                      >
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Cover Letter Panel */}
        {coverLetter && (
          <div className="p-6 bg-ascend-surface border border-ascend-border rounded-card space-y-4 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-ascend-border pb-2">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generated Cover Letter</span>
              </span>
              <button
                onClick={handleCopyLetter}
                className="p-1.5 hover:bg-white/5 text-ascend-text-secondary hover:text-white rounded-button transition-colors flex items-center gap-1 text-[10px] font-semibold"
              >
                {copiedLetter ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedLetter ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <div className="p-4 rounded-button bg-black/35 border border-ascend-border text-[10.5px] text-zinc-350 leading-relaxed font-mono whitespace-pre-wrap select-text max-h-[40vh] overflow-y-auto">
              {coverLetter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
