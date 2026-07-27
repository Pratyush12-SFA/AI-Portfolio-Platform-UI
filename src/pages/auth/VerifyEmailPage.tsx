import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../services/portfolio.service";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Verification token is missing.");
      setLoading(false);
      return;
    }

    async function doVerification() {
      try {
        const res = await verifyEmail(token);
        if (res.success) {
          setSuccess(true);
        } else {
          setError(res.message || "Email verification failed.");
        }
      } catch {
        setError("Network error. Could not verify email.");
      } finally {
        setLoading(false);
      }
    }

    doVerification();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(245,158,11,0.05)] text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Email Verification</h2>

        <div className="mt-8 space-y-6">
          {loading && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-zinc-400 text-sm">Verifying your email address...</p>
            </div>
          )}

          {!loading && success && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
              <p className="text-zinc-200 font-medium">Your email has been verified successfully!</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-medium text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              >
                Go to Sign In
              </button>
            </div>
          )}

          {!loading && !success && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">✗</div>
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full mt-4 rounded-xl border border-white/10 bg-white/5 py-3 transition hover:bg-white/10"
              >
                Go to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
