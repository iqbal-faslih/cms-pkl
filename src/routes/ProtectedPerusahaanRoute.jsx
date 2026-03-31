import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { StatusPerusahaanContext } from "../contexts/StatusPerusahaanContext";
import {
  isAllowedRouteWhenProfileIncomplete,
  PERUSAHAAN_GUARD_ROUTES,
  PERUSAHAAN_GUARD_TOAST_MESSAGES,
} from "./guards/perusahaanGuardConfig";

const ProtectedPerusahaanRoute = () => {
  const { hasProfilPerusahaan, loading } = useContext(StatusPerusahaanContext);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const reason = location.state?.reason;
    if (!reason || !PERUSAHAAN_GUARD_TOAST_MESSAGES[reason]) return;

    const notify = reason === "already_completed" ? toast.success : toast.error;

    notify(PERUSAHAAN_GUARD_TOAST_MESSAGES[reason], {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    window.history.replaceState({}, document.title);
  }, [location.state]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (
    hasProfilPerusahaan &&
    currentPath === PERUSAHAAN_GUARD_ROUTES.REGISTRASI
  ) {
    return (
      <Navigate
        to={PERUSAHAAN_GUARD_ROUTES.DASHBOARD}
        state={{ reason: "already_completed" }}
        replace
      />
    );
  }

  if (
    !hasProfilPerusahaan &&
    !isAllowedRouteWhenProfileIncomplete(currentPath)
  ) {
    return (
      <Navigate
        to={PERUSAHAAN_GUARD_ROUTES.DASHBOARD}
        state={{ from: location, reason: "profile_incomplete" }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedPerusahaanRoute;
