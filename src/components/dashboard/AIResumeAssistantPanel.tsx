import { useState } from "react";
import {
  analyzeATSScore,
  generateResumeSummary,
  fixResumeGrammar
} from "../../services/ai.service";
import type { ATSAnalysisResult } from "../../services/ai.service";
import {
  Sparkles,
  Award,
  BookOpen,
  FileCheck2,
  Copy,
  Check,
  TrendingUp,
  Loader2,
  ClipboardCheck,
  AlertCircle
} from "lucide-react";

export default function AIResumeAssistantPanel() {
  const [activeTab, setActiveTab] = useState<"ats" | "summary" | "grammar">("ats");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ATS States
  const [atsResume, setAtsResume] = useState("");
  const [atsJobDesc, setAtsJobDesc] = useState("");
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);

  // Summary States
  const [summaryInput, setSummaryInput] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");

  // Grammar States
  const [grammarInput, setGrammarInput] = useState("");
  const [polishedText, setPolishedText] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeATS = async () => {
    if (!atsResume.trim() || !atsJobDesc.trim()) return;
    setIsLoading(true);
    setAtsResult(null);
    try {
      const result = await analyzeATSScore(atsResume, atsJobDesc);
      setAtsResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!summaryInput.trim()) return;
    setIsLoading(true);
    setGeneratedSummary("");
    try {
      const res = await generateResumeSummary(summaryInput);
      setGeneratedSummary(res.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixGrammar = async () => {
    if (!grammarInput.trim()) return;
    setIsLoading(true);
    setPolishedText("");
    try {
      const res = await fixResumeGrammar(grammarInput);
      setPolishedText(res.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("ats")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "ats"
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          ATS Compatibility Scanner
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "summary"
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Professional Bio Summary
        </button>
        <button
          onClick={() => setActiveTab("grammar")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "grammar"
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Grammar & STAR Polisher
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "ats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Paste Resume Text
              </label>
              <textarea
                value={atsResume}
                onChange={(e) => setAtsResume(e.target.value)}
                placeholder="Paste the text content of your resume here..."
                rows={10}
                className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-xs resize-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Paste Job Description
              </label>
              <textarea
                value={atsJobDesc}
                onChange={(e) => setAtsJobDesc(e.target.value)}
                placeholder="Paste the target job description to match against..."
                rows={10}
                className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-xs resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyzeATS}
              disabled={isLoading || !atsResume.trim() || !atsJobDesc.trim()}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-850 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Scan ATS Compatibility
                </>
              )}
            </button>
          </div>

          {/* ATS Result Panel */}
          {atsResult && (
            <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-6 animate-fadeIn">
              <div className="flex items-center gap-6">
                {/* Custom Circular Progress */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className="stroke-zinc-800 fill-none"
                      strokeWidth="8"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className={`fill-none transition-all duration-1000 ${
                        atsResult.score >= 80
                          ? "stroke-emerald-500"
                          : atsResult.score >= 55
                          ? "stroke-amber-500"
                          : "stroke-red-500"
                      }`}
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * atsResult.score) / 100}
                    />
                  </svg>
                  <span className="absolute text-xl font-bold text-zinc-100">
                    {atsResult.score}%
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                    ATS Match Summary
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-lg">
                    {atsResult.score >= 80
                      ? "Excellent alignment! Your resume captures most core keywords and prerequisites."
                      : atsResult.score >= 55
                      ? "Decent alignment, but there are notable keyword gaps you should address."
                      : "Critical mismatch. Consider restructuring your experience to focus on required skills."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/80">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Matched Skills / Keywords ({atsResult.matchedKeywords?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matchedKeywords?.length > 0 ? (
                      atsResult.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full font-medium"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-600">None detected.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    Missing Keywords ({atsResult.missingKeywords?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.missingKeywords?.length > 0 ? (
                      atsResult.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[10px] bg-amber-500/10 border border-amber-500/25 text-amber-500 rounded-full font-medium"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-600">No missing critical keywords!</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Actionable Recommendations
                </span>
                <ul className="space-y-1.5">
                  {atsResult.recommendations?.map((rec, i) => (
                    <li key={i} className="text-xs text-zinc-300 list-disc list-inside">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "summary" && (
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Candidate Background (Key Skills, Projects, Experience details)
            </label>
            <textarea
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              placeholder="List some of your technical expertise or bullet points..."
              rows={5}
              className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-xs resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateSummary}
              disabled={isLoading || !summaryInput.trim()}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-850 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Generate Bio Summary
                </>
              )}
            </button>
          </div>

          {generatedSummary && (
            <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">
                  Generated Summary
                </span>
                <button
                  onClick={() => handleCopy(generatedSummary)}
                  className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-250 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{generatedSummary}"
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "grammar" && (
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Input Text (Experience points / description)
            </label>
            <textarea
              value={grammarInput}
              onChange={(e) => setGrammarInput(e.target.value)}
              placeholder="Paste the text segment or bullet point you want to fix and polish..."
              rows={5}
              className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-xs resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleFixGrammar}
              disabled={isLoading || !grammarInput.trim()}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-850 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Polishing...
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4" />
                  Fix Grammar & STAR Polish
                </>
              )}
            </button>
          </div>

          {polishedText && (
            <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">
                  Polished Text
                </span>
                <button
                  onClick={() => handleCopy(polishedText)}
                  className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-250 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {polishedText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
