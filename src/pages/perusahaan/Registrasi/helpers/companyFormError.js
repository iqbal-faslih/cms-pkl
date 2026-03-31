const FIELD_MAP = {
  email: "email_perusahaan",
  profil_bg: "profil_background",
  legalitas: "legalitas_perusahaan",
  npwp: "npwp_perusahaan",
};

export const getMetaValidationErrors = (meta) => {
  if (!meta || typeof meta !== "object") return {};

  return Object.entries(meta).reduce((acc, [key, value]) => {
    if (["message", "code", "status"].includes(key)) return acc;

    if (Array.isArray(value) && value.length > 0) {
      acc[key] = value;
      return acc;
    }

    if (typeof value === "string" && value.trim()) {
      acc[key] = [value];
    }

    return acc;
  }, {});
};

export const extractValidationErrors = (raw) => {
  const metaErrors = getMetaValidationErrors(raw?.meta);
  return (
    raw?.errors ||
    raw?.data?.errors ||
    raw?.error?.errors ||
    raw?.meta?.errors ||
    raw?.result?.errors ||
    metaErrors
  );
};

export const extractErrorMessage = (raw) =>
  raw?.message ||
  raw?.data?.message ||
  raw?.error?.message ||
  raw?.meta?.message ||
  (typeof raw?.error === "string" ? raw.error : "");

export const applyServerErrorsToForm = (validationErrors = {}, setError) => {
  Object.entries(validationErrors).forEach(([field, messages]) => {
    const targetField = FIELD_MAP[field] || field;
    const firstMessage = Array.isArray(messages) ? messages[0] : messages;

    if (typeof firstMessage === "string" && firstMessage.trim()) {
      setError(targetField, {
        type: "server",
        message: firstMessage,
      });
    }
  });
};

export const shouldRetryWithEmail = (validationErrors, registeredEmail) => {
  const emailErrors = validationErrors?.email;
  const firstEmailError = Array.isArray(emailErrors) ? emailErrors[0] : emailErrors;
  return (
    typeof firstEmailError === "string" &&
    firstEmailError.toLowerCase().includes("wajib diisi") &&
    Boolean(registeredEmail)
  );
};

export const formatValidationErrors = (validationErrors) => {
  if (!validationErrors || typeof validationErrors !== "object") return "";

  return Object.entries(validationErrors)
    .map(([field, messages]) => {
      const firstMessage = Array.isArray(messages) ? messages[0] : messages;
      return `${field}: ${firstMessage}`;
    })
    .join(" | ");
};

export const formatRawFallbackMessage = (raw) => {
  if (typeof raw === "string") return raw.slice(0, 200);
  if (typeof raw === "object" && raw !== null) return JSON.stringify(raw).slice(0, 200);
  return "";
};
