export const PERUSAHAAN_GUARD_ROUTES = {
  DASHBOARD: "/perusahaan/dashboard",
  REGISTRASI: "/perusahaan/registrasi",
};

export const PERUSAHAAN_GUARD_TOAST_MESSAGES = {
  already_completed: "Profil perusahaan sudah lengkap.",
  profile_incomplete:
    "Akses tidak diizinkan. Isi dan lengkapi data diri anda terlebih dahulu.",
};

export const isAllowedRouteWhenProfileIncomplete = (path) =>
  [PERUSAHAAN_GUARD_ROUTES.DASHBOARD, PERUSAHAAN_GUARD_ROUTES.REGISTRASI].includes(
    path
  );

