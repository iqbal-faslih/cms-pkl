import { useState } from "react";

const usePasswordValidation = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[\W_]/.test(pwd)) strength++;

    if (strength <= 2) return { label: "Weak", color: "bg-red-500" };
    if (strength <= 4) return { label: "Moderate", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const validatePasswords = () => {
    const errors = [];

    if (!isPasswordValid(password)) {
      errors.push("Password minimal 8 karakter dan mengandung huruf besar, kecil, angka, dan simbol.");
    }

    if (password !== confirmPassword) {
      errors.push("Password dan konfirmasi tidak cocok.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const resetFields = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
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
    isPasswordValid,
    getPasswordStrength,
    validatePasswords,
    resetFields,
  };
};

export default usePasswordValidation;