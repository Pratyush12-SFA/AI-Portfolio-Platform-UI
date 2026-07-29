import React, { useState, useEffect, useRef } from "react";
import { Search, Home, FileText, Globe, Briefcase, Bot, TrendingUp, MessageSquare, Settings } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ComponentType<any>;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommand: (commandId: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectCommand,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    { id: "home", label: "Go to Workspace Home", category: "Navigation", icon: Home, shortcut: "H" },
    { id: "resume", label: "Go to Resume Builder", category: "Navigation", icon: FileText, shortcut: "R" },
    { id: "portfolio", label: "Go to Portfolio Workspace", category: "Navigation", icon: Globe, shortcut: "P" },
    { id: "jobs", label: "Go to Jobs & ATS Matcher", category: "Navigation", icon: Briefcase, shortcut: "J" },
    { id: "ai-assistant", label: "Go to AI Coach Chat", category: "Navigation", icon: Bot, shortcut: "A" },
    { id: "analytics", label: "Go to Performance Analytics", category: "Navigation", icon: TrendingUp, shortcut: "T" },
    { id: "messages", label: "Go to Recruiter Messages Inbox", category: "Navigation", icon: MessageSquare, shortcut: "M" },
    { id: "settings", label: "Go to Account Settings", category: "Navigation", icon: Settings, shortcut: "S" },
  ];

  // Filter commands by search
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard events inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelectCommand(filteredCommands[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose, onSelectCommand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center pt-[15vh] px-4 animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={containerRef}
        className="w-full max-w-xl bg-ascend-surface-elevated border border-ascend-border rounded-dialog shadow-floating overflow-hidden relative z-10 animate-scaleUp"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ascend-border">
          <Search className="w-4 h-4 text-ascend-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search workspace..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-ascend-text-muted"
          />
          <div className="px-2 py-0.5 rounded bg-white/5 border border-ascend-border text-[9px] text-ascend-text-muted font-mono font-bold select-none">
            ESC
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-ascend-text-muted">
              No actions found matching search.
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="px-2 py-1 text-[9px] font-bold text-ascend-text-muted uppercase tracking-wider">
                Workspace Controls
              </div>
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      onSelectCommand(cmd.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-button text-xs transition-all text-left ${
                      isSelected
                        ? "bg-ascend-primary/10 text-ascend-primary border border-ascend-primary/20 shadow-card"
                        : "text-ascend-text-secondary hover:bg-white/2 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-ascend-primary" : "text-ascend-text-secondary"}`} />
                      <span>{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-mono text-ascend-text-muted px-1.5 py-0.5 rounded bg-white/5 border border-ascend-border">
                          {cmd.shortcut}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-black/20 border-t border-ascend-border flex items-center justify-between text-[9px] text-ascend-text-muted select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-ascend-border font-mono">↑↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-ascend-border font-mono">Enter</kbd> to select
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-ascend-border font-mono">Ctrl+K</kbd>
            <span>anywhere to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
