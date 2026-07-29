import { useProfile, useUpsertProfile } from "../../queries/portfolio.queries";
import { useToast } from "../../contexts/ToastContext";
import PortfolioWorkspace from "../../features/portfolio/components/PortfolioWorkspace";
import AppLayout from "../../layouts/AppLayout";
import { Loader2 } from "lucide-react";

export default function PortfolioPage() {
  const { addToast } = useToast();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const upsertProfileMutation = useUpsertProfile();

  const handleProfileSave = async (profileData: Portfolio.Profile) => {
    try {
      await upsertProfileMutation.mutateAsync(profileData);
      addToast("success", "Portfolio settings saved successfully!");
    } catch {
      addToast("error", "Failed to save portfolio settings.");
      throw new Error();
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
      </div>
    );
  }

  return (
    <AppLayout>
      <PortfolioWorkspace profile={profile || {}} onSaveProfile={handleProfileSave} />
    </AppLayout>
  );
}
