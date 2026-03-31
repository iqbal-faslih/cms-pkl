import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showErrorAlert, showSuccessAlert } from "../../../helpers/sweetAlertHelper";
import { useUpdatePassword } from "../../../hooks/siswa/account-settings/useUpdatePassword";
import {
  defaultPasswordValues,
  passwordRequirements,
  updatePasswordSchema,
} from "../../../schema/passwordSchema";

const API_FIELD_TO_FORM_FIELD = {
  old_password: "current_password",
  new_password: "password",
  new_password_confirmation: "password_confirmation",
};

const mapApiFieldToFormField = (field) => API_FIELD_TO_FORM_FIELD[field] || field;

export const usePasswordPesertaForm = ({ onSuccess } = {}) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { handleUpdatePassword, loading } = useUpdatePassword();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: defaultPasswordValues,
    mode: "onChange",
  });

  const password = watch("password") || "";
  const requirements = useMemo(() => passwordRequirements(password), [password]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleApiErrors = (apiErrors = {}) => {
    Object.entries(apiErrors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages;
      setError(mapApiFieldToFormField(field), { message });
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await handleUpdatePassword(data);
      showSuccessAlert("Password berhasil diperbarui");
      reset();
      onSuccess?.();
    } catch (apiErrors) {
      handleApiErrors(apiErrors);
      showErrorAlert("Terjadi kesalahan saat menyimpan");
    }
  });

  return {
    register,
    errors,
    loading,
    isValid,
    requirements,
    showPasswords,
    onSubmit,
    togglePasswordVisibility,
  };
};
