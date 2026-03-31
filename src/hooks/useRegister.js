import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../helpers/apiClient";
import { AuthContext } from "../contexts/AuthContext";
import { extractErrorMessage } from "../helpers/extractErrorMessage";
import usePasswordValidation from "./usePasswordValidation";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    getPasswordStrength,
  } = usePasswordValidation();

  const register = async (data) => {
    if (!data.password || !data.password_confirmation) {
      toast.error("Semua field wajib diisi");
      return;
    }

    if (data.password !== data.password_confirmation) {
      toast.error("Password dan konfirmasi tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(data);
      const userData = response?.data?.data?.data;

      if (userData?.id) {
        sessionStorage.setItem("id", userData.id);
      } else {
        console.warn("ID user tidak ditemukan di response backend:", response);
      }

      toast.success("Registrasi berhasil!");
      navigate("/auth/select", { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    getPasswordStrength,
  };
};

export default useRegister;