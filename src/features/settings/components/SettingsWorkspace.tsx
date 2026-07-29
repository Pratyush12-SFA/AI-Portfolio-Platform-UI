import { useState } from "react";
import {
  KeyRound,
  Laptop,
  Trash2,
  MailWarning,
  Loader2,
  CheckCircle,
  Smartphone,
  Globe,
} from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";

interface SettingsWorkspaceProps {
  sessions: Portfolio.Session[];
  onRevokeSession: (sessionId: number) => Promise<void>;
  onChangePassword: (e: React.FormEvent, data: Record<string, string>) => Promise<void>;
  onVerificationRequest: () => Promise<void>;
}

export default function SettingsWorkspace({
  sessions,
  onRevokeSession,
  onChangePassword,
  onVerificationRequest,
}: SettingsWorkspaceProps) {
  const { addToast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      addToast("error", "Please fill in all password fields.");
      return;
    }
    setIsChangingPassword(true);
    try {
      await onChangePassword(e, { oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
    } catch {
      // Alert triggered by parent
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerifyRequest = async () => {
    setIsVerifying(true);
    try {
      await onVerificationRequest();
    } catch {
      // Alert handled by parent
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Upper area: Account Verification Card */}
      <div className="p-6 rounded-card bg-ascend-surface border border-ascend-border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-button bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <MailWarning className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">
              Verification Status
            </h4>
            <p className="text-[11px] text-ascend-text-secondary leading-normal font-light">
              Verify your registration email to unlock full API capabilities,
              search visibility, and analytics summaries.
            </p>
          </div>
        </div>

        <button
          onClick={handleVerifyRequest}
          disabled={isVerifying}
          className="px-5 py-2.5 rounded-button bg-white/5 border border-ascend-border hover:border-ascend-primary/30 hover:bg-ascend-primary/5 text-xs text-white font-bold transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center disabled:opacity-40"
        >
          {isVerifying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-ascend-primary" />
              <span>Verify Email</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Password edit & Active Sessions list */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
        {/* Change Password Card */}
        <div className="p-6 bg-ascend-surface border border-ascend-border rounded-card space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-ascend-border pb-2.5">
            <KeyRound className="w-4.5 h-4.5 text-ascend-primary" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Modify Credentials
            </span>
          </div>

          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-xl border border-ascend-border bg-black/40 px-3.5 py-2.5 text-xs outline-none focus:border-ascend-primary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[10px] text-ascend-text-secondary mb-1.5 uppercase font-semibold">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-ascend-border bg-black/40 px-3.5 py-2.5 text-xs outline-none focus:border-ascend-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword || !oldPassword || !newPassword}
              className="w-full py-2.5 rounded-button bg-gradient-to-r from-ascend-primary to-ascend-ai hover:from-[#F5B301] hover:to-[#C08500] text-black text-xs font-black tracking-wide shadow-lg disabled:opacity-40 transition-all"
            >
              {isChangingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-black" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>

        {/* Active Sessions list */}
        <div className="p-6 bg-ascend-surface border border-ascend-border rounded-card space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-ascend-border pb-2.5">
            <Laptop className="w-4.5 h-4.5 text-white" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Device Session Tracker
            </span>
          </div>

          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center p-4 text-xs text-ascend-text-muted">
                No active tracking logs.
              </div>
            ) : (
              sessions.map((sess) => {
                const isCurrent = sess.IsCurrentActive || false;
                return (
                  <div
                    key={sess.Id}
                    className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                      isCurrent
                        ? "bg-ascend-ai/5 border-ascend-ai/20"
                        : "bg-black/10 border-ascend-border"
                    }`}
                  >
                    <div className="flex gap-3 overflow-hidden mr-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isCurrent
                            ? "bg-ascend-ai/10 border-ascend-ai/20 text-white"
                            : "bg-zinc-800 border-zinc-700 text-ascend-text-secondary"
                        }`}
                      >
                        {sess.DeviceType === "Mobile" ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Globe className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-0.5 text-left overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate max-w-[150px]">
                            {sess.DeviceDetails || "Unknown Device"}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-ascend-ai/20 text-white border border-ascend-ai/30">
                              Active Now
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-ascend-text-muted font-mono block">
                          IP: {sess.IpAddress || "N/A"}
                        </span>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => onRevokeSession(sess.Id)}
                        className="p-1.5 text-zinc-550 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors shrink-0"
                        title="Revoke session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
