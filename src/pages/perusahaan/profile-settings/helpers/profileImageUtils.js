const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const validateProfileImageFile = (file) => {
  if (!file) {
    return { valid: false, title: "Pilih Foto", message: "Pilih foto profil untuk diupload" };
  }

  if (!IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      title: "Format tidak didukung",
      message: "Gunakan file JPG/JPEG/PNG",
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      title: "File terlalu besar",
      message: "Ukuran maksimal 5MB",
    };
  }

  return { valid: true };
};

export const resolveProfileFileUrl = (value) => {
  if (!value) return "";
  const raw = String(value);
  if (raw.startsWith("blob:") || raw.startsWith("data:")) return raw;

  if (raw.startsWith("http")) {
    try {
      const parsed = new URL(raw);
      const isLocalHost = parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost";
      if (!isLocalHost) return raw;

      const publicBase =
        import.meta.env.VITE_FILE_URL ||
        import.meta.env.VITE_API_URL_FILE ||
        import.meta.env.VITE_API_URL ||
        "";
      if (!publicBase) return raw;

      const baseNormalized = String(publicBase).replace(/\/+$/, "");
      const normalizedPath = parsed.pathname.replace(/^\/+/, "");
      return `${baseNormalized}/${normalizedPath}`;
    } catch {
      return raw;
    }
  }

  return `${import.meta.env.VITE_FILE_URL}/${raw.replace(/^\/+/, "")}`;
};

export const withCacheBust = (url, version) => {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
};

export const persistAvatarToStorage = ({
  storage,
  avatarUrl,
  useOptimisticValue = false,
  refreshVersion,
}) => {
  try {
    const raw = storage.getItem("user");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const nextUser = {
      ...parsed,
      logo: useOptimisticValue ? parsed?.logo : avatarUrl,
      avatar: useOptimisticValue ? parsed?.avatar : avatarUrl,
      _avatarVersion: refreshVersion,
    };

    storage.setItem("user", JSON.stringify(nextUser));
    storage.setItem("avatar_version", String(refreshVersion));
  } catch {
    // Ignore malformed storage data.
  }
};
