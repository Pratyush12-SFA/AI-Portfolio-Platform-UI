export default function HeroSection() {
  return (
    <div className="relative hidden overflow-hidden lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#25104d_0%,#0b0b0f_55%)]" />

      <div className="relative z-10 flex w-full flex-col justify-between p-16">
        <div>
          <h2 className="text-2xl font-semibold tracking-wide">
            AI Portfolio
          </h2>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-400">
            Premium Portfolio Platform
          </p>

          <h1 className="text-7xl font-bold leading-none">
            Build.
            <br />
            Manage.
            <br />
            Showcase.
          </h1>

         <>
  <p className="mt-8 text-lg text-zinc-400">
    Create a premium digital presence powered by modern
    software, AI and beautiful design.
  </p>

  <p className="mt-6 text-sm text-purple-300">
    Powered by .NET • React • AI
  </p>
</>
        </div>

        <div className="grid max-w-xl grid-cols-3 gap-4">
          <StatCard title="Projects" value="12+" />
          <StatCard title="Skills" value="18+" />
          <StatCard title="Certificates" value="3+" />
        </div>
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-500/30">
      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}