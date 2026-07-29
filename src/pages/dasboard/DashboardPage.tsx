import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../queries/auth.queries";
import { useAuth } from "../../contexts/Authcontext/queries";
import {
  useProfile,
  useUpsertProfile,
  useResumeData,
  useUpsertResumeData,
  useDeleteResumeData,
  useActiveSessions,
  useRevokeSession,
  useChangePassword,
  useRequestVerificationEmail,
} from "../../queries/portfolio.queries";

import AppLayout from "../../layouts/AppLayout";
import HomeWorkspace from "../../features/home/components/HomeWorkspace";
import ResumeWorkspace from "../../features/resume/components/ResumeWorkspace";
import PortfolioWorkspace from "../../features/portfolio/components/PortfolioWorkspace";
import JobMatchWorkspace from "../../features/jobs/components/JobMatchWorkspace";
import AnalyticsWorkspace from "../../features/analytics/components/AnalyticsWorkspace";
import MessagesWorkspace from "../../features/messages/components/MessagesWorkspace";
import SettingsWorkspace from "../../features/settings/components/SettingsWorkspace";
import PersistentAIAssistant from "../../features/coach/components/PersistentAIAssistant";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Tab states and shell alerts
  const [activeTab, setActiveTab] = useState<string>("home");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Queries
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useProfile();
  const { data: educations = [], isLoading: isEduLoading } =
    useResumeData("education");
  const { data: experiences = [], isLoading: isExpLoading } =
    useResumeData("experience");
  const { data: projects = [], isLoading: isProjLoading } =
    useResumeData("projects");
  const { data: skills = [], isLoading: isSkillsLoading } =
    useResumeData("skills");
  const { data: certifications = [], isLoading: isCertsLoading } =
    useResumeData("certifications");
  const { data: achievements = [], isLoading: isAchsLoading } =
    useResumeData("achievements");
  const { data: languages = [], isLoading: isLangsLoading } =
    useResumeData("languages");
  const { data: socialLinks = [], isLoading: isSocialsLoading } =
    useResumeData("social-links");
  const { data: customSections = [], isLoading: isCustomsLoading } =
    useResumeData("custom-sections");
  const { data: sessions = [], isLoading: isSessionsLoading } =
    useActiveSessions();

  // Mutations
  const upsertProfileMutation = useUpsertProfile();
  const upsertResumeMutation = useUpsertResumeData();
  const deleteResumeMutation = useDeleteResumeData();
  const revokeSessionMutation = useRevokeSession();
  const changePasswordMutation = useChangePassword();
  const requestVerificationMutation = useRequestVerificationEmail();

  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleProfileSave = async (profileData: any) => {
    try {
      await upsertProfileMutation.mutateAsync(profileData);
      triggerAlert("success", "Profile preferences saved successfully!");
    } catch {
      triggerAlert("error", "Failed to save profile preferences.");
      throw new Error();
    }
  };

  const handleUpsertItem = async (type: string, data: any) => {
    try {
      const res = await upsertResumeMutation.mutateAsync({ type, data });
      if (res.success) {
        triggerAlert("success", "Saved successfully!");
      } else {
        triggerAlert("error", "Save failed.");
        throw new Error();
      }
    } catch {
      triggerAlert("error", "Save failed.");
      throw new Error();
    }
  };

  const handleDeleteItem = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await deleteResumeMutation.mutateAsync({ type, id });
      if (res.success) {
        triggerAlert("success", "Deleted successfully!");
      } else {
        triggerAlert("error", "Delete failed.");
      }
    } catch {
      triggerAlert("error", "Delete failed.");
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    if (!confirm("Revoke this session? This will force-logout the device."))
      return;
    try {
      const res = await revokeSessionMutation.mutateAsync(sessionId);
      if (res.success) {
        triggerAlert("success", "Session revoked successfully.");
      } else {
        triggerAlert("error", "Failed to revoke session.");
      }
    } catch {
      triggerAlert("error", "Failed to revoke session.");
    }
  };

  const handleChangePassword = async (_e: React.FormEvent, data: any) => {
    try {
      const res = await changePasswordMutation.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      if (res.success) {
        triggerAlert("success", "Password updated successfully!");
      } else {
        triggerAlert("error", res.message || "Failed to change password.");
        throw new Error();
      }
    } catch {
      triggerAlert("error", "Error updating password.");
      throw new Error();
    }
  };

  const handleVerificationRequest = async () => {
    try {
      const res = await requestVerificationMutation.mutateAsync();
      if (res.success) {
        triggerAlert(
          "success",
          "Verification link sent! Check your email inbox.",
        );
      } else {
        triggerAlert("error", "Verification request failed.");
      }
    } catch {
      triggerAlert("error", "Verification request failed.");
    }
  };

  const handleLogoutFlow = async () => {
    await logoutUser();
    logout();
    navigate("/login");
  };

  const handleAddAtsSkill = async (skillName: string) => {
    await handleUpsertItem("skills", {
      Name: skillName,
      ProficiencyLevel: "Intermediate",
      Category: "Technical",
    });
  };

  // Render correct workspace sub-panel
  const renderWorkspace = () => {
    if (
      isProfileLoading ||
      isEduLoading ||
      isExpLoading ||
      isProjLoading ||
      isSkillsLoading ||
      isCertsLoading ||
      isAchsLoading ||
      isLangsLoading ||
      isSocialsLoading ||
      isCustomsLoading ||
      isSessionsLoading
    ) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
        </div>
      );
    }

    const defaultProfile = profile || {
      Headline: "",
      Summary: "",
      PhoneNumber: "",
      ContactEmail: "",
      Address: "",
      ThemeName: "ModernDark",
      CustomSlug: "user-profile",
      IsDarkModePreferred: true,
    };

    switch (activeTab) {
      case "home":
        return (
          <HomeWorkspace profile={defaultProfile} setActiveTab={setActiveTab} />
        );
      case "resume":
        return (
          <ResumeWorkspace
            educations={educations}
            experiences={experiences}
            projects={projects}
            skills={skills}
            certifications={certifications}
            achievements={achievements}
            languages={languages}
            socialLinks={socialLinks}
            customSections={customSections}
            profile={defaultProfile}
            onUpsertItem={handleUpsertItem}
            onDeleteItem={handleDeleteItem}
            onSaveProfile={handleProfileSave}
            loadAllData={async () => {
              refetchProfile();
            }}
            triggerAlert={triggerAlert}
          />
        );
      case "portfolio":
        return (
          <PortfolioWorkspace
            profile={defaultProfile}
            onSaveProfile={handleProfileSave}
            triggerAlert={triggerAlert}
          />
        );
      case "jobs":
        return (
          <JobMatchWorkspace
            skills={skills}
            experiences={experiences}
            profile={defaultProfile}
            onAddSkill={handleAddAtsSkill}
            triggerAlert={triggerAlert}
          />
        );
      case "analytics":
        return <AnalyticsWorkspace />;
      case "messages":
        return <MessagesWorkspace />;
      case "settings":
        return (
          <SettingsWorkspace
            sessions={sessions}
            onRevokeSession={handleRevokeSession}
            onChangePassword={handleChangePassword}
            onVerificationRequest={handleVerificationRequest}
            triggerAlert={triggerAlert}
          />
        );
      case "ai-assistant":
        return (
          <div className="lg:hidden flex-1 h-[calc(100vh-8rem)]">
            <PersistentAIAssistant floatingMode={true} />
          </div>
        );
      default:
        return <div>Workspace Loading...</div>;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={profile || {}}
      onLogout={handleLogoutFlow}
      alert={alert}
    >
      {renderWorkspace()}
    </AppLayout>
  );
}
