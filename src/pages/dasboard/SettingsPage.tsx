import { useActiveSessions, useRevokeSession, useChangePassword, useRequestVerificationEmail } from "../../queries/portfolio.queries";
import { useToast } from "../../contexts/ToastContext";
import SettingsWorkspace from "../../features/settings/components/SettingsWorkspace";
import AppLayout from "../../layouts/AppLayout";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { addToast } = useToast();
  const { data: sessions = [], isLoading: isSessionsLoading } = useActiveSessions();
  const revokeSessionMutation = useRevokeSession();
  const changePasswordMutation = useChangePassword();
  const requestVerificationMutation = useRequestVerificationEmail();

  const handleRevokeSession = async (sessionId: number) => {
    if (!confirm("Revoke this session? This will force-logout the device.")) return;
    try {
      const res = await revokeSessionMutation.mutateAsync(sessionId);
      if (res.success) {
        addToast("success", "Session revoked successfully.");
      } else {
        addToast("error", "Failed to revoke session.");
      }
    } catch {
      addToast("error", "Failed to revoke session.");
    }
  };

  const handleChangePassword = async (_e: React.FormEvent, data: Record<string, string>) => {
    try {
      const res = await changePasswordMutation.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      if (res.success) {
        addToast("success", "Password updated successfully!");
      } else {
        addToast("error", res.message || "Failed to change password.");
        throw new Error();
      }
    } catch {
      addToast("error", "Error updating password.");
      throw new Error();
    }
  };

  const handleVerificationRequest = async () => {
    try {
      const res = await requestVerificationMutation.mutateAsync();
      if (res.success) {
        addToast("success", "Verification link sent! Check your email inbox.");
      } else {
        addToast("error", "Verification request failed.");
      }
    } catch {
      addToast("error", "Verification request failed.");
    }
  };

  if (isSessionsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
      </div>
    );
  }

  return (
    <AppLayout>
      <SettingsWorkspace
        sessions={sessions}
        onRevokeSession={handleRevokeSession}
        onChangePassword={handleChangePassword}
        onVerificationRequest={handleVerificationRequest}
      />
    </AppLayout>
  );
}
