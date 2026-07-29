import { motion } from "framer-motion";

export default function HeroSection() {
  const words = ["Build.", "Manage.", "Showcase."];

  return (
    <div className="relative hidden overflow-hidden lg:flex bg-gradient-to-br from-[#0052FF] via-[#1a6aff] to-[#4D7CFF]">
      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/8 blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex w-full flex-col justify-between p-16">
        {/* Brand mark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <h2
            className="text-xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ascend
          </h2>
        </div>

        {/* Main content */}
        <div className="max-w-lg">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
            AI Career Operating System
          </p>

          <div className="space-y-0">
            {words.map((word, idx) => (
              <motion.h1
                key={word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-7xl font-black leading-none text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {word}
              </motion.h1>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-base text-blue-100 leading-relaxed max-w-sm"
          >
            Create a premium digital presence powered by AI-driven resume
            optimization, intelligent job matching, and beautiful portfolio design.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="mt-5 text-xs text-white/50 font-mono tracking-widest"
          >
            Powered by .NET · React · AI
          </motion.p>
        </div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="grid max-w-sm grid-cols-3 gap-3"
        >
          <StatCard title="Projects" value="12+" />
          <StatCard title="Skills Tracked" value="18+" />
          <StatCard title="Certificates" value="3+" />
        </motion.div>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:border-white/30">
      <p className="text-xs text-blue-200">{title}</p>
      <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}