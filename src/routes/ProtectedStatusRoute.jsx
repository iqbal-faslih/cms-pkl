import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { StatusContext } from "../pages/student/StatusContext";
import { toast } from "react-toastify"; // atau library toast lain yang Anda gunakan

const ROUTES = {
  DASHBOARD: "/peserta/dashboard",
  SETTINGS: "/peserta/profile-settings",
  REGIST: "/peserta/registrasi",
  PASSWORD: "/peserta/kata-sandi",
  RIWAYAT_LOWONGAN: "/peserta/riwayat-lowongan"
};

const ALLOWED_ROUTES_PROFILE_COMPLETE = [
  ROUTES.DASHBOARD, 
  ROUTES.SETTINGS, 
  ROUTES.PASSWORD, 
  ROUTES.RIWAYAT_LOWONGAN
];

const TOAST_MESSAGES = {
  already_completed: "Profil Anda sudah lengkap. Tidak perlu mengakses halaman registrasi lagi.",
  profile_incomplete: "Akses tidak diizinkan. Isi dan lengkapi data diri anda terlebih dahulu.",
  internship_pending: "Permohonan Anda sedang dalam proses verifikasi. Silakan tunggu informasi lebih lanjut."
};

const ProtectedStatusRoute = () => {
  const { profileComplete, internshipStatus, userLoading } = useContext(StatusContext);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const state = location.state;
    if (state?.reason && TOAST_MESSAGES[state.reason]) {
      toast.error(TOAST_MESSAGES[state.reason], {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (userLoading) {
    return (
      <div
        className="w-full min-h-[60vh] flex items-center justify-center"
        role="status"
        aria-label="Loading user data"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // RULE REGIST: hanya bisa diakses kalau profile belum complete
  if (currentPath === ROUTES.REGIST && profileComplete) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        state={{ from: location, reason: "already_completed" }}
        replace
      />
    );
  }

  // RULE 1: Incomplete profile - hanya boleh buka dashboard & registrasi
  if (
    !profileComplete &&
    ![ROUTES.DASHBOARD, ROUTES.REGIST].includes(currentPath)
  ) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        state={{ from: location, reason: "profile_incomplete" }}
        replace
      />
    );
  }

  // RULE 2: Profile complete tapi belum magang - hanya dashboard & settings
  if (profileComplete && !internshipStatus) {
    if (!ALLOWED_ROUTES_PROFILE_COMPLETE.includes(currentPath)) {
      return (
        <Navigate
          to={ROUTES.DASHBOARD}
          state={{ from: location, reason: "internship_pending" }}
          replace
        />
      );
    }
  }

  // RULE 3: Dua kondisi true - semua rute dapat diakses
  // nonaktifin 2 Rule tadi agar semua rute bisa diakses(development)
  return <Outlet />;
};

export default ProtectedStatusRoute;
