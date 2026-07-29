import { useState } from "react";
import { 
  TrendingUp, 
  Eye, 
  Award, 
  ArrowUpRight, 
  Target,
  ChevronDown
} from "lucide-react";

export default function AnalyticsWorkspace() {
  const [timeRange, setTimeRange] = useState("7d");

  const coreCompetencies = [
    { name: "Frontend Architecture", level: 92, count: "React 19, TS, Vite" },
    { name: "API & Backend Systems", level: 85, count: ".NET, REST, SQL" },
    { name: "AI Integration & Prompt Engineering", level: 78, count: "OpenAI, LLM Tooling" },
    { name: "DevOps & Cloud Deployment", level: 68, count: "Docker, AWS, CI/CD" }
  ];

  // SVG dimensions for animated line chart
  const svgWidth = 500;
  const svgHeight = 150;
  const points = [40, 65, 55, 95, 110, 85, 130]; // 7 data points
  
  // Map points to SVG coordinates
  const svgPoints = points.map((p, index) => {
    const x = (index / (points.length - 1)) * svgWidth;
    const y = svgHeight - (p / 150) * svgHeight;
    return { x, y };
  });

  // Construct SVG path string for bezier curve
  const pathD = svgPoints.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = svgPoints[index - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, "");

  // Construct fill path string to color gradient below the curve
  const fillD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="space-y-6 select-none">
      
      {/* Upper header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Workspace Analytics</h3>
          <p className="text-[10px] text-ascend-text-secondary font-light">Monitor public search discoveries, theme pageviews, and resume competency ratios.</p>
        </div>
        
        <div className="relative">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-ascend-surface border border-ascend-border rounded-xl text-xs font-semibold px-4 py-2 text-white pr-8 focus:outline-none focus:border-ascend-primary cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
          </select>
          <ChevronDown className="w-4 h-4 text-ascend-text-muted absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Grid: SVG Line Chart & Core Competencies */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        
        {/* SVG Bezier Line Chart */}
        <div className="p-6 bg-ascend-surface border border-ascend-border rounded-card space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Eye className="w-4.5 h-4.5 text-ascend-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Portfolio Traffic Discovery</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>+18.4%</span>
            </div>
          </div>

          <div className="relative pt-4">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto overflow-visible"
            >
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5B301" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F5B301" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Background Lines */}
              <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* Area path with gradient */}
              <path d={fillD} fill="url(#chartGlow)" />

              {/* Main curve path */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="#F5B301" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="animate-pulse-glow"
              />

              {/* Glow node circles */}
              {svgPoints.map((pt, idx) => (
                <circle 
                  key={idx}
                  cx={pt.x} 
                  cy={pt.y} 
                  r="4" 
                  className="fill-[#09090B] stroke-ascend-primary" 
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[9px] text-ascend-text-muted font-mono pt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Skill Competency breakdown */}
        <div className="p-6 bg-ascend-surface border border-ascend-border rounded-card space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Target className="w-4.5 h-4.5 text-white" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Profile Strengths</span>
          </div>

          <div className="space-y-4">
            {coreCompetencies.map((comp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-zinc-200">{comp.name}</span>
                  <span className="font-bold text-ascend-primary">{comp.level}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-ascend-primary to-ascend-ai"
                    style={{ width: `${comp.level}%` }}
                  />
                </div>
                <span className="text-[9px] text-ascend-text-muted block">{comp.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Numerical Analytics summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-button bg-black/20 border border-ascend-border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-ascend-text-muted uppercase tracking-widest font-semibold">Discovery Matches</span>
            <span className="text-lg font-bold text-white block mt-0.5">342</span>
          </div>
          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="p-4 rounded-button bg-black/20 border border-ascend-border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-ascend-text-muted uppercase tracking-widest font-semibold">Average session time</span>
            <span className="text-lg font-bold text-white block mt-0.5">4m 12s</span>
          </div>
          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="p-4 rounded-button bg-black/20 border border-ascend-border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-ascend-text-muted uppercase tracking-widest font-semibold">Resume score level</span>
            <span className="text-lg font-bold text-white block mt-0.5">Advanced</span>
          </div>
          <Award className="w-5 h-5 text-ascend-primary" />
        </div>
      </div>

    </div>
  );
}
