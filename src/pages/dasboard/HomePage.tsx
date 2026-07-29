import { useProfile, useResumeData } from "../../queries/portfolio.queries";
import HomeWorkspace from "../../features/home/components/HomeWorkspace";
import AppLayout from "../../layouts/AppLayout";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: projects = [], isLoading: isProjLoading } = useResumeData("projects");
  const { data: skills = [] } = useResumeData("skills");
  const { data: experiences = [] } = useResumeData("experience");

  if (isProfileLoading || isProjLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
      </div>
    );
  }

  return (
    <AppLayout>
      <HomeWorkspace
        profile={profile || {}}
        projects={projects}
        skills={skills}
        experiences={experiences}
      />
    </AppLayout>
  );
}
