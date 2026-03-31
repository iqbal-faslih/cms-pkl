import { useEffect, useMemo, useState } from "react";
import {
  applyServerErrorsToForm,
  extractErrorMessage,
  extractValidationErrors,
  formatRawFallbackMessage,
  formatValidationErrors,
  shouldRetryWithEmail,
} from "../helpers/companyFormError";

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const useCompanyRegistrationForm = ({
  userEmail,
  submitCompanyData,
  setValue,
  clearErrors,
  setError,
  watch,
}) => {
  const [submitError, setSubmitError] = useState(null);

  const registeredEmail = useMemo(() => {
    if (userEmail) return userEmail;

    try {
      const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (!storedUser) return "";
      const parsedUser = JSON.parse(storedUser);
      return parsedUser?.email || "";
    } catch {
      return "";
    }
  }, [userEmail]);

  useEffect(() => {
    if (!registeredEmail) return;

    setValue("email_perusahaan", registeredEmail, {
      shouldValidate: true,
      shouldDirty: false,
      shouldTouch: false,
    });
    clearErrors("email_perusahaan");
  }, [clearErrors, registeredEmail, setValue]);

  const deskripsi = watch("deskripsi");
  const alamat = watch("alamat");

  const handleImageFileChange = (name, fieldOnChange, file) => {
    if (!file) {
      fieldOnChange(null);
      clearErrors(name);
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setError(name, {
        type: "manual",
        message: "File harus berupa gambar (.jpg, .jpeg, .png)",
      });
      fieldOnChange(null);
      return;
    }

    if (!IMAGE_TYPES.includes(file.type)) {
      setError(name, {
        type: "manual",
        message: "Format file harus JPG, JPEG, atau PNG",
      });
      fieldOnChange(null);
      return;
    }

    clearErrors(name);
    fieldOnChange(file);
  };

  const tryRetryWithEmail = async ({ basePayload, validationErrors }) => {
    if (!shouldRetryWithEmail(validationErrors, registeredEmail)) return false;

    try {
      await submitCompanyData({
        ...basePayload,
        email: registeredEmail,
      });
      return true;
    } catch (retryErr) {
      const retryRaw = retryErr?.response?.data;
      const retryValidationErrors = extractValidationErrors(retryRaw);

      applyServerErrorsToForm(retryValidationErrors, setError);
      setSubmitError(
        retryRaw?.message ||
          retryRaw?.meta?.message ||
          retryErr?.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
      return true;
    }
  };

  const onSubmit = async (data) => {
    const basePayload = {
      ...data,
      email_perusahaan: registeredEmail || data.email_perusahaan,
    };

    try {
      setSubmitError(null);
      await submitCompanyData(basePayload);
    } catch (err) {
      const raw = err?.response?.data;
      const status = err?.response?.status;
      const statusText = err?.response?.statusText;
      const validationErrors = extractValidationErrors(raw);
      const nestedMessage = extractErrorMessage(raw);

      const wasRetried = await tryRetryWithEmail({ basePayload, validationErrors });
      if (wasRetried) return;

      applyServerErrorsToForm(validationErrors, setError);

      setSubmitError(
        formatValidationErrors(validationErrors) ||
          nestedMessage ||
          `Request gagal (${status || "unknown"} ${statusText || ""}) ${formatRawFallbackMessage(raw)}` ||
          err?.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
    }
  };

  return {
    alamat,
    deskripsi,
    handleImageFileChange,
    onSubmit,
    registeredEmail,
    setSubmitError,
    submitError,
  };
};
