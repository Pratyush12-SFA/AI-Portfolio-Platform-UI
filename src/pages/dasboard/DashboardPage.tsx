import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../queries/auth.queries";
import { useAuth } from "../../contexts/Authcontext/queries";
import {
  getProfile,
  upsertProfile,
  getResumeData,
  upsertResumeData,
  deleteResumeData,
  getActiveSessions,
  revokeSession,
  changePassword,
  requestVerificationEmail,
} from "../../services/portfolio.service";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Terminal,
  FileText,
  Settings,
  Languages,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Laptop,
  CheckCircle,
  Menu,
  X,
  Palette,
  ShieldAlert,
  Bot,
  Sparkles,
} from "lucide-react";
import AICoachingPanel from "../../components/dashboard/AICoachingPanel";
import AIResumeAssistantPanel from "../../components/dashboard/AIResumeAssistantPanel";

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Success/Error Alerts
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Data States
  const [profile, setProfile] = useState<any>({
    Headline: "",
    Summary: "",
    PhoneNumber: "",
    ContactEmail: "",
    Address: "",
    ThemeName: "ModernDark",
    CustomSlug: "",
    IsDarkModePreferred: true,
  });

  const [educations, setEducations] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  // Editing Item States
  const [activeEditType, setActiveEditType] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>({});

  // Account Settings States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadAllData = async () => {
    try {
      const prof = await getProfile();
      if (prof) setProfile(prof);

      const edus = await getResumeData("education");
      setEducations(edus || []);

      const exps = await getResumeData("experience");
      setExperiences(exps || []);

      const projs = await getResumeData("projects");
      setProjects(projs || []);

      const sks = await getResumeData("skills");
      setSkills(sks || []);

      const certs = await getResumeData("certifications");
      setCertifications(certs || []);

      const achs = await getResumeData("achievements");
      setAchievements(achs || []);

      const langs = await getResumeData("languages");
      setLanguages(langs || []);

      const socials = await getResumeData("social-links");
      setSocialLinks(socials || []);

      const customs = await getResumeData("custom-sections");
      setCustomSections(customs || []);

      const activeSess = await getActiveSessions();
      setSessions(activeSess || []);
    } catch {
      triggerAlert("error", "Failed to retrieve portfolio details.");
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertProfile(profile);
      triggerAlert("success", "Profile preferences saved successfully!");
    } catch {
      triggerAlert("error", "Failed to save profile preferences.");
    }
  };

  const handleUpsertItem = async (type: string) => {
    try {
      const res = await upsertResumeData(type, editItem);
      if (res.success) {
        triggerAlert("success", "Saved successfully!");
        loadAllData();
        setActiveEditType(null);
        setEditItem({});
      }
    } catch {
      triggerAlert("error", "Save failed.");
    }
  };

  const handleDeleteItem = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await deleteResumeData(type, id);
      if (res.success) {
        triggerAlert("success", "Deleted successfully!");
        loadAllData();
      }
    } catch {
      triggerAlert("error", "Delete failed.");
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    if (!confirm("Revoke this session? This will force-logout the device."))
      return;
    try {
      const res = await revokeSession(sessionId);
      if (res.success) {
        triggerAlert("success", "Session revoked successfully.");
        const activeSess = await getActiveSessions();
        setSessions(activeSess || []);
      }
    } catch {
      triggerAlert("error", "Failed to revoke session.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await changePassword({ oldPassword, newPassword });
      if (res.success) {
        triggerAlert("success", "Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        triggerAlert("error", res.message || "Failed to change password.");
      }
    } catch {
      triggerAlert("error", "Error updating password.");
    }
  };

  const handleVerificationRequest = async () => {
    try {
      const res = await requestVerificationEmail();
      if (res.success) {
        triggerAlert(
          "success",
          "Verification link sent! Check your email (or console logs).",
        );
      }
    } catch {
      triggerAlert("error", "Verification request failed.");
    }
  };

  // Multiple Resume Templates Layout Selector
  const [resumeTemplate, setResumeTemplate] = useState("elegant");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans flex flex-col lg:flex-row">
      {/* Alert Banner */}
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl border flex items-center gap-3 backdrop-blur-md shadow-2xl transition duration-300 ${
            alert.type === "success"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <ShieldAlert className="w-5 h-5" />
          )}
          <span className="font-medium text-sm">{alert.message}</span>
        </div>
      )}

      {/* Sidebar - Asymmetric Minimal layout */}
      <aside className="w-full lg:w-72 bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between p-6 no-print">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center font-black text-black">
                P
              </div>
              <span className="font-bold tracking-tight text-lg">
                AI Portfolio
              </span>
            </div>
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={`space-y-1.5 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}
          >
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "resume", label: "Resume Builder", icon: FileText },
              { id: "ai-coach", label: "AI Career Coach", icon: Bot },
              { id: "resume-ai", label: "AI Resume Tools", icon: Sparkles },
              { id: "portfolio", label: "Portfolio Theme", icon: Palette },
              { id: "sessions", label: "Active Sessions", icon: Laptop },
              { id: "settings", label: "Account Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-200 ${
                    activeTab === item.id
                      ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div
          className={`pt-6 border-t border-white/5 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}
        >
          <button
            onClick={async () => {
              await logoutUser();
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/5 transition duration-200"
          >
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 lg:p-12 max-w-5xl mx-auto w-full print-page">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-8 no-print">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Personal Information
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Configure your personal public profile details.
              </p>
            </div>

            <form
              onSubmit={handleProfileSave}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 p-8 rounded-2xl"
            >
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Profile Headline
                </label>
                <input
                  type="text"
                  value={profile.Headline || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, Headline: e.target.value })
                  }
                  placeholder="Senior Software Architect | Tech Enthusiast"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Profile Picture Link
                </label>
                <input
                  type="text"
                  value={profile.ProfilePictureUrl || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      ProfilePictureUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={profile.ContactEmail || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, ContactEmail: e.target.value })
                  }
                  placeholder="contact@mydomain.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile.PhoneNumber || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, PhoneNumber: e.target.value })
                  }
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-400 mb-2">
                  Location Address
                </label>
                <input
                  type="text"
                  value={profile.Address || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, Address: e.target.value })
                  }
                  placeholder="San Francisco, CA"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-400 mb-2">
                  Professional Summary / Bio
                </label>
                <textarea
                  rows={4}
                  value={profile.Summary || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, Summary: e.target.value })
                  }
                  placeholder="Describe your goals, experience, and passions..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RESUME BUILDER TAB */}
        {activeTab === "resume" && (
          <div className="space-y-8 print-page">
            <div className="flex justify-between items-center no-print">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Resume Builder
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Structure and export a print-ready PDF resume.
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] transition"
              >
                Export PDF
              </button>
            </div>

            {/* Resume Editor Forms / Sections - Side-by-side or stacked in UI */}
            <div className="space-y-6 no-print">
              {/* SECTION CONTROLS ACCORDION */}
              {[
                {
                  id: "education",
                  label: "Education",
                  icon: GraduationCap,
                  items: educations,
                },
                {
                  id: "experience",
                  label: "Work Experience",
                  icon: Briefcase,
                  items: experiences,
                },
                {
                  id: "projects",
                  label: "Projects",
                  icon: Terminal,
                  items: projects,
                },
                { id: "skills", label: "Skills", icon: Award, items: skills },
                {
                  id: "certifications",
                  label: "Certifications",
                  icon: CheckCircle,
                  items: certifications,
                },
                {
                  id: "achievements",
                  label: "Achievements",
                  icon: Award,
                  items: achievements,
                },
                {
                  id: "languages",
                  label: "Languages",
                  icon: Languages,
                  items: languages,
                },
                {
                  id: "social-links",
                  label: "Social Links",
                  icon: ExternalLink,
                  items: socialLinks,
                },
                {
                  id: "custom-sections",
                  label: "Custom Sections",
                  icon: FileText,
                  items: customSections,
                },
              ].map((sect) => (
                <div
                  key={sect.id}
                  className="border border-white/5 bg-white/[0.01] rounded-2xl p-6 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <sect.icon className="w-5 h-5 text-amber-500" />
                      <h3 className="font-bold text-lg">{sect.label}</h3>
                    </div>
                    <button
                      onClick={() => {
                        setActiveEditType(sect.id);
                        setEditItem({});
                      }}
                      className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-amber-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>

                  {/* List items inside the section */}
                  <div className="space-y-2">
                    {sect.items?.map((item: any) => (
                      <div
                        key={item.Id}
                        className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm"
                      >
                        <div>
                          <div className="font-semibold text-white">
                            {item.Institution ||
                              item.CompanyName ||
                              item.Title ||
                              item.Name ||
                              item.LanguageName ||
                              item.PlatformName ||
                              item.SectionTitle}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {item.Degree ||
                              item.Designation ||
                              item.ShortDescription ||
                              item.Category ||
                              item.Proficiency ||
                              item.Url}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveEditType(sect.id);
                              setEditItem(item);
                            }}
                            className="p-2 text-zinc-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(sect.id, item.Id)}
                            className="p-2 text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!sect.items || sect.items.length === 0) && (
                      <div className="text-zinc-500 text-xs py-2">
                        No items added yet.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* INLINE EDIT POPUP MODAL (NO-PRINT) */}
            {activeEditType && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
                <div className="w-full max-w-lg rounded-2xl bg-[#0b0b0e] border border-white/10 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl uppercase tracking-tight text-amber-500">
                      Edit {activeEditType}
                    </h3>
                    <button
                      onClick={() => setActiveEditType(null)}
                      className="p-1 hover:text-red-400"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Render inputs dynamically based on edit type */}
                    {activeEditType === "education" && (
                      <>
                        <input
                          type="text"
                          placeholder="Institution"
                          value={editItem.Institution || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Institution: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={editItem.Degree || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Degree: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Field Of Study"
                          value={editItem.FieldOfStudy || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              FieldOfStudy: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            placeholder="Start Date"
                            value={
                              editItem.StartDate
                                ? editItem.StartDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                StartDate: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                          />
                          <input
                            type="date"
                            placeholder="End Date"
                            value={
                              editItem.EndDate
                                ? editItem.EndDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                EndDate: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Grade (GPA)"
                          value={editItem.Grade || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Grade: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <textarea
                          placeholder="Description"
                          rows={3}
                          value={editItem.Description || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Description: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none resize-none"
                        />
                      </>
                    )}

                    {activeEditType === "experience" && (
                      <>
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={editItem.CompanyName || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              CompanyName: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Designation"
                          value={editItem.Designation || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Designation: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Employment Type (e.g. Full-time)"
                          value={editItem.EmploymentType || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              EmploymentType: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={editItem.Location || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Location: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            placeholder="Start Date"
                            value={
                              editItem.StartDate
                                ? editItem.StartDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                StartDate: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                          />
                          <input
                            type="date"
                            placeholder="End Date"
                            value={
                              editItem.EndDate
                                ? editItem.EndDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                EndDate: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                          />
                        </div>
                        <textarea
                          placeholder="Description"
                          rows={3}
                          value={editItem.Description || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Description: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none resize-none"
                        />
                      </>
                    )}

                    {activeEditType === "projects" && (
                      <>
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={editItem.Title || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Title: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Short Description"
                          value={editItem.ShortDescription || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              ShortDescription: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <textarea
                          placeholder="Full Description"
                          rows={3}
                          value={editItem.Description || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Description: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none resize-none"
                        />
                        <input
                          type="text"
                          placeholder="Tech Stack (comma separated)"
                          value={editItem.TechStack || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              TechStack: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="GitHub URL"
                          value={editItem.GithubUrl || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              GithubUrl: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Live Demo URL"
                          value={editItem.LiveDemoUrl || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              LiveDemoUrl: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Thumbnail Image URL"
                          value={editItem.ThumbnailUrl || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              ThumbnailUrl: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                      </>
                    )}

                    {activeEditType === "skills" && (
                      <>
                        <input
                          type="text"
                          placeholder="Skill Name"
                          value={editItem.Name || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Name: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g. Frontend)"
                          value={editItem.Category || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Category: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">
                            Proficiency ({editItem.ProficiencyPercentage || 0}%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editItem.ProficiencyPercentage || 0}
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                ProficiencyPercentage: parseInt(e.target.value),
                              })
                            }
                            className="w-full accent-amber-500"
                          />
                        </div>
                      </>
                    )}

                    {activeEditType === "certifications" && (
                      <>
                        <input
                          type="text"
                          placeholder="Certification Title"
                          value={editItem.Title || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Title: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Issuing Organization"
                          value={editItem.IssuingOrganization || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              IssuingOrganization: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Credential URL"
                          value={editItem.CertificateUrl || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              CertificateUrl: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            placeholder="Issue Date"
                            value={
                              editItem.IssueDate
                                ? editItem.IssueDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                IssueDate: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                          />
                          <input
                            type="date"
                            placeholder="Expiry Date"
                            value={
                              editItem.ExpiryDate
                                ? editItem.ExpiryDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                ExpiryDate: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                          />
                        </div>
                      </>
                    )}

                    {activeEditType === "achievements" && (
                      <>
                        <input
                          type="text"
                          placeholder="Achievement Title"
                          value={editItem.Title || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Title: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Issuer"
                          value={editItem.Issuer || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Issuer: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="date"
                          placeholder="Date Received"
                          value={
                            editItem.DateReceived
                              ? editItem.DateReceived.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              DateReceived: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <textarea
                          placeholder="Description"
                          rows={3}
                          value={editItem.Description || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Description: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none resize-none"
                        />
                      </>
                    )}

                    {activeEditType === "languages" && (
                      <>
                        <input
                          type="text"
                          placeholder="Language Name"
                          value={editItem.LanguageName || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              LanguageName: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Proficiency (e.g. Native, Fluent)"
                          value={editItem.Proficiency || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Proficiency: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                      </>
                    )}

                    {activeEditType === "social-links" && (
                      <>
                        <input
                          type="text"
                          placeholder="Platform Name (e.g. GitHub)"
                          value={editItem.PlatformName || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              PlatformName: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={editItem.Url || ""}
                          onChange={(e) =>
                            setEditItem({ ...editItem, Url: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                      </>
                    )}

                    {activeEditType === "custom-sections" && (
                      <>
                        <input
                          type="text"
                          placeholder="Section Title"
                          value={editItem.SectionTitle || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              SectionTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                        <textarea
                          placeholder="Section Content"
                          rows={5}
                          value={editItem.Content || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              Content: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none resize-none"
                        />
                      </>
                    )}
                  </div>

                  <div className="flex gap-4 justify-end pt-4">
                    <button
                      onClick={() => setActiveEditType(null)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpsertItem(activeEditType)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW RESUME TEMPLATE (VISIBLE ON PRINT) */}
            <div className="no-print bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Select Resume Template</h3>
                <div className="flex gap-2">
                  {["elegant", "minimal", "bold"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setResumeTemplate(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                        resumeTemplate === t
                          ? "bg-amber-500 text-black"
                          : "bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW CONTAINER */}
            <div className="bg-white text-black p-8 lg:p-12 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-6 print-page bg-white-important">
              {resumeTemplate === "elegant" && (
                <div className="space-y-6">
                  <div className="text-center border-b pb-6 space-y-2">
                    <h1 className="text-4xl font-serif font-bold text-zinc-900">
                      {profile.FullName || "John Doe"}
                    </h1>
                    <p className="text-sm tracking-wide text-zinc-500 uppercase">
                      {profile.Headline || "Tech Professional"}
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-zinc-600">
                      {profile.ContactEmail && (
                        <span>{profile.ContactEmail}</span>
                      )}
                      {profile.PhoneNumber && (
                        <span>{profile.PhoneNumber}</span>
                      )}
                      {profile.Address && <span>{profile.Address}</span>}
                    </div>
                  </div>

                  {profile.Summary && (
                    <div className="space-y-1">
                      <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                        Summary
                      </h2>
                      <p className="text-sm leading-relaxed text-zinc-700">
                        {profile.Summary}
                      </p>
                    </div>
                  )}

                  {experiences.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-bold border-b pb-1">
                        Experience
                      </h2>
                      {experiences.map((exp) => (
                        <div key={exp.Id} className="text-sm space-y-1">
                          <div className="flex justify-between font-bold text-zinc-900">
                            <span>
                              {exp.Designation} • {exp.CompanyName}
                            </span>
                            <span className="font-normal text-zinc-500">
                              {new Date(exp.StartDate).toLocaleDateString(
                                undefined,
                                { year: "numeric", month: "short" },
                              )}{" "}
                              -{" "}
                              {exp.EndDate
                                ? new Date(exp.EndDate).toLocaleDateString(
                                    undefined,
                                    { year: "numeric", month: "short" },
                                  )
                                : "Present"}
                            </span>
                          </div>
                          <p className="text-zinc-600 leading-relaxed text-xs">
                            {exp.Description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {educations.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-bold border-b pb-1">
                        Education
                      </h2>
                      {educations.map((edu) => (
                        <div key={edu.Id} className="text-sm space-y-1">
                          <div className="flex justify-between font-bold text-zinc-900">
                            <span>
                              {edu.Degree}{" "}
                              {edu.FieldOfStudy ? `in ${edu.FieldOfStudy}` : ""}
                            </span>
                            <span className="font-normal text-zinc-500">
                              {new Date(edu.StartDate).getFullYear()} -{" "}
                              {edu.EndDate
                                ? new Date(edu.EndDate).getFullYear()
                                : "Present"}
                            </span>
                          </div>
                          <div className="text-zinc-600 text-xs">
                            {edu.Institution}{" "}
                            {edu.Grade ? `• Grade: ${edu.Grade}` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {resumeTemplate === "minimal" && (
                <div className="space-y-8 font-sans">
                  <div className="flex justify-between items-start border-b pb-6">
                    <div>
                      <h1 className="text-3xl font-extrabold text-zinc-950">
                        {profile.FullName || "John Doe"}
                      </h1>
                      <p className="text-zinc-600 text-sm mt-1">
                        {profile.Headline}
                      </p>
                    </div>
                    <div className="text-right text-xs text-zinc-500 space-y-0.5">
                      <div>{profile.ContactEmail}</div>
                      <div>{profile.PhoneNumber}</div>
                      <div>{profile.Address}</div>
                    </div>
                  </div>

                  {experiences.length > 0 && (
                    <div className="grid grid-cols-[120px_1fr] gap-6">
                      <h2 className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">
                        Experience
                      </h2>
                      <div className="space-y-6">
                        {experiences.map((exp) => (
                          <div key={exp.Id} className="space-y-1 text-sm">
                            <h3 className="font-bold text-zinc-900">
                              {exp.Designation}
                            </h3>
                            <div className="text-xs text-zinc-500">
                              {exp.CompanyName} •{" "}
                              {new Date(exp.StartDate).getFullYear()} -{" "}
                              {exp.EndDate
                                ? new Date(exp.EndDate).getFullYear()
                                : "Present"}
                            </div>
                            <p className="text-zinc-600 leading-relaxed text-xs">
                              {exp.Description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {resumeTemplate === "bold" && (
                <div className="space-y-6">
                  <div className="bg-zinc-950 text-white p-6 -mx-8 -mt-8 flex justify-between items-center">
                    <div>
                      <h1 className="text-4xl font-black">
                        {profile.FullName || "John Doe"}
                      </h1>
                      <p className="text-amber-500 uppercase tracking-widest text-xs font-bold mt-1">
                        {profile.Headline}
                      </p>
                    </div>
                    <div className="text-right text-xs text-zinc-400">
                      <div>{profile.ContactEmail}</div>
                      <div>{profile.PhoneNumber}</div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    {experiences.length > 0 && (
                      <div className="space-y-3">
                        <h2 className="text-sm font-black uppercase tracking-wider text-amber-600">
                          Employment
                        </h2>
                        {experiences.map((exp) => (
                          <div key={exp.Id} className="text-xs space-y-1">
                            <div className="font-bold text-zinc-900">
                              {exp.Designation} / {exp.CompanyName}
                            </div>
                            <p className="text-zinc-600">{exp.Description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PORTFOLIO BUILDER TAB */}
        {activeTab === "portfolio" && (
          <div className="space-y-8 no-print">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Portfolio Settings
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Configure your public portfolio hosted landing page.
              </p>
            </div>

            <form
              onSubmit={handleProfileSave}
              className="space-y-6 bg-white/[0.01] border border-white/5 p-8 rounded-2xl"
            >
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Public Portfolio URL Slug
                </label>
                <div className="flex gap-2">
                  <span className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-zinc-500 flex items-center text-sm">
                    http://localhost:5173/portfolio/
                  </span>
                  <input
                    type="text"
                    value={profile.CustomSlug || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        CustomSlug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    placeholder="my-custom-url"
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  {profile.CustomSlug && (
                    <a
                      href={`/portfolio/${profile.CustomSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Select Portfolio Theme
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "ModernDark",
                      label: "Modern Dark (Amber)",
                      desc: "Sleek dark layout with luxury gold/amber highlight details.",
                    },
                    {
                      id: "Cyberpunk",
                      label: "Cyberpunk Green",
                      desc: "Retro-futurism with neon green terminal styled colors.",
                    },
                    {
                      id: "ClassicCharcoal",
                      label: "Classic Charcoal",
                      desc: "Clean corporate grey look with structured layout borders.",
                    },
                  ].map((themeOpt) => (
                    <button
                      key={themeOpt.id}
                      type="button"
                      onClick={() =>
                        setProfile({ ...profile, ThemeName: themeOpt.id })
                      }
                      className={`p-6 rounded-xl border text-left space-y-2 transition duration-200 ${
                        profile.ThemeName === themeOpt.id
                          ? "border-amber-500 bg-amber-500/5"
                          : "border-white/5 bg-white/[0.01] hover:border-white/10"
                      }`}
                    >
                      <div className="font-bold text-sm">{themeOpt.label}</div>
                      <div className="text-zinc-500 text-xs leading-relaxed">
                        {themeOpt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl transition hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                >
                  Save Theme Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ACTIVE SESSIONS TAB */}
        {activeTab === "sessions" && (
          <div className="space-y-8 no-print">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Active Sessions
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Review and revoke active devices logged into your account.
              </p>
            </div>

            <div className="border border-white/5 bg-white/[0.01] rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-400">
                    <th className="p-4 font-semibold">Device / Browser</th>
                    <th className="p-4 font-semibold">IP Address</th>
                    <th className="p-4 font-semibold">Last Activity</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.map((sess) => (
                    <tr key={sess.Id}>
                      <td className="p-4 flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-amber-500" />
                        <div>
                          <div className="font-semibold">
                            {sess.Browser || "Unknown Browser"}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {sess.UserAgent || "Web Device"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">
                        {sess.CreatedFromIp || "127.0.0.1"}
                      </td>
                      <td className="p-4 text-zinc-500">
                        {sess.LastActivityOn
                          ? new Date(sess.LastActivityOn).toLocaleString()
                          : new Date(sess.CreatedOn).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() =>
                            handleRevokeSession(sess.RefreshTokenId)
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition"
                        >
                          Revoke Session
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-500">
                        No active sessions retrieved.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACCOUNT SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-8 no-print">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Account Settings
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Manage email verification and passwords.
              </p>
            </div>

            {/* Email Verification Card */}
            <div className="border border-white/5 bg-white/[0.01] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="font-bold text-lg">Verify Email Address</h3>
                <p className="text-zinc-400 text-xs mt-1">
                  Ensure your account is fully verified to recover password
                  options.
                </p>
              </div>
              <button
                onClick={handleVerificationRequest}
                className="px-5 py-2.5 rounded-xl border border-amber-500/20 text-amber-400 hover:bg-amber-500/5 font-semibold text-sm transition"
              >
                Send Verification Link
              </button>
            </div>

            {/* Password Change Form */}
            <form
              onSubmit={handleChangePassword}
              className="space-y-5 bg-white/[0.01] border border-white/5 p-8 rounded-2xl"
            >
              <h3 className="font-bold text-lg">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl transition hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* AI CAREER COACH TAB */}
        {activeTab === "ai-coach" && (
          <div className="space-y-8 no-print animate-fadeIn">
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
                <Bot className="text-amber-500 w-8 h-8" />
                AI Career Coach
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Consult with Antigravity, your dedicated AI career advisor and mock technical interviewer.
              </p>
            </div>
            <AICoachingPanel />
          </div>
        )}

        {/* AI RESUME TOOLS TAB */}
        {activeTab === "resume-ai" && (
          <div className="space-y-8 no-print animate-fadeIn">
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
                <Sparkles className="text-amber-500 w-8 h-8" />
                AI Resume Tools
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Optimize your ATS match rate, check keyword alignment, and polish bullet points.
              </p>
            </div>
            <AIResumeAssistantPanel />
          </div>
        )}
      </main>
    </div>
  );
}
