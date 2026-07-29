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
        <div className="min-h-screen bg-white">
            <div className="grid min-h-screen lg:grid-cols-[55%_45%]">
                <HeroSection />
                <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}