import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/dashboard/AppSidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import PersistentAIAssistant from "../features/coach/components/PersistentAIAssistant";
import CommandPalette from "../components/ui/CommandPalette";
import { X, Bot } from "lucide-react";
import { useAuth } from "../contexts/Authcontext/queries";
import { logoutUser } from "../queries/auth.queries";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-ascend-bg text-ascend-text-primary flex flex-col lg:flex-row relative workspace-grid">
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <TopNavbar
        onMenuToggle={() => setMobileMenuOpen(true)}
        onAiToggle={() => setIsAiOpen(true)}
      />

      <div
        className={`fixed inset-0 z-50 lg:relative lg:flex lg:z-auto ${
          mobileMenuOpen ? "flex" : "hidden lg:flex"
        }`}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-10"
        />

        <div className="relative z-20 h-full w-72 lg:w-auto">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 lg:hidden p-2 text-ascend-text-muted hover:text-ascend-text-secondary rounded-lg hover:bg-ascend-surface-elevated"
          >
            <X className="w-5 h-5" />
          </button>

          <AppSidebar
            onLogout={handleLogout}
          />
        </div>
      </div>

      <main className="flex-1 min-w-0 p-6 lg:p-10 pt-20 lg:pt-10 overflow-y-auto max-w-[1440px] mx-auto w-full select-none relative z-10">
        {children}
      </main>

      {/* Collapsible Floating Drawer for AI Assistant (Mobile & Desktop) */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsAiOpen(false)}
            className="fixed inset-0 bg-black/15 backdrop-blur-xs z-40"
          />
          {/* Drawer Panel */}
          <div className="relative z-50 w-full max-w-md sm:w-80 md:w-96 bg-ascend-surface h-full shadow-2xl overflow-hidden border-l border-ascend-border flex flex-col animate-slide-in-right">
            <PersistentAIAssistant
              floatingMode={true}
              onClose={() => setIsAiOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) to toggle AI Assistant */}
      {!isAiOpen && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center border border-white/20 hover:border-white/40 cursor-pointer"
          aria-label="Open AI Coach"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      )}
    </div>
  );
}
