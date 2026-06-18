import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../queries/auth.queries";
import { useAuth } from "../../contexts/Authcontext/queries";

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <button
          onClick={async () => {
            try {
              await logoutUser();

              logout();

              navigate("/login");
            } catch {
              alert("Logout failed. Please try again.");
            }
          }}
        >
          Logout
        </button>
      </div>
      <div className="p-10">
        <h1 className="text-5xl font-bold">Dashboard</h1>
        <p className="mt-4 text-zinc-400">
          Welcome to AI Portfolio! This is your dashboard where you can manage
          your projects, skills, and certificates. Explore the features and
          create an impressive portfolio to showcase your talents.
        </p>
      </div>
    </div>
  );
}
