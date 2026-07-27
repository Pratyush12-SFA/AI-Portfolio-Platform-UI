import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/portfolio.service";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await resetPassword({ token, newPassword: password });
      if (res.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(res.message || "Failed to reset password.");
      }
    } catch {
      setError("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(245,158,11,0.05)]">
        <h2 className="text-3xl font-bold text-white tracking-tight">Set New Password</h2>
        <p className="mt-2 text-zinc-400 text-sm">Please choose a secure new password.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-amber-400 font-medium">{message}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-medium text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50"
          >
            {!token ? "Missing Token" : loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
