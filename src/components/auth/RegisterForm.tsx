import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser, googleLoginUser } from "../../queries/auth.queries";
import { useAuth } from "../../contexts/Authcontext/queries";
import { registerSchema } from "../../lib/validations/auth";
import type { RegisterFormData } from "../../lib/validations/auth";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const resolver = (data: RegisterFormData) => {
  const result = registerSchema.safeParse(data);
  if (result.success) return { values: result.data, errors: {} };
  const fieldErrors = result.error.issues.reduce((acc, issue) => {
    const path = issue.path.join(".");
    if (!acc[path]) acc[path] = { message: issue.message, type: "validation" };
    return acc;
  }, {} as Record<string, { message: string; type: string }>);
  return { values: {}, errors: fieldErrors };
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const hasGoogleClient =
    !!import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID !== "disabled-placeholder-client-id";

  async function onSubmit(data: RegisterFormData) {
    try {
      setLoading(true);
      setError("");
      const response = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      auth.login(response.AccessToken);
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
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
            Get started for free
          </span>
        </div>
        <h2
          className="text-3xl font-bold text-ascend-text-primary tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Create your account
        </h2>
        <p className="mt-2 text-sm text-ascend-text-muted">
          Join Ascend and accelerate your career with AI.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ascend-text-secondary">
            Full Name
          </label>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Jane Doe"
            className="input-light w-full px-4 py-3 text-sm"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-ascend-danger">{errors.fullName.message}</p>
          )}
        </div>

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
            <p className="mt-1 text-sm text-ascend-danger">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ascend-text-secondary">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••••"
            className="input-light w-full px-4 py-3 text-sm"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-ascend-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-3 py-2.5 bg-ascend-danger-light border border-ascend-danger/20 rounded-lg">
            <p className="text-sm text-ascend-danger">{error}</p>
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
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

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
                      setError("Google sign up failed: No access token returned");
                    }
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : "Google sign up failed");
                  }
                }}
                onError={() => {
                  setError("Google sign up failed");
                }}
              />
            </div>
          </>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-ascend-text-muted">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-semibold text-ascend-primary hover:text-ascend-primary-hover transition-colors"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
