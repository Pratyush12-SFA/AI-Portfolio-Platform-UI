import {
  useProfile,
  useUpsertProfile,
  useResumeData,
  useUpsertResumeData,
  useDeleteResumeData,
} from "../../queries/portfolio.queries";
import { useToast } from "../../contexts/ToastContext";
import ResumeWorkspace from "../../features/resume/components/ResumeWorkspace";
import AppLayout from "../../layouts/AppLayout";
import { Loader2 } from "lucide-react";

export default function ResumePage() {
  const { addToast } = useToast();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: educations = [], isLoading: isEduLoading } = useResumeData("education");
  const { data: experiences = [], isLoading: isExpLoading } = useResumeData("experience");
  const { data: projects = [], isLoading: isProjLoading } = useResumeData("projects");
  const { data: skills = [], isLoading: isSkillsLoading } = useResumeData("skills");
  const { data: certifications = [], isLoading: isCertsLoading } = useResumeData("certifications");
  const { data: achievements = [], isLoading: isAchsLoading } = useResumeData("achievements");
  const { data: languages = [], isLoading: isLangsLoading } = useResumeData("languages");
  const { data: socialLinks = [], isLoading: isSocialsLoading } = useResumeData("social-links");
  const { data: customSections = [], isLoading: isCustomsLoading } = useResumeData("custom-sections");

  const upsertProfileMutation = useUpsertProfile();
  const upsertResumeMutation = useUpsertResumeData();
  const deleteResumeMutation = useDeleteResumeData();

  const handleUpsertItem = async (type: string, data: Record<string, unknown>) => {
    try {
      await upsertResumeMutation.mutateAsync({ type, data });
      addToast("success", "Saved successfully!");
    } catch {
      addToast("error", "Save failed.");
      throw new Error();
    }
  };

  const handleDeleteItem = async (type: string, id: number | undefined) => {
    if (id === undefined) return;
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteResumeMutation.mutateAsync({ type, id });
      addToast("success", "Deleted successfully!");
    } catch {
      addToast("error", "Delete failed.");
    }
  };

  const handleProfileSave = async (profileData: Portfolio.Profile) => {
    try {
      await upsertProfileMutation.mutateAsync(profileData);
      addToast("success", "Profile preferences saved successfully!");
    } catch {
      addToast("error", "Failed to save profile preferences.");
      throw new Error();
    }
  };

  if (
    isProfileLoading || isEduLoading || isExpLoading || isProjLoading ||
    isSkillsLoading || isCertsLoading || isAchsLoading || isLangsLoading ||
    isSocialsLoading || isCustomsLoading
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
      </div>
    );
  }

  return (
    <AppLayout>
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
        profile={profile || {}}
        onUpsertItem={handleUpsertItem}
        onDeleteItem={handleDeleteItem}
        onSaveProfile={handleProfileSave}
        loadAllData={async () => {}}
      />
    </AppLayout>
  );
}
