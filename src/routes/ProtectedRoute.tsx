import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext/queries";

export default function PrrotectedRoute({
    children
}: {
    children: React.ReactNode;
}) {
    const {
        isAuthenticated,
    } = useAuth();
    if(!isAuthenticated) {
        return (<Navigate to="/login" replace />
        );
    }
    return children;
}