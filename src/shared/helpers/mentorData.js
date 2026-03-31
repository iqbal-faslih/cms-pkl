const FILE_BASE_URL =
  import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || "";

const DATE_KEY_PATTERN = /(created|tanggal|date|register|join|dibuat|waktu|daftar)/i;

const MENTOR_CREATED_AT_CANDIDATES = [
  (mentor) => mentor?.created_at,
  (mentor) => mentor?.createdAt,
  (mentor) => mentor?.tanggal_buat,
  (mentor) => mentor?.tanggal_pembuatan,
  (mentor) => mentor?.tanggal_dibuat,
  (mentor) => mentor?.waktu_dibuat,
  (mentor) => mentor?.registered_at,
  (mentor) => mentor?.registeredAt,
  (mentor) => mentor?.tanggal_daftar,
  (mentor) => mentor?.mentor?.created_at,
  (mentor) => mentor?.mentor?.createdAt,
  (mentor) => mentor?.mentor?.tanggal_dibuat,
  (mentor) => mentor?.user?.created_at,
  (mentor) => mentor?.user?.createdAt,
  (mentor) => mentor?.user?.tanggal_dibuat,
  (mentor) => mentor?.updated_at,
  (mentor) => mentor?.user?.updated_at,
];

const MENTOR_PHOTO_CANDIDATES = [
  (mentor) => mentor?.foto?.find?.((item) => item?.type === "profile")?.path,
  (mentor) => mentor?.foto?.find?.((item) => item?.type === "profil")?.path,
  (mentor) => mentor?.foto?.[0]?.path,
  (mentor) => mentor?.foto_profile?.path,
  (mentor) => mentor?.profile_photo?.path,
  (mentor) => mentor?.profile_image?.path,
  (mentor) => mentor?.avatar,
  (mentor) => mentor?.profile_photo,
  (mentor) => mentor?.profile_image,
  (mentor) => mentor?.user?.avatar,
  (mentor) => mentor?.user?.foto,
  (mentor) => mentor?.user?.foto_profile?.path,
  (mentor) => mentor?.user?.profile_photo?.path,
  (mentor) => mentor?.mentor?.avatar,
  (mentor) => mentor?.peserta?.foto?.find?.((item) => item?.type === "profile")?.path,
  (mentor) => mentor?.peserta?.foto?.[0]?.path,
];

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const pickFirstTruthyValue = (resolvers, source, fallback = "") => {
  for (const resolver of resolvers) {
    const resolved = resolver(source);
    if (resolved === null || resolved === undefined) continue;
    if (typeof resolved === "string" && !resolved.trim()) continue;
    return resolved;
  }
  return fallback;
};

const findDateValueInObject = (source, maxDepth = 3) => {
  const visited = new Set();

  const walk = (node, depth) => {
    if (!node || depth > maxDepth) return "";
    if (typeof node !== "object") return "";
    if (visited.has(node)) return "";
    visited.add(node);

    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item, depth + 1);
        if (found) return found;
      }
      return "";
    }

    for (const [key, value] of Object.entries(node)) {
      if (value === null || value === undefined) continue;
      if (DATE_KEY_PATTERN.test(key)) {
        if (typeof value === "string" && value.trim()) return value.trim();
        if (typeof value === "number") return value;
        if (value instanceof Date) return value;
        if (typeof value === "object" && value.date) return value.date;
      }
    }

    for (const value of Object.values(node)) {
      const found = walk(value, depth + 1);
      if (found) return found;
    }

    return "";
  };

  return walk(source, 0);
};


export const getMentorName = (mentor) =>
  pickFirstTruthyValue(
    [
      (item) => item?.user?.nama,
      (item) => item?.nama,
      (item) => item?.mentor?.nama,
      (item) => item?.peserta?.user?.nama,
    ],
    mentor,
    "-"
  );

export const getMentorEmail = (mentor) =>
  pickFirstTruthyValue(
    [
      (item) => item?.user?.email,
      (item) => item?.email,
      (item) => item?.mentor?.email,
    ],
    mentor,
    "-"
  );

export const getMentorCreatedAt = (mentor) =>
  pickFirstTruthyValue(
    [...MENTOR_CREATED_AT_CANDIDATES, (item) => findDateValueInObject(item)],
    mentor,
    ""
  );

export const parseDateSafe = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  if (typeof value === "number") {
    const millis = value < 1e12 ? value * 1000 : value;
    const numericDate = new Date(millis);
    return Number.isNaN(numericDate.getTime()) ? null : numericDate;
  }

  if (typeof value === "object" && value?.date) {
    return parseDateSafe(value.date);
  }

  if (typeof value !== "string") return null;

  const text = value.trim();
  if (!text) return null;

  if (/^\d+$/.test(text)) {
    const numericValue = Number(text);
    if (!Number.isNaN(numericValue)) {
      const millis = text.length <= 10 ? numericValue * 1000 : numericValue;
      const numericDate = new Date(millis);
      if (!Number.isNaN(numericDate.getTime())) return numericDate;
    }
  }

  const dmyMatch = text.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (dmyMatch) {
    const [, dd, mm, yyyy, hh = "0", min = "0", ss = "0"] = dmyMatch;
    const parsed = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
      Number(ss)
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const normalizedDateTimeText = text.includes(" ")
    ? text.replace(" ", "T")
    : text;
  const parsed = new Date(normalizedDateTimeText);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatMentorDate = (value) => {
  const parsed = parseDateSafe(value);
  if (!parsed) return "-";
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const buildFileUrl = (path) => {
  const rawPath = normalizeText(path);
  if (!rawPath) return "";
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  const base = normalizeText(FILE_BASE_URL);
  if (!base) return rawPath;

  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = rawPath.replace(/^\/+/, "");
  const baseEndsWithStorage = /\/storage$/i.test(cleanBase);

  if (rawPath.startsWith("/storage/")) {
    if (baseEndsWithStorage) {
      return `${cleanBase}/${cleanPath.replace(/^storage\/+/, "")}`;
    }
    return `${cleanBase}${rawPath}`;
  }

  if (baseEndsWithStorage) {
    return `${cleanBase}/${cleanPath.replace(/^storage\/+/, "")}`;
  }

  return `${cleanBase}/storage/${cleanPath.replace(/^storage\/+/, "")}`;
};

export const resolveMentorProfileUrl = (mentor) => {
  const photoPath = pickFirstTruthyValue(MENTOR_PHOTO_CANDIDATES, mentor, "");
  return buildFileUrl(photoPath);
};
