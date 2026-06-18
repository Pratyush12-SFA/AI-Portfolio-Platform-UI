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
      navigate("/login");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)]">
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome!</h2>

        <p className="mt-2 text-zinc-400">Sign up to manage your portfolio.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Confirm Password</label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-medium transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] disabled:opacity-50"
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
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 transition duration-300 hover:-translate-y-1 hover:bg-white/10"
        >
          Continue with Google
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-medium text-purple-400 hover:text-purple-300"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
