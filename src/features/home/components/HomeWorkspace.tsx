import { useEffect, useState } from "react";
import {
  Sparkles,
  Eye,
  Send,
  Bot,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

interface HomeWorkspaceProps {
  profile: any;
  setActiveTab: (tab: string) => void;
  resumeData?: any;
}

// Custom Counter Hook / Component inline for Animated Numbers
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    if (value === 0) return;
    const duration = 800; // ms
    const stepTime = Math.max(Math.floor(duration / value), 15);

    const timer = setInterval(() => {
      start += Math.ceil(value / 30);
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function HomeWorkspace({
  profile,
  setActiveTab,
}: HomeWorkspaceProps) {
  const userName = profile?.FullName || "Pratyush";

  // Dynamic Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const metrics = [
    {
      label: "Resume ATS Score",
      value: 88,
      suffix: "%",
      desc: "ATS verified",
      color: "from-[#FFE885]/10 to-[#F5B301]/10",
      icon: Sparkles,
      iconColor: "text-[#F5B301]",
      tab: "resume",
    },
    {
      label: "Portfolio Views",
      value: 1248,
      suffix: "",
      desc: "+12% this week",
      color: "from-blue-500/10 to-cyan-500/10",
      icon: Eye,
      iconColor: "text-blue-400",
      tab: "portfolio",
    },
    {
      label: "Jobs Tracking",
      value: 24,
      suffix: "",
      desc: "3 matches found",
      color: "from-emerald-500/10 to-teal-500/10",
      icon: Send,
      iconColor: "text-emerald-400",
      tab: "jobs",
    },
    {
      label: "AI Coach Credits",
      value: 85,
      suffix: "/100",
      desc: "Refreshes in 4 days",
      color: "from-purple-500/10 to-pink-500/10",
      icon: Bot,
      iconColor: "text-purple-400",
      tab: "ai-assistant",
    },
  ];

  const quickActions = [
    {
      title: "Improve Resume",
      desc: "Optimize summary & rewrite experience bullets",
      icon: FileCheck2,
      tab: "resume",
      actionText: "Open Builder",
      color:
        "border-[#F5B301]/25 hover:border-[#F5B301]/80 hover:bg-[#F5B301]/5",
    },
    {
      title: "Select Portfolio Theme",
      desc: "Publish your personal site in a new theme",
      icon: Eye,
      tab: "portfolio",
      actionText: "View Themes",
      color: "border-blue-500/25 hover:border-blue-500/80 hover:bg-blue-500/5",
    },
    {
      title: "Scan Job Description",
      desc: "Check ATS match keywords & cover letter",
      icon: TrendingUp,
      tab: "jobs",
      actionText: "Analyze JD",
      color:
        "border-emerald-500/25 hover:border-emerald-500/80 hover:bg-emerald-500/5",
    },
    {
      title: "Consult AI Coach",
      desc: "Prep for interview questions & skills analysis",
      icon: Bot,
      tab: "ai-assistant",
      actionText: "Chat Now",
      color:
        "border-purple-500/25 hover:border-purple-500/80 hover:bg-purple-500/5",
    },
  ];

  const timelineItems = [
    {
      title: "STAR Bullet Optimization Run",
      time: "2 hours ago",
      desc: "Rewrote Google experience description focusing on metrics and business outcomes.",
      icon: Sparkles,
      iconBg: "bg-purple-500/10 border border-purple-500/30 text-purple-400",
    },
    {
      title: "Portfolio Domain Configured",
      time: "Yesterday",
      desc: "Successfully mapped custom slug 'pratyush-software' to public URL.",
      icon: Eye,
      iconBg: "bg-blue-500/10 border border-blue-500/30 text-blue-400",
    },
    {
      title: "Job Fit Check: Senior Frontend Architect",
      time: "3 days ago",
      desc: "Ran match scanner for Netflix JD. Score: 82% match with 4 suggested keywords.",
      icon: FileCheck2,
      iconBg: "bg-[#F5B301]/10 border border-[#F5B301]/30 text-[#F5B301]",
    },
  ];

  const suggestions = [
    {
      title: "High-priority keyword mismatch",
      desc: "Your resume is missing 'React 19 Server Components'. This is required in 3 bookmarked jobs.",
      type: "warning",
      action: "Optimize Skills",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      tab: "resume",
    },
    {
      title: "Unpublished changes",
      desc: "You updated your experience timeline, but the portfolio theme is not synced. Publish now.",
      type: "idea",
      action: "Publish Themes",
      icon: Lightbulb,
      iconColor: "text-blue-400",
      tab: "portfolio",
    },
  ];

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* Header Greeting */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <span>
            {getGreeting()}, {userName}
          </span>
          <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-sm text-ascend-text-secondary font-light max-w-xl leading-relaxed">
          Welcome to your Ascend Career Operating System. Let's build something
          extraordinary for your career today.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => setActiveTab(m.tab)}
              className="p-5 rounded-card bg-gradient-to-b from-ascend-surface to-ascend-bg border border-ascend-border cursor-pointer transition-all duration-200 hover:border-ascend-primary/30 relative overflow-hidden group shadow-card"
            >
              {/* Subtle top light reflection */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium text-ascend-text-secondary">
                  {m.label}
                </span>
                <div
                  className={`p-2 rounded-button bg-white/5 border border-ascend-border ${m.iconColor}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-white">
                  <AnimatedCounter value={parseInt(m.value.toString())} />
                  {m.suffix}
                </span>
              </div>
              <span className="text-[10px] text-ascend-text-muted mt-1 block">
                {m.desc}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Work & Suggestive Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left Side: Quick Actions & Timeline */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest px-1">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(action.tab)}
                    className={`p-5 rounded-card bg-ascend-surface border text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-card flex flex-col justify-between h-36 relative group overflow-hidden ${action.color}`}
                  >
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-button bg-white/5 flex items-center justify-center border border-ascend-border group-hover:scale-110 transition-transform duration-200">
                        <Icon className="w-5 h-5 text-white/70" />
                      </div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">
                        {action.title}
                      </h4>
                      <p className="text-[11px] text-ascend-text-secondary leading-normal font-light">
                        {action.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ascend-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>{action.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest px-1">
              Activity History
            </h3>
            <div className="p-6 rounded-card bg-ascend-surface border border-ascend-border space-y-6 shadow-card relative">
              {timelineItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-4 relative group">
                    {/* Vertical Connecting Line */}
                    {idx !== timelineItems.length - 1 && (
                      <div className="absolute left-[17px] top-[30px] bottom-[-24px] w-[1px] bg-white/10 group-hover:bg-ascend-primary/30 transition-colors" />
                    )}

                    <div
                      className={`w-9 h-9 rounded-button flex items-center justify-center shrink-0 z-10 ${item.iconBg}`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white">
                          {item.title}
                        </h4>
                        <span className="text-[9px] text-ascend-text-muted flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-ascend-text-secondary leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: AI Suggestions & Large Banner */}
        <div className="space-y-6">
          {/* AI suggestions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest px-1">
              AI Insights
            </h3>

            <div className="space-y-3">
              {suggestions.map((sug, idx) => {
                const Icon = sug.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-card bg-ascend-surface/70 border border-ascend-border space-y-3 relative overflow-hidden group shadow-card"
                  >
                    <div className="flex gap-2">
                      <Icon
                        className={`w-4 h-4 shrink-0 mt-0.5 ${sug.iconColor}`}
                      />
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-white tracking-wide uppercase">
                          {sug.title}
                        </h4>
                        <p className="text-[10.5px] text-ascend-text-secondary leading-relaxed font-light">
                          {sug.desc}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab(sug.tab)}
                      className="w-full py-1.5 px-3 rounded-button bg-white/5 border border-ascend-border hover:border-ascend-primary/30 hover:bg-ascend-primary/5 text-[10px] font-semibold text-white tracking-wide flex items-center justify-center gap-1 group-hover:scale-[1.01] transition-all"
                    >
                      <span>{sug.action}</span>
                      <ArrowRight className="w-3 h-3 text-ascend-primary" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Large AI Banner */}
          <div className="p-6 rounded-card bg-gradient-to-br from-ascend-ai/20 via-ascend-ai/5 to-ascend-bg border border-ascend-ai/20 relative overflow-hidden group shadow-floating">
            {/* Ambient Purple Light Flare */}
            <div className="absolute -left-12 -bottom-12 w-28 h-28 bg-ascend-ai/10 rounded-full blur-2xl" />

            <div className="space-y-4 relative z-10">
              <div className="w-8 h-8 rounded-button bg-ascend-ai/20 border border-ascend-ai/30 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white leading-tight">
                  Let AI Transform Your Career
                </h4>
                <p className="text-[10px] text-ascend-text-secondary leading-normal font-light">
                  Elevate your applications, design high-impact summaries, and
                  receive personalized coaching.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("ai-assistant")}
                className="py-2 px-4 rounded-button bg-gradient-to-r from-ascend-ai to-[#6D28D9] hover:from-ascend-ai/90 hover:to-[#5B21B6] text-white font-semibold text-xs tracking-wide shadow-floating transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span>Ask AI Career Coach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
