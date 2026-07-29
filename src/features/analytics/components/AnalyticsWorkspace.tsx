import { useState } from "react";
import { 
  Eye, 
  ChevronDown
} from "lucide-react";

export default function AnalyticsWorkspace() {
  const [timeRange, setTimeRange] = useState("7d");

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

      {/* Empty State */}
      <div className="p-12 bg-ascend-surface border border-dashed border-ascend-border rounded-card flex flex-col items-center justify-center text-center shadow-xl">
        <Eye className="w-10 h-10 text-ascend-text-muted mb-4" />
        <h3 className="text-sm font-bold text-white tracking-wide">
          No Analytics Data Yet
        </h3>
        <p className="text-[11px] text-ascend-text-secondary font-light mt-2 max-w-md leading-relaxed">
          Portfolio traffic and profile strength data will appear here once your public page receives visitors. Publish your portfolio and share the link to start collecting insights.
        </p>
      </div>

    </div>
  );
}
