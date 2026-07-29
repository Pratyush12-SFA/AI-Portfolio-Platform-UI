import { useProfile, useResumeData, useUpsertResumeData } from "../../queries/portfolio.queries";
import { useToast } from "../../contexts/ToastContext";
import JobMatchWorkspace from "../../features/jobs/components/JobMatchWorkspace";
import AppLayout from "../../layouts/AppLayout";
import { Loader2 } from "lucide-react";

export default function JobsPage() {
  const { addToast } = useToast();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: skills = [], isLoading: isSkillsLoading } = useResumeData("skills");
  const { data: experiences = [], isLoading: isExpLoading } = useResumeData("experience");
  const upsertResumeMutation = useUpsertResumeData();

  const handleAddSkill = async (skillName: string) => {
    try {
      await upsertResumeMutation.mutateAsync({
        type: "skills",
        data: { Name: skillName, ProficiencyLevel: "Intermediate", Category: "Technical" },
      });
      addToast("success", `Added ${skillName} successfully!`);
    } catch {
      addToast("error", "Failed to add skill.");
    }
  };

  if (isProfileLoading || isSkillsLoading || isExpLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
      </div>
    );
  }

  return (
    <AppLayout>
      <JobMatchWorkspace
        skills={skills}
        experiences={experiences}
        profile={profile || {}}
        onAddSkill={handleAddSkill}
      />
    </AppLayout>
  );
}
