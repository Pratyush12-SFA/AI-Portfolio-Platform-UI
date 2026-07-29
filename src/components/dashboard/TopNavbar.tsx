import { Menu, Bot, Sparkles } from "lucide-react";

interface TopNavbarProps {
  activeTab: string;
  onMenuToggle: () => void;
  onAiToggle: () => void;
}

export default function TopNavbar({
  activeTab,
  onMenuToggle,
  onAiToggle,
}: TopNavbarProps) {
  const getTabLabel = () => {
    switch (activeTab) {
      case "home":
        return "Workspace Home";
      case "resume":
        return "Resume Builder";
      case "portfolio":
        return "Portfolio Workspace";
      case "jobs":
        return "Jobs & Match";
      case "ai-assistant":
        return "AI Coaching Coach";
      case "analytics":
        return "Performance Analytics";
      case "messages":
        return "Recruiter Messages";
      case "settings":
        return "Workspace Settings";
      default:
        return "Ascend";
    }
  };

  return (
    <header className="lg:hidden w-full h-16 bg-ascend-sidebar/80 backdrop-blur-md border-b border-ascend-border flex items-center justify-between px-6 fixed top-0 left-0 z-40 no-print select-none">
      {/* Mobile Drawer Trigger */}
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 text-ascend-text-secondary hover:text-white hover:bg-white/5 rounded-button transition-all"
        aria-label="Toggle Navigation Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Brand & Tab Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-button bg-gradient-to-br from-ascend-primary to-ascend-ai flex items-center justify-center font-black text-black text-xs">
          <Sparkles className="w-3.5 h-3.5 fill-current text-white" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-ascend-text-secondary">
          {getTabLabel()}
        </span>
      </div>

      {/* AI Assistant Quick Toggle */}
      <button
        onClick={onAiToggle}
        className="p-2 text-ascend-text-secondary hover:text-ascend-ai hover:bg-ascend-ai/10 border border-ascend-border hover:border-ascend-ai/20 rounded-button transition-all flex items-center gap-1 bg-ascend-surface"
        aria-label="Open AI Assistant Drawer"
      >
        <Bot className="w-5 h-5 text-ascend-ai" />
        <span className="text-[10px] font-bold text-ascend-ai uppercase tracking-wider hidden sm:inline">
          Coach
        </span>
      </button>
    </header>
  );
}
