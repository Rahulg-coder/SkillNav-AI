import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const loggedIn = !!(localStorage.getItem("token") || localStorage.getItem("skillpath_token"));

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;