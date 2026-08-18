import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Bot,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface HomeWorkspaceProps {
  profile: Portfolio.Profile | null;
  projects?: Portfolio.Project[];
  skills?: Portfolio.Skill[];
  experiences?: Portfolio.Experience[];
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
  projects = [],
  skills = [],
  experiences = [],
}: HomeWorkspaceProps) {
  const navigate = useNavigate();
  const userName = profile?.FullName?.split(" ")[0] || "User";
  const [miniChatInput, setMiniChatInput] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Compute profile completion percentage dynamically
  let completion = 0;
  if (profile?.FullName) completion += 15;
  if (profile?.Summary) completion += 15;
  if (profile?.ContactEmail || profile?.PhoneNumber) completion += 10;
  if (experiences && experiences.length > 0) completion += 20;
  if (projects && projects.length > 0) completion += 20;
  if (skills && skills.length > 0) completion += 20;

  const metrics = [
    {
      label: "Profile Completion",
      value: completion,
      suffix: "%",
      desc:
        completion === 100
          ? "Profile fully completed"
          : "Add more info to reach 100%",
      icon: Sparkles,
      iconStyle: "bg-blue-50 text-blue-600 border border-blue-100",
      tab: "/dashboard/resume",
      trend: `${completion}%`,
    },
    {
      label: "Projects Added",
      value: projects.length,
      suffix: "",
      desc:
        projects.length > 0
          ? `${projects.length} active projects`
          : "No projects added yet",
      icon: Send,
      iconStyle:
        "bg-[#EEF3FF] text-[#0052FF] border border-[rgba(0,82,255,0.15)]",
      tab: "/dashboard/portfolio",
      trend: `+${projects.length}`,
    },
    {
      label: "Skills Matched",
      value: skills.length,
      suffix: "",
      desc: `${skills.length} core competencies`,
      icon: FileCheck2,
      iconStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      tab: "/dashboard/resume",
      trend: `+${skills.length}`,
    },
    {
      label: "Work Experiences",
      value: experiences.length,
      suffix: "",
      desc: `${experiences.length} career achievements`,
      icon: Bot,
      iconStyle: "bg-sky-50 text-sky-600 border border-sky-100",
      tab: "/dashboard/resume",
      trend: `+${experiences.length}`,
    },
  ];

  const getAIRecommendation = () => {
    if (!skills || skills.length === 0) {
      return {
        title: "Add Core Skills",
        desc: "Get started by listing your technical skills, programming languages, and frameworks in the resume builder to enable job matching.",
      };
    }
    if (!projects || projects.length === 0) {
      return {
        title: "Add Showcase Projects",
        desc: "Showcase your practical expertise by adding projects with technical stacks and GitHub links to your portfolio.",
      };
    }
    if (!profile?.Summary) {
      return {
        title: "Write Professional Summary",
        desc: "Add a career summary to your profile to let recruiters know your specialization and career objectives.",
      };
    }
    return {
      title: "Optimize ATS Keyword Matching",
      desc: "Your profile is in great shape! Head to the Jobs board to upload job descriptions and run ATS match checks against your resume.",
    };
  };

  const aiRec = getAIRecommendation();

  const timelineItems: Array<{
    title: string;
    time: string;
    desc: string;
    icon: LucideIcon;
    iconStyle: string;
  }> = [];

  if (profile?.Summary) {
    timelineItems.push({
      title: "Profile Summary Updated",
      time: "Recent",
      desc: "Updated your professional career summary and target focus.",
      icon: Sparkles,
      iconStyle: "bg-blue-50 border border-blue-100 text-blue-600",
    });
  }

  if (projects && projects.length > 0) {
    const latestProj = projects[projects.length - 1];
    timelineItems.push({
      title: `Project Added: ${latestProj.Title}`,
      time: "Recent",
      desc:
        latestProj.Description ||
        "Added a new project to showcase your technical stack.",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 border border-emerald-100 text-emerald-600",
    });
  }

  if (experiences && experiences.length > 0) {
    const latestExp = experiences[experiences.length - 1];
    timelineItems.push({
      title: `Experience Added: ${latestExp.JobTitle || latestExp.Position}`,
      time: "Recent",
      desc: `Joined ${latestExp.CompanyName || latestExp.Company}.`,
      icon: FileCheck2,
      iconStyle: "bg-sky-50 border border-sky-100 text-sky-600",
    });
  }

  if (timelineItems.length === 0) {
    timelineItems.push({
      title: "Welcome to Ascend!",
      time: "Just now",
      desc: "Start by completing your profile in the Resume Builder workspace.",
      icon: Sparkles,
      iconStyle: "bg-blue-50 border border-blue-100 text-blue-600",
    });
  }

  const displayProjects = projects.map((p) => {
    const tech = p.TechStack
      ? p.TechStack.split(",").map((t) => t.trim())
      : p.Technologies
        ? p.Technologies.split(",").map((t) => t.trim())
        : [];
    return {
      name: p.Title,
      role: p.Role || "Contributor",
      status: p.ProjectUrl || p.GithubUrl ? "Published" : "Draft",
      progress: p.Description ? 100 : 50,
      score: p.TechStack ? "Optimized" : "Draft",
      tech: tech.slice(0, 3),
    };
  });

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
              <span className="text-2xl font-bold text-[#0052FF]">
                {completion}%
              </span>
              <span className="text-[10px] text-gray-400 block font-semibold">
                COMPLETED
              </span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center relative bg-gray-50 shrink-0">
              <span className="text-sm font-bold text-gray-800">
                {completion}%
              </span>
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-[#0052FF] fill-none"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - completion / 100)}
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
            <h3 className="text-base font-bold text-gray-900">{aiRec.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {aiRec.desc}
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
          {displayProjects.map((p, idx) => (
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
