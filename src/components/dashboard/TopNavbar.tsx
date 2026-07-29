import { useLocation } from "react-router-dom";
import { Menu, Bot, Sparkles } from "lucide-react";

interface TopNavbarProps {
  onMenuToggle: () => void;
  onAiToggle: () => void;
}

export default function TopNavbar({
  onMenuToggle,
  onAiToggle,
}: TopNavbarProps) {
  const location = useLocation();

  const getTabLabel = () => {
    switch (location.pathname) {
      case "/dashboard/home":
      case "/dashboard":
        return "Workspace Home";
      case "/dashboard/resume":
        return "Resume Builder";
      case "/dashboard/portfolio":
        return "Portfolio Workspace";
      case "/dashboard/jobs":
        return "Jobs & Match";
      case "/dashboard/ai-assistant":
        return "AI Coaching Coach";
      case "/dashboard/analytics":
        return "Performance Analytics";
      case "/dashboard/messages":
        return "Recruiter Messages";
      case "/dashboard/settings":
        return "Workspace Settings";
      default:
        return "Ascend";
    }
  };

  return (
    <header className="lg:hidden w-full h-16 bg-ascend-sidebar/80 backdrop-blur-md border-b border-ascend-border flex items-center justify-between px-6 fixed top-0 left-0 z-40 no-print select-none">
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 text-ascend-text-secondary hover:text-white hover:bg-white/5 rounded-button transition-all"
        aria-label="Toggle Navigation Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-button bg-linear-to-br from-ascend-primary to-ascend-ai flex items-center justify-center font-black text-black text-xs">
          <Sparkles className="w-3.5 h-3.5 fill-current text-white" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-ascend-text-secondary">
          {getTabLabel()}
        </span>
      </div>

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
