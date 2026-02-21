import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard
        const dashboardMap = {
            student: "/student-dashboard",
            faculty: "/faculty-dashboard",
            admin: "/admin-dashboard",
        };
        return <Navigate to={dashboardMap[user.role] || "/"} replace />;
    }

    return children;
}
