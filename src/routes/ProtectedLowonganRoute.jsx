import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const getDashboardPath = (userRole) => {
  const map = {
    perusahaan: "/perusahaan/dashboard",
    cabang: "/cabang/dashboard",
    admin: "/admin/dashboard",
    superadmin: "/superadmin/dashboard",
    mentor: "/mentor/dashboard",
    company: "/perusahaan/dashboard",
  };

  return map[userRole] || "/";
};

const ProtectedLowonganRoute = () => {
  const { token, role, isLoadingUser } = useContext(AuthContext);

  if (token && isLoadingUser) return null;

  if (token) {
    const normalizedRole = String(role || "").trim().toLowerCase();
    if (normalizedRole && normalizedRole !== "peserta") {
      return (
        <Navigate
          to={getDashboardPath(normalizedRole)}
          replace
          state={{ reason: "forbidden" }}
        />
      );
    }
  }

  return <Outlet />;
};

export default ProtectedLowonganRoute;
