import React, { useState, useEffect } from "react";
import AppSidebar from "../components/dashboard/AppSidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import PersistentAIAssistant from "../features/coach/components/PersistentAIAssistant";
import CommandPalette from "../components/ui/CommandPalette";
import { X, CheckCircle, ShieldAlert } from "lucide-react";

interface AppLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: any;
  onLogout: () => void;
  alert: { type: "success" | "error"; message: string } | null;
  children: React.ReactNode;
}

export default function AppLayout({
  activeTab,
  setActiveTab,
  profile,
  onLogout,
  alert,
  children,
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global hotkey hook for CTRL+K / CMD+K
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

  return (
    <div className="min-h-screen bg-ascend-bg text-white flex flex-col lg:flex-row relative">
      {/* Central Command Palette overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCommand={(cmdId) => setActiveTab(cmdId)}
      />

      {/* Dynamic Alert Banner */}
      {alert && (
        <div
          className={`fixed top-6 right-6 z-[99] px-5 py-3.5 rounded-card border flex items-center gap-3 backdrop-blur-md shadow-floating transition duration-300 animate-fadeIn ${
            alert.type === "success"
              ? "bg-ascend-primary/10 border-ascend-primary/30 text-ascend-primary"
              : "bg-ascend-danger/10 border-ascend-danger/30 text-ascend-danger"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-ascend-primary" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-ascend-danger" />
          )}
          <span className="font-semibold text-xs leading-none">
            {alert.message}
          </span>
        </div>
      )}

      {/* Mobile Top Header (hidden on Desktop) */}
      <TopNavbar
        activeTab={activeTab}
        onMenuToggle={() => setMobileMenuOpen(true)}
        onAiToggle={() => setMobileAiOpen(true)}
      />

      {/* Left Navigation Sidebar Drawer (Responsive mobile pop-out) */}
      <div
        className={`fixed inset-0 z-50 lg:relative lg:flex lg:z-auto ${
          mobileMenuOpen ? "flex" : "hidden lg:flex"
        }`}
      >
        {/* Backdrop for mobile */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-10"
        />

        <div className="relative z-20 h-full w-72 lg:w-auto">
          {/* Close button inside mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 lg:hidden p-2 text-ascend-text-secondary hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <AppSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setMobileMenuOpen(false);
            }}
            profile={profile}
            onLogout={onLogout}
          />
        </div>
      </div>

      {/* Center main workspace container */}
      <main className="flex-1 min-w-0 p-6 lg:p-12 pt-20 lg:pt-12 overflow-y-auto max-w-5xl mx-auto w-full select-none">
        {children}
      </main>

      {/* Right Column: Persistent AI Assistant (visible on Desktop) */}
      <div className="hidden lg:flex">
        <PersistentAIAssistant />
      </div>

      {/* Right Drawer: AI Coach drawer (mobile overlay) */}
      {mobileAiOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            onClick={() => setMobileAiOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md bg-ascend-sidebar h-full shadow-floating animate-slideLeft rounded-l-drawer overflow-hidden">
            <PersistentAIAssistant
              floatingMode={true}
              onClose={() => setMobileAiOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
