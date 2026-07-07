import { Navigate } from "react-router-dom";

function UserProtectedRoute({ children }) {

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    return children;
}

export default UserProtectedRoute;