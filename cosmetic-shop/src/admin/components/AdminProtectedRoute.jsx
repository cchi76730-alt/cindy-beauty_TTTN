import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const admin = JSON.parse(localStorage.getItem("admin"));

    if (!token || !admin) {
        return <Navigate to="/admin/auth" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(admin.role)
    ) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}

export default AdminProtectedRoute;