import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPassword } from "../helpers/apiClient";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../helpers/extractErrorMessage";
import usePasswordValidation from "./usePasswordValidation";

const useSetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    getPasswordStrength,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = usePasswordValidation();

  const setPwHandler = async ({ password, password_confirmation }) => {
    setLoading(true);
    try {
      const googleToken = sessionStorage.getItem("googleToken");
      const res = await setPassword(
        {
          password,
          password_confirmation,
        },
        googleToken
      );
      toast.success(res?.data?.message);
      navigate("/auth/select");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    setPwHandler,
    loading,
    getPasswordStrength,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};

export default useSetPassword;
