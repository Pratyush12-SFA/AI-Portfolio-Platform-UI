import { Navigate } from "react-router-dom";
import HeroSection from "../../components/auth/HeroSection";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../contexts/Authcontext/queries";


export default function LoginPage() {
    const {isAuthenticated} = useAuth();
    if(isAuthenticated) {
        return (<Navigate to="/dashboard" replace />
        );
    }
    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white">
            <div className="grid min-h-screen lg: grid-cols-[60%_40%]">
                <HeroSection />
                <div className="flex items-center justify-center p-6 lg:p-12">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}