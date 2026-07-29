import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Bot,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface HomeWorkspaceProps {
  profile: any;
  projects?: any[];
  skills?: any[];
  experiences?: any[];
}

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
    const duration = 800;
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
}: HomeWorkspaceProps) {
  const navigate = useNavigate();
  const userName = profile?.FullName?.split(" ")[0] || "Pratyush";
  const [miniChatInput, setMiniChatInput] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const metrics = [
    {
      label: "Resume ATS Score",
      value: 88,
      suffix: "%",
      desc: "ATS verified · top 12%",
      icon: Sparkles,
      iconStyle: "bg-blue-50 text-blue-600 border border-blue-100",
      tab: "/dashboard/resume",
      trend: "+4%",
    },
    {
      label: "Application Success",
      value: 74,
      suffix: "%",
      desc: "+12% this week",
      icon: Send,
      iconStyle:
        "bg-[#EEF3FF] text-[#0052FF] border border-[rgba(0,82,255,0.15)]",
      tab: "/dashboard/jobs",
      trend: "+12%",
    },
    {
      label: "Skills Coverage",
      value: 82,
      suffix: "%",
      desc: "18 / 22 core skills matched",
      icon: FileCheck2,
      iconStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      tab: "/dashboard/resume",
      trend: "+6%",
    },
    {
      label: "AI Confidence Score",
      value: 91,
      suffix: "%",
      desc: "High fit recommendation",
      icon: Bot,
      iconStyle: "bg-sky-50 text-sky-600 border border-sky-100",
      tab: "/dashboard/ai-assistant",
      trend: "+3%",
    },
  ];

  const timelineItems = [
    {
      title: "STAR Bullet Optimization Run",
      time: "2 hours ago",
      desc: "Rewrote Google experience description focusing on metrics and business outcomes.",
      icon: Sparkles,
      iconStyle: "bg-blue-50 border border-blue-100 text-blue-600",
    },
    {
      title: "Portfolio Domain Configured",
      time: "Yesterday",
      desc: "Successfully mapped custom slug 'pratyush-software' to public URL.",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 border border-emerald-100 text-emerald-600",
    },
    {
      title: "Job Fit Check: Senior Frontend Architect",
      time: "3 days ago",
      desc: "Ran match scanner for Netflix JD. Score: 82% match with 4 suggested keywords.",
      icon: FileCheck2,
      iconStyle: "bg-sky-50 border border-sky-100 text-sky-600",
    },
  ];

  const mockProjects = [
    {
      name: "AI Portfolio Platform",
      role: "Lead Frontend Architect",
      status: "Published",
      progress: 95,
      score: "92% ATS",
      tech: ["React 19", "Vite", "Tailwind v4"],
    },
    {
      name: "Talent Development Portal",
      role: "Senior Systems Engineer",
      status: "In Progress",
      progress: 68,
      score: "85% ATS",
      tech: ["C# .NET", "PostgreSQL", "Zustand"],
    },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto select-none">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-1.5"
      >
        <h1
          className="text-4xl font-bold tracking-tight text-gray-900 flex items-center gap-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {getGreeting()}, {userName}
          <span>👋</span>
        </h1>
        <p className="text-sm text-gray-500 font-normal leading-relaxed">
          Welcome to your Ascend Career Dashboard. Here is your linear progress
          timeline and suggestions for today.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 surface-card relative overflow-hidden group"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <span className="section-label">Today&apos;s Goal</span>
            <h3 className="text-lg font-bold text-gray-900">
              Complete your profile
            </h3>
            <p className="text-xs text-gray-500">
              Add key projects and optimize your custom domain details.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right sm:block hidden">
              <span className="text-2xl font-bold text-[#0052FF]">82%</span>
              <span className="text-[10px] text-gray-400 block font-semibold">
                COMPLETED
              </span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center relative bg-gray-50 shrink-0">
              <span className="text-sm font-bold text-gray-800">82%</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-[#0052FF] fill-none"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - 0.82)}
                />
              </svg>
            </div>
            <button
              onClick={() => navigate("/dashboard/resume")}
              className="btn-primary py-2 px-4 rounded-lg text-xs"
            >
              Finish Profile
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 bg-blue-50 border border-blue-100 rounded-xl flex gap-4"
      >
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0 h-10 w-10 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-3 flex-1">
          <div className="space-y-1">
            <span className="section-label text-[#0052FF]">
              Primary AI Recommendation
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Improve ATS Score
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your resume is currently missing{" "}
              <strong className="text-gray-900 font-semibold">
                React 19 Server Components
              </strong>
              . This skill is explicitly required in 3 of your bookmarked job
              descriptions.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/resume")}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0052FF] hover:text-[#0040CC] transition-colors"
          >
            <span>Optimize Skills in Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      <div className="space-y-3">
        <span className="section-label px-0.5">Metrics</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{
                  y: -2,
                }}
                onClick={() => navigate(m.tab)}
                className="p-5 surface-card cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-[11px] font-semibold text-gray-500 tracking-tight leading-tight">
                    {m.label}
                  </span>
                  <div className={`p-1.5 rounded-lg ${m.iconStyle}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={parseInt(m.value.toString())} />
                    {m.suffix}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                    {m.trend}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block leading-tight">
                  {m.desc}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <span className="section-label px-0.5">Projects</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProjects.map((p, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/dashboard/portfolio")}
              className="p-5 surface-card cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{p.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.role}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    p.status === "Published" ? "badge-success" : "badge-blue"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="space-y-1 mt-4">
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>ATS optimization rating</span>
                  <span className="font-bold text-gray-700">{p.progress}%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${
                      p.status === "Published"
                        ? "from-emerald-400 to-emerald-500"
                        : "from-[#0052FF] to-[#4D7CFF]"
                    }`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                <span className="text-[9px] font-semibold text-gray-400">
                  {p.score}
                </span>
                <div className="flex gap-1">
                  {p.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-gray-100 text-[8px] text-gray-500 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="section-label px-0.5">Recent Activity</span>
        <div className="p-5 surface-card space-y-4">
          {timelineItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex gap-4 relative group">
                {idx !== timelineItems.length - 1 && (
                  <div className="absolute left-4.25 top-8 -bottom-5 w-px bg-gray-100" />
                )}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 z-10 ${item.iconStyle}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-800">
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-gray-400 font-medium">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <span className="section-label px-0.5">AI Chat</span>
        <motion.div
          whileHover={{ y: -1 }}
          className="p-5 rounded-xl bg-linear-to-br from-[#0052FF] to-[#4D7CFF] text-white relative overflow-hidden shadow-md"
        >
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex gap-4 items-start relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center text-white shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="space-y-1">
                <h4
                  className="text-base font-bold text-white leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Consult AI Coach
                </h4>
                <p className="text-[11px] text-blue-100 leading-relaxed max-w-lg">
                  Ask me anything about resume rewriting, interview preparation,
                  or portfolio themes. I have full context of your workspace.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask the coach..."
                  value={miniChatInput}
                  onChange={(e) => setMiniChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && miniChatInput.trim()) {
                      navigate("/dashboard/ai-assistant");
                    }
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white placeholder-blue-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                />
                <button
                  onClick={() => {
                    if (miniChatInput.trim()) {
                      navigate("/dashboard/ai-assistant");
                    }
                  }}
                  className="px-3.5 bg-white text-[#0052FF] hover:bg-blue-50 font-bold text-xs rounded-lg transition-colors flex items-center justify-center shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
