export const PROFILE_ADMIN_ENDPOINTS = ["/profile-admin", "/perusahaan/profile-admin"];

const REQUIRED_HINT_FIELDS = [
  "nama",
  "email",
  "telepon",
  "password_lama",
  "password_baru",
  "password_confirmation",
];

const hasRequiredHintValidation = (error) => {
  const status = error?.response?.status;
  if (status !== 422) return false;

  const meta = error?.response?.data?.meta;
  if (!meta || typeof meta !== "object") return false;

  return REQUIRED_HINT_FIELDS.every(
    (field) => Array.isArray(meta[field]) && meta[field].length > 0
  );
};

export const shouldFallbackProfileAdminUpdate = (error) => {
  const status = error?.response?.status;
  if ([404, 405, 415].includes(status)) return true;
  return hasRequiredHintValidation(error);
};

export const buildProfileAdminPayload = (formData = {}) => {
  const payload = new FormData();

  const nama = formData?.nama || "";
  const email = formData?.email || "";
  const telepon = formData?.telepon || formData?.nomorHp || "";

  payload.append("nama", nama);
  payload.append("email", email);
  payload.append("telepon", telepon);
  payload.append("nomor_hp", telepon);

  const oldPassword = String(formData?.password || "").trim();
  const newPassword = String(formData?.passwordBaru || "").trim();

  if (oldPassword && newPassword) {
    payload.append("password_lama", oldPassword);
    payload.append("old_password", oldPassword);
    payload.append("password_baru", newPassword);
    payload.append("new_password", newPassword);
    payload.append("password_confirmation", newPassword);
    payload.append("confirm_password", newPassword);
    payload.append("new_password_confirmation", newPassword);
  }

  return payload;
};

export const buildProfileAdminMethodOverridePayload = (formData = {}) => {
  const payload = buildProfileAdminPayload(formData);
  payload.append("_method", "PUT");
  return payload;
};

export const normalizeApiFieldErrors = (rawErrors) => {
  if (!rawErrors || typeof rawErrors !== "object") return {};

  const fieldNameMap = {
    telepon: "nomorHp",
    nomor_hp: "nomorHp",
    password_lama: "password",
    old_password: "password",
    password_baru: "passwordBaru",
    new_password: "passwordBaru",
    confirm_password: "passwordBaru",
    password_confirmation: "passwordBaru",
    new_password_confirmation: "passwordBaru",
  };

  return Object.fromEntries(
    Object.entries(rawErrors).map(([key, value]) => {
      const mappedKey = fieldNameMap[key] || key;
      return [mappedKey, Array.isArray(value) ? value[0] : value];
    })
  );
};
