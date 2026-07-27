import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../queries/auth.queries";
import { useAuth } from "../../contexts/Authcontext/queries";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const response = await registerUser({
        fullName,
        email,
        password,
      });

      auth.login(response.accessToken);
      navigate("/dashboard");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(245,158,11,0.05)]">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome!</h2>

        <p className="mt-2 text-zinc-400 text-sm">Sign up to manage your portfolio.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Confirm Password</label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-semibold text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(245,158,11,0.3)] disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-white/10" />

          <span className="text-sm text-zinc-500">OR</span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 text-sm font-semibold"
        >
          Continue with Google (Sign In)
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-medium text-amber-400 hover:text-amber-300"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
