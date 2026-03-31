import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, getGoogleLoginUrl } from "../helpers/apiClient";
import { AuthContext } from "../contexts/AuthContext";
import { extractErrorMessage } from "../helpers/extractErrorMessage";

const saveToStorage = (key, value, rememberMe) => {
  if (rememberMe) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
};

const getPostLoginPath = (userRole) => {
  const normalizedRole = String(userRole || "").trim().toLowerCase();
  if (normalizedRole === "peserta") return "/peserta/dashboard";
  return `/${normalizedRole}/dashboard`;
};

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();
  const { setToken, setRole, setUser } = useContext(AuthContext);

  const clearAuthStorage = () => {
    const keys = [
      "token",
      "role",
      "user",
      "nama",
      "foto_profile",
      "location",
      "id_cabang",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  };

  const login = async (payload, rememberMe) => {
    setLoading(true);
    try {
      const response = await loginUser(payload);
      const { token, role, user = {}, foto_profile } = response?.data?.data || {};

      if (!role) {
        if (user?.id) {
          sessionStorage.setItem("id", user.id);
        }
        toast.info("Silakan pilih jenis akun terlebih dahulu.");
        navigate("/auth/select");
      } else {
        clearAuthStorage();
        saveToStorage("token", token, rememberMe);
        saveToStorage("nama", user.nama, rememberMe);
        saveToStorage("role", role, rememberMe);
        saveToStorage("user", JSON.stringify(user), rememberMe);
        saveToStorage("foto_profile", foto_profile, rememberMe);
        setToken(token, rememberMe);
        setRole(role);
        setUser(user);
        const redirectPath = getPostLoginPath(role);
        saveToStorage("location", redirectPath, rememberMe);
        toast.success("Berhasil login!");
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      const response = await getGoogleLoginUrl();
      window.location.href = response.data.url;
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingGoogle(false);
    }
  };

  return { login, loginWithGoogle, loading, loadingGoogle };
};

export default useLogin;
