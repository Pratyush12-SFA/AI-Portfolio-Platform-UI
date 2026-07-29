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
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center shadow-[0_4px_14px_rgba(0,82,255,0.3)] shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span
              className="font-bold tracking-tight text-gray-900 text-lg leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ascend
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none">
              AI Career OS
            </span>
          </div>
        </div>

        <nav className="p-3 space-y-4 flex-1">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
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
                          ? "bg-[#EEF3FF] text-[#0052FF] border border-[rgba(0,82,255,0.15)]"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent"
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#0052FF] rounded-r-full" />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4.5 h-4.5 transition-colors duration-150 ${
                            active
                              ? "text-[#0052FF]"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        <span className="tracking-normal">{item.label}</span>
                      </div>

                      {item.path === "/dashboard/ai-assistant" && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-600 border border-blue-200">
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

      <div className="p-4 border-t border-gray-100">
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#EEF3FF] to-[#F8FAFF] border border-[rgba(0,82,255,0.1)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#0052FF]" />
              <span className="text-[11px] font-semibold text-[#0052FF] uppercase tracking-wider">
                PRO PLAN
              </span>
            </div>
            <span className="text-[10px] text-gray-500">
              {creditsRemaining} Credits
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-1.5 rounded-full bg-blue-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] transition-all duration-1000 ease-out"
                style={{ width: `${creditsPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>AI Credits Used</span>
              <span>
                {creditsUsed}/{totalCredits}
              </span>
            </div>
          </div>

          <button className="w-full mt-4 py-2 px-3 rounded-lg bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] hover:from-[#0040CC] hover:to-[#0052FF] text-white font-semibold text-xs tracking-wide shadow-[0_2px_8px_rgba(0,82,255,0.3)] hover:shadow-[0_4px_16px_rgba(0,82,255,0.4)] transition-all duration-200 flex items-center justify-center gap-1">
            <span>Upgrade Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center text-sm font-bold text-white shadow-[0_2px_8px_rgba(0,82,255,0.25)]">
            U
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-semibold text-gray-800 truncate">
              User
            </span>
            <span className="text-[10px] text-gray-400 truncate">
              Account
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sign out of Ascend"
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150 shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
