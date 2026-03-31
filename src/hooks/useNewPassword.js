import { useState } from "react";
import { toast } from "react-toastify";
import { newPassword } from "../helpers/apiClient";
import { extractErrorMessage } from "../helpers/extractErrorMessage";
import usePasswordValidation from "./usePasswordValidation";

const useNewPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    validatePasswords,
    getPasswordStrength,
    resetFields
  } = usePasswordValidation();

  const otp = sessionStorage.getItem("resetOtp");
  const email = sessionStorage.getItem("resetEmail");

  const handleSubmit = async () => {
    const validation = validatePasswords();
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setLoading(true);
    try {
      const res = await newPassword({
        email,
        otp,
        new_password: password,
        new_password_confirmation: confirmPassword,
      });

      if (res.data?.meta?.status === "success") {
        toast.success("Password berhasil diperbarui.");
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetOtp");
        setIsSuccess(true);
        resetFields();
      } else {
        toast.error(res.data?.meta?.message || "Gagal memperbarui password.");
      }
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSuccess,
    loading,
    handleSubmit,
    getPasswordStrength,
  };
};

export default useNewPassword;