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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: any;
  onLogout: () => void;
  creditsUsed?: number;
  totalCredits?: number;
}

export default function AppSidebar({
  activeTab,
  setActiveTab,
  profile,
  onLogout,
  creditsUsed = 15,
  totalCredits = 100,
}: AppSidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "resume", label: "Resume Builder", icon: FileText },
    { id: "portfolio", label: "Portfolio Workspace", icon: Globe },
    { id: "jobs", label: "Jobs & Match", icon: Briefcase },
    { id: "ai-assistant", label: "AI Coach Chat", icon: Bot },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const creditsRemaining = totalCredits - creditsUsed;
  const creditsPercentage = (creditsRemaining / totalCredits) * 100;

  return (
    <aside className="w-72 bg-ascend-sidebar border-r border-ascend-border flex flex-col justify-between h-screen sticky top-0 no-print shrink-0 select-none z-30">
      <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
        {/* Brand Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-ascend-border">
          <div className="w-10 h-10 rounded-button bg-gradient-to-br from-ascend-primary to-ascend-ai flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(245,179,1,0.25)] ring-1 ring-white/10">
            <Sparkles className="w-5 h-5 fill-current text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-ascend-text-primary text-base font-sans leading-tight">
              Ascend
            </span>
            <span className="text-[10px] text-ascend-text-muted font-medium uppercase tracking-widest leading-none">
              AI Career OS
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-button text-sm font-medium transition-all duration-200 relative group overflow-hidden ${
                  isActive
                    ? "text-ascend-primary bg-ascend-primary/5 border border-ascend-primary/20 shadow-card"
                    : "text-ascend-text-secondary hover:bg-white/2 hover:text-white border border-transparent"
                }`}
              >
                {/* Glowing border left overlay */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-ascend-primary to-ascend-ai rounded-r" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-ascend-primary"
                        : "text-ascend-text-secondary group-hover:text-white"
                    }`}
                  />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {/* Micro badge indicator */}
                {item.id === "ai-assistant" && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-ascend-ai/20 text-white border border-ascend-ai/30 animate-pulse">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upgrade & Credits Card */}
      <div className="p-4 border-t border-ascend-border bg-black/10">
        <div className="p-4 rounded-card bg-gradient-to-b from-ascend-surface to-ascend-bg border border-ascend-border relative overflow-hidden group">
          {/* Subtle gold glow behind card */}
          <div className="absolute -right-12 -top-12 w-24 h-24 bg-ascend-primary/5 rounded-full blur-xl transition-all duration-500 group-hover:bg-ascend-primary/10" />

          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-ascend-primary fill-current animate-bounce" />
              <span className="text-[11px] font-semibold text-ascend-primary uppercase tracking-wider">
                PRO PLAN
              </span>
            </div>
            <span className="text-[10px] text-ascend-text-secondary">
              {creditsRemaining} Credits
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ascend-primary to-ascend-ai transition-all duration-1000 ease-out"
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

          <button className="w-full mt-4 py-2 px-3 rounded-button bg-gradient-to-r from-[#FFE885] to-ascend-primary hover:from-ascend-primary hover:to-[#D99B00] text-black font-semibold text-xs tracking-wide shadow-card transition-all duration-300 hover:shadow-floating flex items-center justify-center gap-1">
            <span>Upgrade Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* User Card */}
      <div className="p-4 border-t border-ascend-border flex items-center justify-between gap-3 bg-black/20">
        <div className="flex items-center gap-3 overflow-hidden">
          {profile?.ProfilePictureUrl ? (
            <img
              src={profile.ProfilePictureUrl}
              alt={profile?.FullName || "User Avatar"}
              className="w-10 h-10 rounded-button object-cover border border-ascend-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-button bg-white/5 border border-ascend-border flex items-center justify-center text-sm font-bold text-ascend-primary">
              {profile?.FullName
                ? profile.FullName.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-semibold text-ascend-text-primary truncate">
              {profile?.FullName || "Pratyush 👋"}
            </span>
            <span className="text-[10px] text-ascend-text-secondary truncate">
              {profile?.ContactEmail || "pro@ascend.io"}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sign out of Ascend"
          className="p-2 text-ascend-text-muted hover:text-ascend-danger hover:bg-ascend-danger/5 rounded-button transition-colors duration-200 shrink-0"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </aside>
  );
}
