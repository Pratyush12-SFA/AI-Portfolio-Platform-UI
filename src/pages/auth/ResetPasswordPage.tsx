import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../lib/validations/auth";
import { resetPassword } from "../../services/portfolio.service";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: (data) => {
      const result = resetPasswordSchema.safeParse(data);
      if (result.success) return { values: result.data, errors: {} };
      const fieldErrors: Record<string, { type: string; message: string }> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = { type: issue.code, message: issue.message };
        }
      }
      return { values: {}, errors: fieldErrors };
    },
  });

  const [message, setMessage] = useState("");

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      setMessage("");
      const res = await resetPassword({ token, newPassword: data.password });
      if (res.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError("root", { message: res.message || "Failed to reset password." });
      }
    } catch {
      setError("root", { message: "Failed to reset password." });
    }
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(245,158,11,0.05)]">
        <h2 className="text-3xl font-bold text-white tracking-tight">Set New Password</h2>
        <p className="mt-2 text-zinc-400 text-sm">Please choose a secure new password.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">New Password</label>
            <input
              type="password"
              required
              {...register("password")}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Confirm New Password</label>
            <input
              type="password"
              required
              {...register("confirmPassword")}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errors.root && <p className="text-sm text-red-400">{errors.root.message}</p>}
          {message && <p className="text-sm text-amber-400 font-medium">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-medium text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50"
          >
            {!token ? "Missing Token" : isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
