import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../lib/validations/auth";
import { googleLoginUser, loginUser } from "../../queries/auth.queries";
import { useAuth } from "../../contexts/Authcontext/queries";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const hasGoogleClient =
    !!import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID !== "disabled-placeholder-client-id";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setLoading(true);
      setServerError("");
      const response = await loginUser({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      });
      auth.login(response.AccessToken);
      navigate("/dashboard");
    } catch {
      setServerError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ascend-primary-light border border-ascend-primary/20 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-ascend-primary" />
          <span className="text-[11px] font-semibold text-ascend-primary tracking-wide">
            Welcome back
          </span>
        </div>
        <h2
          className="text-3xl font-bold text-ascend-text-primary tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sign in to Ascend
        </h2>
        <p className="mt-2 text-sm text-ascend-text-muted">
          Your AI career OS is ready for you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ascend-text-secondary">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="input-light w-full px-4 py-3 text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-ascend-danger">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ascend-text-secondary">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className="input-light w-full px-4 py-3 text-sm pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ascend-text-muted hover:text-ascend-text-secondary p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 accent-[#0052FF] rounded"
            />
            <span className="text-sm text-ascend-text-muted select-none group-hover:text-ascend-text-secondary">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-medium text-ascend-primary hover:text-ascend-primary-hover transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="px-3 py-2.5 bg-ascend-danger-light border border-ascend-danger/20 rounded-lg">
            <p className="text-sm text-ascend-danger">{serverError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-sm rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

        {/* Google Login */}
        {hasGoogleClient && (
          <>
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-ascend-border" />
              <span className="text-xs text-ascend-text-muted font-medium">or</span>
              <div className="h-px flex-1 bg-ascend-border" />
            </div>

            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) return;
                  try {
                    const response = await googleLoginUser(
                      credentialResponse.credential
                    );
                    if (response && response.AccessToken) {
                      auth.login(response.AccessToken);
                      navigate("/dashboard");
                    } else {
                      setServerError(
                        "Google Login failed: No access token returned"
                      );
                    }
                  } catch (e: unknown) {
                    setServerError(
                      e instanceof Error ? e.message : "Google Login Failed"
                    );
                  }
                }}
                onError={() => {
                  setServerError("Google Login Failed");
                }}
              />
            </div>
          </>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-ascend-text-muted">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-semibold text-ascend-primary hover:text-ascend-primary-hover transition-colors"
        >
          Create Account
        </button>
      </p>
    </div>
  );
}
