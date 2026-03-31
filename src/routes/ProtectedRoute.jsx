import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useContext(AuthContext);
  const unauthorized = !token || (allowedRoles && !allowedRoles.includes(role));

  if (unauthorized) {
    return <Navigate to="/auth/login" replace state={{ reason: "unauthorized" }} />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
