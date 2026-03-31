import { useContext, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AuthLayout = () => {
  const { role, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const normalizedRole = useMemo(
    () => String(role || "").trim().toLowerCase(),
    [role]
  );

  const getDashboardPath = (userRole) => {
    const map = {
      perusahaan: "/perusahaan/dashboard",
      cabang: "/cabang/dashboard",
      admin: "/admin/dashboard",
      superadmin: "/superadmin/dashboard",
      mentor: "/mentor/dashboard",
      peserta: "/peserta/dashboard",
      company: "/perusahaan/dashboard",
    };

    return map[userRole] || "/";
  };

  useEffect(() => {
    if (normalizedRole && token) {
      const redirectTo =
        sessionStorage.getItem("location") ||
        localStorage.getItem("location") ||
        getDashboardPath(normalizedRole);

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        sessionStorage.removeItem("location");
        localStorage.removeItem("location");
      }
    }
  }, [navigate, normalizedRole, token]);

  if (normalizedRole && token) return null;

  return <Outlet />;
};

export default AuthLayout;
