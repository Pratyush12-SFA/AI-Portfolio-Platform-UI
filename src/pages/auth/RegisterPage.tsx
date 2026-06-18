import { Navigate } from "react-router-dom";
import HeroSection from "../../components/auth/HeroSection";
import RegisterForm from "../../components/auth/RegisterForm";
import { useAuth } from "../../contexts/Authcontext/queries";

export default function RegisterPage() {
    const {isAuthenticated} = useAuth();
    if(isAuthenticated) {
        return (<Navigate to="/dashboard" replace />
        );
    }
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="grid min-h-screen lg:grid-cols-2">
                <HeroSection />
                <div className="flex items-center justify-center p-8">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}