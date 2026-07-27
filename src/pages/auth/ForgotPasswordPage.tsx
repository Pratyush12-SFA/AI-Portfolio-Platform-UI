import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/portfolio.service";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await forgotPassword(email);
      setMessage(res.message || "Password reset link sent!");
    } catch {
      setError("Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(245,158,11,0.05)]">
        <h2 className="text-3xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="mt-2 text-zinc-400 text-sm">Enter your email and we'll send you a password reset link.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-amber-400 font-medium">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-medium text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-amber-400 hover:text-amber-300"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
