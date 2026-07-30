import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Globe,
  Briefcase,
  Bot,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  Crown,
  ChevronRight,
} from "lucide-react";

interface AppSidebarProps {
  onLogout: () => void;
  creditsUsed?: number;
  totalCredits?: number;
}

export default function AppSidebar({
  onLogout,
  creditsUsed = 15,
  totalCredits = 100,
}: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navGroups = [
    {
      label: "Primary",
      items: [
        { path: "/dashboard/home", label: "Home", icon: Home },
        { path: "/dashboard/resume", label: "Resume Builder", icon: FileText },
        { path: "/dashboard/portfolio", label: "Portfolio", icon: Globe },
        { path: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
      ],
    },
    {
      label: "Secondary",
      items: [
        { path: "/dashboard/ai-assistant", label: "AI Coach", icon: Bot },
        { path: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
        { path: "/dashboard/messages", label: "Messages", icon: MessageSquare },
      ],
    },
    {
      label: "Utility",
      items: [
        { path: "/dashboard/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const creditsRemaining = totalCredits - creditsUsed;
  const creditsPercentage = (creditsRemaining / totalCredits) * 100;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-72 surface-sidebar flex flex-col justify-between h-screen sticky top-0 no-print shrink-0 select-none z-30">
      <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
        <div className="p-6 flex items-center gap-3 border-b border-ascend-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center shadow-[0_4px_14px_rgba(0,82,255,0.3)] shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span
              className="font-bold tracking-tight text-ascend-text-primary text-lg leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ascend
            </span>
            <span className="text-[10px] text-ascend-text-muted font-medium uppercase tracking-widest leading-none">
              AI Career OS
            </span>
          </div>
        </div>

        <nav className="p-3 space-y-4 flex-1">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 py-1 text-[9px] font-bold text-ascend-text-muted uppercase tracking-widest">
                {group.label}
              </div>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
                        active
                          ? "bg-ascend-primary-light text-ascend-primary border border-ascend-primary/15"
                          : "text-ascend-text-secondary hover:bg-ascend-surface-elevated hover:text-ascend-text-primary border border-transparent"
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-ascend-primary rounded-r-full" />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4.5 h-4.5 transition-colors duration-150 ${
                            active
                              ? "text-ascend-primary"
                              : "text-ascend-text-muted group-hover:text-ascend-text-secondary"
                          }`}
                        />
                        <span className="tracking-normal">{item.label}</span>
                      </div>

                      {item.path === "/dashboard/ai-assistant" && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-ascend-primary-light text-ascend-primary border border-ascend-primary/20">
                          AI
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-ascend-border">
        <div className="p-4 rounded-xl bg-ascend-primary-light border border-ascend-primary/10 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-ascend-primary" />
              <span className="text-[11px] font-semibold text-ascend-primary uppercase tracking-wider">
                PRO PLAN
              </span>
            </div>
            <span className="text-[10px] text-ascend-text-muted">
              {creditsRemaining} Credits
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-1.5 rounded-full bg-ascend-primary-light overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ascend-primary to-ascend-primary-mid transition-all duration-1000 ease-out"
                style={{ width: `${creditsPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-ascend-text-muted">
              <span>AI Credits Used</span>
              <span>
                {creditsUsed}/{totalCredits}
              </span>
            </div>
          </div>

          <button className="w-full mt-4 py-2 px-3 rounded-lg bg-gradient-to-r from-ascend-primary to-ascend-primary-mid hover:from-ascend-primary-hover hover:to-ascend-primary text-white font-semibold text-xs tracking-wide shadow-[0_2px_8px_rgba(0,82,255,0.3)] hover:shadow-[0_4px_16px_rgba(0,82,255,0.4)] transition-all duration-200 flex items-center justify-center gap-1">
            <span>Upgrade Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-ascend-border flex items-center justify-between gap-3 bg-ascend-surface-elevated">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ascend-primary to-ascend-primary-mid flex items-center justify-center text-sm font-bold text-white shadow-[0_2px_8px_rgba(0,82,255,0.25)]">
            U
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-semibold text-ascend-text-primary truncate">
              User
            </span>
            <span className="text-[10px] text-ascend-text-muted truncate">
              Account
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sign out of Ascend"
          className="p-2 text-ascend-text-muted hover:text-ascend-danger hover:bg-ascend-danger-light rounded-lg transition-colors duration-150 shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
