import { useState } from "react";
import { Globe, ExternalLink, Check, Loader2 } from "lucide-react";

interface PortfolioWorkspaceProps {
  profile: any;
  onSaveProfile: (profileData: any) => Promise<void>;
  triggerAlert: (type: "success" | "error", message: string) => void;
}

export default function PortfolioWorkspace({
  profile,
  onSaveProfile,
  triggerAlert,
}: PortfolioWorkspaceProps) {
  const [selectedTheme, setSelectedTheme] = useState(
    profile?.ThemeName || "ModernDark",
  );
  const [customSlug, setCustomSlug] = useState(profile?.CustomSlug || "");
  const [isSaving, setIsSaving] = useState(false);

  const themesList = [
    {
      id: "ModernDark",
      name: "Luxury Modern Dark",
      desc: "Deep pitch background, high-contrast text, glowing gold accents. The signature Ascend appearance.",
      bg: "bg-ascend-bg",
      accent: "bg-ascend-primary",
      border: "border-ascend-primary/30",
      pillClass: "bg-ascend-primary/10 text-ascend-primary",
    },
    {
      id: "Cyberpunk",
      name: "Terminal Cyberpunk",
      desc: "True black canvas, bright neon green monospace lettering. Highly technical and developers choice.",
      bg: "bg-[#000000]",
      accent: "bg-[#39ff14]",
      border: "border-[#39ff14]/30",
      pillClass: "bg-[#39ff14]/10 text-[#39ff14]",
    },
    {
      id: "ClassicCharcoal",
      name: "Classic Charcoal",
      desc: "Cool slate background, light zinc borders, clean sans-serif layouts. Balanced corporate layout.",
      bg: "bg-[#1C1C22]",
      accent: "bg-zinc-400",
      border: "border-zinc-700",
      pillClass: "bg-zinc-800 text-white",
    },
  ];

  const handleApplyTheme = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        ThemeName: selectedTheme,
        CustomSlug: customSlug.trim().toLowerCase(),
      };
      await onSaveProfile(updatedProfile);
      triggerAlert("success", "Portfolio settings saved successfully!");
    } catch {
      triggerAlert("error", "Failed to update portfolio settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const publicUrl = `${window.location.origin}/portfolio/${customSlug || profile?.CustomSlug || "your-slug"}`;

  return (
    <div className="space-y-6 select-none">
      {/* Upper section: URL Mapping */}
      <div className="p-6 rounded-card bg-ascend-surface border border-ascend-border space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-ascend-primary" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Domain Slug & Custom Address
          </h3>
        </div>
        <p className="text-[11px] text-ascend-text-secondary leading-normal font-light">
          Set a custom public URL for your portfolio. Anyone with this link can
          view your published resume and projects in your selected theme.
        </p>

        <div className="space-y-3">
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-ascend-border bg-black/40 text-[10px] text-ascend-text-muted font-mono">
              ascend.io/portfolio/
            </span>
            <input
              type="text"
              value={customSlug}
              onChange={(e) =>
                setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
              }
              placeholder="pratyush-software-architect"
              className="flex-1 min-w-0 rounded-r-xl border border-ascend-border bg-black/40 px-3.5 py-2.5 text-xs outline-none focus:border-ascend-primary font-mono text-ascend-primary"
            />
          </div>

          {profile?.CustomSlug && (
            <div className="flex items-center justify-between p-3 rounded-button bg-black/20 border border-ascend-border">
              <span className="text-[10px] text-ascend-text-muted font-mono truncate">
                {publicUrl}
              </span>
              <a
                href={`/portfolio/${profile.CustomSlug}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-ascend-primary hover:text-ascend-primary flex items-center gap-1 shrink-0 ml-4"
              >
                <span>Live Preview</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Visual Theme Selection Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Public Themes
            </h3>
            <p className="text-[10px] text-ascend-text-secondary font-light">
              Choose the style for your public website layout.
            </p>
          </div>
          <button
            onClick={handleApplyTheme}
            disabled={isSaving}
            className="px-5 py-2 rounded-button bg-ascend-primary text-black hover:bg-ascend-primary/90 text-xs font-bold transition-all flex items-center gap-1 shadow-lg disabled:opacity-40"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Apply Settings</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themesList.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`rounded-card border bg-ascend-surface p-5 flex flex-col justify-between h-72 cursor-pointer transition-all duration-300 relative overflow-hidden group shadow-md ${
                  isSelected
                    ? "border-ascend-primary shadow-[0_0_20px_rgba(245,179,1,0.08)] bg-gradient-to-b from-[#111113] to-[#161619]"
                    : "border-ascend-border hover:border-ascend-border hover:bg-[#131316]"
                }`}
              >
                {/* Visual Theme Mini Preview Card */}
                <div
                  className={`h-24 rounded-xl ${theme.bg} ${theme.border} border border-dashed flex flex-col justify-between p-3 relative overflow-hidden`}
                >
                  <div className="flex justify-between items-center">
                    <span className="w-12 h-2 rounded bg-white/10" />
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${theme.pillClass}`}
                    >
                      {theme.id}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="w-16 h-1.5 rounded bg-white/20 block" />
                    <span className={`w-8 h-1 rounded ${theme.accent} block`} />
                  </div>
                </div>

                <div className="space-y-2 mt-4 flex-1">
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {theme.name}
                  </h4>
                  <p className="text-[10.5px] text-ascend-text-secondary leading-normal font-light">
                    {theme.desc}
                  </p>
                </div>

                {/* Checked State indicator */}
                <div className="flex justify-between items-center border-t border-ascend-border pt-3 mt-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ascend-text-muted">
                    Select Layout
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-ascend-primary border-ascend-primary text-black"
                        : "border-ascend-border text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
