import { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

const useGoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRole, setToken } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const query = new URLSearchParams(location.search);
    const googleToken = query.get("token");
    const role = query.get("role");
    const id = query.get("id");
    const wasRecentlyCreated = query.get("wasRecentlyCreated") === "1";
    const hasPassword = query.get("password") === "1";

    if (!googleToken || !id) {
      setError("Data login tidak lengkap.");
      setLoading(false);
      return;
    }

    // simpan dulu sebagai token sementara
    sessionStorage.setItem("googleToken", googleToken);
    sessionStorage.setItem("id", id);

    // token final dihapus dulu
    sessionStorage.removeItem("token");

    // Validasi dan pengecekan 
    const validateUserData = (isNewUser = false) => {
      if (!hasPassword) {
        const message = isNewUser
          ? "Silahkan buat password untuk akun Anda"
          : "Silahkan buat password terlebih dahulu";
        toast.dismiss();
        toast.info(message);
        navigate("/auth/set-password", { replace: true });
        return false;
      }

      if (!role) {
        toast.dismiss()
        toast.info("Silahkan pilih role Anda");
        navigate("/auth/select", { replace: true });
        return false;
      }

      return true;
    };

    // Process based on user status
    if (wasRecentlyCreated) {
      if (validateUserData(true)) {
        // promote googleToken → token final
        sessionStorage.setItem("token", googleToken);
        sessionStorage.removeItem("googleToken");

        setToken(googleToken);
        setRole(role);
        localStorage.setItem("location", `/${role}`);
        toast.dismiss();
        toast.success("Berhasil mendaftar dan login!");
        navigate(`/${role}/dashboard`, { replace: true });
      }
    } else {
      if (validateUserData(false)) {
        // promote googleToken → token final
        sessionStorage.setItem("token", googleToken);
        sessionStorage.removeItem("googleToken");

        setToken(googleToken);
        setRole(role);
        localStorage.setItem("location", `/${role}`);
        toast.dismiss();
        toast.success("Berhasil login!");
        navigate(`/${role}/dashboard`, { replace: true });
      }
    }

    setLoading(false);
  }, [location.search, navigate, setRole, setToken]);

  return { loading, error };
};

export default useGoogleCallback;
