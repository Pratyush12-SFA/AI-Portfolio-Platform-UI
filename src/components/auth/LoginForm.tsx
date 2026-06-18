import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLoginUser, loginUser } from "../../queries/auth.queries";
import { useAuth } from "../../contexts/Authcontext/queries";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({
        email,
        password,
        rememberMe,
      });

      auth.login(response.accessToken);

      navigate("/dashboard");
    } catch {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)]">
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>

        <p className="mt-2 text-zinc-400">Sign in to manage your portfolio.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
          <label className="mb-2 block text-sm text-zinc-400">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            placeholder="."
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <label>Remember Me</label>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-medium transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-white/10" />

          <span className="text-sm text-zinc-500">OR</span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={async (credenialResponse) => {
              if (!credenialResponse.credential) {
                return;
              }
              const response = await googleLoginUser(
                credenialResponse.credential,
              );
              auth.login(response.accessToken);

              navigate("/dashboard");
            }}
            onError={() => {
              setError("Google Login Failed");
            }}
          />
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-medium text-purple-400 hover:text-purple-300"
        >
          Create Account
        </button>
      </p>
    </div>
  );
}
