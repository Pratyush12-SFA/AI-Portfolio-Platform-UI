import { useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  Briefcase,
  GraduationCap,
  Terminal,
  Languages,
  Loader2,
  ListPlus,
} from "lucide-react";
import {
  improveResumeSection,
  suggestMissingSkills,
  generateResumeSummary,
} from "../../../services/ai.service";
import { useToast } from "../../../contexts/ToastContext";

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

function toDateInputValue(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

type ResumeItem = Partial<
  Portfolio.Education &
    Portfolio.Experience &
    Portfolio.Project &
    Portfolio.Skill &
    Portfolio.Certification &
    Portfolio.Achievement &
    Portfolio.Language &
    Portfolio.SocialLink &
    Portfolio.CustomSection
>;

interface ResumeWorkspaceProps {
  educations: Portfolio.Education[];
  experiences: Portfolio.Experience[];
  projects: Portfolio.Project[];
  skills: Portfolio.Skill[];
  certifications: Portfolio.Certification[];
  achievements: Portfolio.Achievement[];
  languages: Portfolio.Language[];
  socialLinks: Portfolio.SocialLink[];
  customSections: Portfolio.CustomSection[];
  profile?: Portfolio.Profile;
  onUpsertItem: (type: string, data: Record<string, unknown>) => Promise<void>;
  onDeleteItem: (type: string, id: number | undefined) => Promise<void>;
  onSaveProfile: (profileData: Portfolio.Profile) => Promise<void>;
  loadAllData: () => Promise<void>;
}

export default function ResumeWorkspace({
  educations,
  experiences,
  projects,
  skills,
  certifications,
  languages,
  socialLinks,
  customSections,
  profile,
  onUpsertItem,
  onDeleteItem,
  onSaveProfile,
}: ResumeWorkspaceProps) {
  const { addToast } = useToast();
  // Navigation Tabs within Resume
  const [activeSubTab, setActiveSubTab] = useState<string>("summary");

  // Notion-like inline edit states
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(profile?.Summary || "");
  const [targetRole, setTargetRole] = useState("");
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Form Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [modalItem, setModalItem] = useState<ResumeItem>({});

  // AI Diff Modal State
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffOriginal, setDiffOriginal] = useState("");
  const [diffRevised, setDiffRevised] = useState("");
  const [diffOnAccept, setDiffOnAccept] = useState<() => void>(() => {});

  // Suggested Skills State
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleOpenEdit = (type: string, item: ResumeItem = {}) => {
    setModalType(type);
    setModalItem({ ...item });
    setShowEditModal(true);
  };

  const handleSaveModal = async () => {
    try {
      setIsAIProcessing(true);
      await onUpsertItem(modalType, modalItem as Record<string, unknown>);
      setShowEditModal(false);
      setModalItem({});
    } catch {
      addToast("error", "Failed to save item.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  // ==========================================
  // AI ACTION HANDLERS
  // ==========================================

  const handleAISummaryAction = async (
    action: "generate" | "improve" | "expand" | "tone",
  ) => {
    setIsAIProcessing(true);
    try {
      let promptText = summaryText;
      if (action === "generate") {
        const expSummary = experiences
          .map((e) => `${e.Position} at ${e.Company}`)
          .join(", ");
        const skillSummary = skills.map((s) => s.Name).join(", ");
        promptText = `Experience: ${expSummary}. Skills: ${skillSummary}`;

        const res = await generateResumeSummary(promptText);
        setSummaryText(res.result);
      } else {
        let improved = "";
        if (action === "improve" || action === "tone") {
          const res = await improveResumeSection(
            promptText,
            action === "tone"
              ? "Format this in an ultra-professional executive tone."
              : undefined,
          );
          improved = res.result;
        } else if (action === "expand") {
          const res = await improveResumeSection(
            promptText,
            "Expand this professional summary to be more detailed, adding business impact and leadership verbs.",
          );
          improved = res.result;
        }

        // Show side-by-side comparison
        setDiffOriginal(summaryText);
        setDiffRevised(improved);
        setDiffOnAccept(() => {
          return () => {
            setSummaryText(improved);
            setShowDiffModal(false);
          };
        });
        setShowDiffModal(true);
      }
    } catch {
      addToast("error", "AI Summary generation failed.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSaveSummaryText = async () => {
    try {
      setIsAIProcessing(true);
      const updatedProfile = { ...profile, Summary: summaryText };
      await onSaveProfile(updatedProfile);
      setIsEditingSummary(false);
      addToast("success", "Summary updated!");
    } catch {
      addToast("error", "Failed to save summary.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleAIExperienceOptimize = async (
    experience: Portfolio.Experience,
    mode: "rewrite" | "star",
  ) => {
    setIsAIProcessing(true);
    try {
      let result = "";
      if (mode === "rewrite") {
        const res = await improveResumeSection(experience.Description);
        result = res.result;
      } else {
        const res = await improveResumeSection(
          experience.Description,
          "Rewrite this work description strictly following the STAR method (Situation, Task, Action, Result). Highlight quantitative achievements.",
        );
        result = res.result;
      }

      setDiffOriginal(experience.Description || "");
      setDiffRevised(result);
      setDiffOnAccept(() => {
        return async () => {
          const updated = { ...experience, Description: result };
          await onUpsertItem("experience", updated as unknown as Record<string, unknown>);
          setShowDiffModal(false);
          addToast("success", "Experience updated with AI revision!");
        };
      });
      setShowDiffModal(true);
    } catch {
      addToast("error", "AI optimization failed.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleAIProjectOptimize = async (
    project: Portfolio.Project,
    mode: "improve" | "metrics",
  ) => {
    setIsAIProcessing(true);
    try {
      let result = "";
      if (mode === "improve") {
        const res = await improveResumeSection(project.Description);
        result = res.result;
      } else {
        const res = await improveResumeSection(
          project.Description,
          "Format this project description to emphasize scale, metrics, impact, and technology stack outcomes.",
        );
        result = res.result;
      }

      setDiffOriginal(project.Description || "");
      setDiffRevised(result);
      setDiffOnAccept(() => {
        return async () => {
          const updated = { ...project, Description: result };
          await onUpsertItem("projects", updated as unknown as Record<string, unknown>);
          setShowDiffModal(false);
          addToast("success", "Project updated with AI metrics!");
        };
      });
      setShowDiffModal(true);
    } catch {
      addToast("error", "AI optimization failed.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleGetSuggestedSkills = async () => {
    if (!targetRole.trim()) return;
    setLoadingSuggestions(true);
    try {
      const expText = experiences.map((e) => e.Description).join(" ");
      const res = await suggestMissingSkills(expText, targetRole);
      setSuggestedSkills(res.result || []);
    } catch {
      addToast("error", "Failed to retrieve skill suggestions.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAddSuggestedSkill = async (skillName: string) => {
    try {
      await onUpsertItem("skills", {
        Name: skillName,
        ProficiencyLevel: "Intermediate",
        Category: "Technical",
      });
      setSuggestedSkills((prev) => prev.filter((s) => s !== skillName));
      addToast("success", `Added ${skillName} to resume!`);
    } catch {
      addToast("error", "Failed to add skill.");
    }
  };

  const tabs = [
    { id: "summary", label: "Bio Summary", icon: BookOpen },
    { id: "experience", label: "Work History", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Terminal },
    { id: "skills", label: "Skills Matrix", icon: ListPlus },
    { id: "education", label: "Education & Certs", icon: GraduationCap },
    { id: "others", label: "Other Sections", icon: Languages },
    { id: "preview", label: "Live Resume Preview", icon: Sparkles },
  ];

  return (
    <div className="space-y-6 select-none relative">
      {/* Tab Select Header */}
      <div className="flex border-b border-ascend-border overflow-x-auto scrollbar-none gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeSubTab === tab.id
                  ? "border-ascend-primary text-ascend-primary"
                  : "border-transparent text-ascend-text-secondary hover:text-ascend-text-primary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Global AI Loading Spinner Overlay */}
      {isAIProcessing && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-card">
          <div className="flex flex-col items-center gap-2 p-4 bg-ascend-surface border border-ascend-border rounded-card shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-ascend-primary" />
            <span className="text-xs font-medium text-white">
              Ascend AI processing...
            </span>
          </div>
        </div>
      )}

      {/* TABS PANELS */}

      {/* 0. LIVE RESUME PREVIEW */}
      {activeSubTab === "preview" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center no-print px-1">
            <div>
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Live Resume Preview
              </h3>
              <p className="text-[10px] text-ascend-text-secondary font-light">
                Preview your generated resume in the premium two-column template. Click "Print Resume" to export as PDF.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gradient-to-r from-ascend-primary to-ascend-ai hover:from-ascend-primary-hover hover:to-ascend-primary-mid text-white text-xs font-black rounded-button flex items-center gap-1.5 shadow-lg transition-all"
            >
              <span>Print / Export PDF</span>
            </button>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body, html {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              aside, header, nav, button, .no-print, [role="dialog"], .fixed {
                display: none !important;
              }
              main {
                padding: 0 !important;
                margin: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
              }
              .resume-preview-container {
                border: none !important;
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                background: white !important;
                color: black !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}} />

          <div className="resume-preview-container w-full max-w-[820px] mx-auto bg-ascend-surface text-ascend-text-primary rounded-card shadow-2xl border border-ascend-border overflow-hidden flex flex-col font-sans select-text">
            <div className="bg-ascend-text-primary text-white py-8 px-10 flex flex-col items-center md:items-end justify-center text-center md:text-right relative">
              <div className="absolute left-10 -bottom-8 w-24 h-24 rounded-full bg-ascend-surface-elevated border-4 border-white overflow-hidden shadow-lg hidden md:block">
                <img 
                  src={profile?.ProfilePictureUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-extrabold tracking-wide uppercase">
                {profile?.FullName || "Riya Sharma"}
              </h1>
              <p className="text-sm font-semibold tracking-wider text-white/70 mt-1 uppercase">
                {profile?.Headline || "Computer Science Graduate"}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr]">
              <div className="bg-ascend-surface-elevated p-8 space-y-8 border-r border-ascend-border">
                <div className="h-10 hidden md:block" />

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ascend-text-primary border-b-2 border-ascend-border pb-1.5">
                    Contact
                  </h3>
                  <ul className="space-y-2 text-[11px] text-ascend-text-secondary leading-relaxed font-medium">
                    <li className="flex items-center gap-2">
                      <span className="font-bold text-ascend-text-primary">📞</span>
                      <span>{profile?.PhoneNumber || "+91-98765432XX"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold text-ascend-text-primary">✉️</span>
                      <span className="break-all">{profile?.ContactEmail || "riya.sharma@email.com"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold text-ascend-text-primary">📍</span>
                      <span>{profile?.Address || "Location (City, State)"}</span>
                    </li>
                    {socialLinks && socialLinks.length > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="font-bold text-ascend-text-primary">🔗</span>
                        <span className="break-all">{socialLinks[0].Url.replace("https://", "")}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {certifications && certifications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-ascend-text-primary border-b-2 border-ascend-border pb-1.5">
                      Certifications
                    </h3>
                    <ul className="list-disc pl-4 space-y-2 text-[11px] text-ascend-text-secondary font-medium">
                      {certifications.map((cert) => (
                        <li key={cert.Id}>
                          <span className="font-bold text-ascend-text-primary">{cert.Name}</span>
                          {cert.Issuer && <span className="text-[10px] block text-ascend-text-muted">({cert.Issuer})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {languages && languages.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-ascend-text-primary border-b-2 border-ascend-border pb-1.5">
                      Languages
                    </h3>
                    <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-ascend-text-secondary font-medium">
                      {languages.map((lang) => (
                        <li key={lang.Id}>
                          {lang.Name} {lang.ProficiencyLevel && <span className="text-ascend-text-muted font-normal">({lang.ProficiencyLevel})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-8 space-y-8 bg-ascend-surface">
                <div className="relative pl-6 border-l border-ascend-border">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-ascend-text-primary border border-white" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ascend-text-primary mb-2 flex items-center gap-2">
                    Career Objective
                  </h3>
                  <p className="text-[11px] text-ascend-text-secondary leading-relaxed font-light select-text">
                    {profile?.Summary || "Motivated Computer Science graduate eager to apply programming and analytical skills in a dynamic organization."}
                  </p>
                </div>

                {skills && skills.length > 0 && (
                  <div className="relative pl-6 border-l border-ascend-border">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-ascend-text-primary border border-white" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-ascend-text-primary mb-3 flex items-center gap-2">
                      Key Skills
                    </h3>
                    <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-ascend-text-secondary font-medium">
                      {skills.map((skill) => (
                        <li key={skill.Id}>
                          {skill.Category ? (
                            <span><strong className="text-ascend-text-primary">{skill.Category}:</strong> {skill.Name}</span>
                          ) : (
                            <span>{skill.Name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {educations && educations.length > 0 && (
                  <div className="relative pl-6 border-l border-ascend-border">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-ascend-text-primary border border-white" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-ascend-text-primary mb-3 flex items-center gap-2">
                      Education
                    </h3>
                    <div className="space-y-4">
                      {educations.map((edu) => (
                        <div key={edu.Id} className="space-y-1 text-[11px]">
                          <div className="flex justify-between font-bold text-ascend-text-primary">
                            <span>{edu.Degree} {edu.FieldOfStudy && `in ${edu.FieldOfStudy}`}</span>
                            <span className="text-ascend-text-muted text-[10px] font-normal">
                              {formatDate(edu.StartDate)} - {edu.IsCurrent ? "Present" : formatDate(edu.EndDate) || "Present"}
                            </span>
                          </div>
                          <div className="text-ascend-text-secondary font-semibold">{edu.Institution}</div>
                          {edu.Grade && <div className="text-ascend-text-muted text-[10px]">{edu.Grade}</div>}
                          {edu.Description && <div className="text-ascend-text-muted font-light mt-1 text-[10px]">{edu.Description}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {((projects && projects.length > 0) || (experiences && experiences.length > 0)) && (
                  <div className="relative pl-6 border-l border-ascend-border">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-ascend-text-primary border border-white" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-ascend-text-primary mb-3 flex items-center gap-2">
                      Projects & Experience
                    </h3>
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.Id} className="space-y-1 text-[11px]">
                          <div className="flex justify-between font-bold text-ascend-text-primary">
                            <span>{exp.Position} at {exp.Company || exp.CompanyName}</span>
                            <span className="text-ascend-text-muted text-[10px] font-normal">
                              {formatDate(exp.StartDate)} - {exp.IsCurrent ? "Present" : formatDate(exp.EndDate) || ""}
                            </span>
                          </div>
                          {exp.Location && <div className="text-ascend-text-muted text-[10px]">{exp.Location}</div>}
                          {exp.Description && <p className="text-ascend-text-muted font-light mt-1 text-[10px] whitespace-pre-line">{exp.Description}</p>}
                        </div>
                      ))}
                      {projects.map((proj) => (
                        <div key={proj.Id} className="space-y-1 text-[11px]">
                          <div className="flex justify-between font-bold text-ascend-text-primary">
                            <span>{proj.Title}</span>
                            {proj.TechStack && <span className="text-ascend-text-muted text-[10px] font-normal">({proj.TechStack})</span>}
                          </div>
                          {proj.Description && <p className="text-ascend-text-muted font-light mt-1 text-[10px]">{proj.Description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABS PANELS */}

      {/* 1. PROFESSIONAL BIO SUMMARY */}
      {activeSubTab === "summary" && (
        <div className="p-6 rounded-card bg-ascend-surface border border-ascend-border space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Professional Bio Summary
              </h3>
              <p className="text-[10px] text-ascend-text-secondary font-light mt-0.5">
                Edit your profile summary directly or optimize with contextual
                AI.
              </p>
            </div>

            {!isEditingSummary ? (
              <button
                onClick={() => {
                  setSummaryText(profile?.Summary || "");
                  setIsEditingSummary(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-ascend-border bg-ascend-surface-elevated hover:border-ascend-primary/30 text-xs text-ascend-text-primary flex items-center gap-1.5 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Bio</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveSummaryText}
                  className="px-3 py-1.5 rounded-button bg-ascend-primary text-black text-xs font-bold flex items-center gap-1 hover:bg-ascend-primary/90 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditingSummary(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-ascend-text-secondary hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            {isEditingSummary ? (
              <div className="space-y-4">
                <textarea
                  rows={6}
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder="Draft your professional story or use the AI tools below to generate one from your current job history and skills..."
                  className="w-full p-4 bg-ascend-surface border border-ascend-border rounded-xl text-xs text-ascend-text-primary focus:outline-none focus:border-ascend-primary transition-colors resize-none font-sans"
                />

                {/* AI SUMMARY TOOLBAR */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-ascend-surface-elevated border border-ascend-border rounded-button">
                  <span className="text-[9px] font-bold text-ascend-text-muted uppercase tracking-widest px-2">
                    AI Tools:
                  </span>
                  <button
                    onClick={() => handleAISummaryAction("generate")}
                    className="px-2.5 py-1 text-[10px] bg-ascend-ai/15 hover:bg-ascend-ai/25 border border-ascend-ai/30 rounded-lg text-ascend-text-primary flex items-center gap-1 font-medium transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>✨ Auto-Generate</span>
                  </button>
                  <button
                    onClick={() => handleAISummaryAction("improve")}
                    className="px-2.5 py-1 text-[10px] bg-ascend-surface-elevated hover:bg-ascend-primary-light border border-ascend-border rounded-lg text-ascend-text-primary flex items-center gap-1 font-medium transition-all"
                  >
                    <span>✨ Improve Flow</span>
                  </button>
                  <button
                    onClick={() => handleAISummaryAction("expand")}
                    className="px-2.5 py-1 text-[10px] bg-ascend-surface-elevated hover:bg-ascend-primary-light border border-ascend-border rounded-lg text-ascend-text-primary flex items-center gap-1 font-medium transition-all"
                  >
                    <span>✨ Expand Detail</span>
                  </button>
                  <button
                    onClick={() => handleAISummaryAction("tone")}
                    className="px-2.5 py-1 text-[10px] bg-ascend-surface-elevated hover:bg-ascend-primary-light border border-ascend-border rounded-lg text-ascend-text-primary flex items-center gap-1 font-medium transition-all"
                  >
                    <span>✨ Executive Tone</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-button bg-ascend-surface-elevated border border-ascend-border text-xs text-ascend-text-secondary font-light leading-relaxed italic select-text">
                {profile?.Summary
                  ? `"${profile.Summary}"`
                  : "No summary drafted yet. Click 'Edit Bio' above to begin building your elevator pitch."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. EXPERIENCE WORK HISTORY */}
      {activeSubTab === "experience" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Work History
              </h3>
              <p className="text-[10px] text-ascend-text-secondary font-light">
                Structure your corporate outcomes inline. Enable STAR formatting
                via AI actions.
              </p>
            </div>
            <button
              onClick={() => handleOpenEdit("experience")}
              className="px-3 py-1.5 rounded-lg bg-ascend-primary text-black text-xs font-bold flex items-center gap-1 hover:bg-ascend-primary/90 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div className="p-8 text-center bg-ascend-surface border border-dashed border-ascend-border rounded-card text-ascend-text-muted text-xs">
                No work history added. Click 'Add Role' to add your professional
                experiences.
              </div>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.Id}
                  className="p-5 rounded-card bg-ascend-surface border border-ascend-border space-y-4 hover:border-ascend-border transition-colors relative group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                        {exp.Position}
                      </h4>
                      <span className="text-xs text-ascend-primary font-medium">
                        {exp.Company}
                      </span>
                      <span className="text-[10px] text-ascend-text-muted block mt-0.5">
                        {formatDate(exp.StartDate)} - {exp.IsCurrent ? "Present" : formatDate(exp.EndDate) || "Present"} |{" "}
                        {exp.Location || "Remote"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit("experience", exp)}
                        className="p-1.5 hover:bg-white/5 text-ascend-text-secondary hover:text-white rounded-lg transition-colors"
                        title="Edit inline"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem("experience", exp.Id)}
                        className="p-1.5 hover:bg-red-500/5 text-ascend-text-muted hover:text-red-400 rounded-lg transition-colors"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-ascend-text-secondary leading-relaxed whitespace-pre-wrap select-text font-light bg-black/10 p-3 rounded-button border border-ascend-border">
                    {exp.Description}
                  </p>

                  {/* Contextual AI Buttons */}
                  <div className="flex gap-2 border-t border-ascend-border pt-3">
                    <button
                      onClick={() => handleAIExperienceOptimize(exp, "rewrite")}
                      className="px-2.5 py-1 text-[10px] bg-ascend-surface-elevated hover:bg-ascend-primary-light border border-ascend-border text-ascend-text-primary rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-ascend-primary" />
                      <span>AI Rewrite</span>
                    </button>
                    <button
                      onClick={() => handleAIExperienceOptimize(exp, "star")}
                      className="px-2.5 py-1 text-[10px] bg-ascend-ai/10 hover:bg-ascend-ai/20 border border-ascend-ai/20 text-ascend-text-primary rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-ascend-ai" />
                      <span>STAR Format</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. PROJECTS GALLERY */}
      {activeSubTab === "projects" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Featured Projects
              </h3>
              <p className="text-[10px] text-ascend-text-secondary font-light">
                Showcase technical highlights. Let AI optimize scale metrics.
              </p>
            </div>
            <button
              onClick={() => handleOpenEdit("projects")}
              className="px-3 py-1.5 rounded-lg bg-ascend-primary text-black text-xs font-bold flex items-center gap-1 hover:bg-ascend-primary/90 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length === 0 ? (
              <div className="p-8 text-center col-span-2 bg-ascend-surface border border-dashed border-ascend-border rounded-card text-ascend-text-muted text-xs">
                No projects added yet. Add projects to populate your work
                portfolio.
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.Id}
                  className="p-5 rounded-card bg-ascend-surface border border-ascend-border flex flex-col justify-between hover:border-ascend-border transition-colors relative group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                          {proj.Title}
                        </h4>
                        {proj.Technologies && (
                          <span className="text-[10px] text-ascend-primary font-medium block mt-0.5">
                            {proj.Technologies}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit("projects", proj)}
                          className="p-1.5 hover:bg-white/5 text-ascend-text-secondary hover:text-white rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem("projects", proj.Id)}
                          className="p-1.5 hover:bg-red-500/5 text-ascend-text-muted hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-ascend-text-secondary leading-relaxed whitespace-pre-wrap select-text font-light bg-black/10 p-3 rounded-button border border-ascend-border">
                      {proj.Description}
                    </p>
                  </div>

                  {/* Contextual AI Buttons */}
                  <div className="flex gap-2 border-t border-ascend-border pt-3 mt-4">
                    <button
                      onClick={() => handleAIProjectOptimize(proj, "improve")}
                      className="px-2 py-1 text-[10px] bg-ascend-surface-elevated hover:bg-ascend-primary-light border border-ascend-border text-ascend-text-primary rounded-lg flex items-center gap-1 transition-all"
                    >
                      <span>Improve</span>
                    </button>
                    <button
                      onClick={() => handleAIProjectOptimize(proj, "metrics")}
                      className="px-2 py-1 text-[10px] bg-ascend-ai/10 hover:bg-ascend-ai/20 border border-ascend-ai/20 text-ascend-text-primary rounded-lg flex items-center gap-1 transition-all"
                    >
                      <span>Highlight Impact</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. SKILLS MATRIX */}
      {activeSubTab === "skills" && (
        <div className="space-y-6">
          <div className="p-6 rounded-card bg-ascend-surface border border-ascend-border space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
              Skills Inventory
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a new skill (e.g. Docker, TypeScript)..."
                id="new-skill-input"
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      await onUpsertItem("skills", {
                        Name: val,
                        ProficiencyLevel: "Advanced",
                        Category: "Technical",
                      });
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                className="flex-1 rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
              />
              <button
                onClick={async () => {
                  const input = document.getElementById(
                    "new-skill-input",
                  ) as HTMLInputElement;
                  const val = input?.value.trim();
                  if (val) {
                    await onUpsertItem("skills", {
                      Name: val,
                      ProficiencyLevel: "Advanced",
                      Category: "Technical",
                    });
                    input.value = "";
                  }
                }}
                className="px-4 py-2 rounded-xl bg-ascend-primary text-black text-xs font-bold hover:bg-ascend-primary/90 transition-all"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.length === 0 ? (
                <span className="text-xs text-ascend-text-muted">
                  No skills added yet. Add skills or consult the AI advisor
                  below.
                </span>
              ) : (
                skills.map((sk) => (
                  <span
                    key={sk.Id}
                    className="px-3 py-1.5 text-xs bg-ascend-surface-elevated border border-ascend-border text-ascend-text-secondary rounded-button flex items-center gap-1.5 hover:border-red-500/30 group"
                  >
                    <span>{sk.Name}</span>
                    <button
                      onClick={() => onDeleteItem("skills", sk.Id)}
                      className="text-ascend-text-muted hover:text-red-400 group-hover:text-red-400 transition-colors"
                      title="Remove skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* AI SUGGEST MATRIX */}
          <div className="p-6 rounded-card bg-ascend-surface-elevated border border-ascend-border space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-ascend-primary" />
              <h3 className="text-xs font-bold text-ascend-text-primary uppercase tracking-wider">
                AI Skill Recommender
              </h3>
            </div>
            <p className="text-[10.5px] text-ascend-text-secondary leading-normal font-light">
              Input your target career position (e.g. Senior Frontend Architect,
              DevOps Engineer) and Ascend AI will extract missing technical
              skills from your experiences compared to standard job roles.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Target Job Title (e.g. Fullstack Engineer)..."
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="flex-1 rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-ai"
              />
              <button
                onClick={handleGetSuggestedSkills}
                disabled={loadingSuggestions || !targetRole.trim()}
                className="px-4 py-2 rounded-button bg-ascend-ai hover:bg-ascend-ai/80 disabled:bg-ascend-surface-elevated text-white text-xs font-bold transition-all flex items-center gap-1"
              >
                {loadingSuggestions ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Analyze Skills"
                )}
              </button>
            </div>

            {suggestedSkills.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-ascend-text-muted uppercase tracking-widest">
                  Suggested Missing Skills (Click to append):
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skName, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddSuggestedSkill(skName)}
                      className="px-2.5 py-1.5 text-[11px] bg-ascend-ai/10 hover:bg-ascend-ai/20 border border-ascend-ai/30 text-ascend-text-primary rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{skName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. EDUCATION & CERTIFICATIONS */}
      {activeSubTab === "education" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Academic Education
              </h3>
              <button
                onClick={() => handleOpenEdit("education")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-ascend-primary hover:text-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {educations.length === 0 ? (
                <div className="p-4 text-center bg-ascend-surface border border-ascend-border rounded-button text-ascend-text-muted text-[11px]">
                  No educational credentials.
                </div>
              ) : (
                educations.map((edu) => (
                  <div
                    key={edu.Id}
                    className="p-4 rounded-button bg-ascend-surface-elevated border border-ascend-border space-y-1 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-ascend-text-primary">
                        {edu.Degree}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit("education", edu)}
                          className="text-ascend-text-muted hover:text-white p-0.5"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteItem("education", edu.Id)}
                          className="text-ascend-text-muted hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-ascend-primary font-medium">
                      {edu.Institution}
                    </p>
                    <p className="text-[10px] text-ascend-text-muted">
                      {formatDate(edu.StartDate)} - {edu.IsCurrent ? "Present" : formatDate(edu.EndDate) || "Present"} | Grade:{" "}
                      {edu.Grade || "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Certifications
              </h3>
              <button
                onClick={() => handleOpenEdit("certifications")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-ascend-primary hover:text-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {certifications.length === 0 ? (
                <div className="p-4 text-center bg-ascend-surface border border-ascend-border rounded-button text-ascend-text-muted text-[11px]">
                  No certificates.
                </div>
              ) : (
                certifications.map((cert) => (
                  <div
                    key={cert.Id}
                    className="p-4 rounded-button bg-ascend-surface-elevated border border-ascend-border space-y-1 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-ascend-text-primary">
                        {cert.Name}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit("certifications", cert)}
                          className="text-ascend-text-muted hover:text-white p-0.5"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            onDeleteItem("certifications", cert.Id)
                          }
                          className="text-ascend-text-muted hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-ascend-primary font-medium">
                      {cert.Issuer}
                    </p>
                    <p className="text-[10px] text-ascend-text-muted">
                      Issued: {formatDate(cert.IssueDate) || "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. OTHER SECTIONS (Languages, Socials, Custom) */}
      {activeSubTab === "others" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Languages */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Languages
              </h3>
              <button
                onClick={() => handleOpenEdit("languages")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-ascend-primary hover:text-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => (
                <div
                  key={lang.Id}
                  className="px-3 py-2 rounded-button bg-ascend-surface-elevated border border-ascend-border flex justify-between items-center group"
                >
                  <div>
                    <span className="text-xs font-bold text-ascend-text-primary">
                      {lang.Name}
                    </span>
                    <span className="text-[10px] text-ascend-text-muted block">
                      {lang.Proficiency || "Native"}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteItem("languages", lang.Id)}
                    className="text-ascend-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Social Links
              </h3>
              <button
                onClick={() => handleOpenEdit("social-links")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-ascend-primary hover:text-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {socialLinks.map((link) => (
                <div
                  key={link.Id}
                  className="px-3 py-2 rounded-button bg-ascend-surface-elevated border border-ascend-border flex justify-between items-center group"
                >
                  <div className="overflow-hidden mr-2">
                    <span className="text-xs font-bold text-ascend-text-primary block">
                      {link.Platform}
                    </span>
                    <span className="text-[9.5px] text-ascend-primary truncate block">
                      {link.Url}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteItem("social-links", link.Id)}
                    className="text-ascend-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Sections */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-ascend-text-primary tracking-wide">
                Custom Sections
              </h3>
              <button
                onClick={() => handleOpenEdit("custom-sections")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-ascend-primary hover:text-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {customSections.map((sec) => (
                <div
                  key={sec.Id}
                  className="p-4 rounded-button bg-ascend-surface-elevated border border-ascend-border space-y-1 relative group"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-ascend-text-primary">
                      {sec.Title}
                    </h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit("custom-sections", sec)}
                        className="text-ascend-text-muted hover:text-white p-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteItem("custom-sections", sec.Id)}
                        className="text-ascend-text-muted hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-ascend-text-secondary truncate">
                    {sec.Content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="w-full max-w-lg bg-ascend-surface border border-ascend-border rounded-card shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-ascend-border pb-3">
              <h3 className="text-sm font-bold text-ascend-text-primary uppercase tracking-wider">
                {modalItem.Id ? "Edit Item Details" : "Add New Item"}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setModalItem({});
                }}
                className="p-1 text-ascend-text-secondary hover:text-white hover:bg-white/5 rounded-lg"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* EXPERIENCE INPUTS */}
              {modalType === "experience" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Position Title
                      </label>
                      <input
                        type="text"
                        value={modalItem.Position || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            Position: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. Senior Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={modalItem.Company || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            Company: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. Google"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={toDateInputValue(modalItem.StartDate)}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            StartDate: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={toDateInputValue(modalItem.EndDate)}
                        disabled={modalItem.IsCurrent}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            EndDate: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary disabled:opacity-40"
                      />
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={modalItem.IsCurrent || false}
                          onChange={(e) =>
                            setModalItem({
                              ...modalItem,
                              IsCurrent: e.target.checked,
                              EndDate: e.target.checked ? null : modalItem.EndDate,
                            })
                          }
                          className="rounded border-ascend-border bg-ascend-surface"
                        />
                        <span className="text-[10px] text-ascend-text-secondary">
                          I currently work here
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Location
                    </label>
                    <input
                      type="text"
                      value={modalItem.Location || ""}
                      onChange={(e) =>
                        setModalItem({ ...modalItem, Location: e.target.value })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Job Description
                    </label>
                    <textarea
                      rows={5}
                      value={modalItem.Description || ""}
                      onChange={(e) =>
                        setModalItem({
                          ...modalItem,
                          Description: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface p-3 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary resize-none font-sans"
                      placeholder="List key outcomes, methodologies, and achievements..."
                    />
                  </div>
                </>
              )}

              {/* PROJECTS INPUTS */}
              {modalType === "projects" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={modalItem.Title || ""}
                        onChange={(e) =>
                          setModalItem({ ...modalItem, Title: e.target.value })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="Project title..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Technologies
                      </label>
                      <input
                        type="text"
                        value={modalItem.Technologies || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            Technologies: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="React, AWS, Node (comma separated)"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={modalItem.GithubUrl || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            GithubUrl: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={modalItem.LiveDemoUrl || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            LiveDemoUrl: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Thumbnail Image URL
                    </label>
                    <input
                      type="text"
                      value={modalItem.ThumbnailUrl || ""}
                      onChange={(e) =>
                        setModalItem({
                          ...modalItem,
                          ThumbnailUrl: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      placeholder="https://image-link.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={modalItem.Description || ""}
                      onChange={(e) =>
                        setModalItem({
                          ...modalItem,
                          Description: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface p-3 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary resize-none font-sans"
                      placeholder="Outline details, architecture choices, and metrics..."
                    />
                  </div>
                </>
              )}

              {/* EDUCATION INPUTS */}
              {modalType === "education" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={modalItem.Degree || ""}
                        onChange={(e) =>
                          setModalItem({ ...modalItem, Degree: e.target.value })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. Master of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={modalItem.Institution || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            Institution: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={modalItem.FieldOfStudy || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            FieldOfStudy: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Grade / GPA
                      </label>
                      <input
                        type="text"
                        value={modalItem.Grade || ""}
                        onChange={(e) =>
                          setModalItem({ ...modalItem, Grade: e.target.value })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. 3.9 GPA"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={toDateInputValue(modalItem.StartDate)}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            StartDate: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={toDateInputValue(modalItem.EndDate)}
                        disabled={modalItem.IsCurrent}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            EndDate: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary disabled:opacity-40"
                      />
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={modalItem.IsCurrent || false}
                          onChange={(e) =>
                            setModalItem({
                              ...modalItem,
                              IsCurrent: e.target.checked,
                              EndDate: e.target.checked ? null : modalItem.EndDate,
                            })
                          }
                          className="rounded border-ascend-border bg-ascend-surface"
                        />
                        <span className="text-[10px] text-ascend-text-secondary">
                          Currently enrolled
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* CERTIFICATIONS INPUTS */}
              {modalType === "certifications" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Cert Name
                      </label>
                      <input
                        type="text"
                        value={modalItem.Name || ""}
                        onChange={(e) =>
                          setModalItem({ ...modalItem, Name: e.target.value })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. AWS Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Issuer / Organization
                      </label>
                      <input
                        type="text"
                        value={modalItem.Issuer || ""}
                        onChange={(e) =>
                          setModalItem({ ...modalItem, Issuer: e.target.value })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={toDateInputValue(modalItem.IssueDate)}
                        onChange={(e) =>
                          setModalItem({ ...modalItem, IssueDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        value={toDateInputValue(modalItem.ExpirationDate)}
                        onChange={(e) =>
                          setModalItem({ ...modalItem, ExpirationDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Credential ID
                      </label>
                      <input
                        type="text"
                        value={modalItem.CredentialId || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            CredentialId: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="Optional ID"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                        Credential Link
                      </label>
                      <input
                        type="text"
                        value={modalItem.CredentialUrl || ""}
                        onChange={(e) =>
                          setModalItem({
                            ...modalItem,
                            CredentialUrl: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                        placeholder="Verify URL"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* LANGUAGES INPUTS */}
              {modalType === "languages" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Language Name
                    </label>
                    <input
                      type="text"
                      value={modalItem.Name || ""}
                      onChange={(e) =>
                        setModalItem({ ...modalItem, Name: e.target.value })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      placeholder="e.g. Spanish"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Proficiency
                    </label>
                    <input
                      type="text"
                      value={modalItem.Proficiency || ""}
                      onChange={(e) =>
                        setModalItem({
                          ...modalItem,
                          Proficiency: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      placeholder="e.g. Native / Professional"
                    />
                  </div>
                </div>
              )}

              {/* SOCIAL LINKS INPUTS */}
              {modalType === "social-links" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value={modalItem.Platform || ""}
                      onChange={(e) =>
                        setModalItem({ ...modalItem, Platform: e.target.value })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      placeholder="e.g. LinkedIn"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Profile URL
                    </label>
                    <input
                      type="text"
                      value={modalItem.Url || ""}
                      onChange={(e) =>
                        setModalItem({ ...modalItem, Url: e.target.value })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              {/* CUSTOM SECTIONS INPUTS */}
              {modalType === "custom-sections" && (
                <>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={modalItem.Title || ""}
                      onChange={(e) =>
                        setModalItem({ ...modalItem, Title: e.target.value })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface px-3.5 py-2 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary"
                      placeholder="e.g. Research Papers"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                      Content Text
                    </label>
                    <textarea
                      rows={4}
                      value={modalItem.Content || ""}
                      onChange={(e) =>
                        setModalItem({ ...modalItem, Content: e.target.value })
                      }
                      className="w-full rounded-xl border border-ascend-border bg-ascend-surface p-3 text-xs text-ascend-text-primary outline-none focus:border-ascend-primary resize-none font-sans"
                      placeholder="Enter custom structured content details..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-ascend-border pt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setModalItem({});
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-ascend-text-secondary hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2 bg-ascend-primary text-black hover:bg-ascend-primary/90 rounded-button text-xs font-bold"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI SIDE-BY-SIDE DIFF REVISION COMPARISON DIALOG */}
      {showDiffModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print animate-fadeIn">
          <div className="w-full max-w-3xl bg-ascend-surface border border-ascend-border rounded-card shadow-2xl p-6 flex flex-col h-[75vh]">
            <div className="flex justify-between items-center border-b border-ascend-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-ascend-primary" />
                <h3 className="text-sm font-bold text-ascend-text-primary uppercase tracking-wider">
                  Review AI Ascend Refactoring
                </h3>
              </div>
              <button
                onClick={() => setShowDiffModal(false)}
                className="p-1.5 text-ascend-text-muted hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Left and Right Diff block */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 py-5 overflow-hidden">
              <div className="flex flex-col h-full overflow-hidden">
                <span className="text-[10px] font-bold text-ascend-text-muted uppercase tracking-widest mb-1.5 block px-1">
                  Original Draft:
                </span>
                <div className="flex-1 p-4 rounded-button bg-ascend-surface-elevated border border-ascend-border text-ascend-text-secondary text-xs leading-relaxed overflow-y-auto select-text font-light whitespace-pre-wrap">
                  {diffOriginal}
                </div>
              </div>

              <div className="flex flex-col h-full overflow-hidden">
                <span className="text-[10px] font-bold text-ascend-primary uppercase tracking-widest mb-1.5 block px-1">
                  AI Optimized Draft:
                </span>
                <div className="flex-1 p-4 rounded-button bg-ascend-ai/5 border border-ascend-ai/20 text-ascend-text-secondary text-xs leading-relaxed overflow-y-auto select-text font-medium whitespace-pre-wrap">
                  {diffRevised}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-ascend-border pt-4">
              <button
                onClick={() => setShowDiffModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-ascend-text-secondary hover:text-white rounded-xl text-xs font-semibold"
              >
                Discard Change
              </button>
              <button
                onClick={diffOnAccept}
                className="px-6 py-2 bg-gradient-to-r from-ascend-primary to-ascend-ai hover:from-ascend-primary-hover hover:to-ascend-primary-mid text-white rounded-button text-xs font-black shadow-lg transition-all"
              >
                Accept Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
