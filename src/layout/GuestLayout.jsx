import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";  
import { AuthContext } from "../contexts/AuthContext";

const GuestLayout = () => {
  const navigate = useNavigate();
  const { token, role, isLoadingUser } = useContext(AuthContext);

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

  const normalizedRole = useMemo(
    () => String(role || "").trim().toLowerCase(),
    [role]
  );

  const shouldRedirect =
    !!token && !isLoadingUser && normalizedRole && normalizedRole !== "peserta";

  useEffect(() => {
    if (!shouldRedirect) return;
    navigate(getDashboardPath(normalizedRole), { replace: true });
  }, [shouldRedirect, normalizedRole, navigate]);

  if (shouldRedirect) return null;

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default GuestLayout;
