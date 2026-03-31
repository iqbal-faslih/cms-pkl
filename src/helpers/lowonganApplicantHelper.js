const normalizeId = (value) => {
  if (value === null || value === undefined) return "";
  const trimmed = String(value).trim();
  return trimmed;
};

const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
};

const findFirstTruthyByPaths = (obj, paths = []) => {
  for (const path of paths) {
    const value = getByPath(obj, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
};

export const extractApprovalItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload?.data,
    payload?.data?.data,
    payload?.data?.items,
    payload?.items,
    payload?.rows,
    payload?.result,
    payload?.pendaftaran,
    payload?.approval,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

export const extractApprovalMeta = (payload) => {
  if (!payload || typeof payload !== "object") return {};
  return (
    payload?.meta ||
    payload?.data?.meta ||
    payload?.pagination ||
    payload?.data?.pagination ||
    {}
  );
};

export const resolveLowonganIdFromApprovalItem = (item) => {
  if (!item || typeof item !== "object") return "";

  const candidates = [
    findFirstTruthyByPaths(item, [
      "lowongan.id",
      "lowongan_id",
      "id_lowongan",
      "idLowongan",
      "magang.lowongan.id",
      "pendaftaran.lowongan.id",
      "detail_lowongan.id",
      "vacancy.id",
      "job.id",
    ]),
    item?.lowongan?.id,
    item?.pendaftaran?.lowongan?.id,
    item?.magang?.lowongan?.id,
  ];

  for (const value of candidates) {
    const normalized = normalizeId(value);
    if (normalized) return normalized;
  }

  return "";
};

export const resolveLowonganNameFromApprovalItem = (item) => {
  if (!item || typeof item !== "object") return "";

  const candidates = [
    findFirstTruthyByPaths(item, [
      "lowongan.nama",
      "lowongan.judul",
      "lowongan.title",
      "magang.lowongan.nama",
      "magang.lowongan.judul",
      "pendaftaran.lowongan.nama",
      "pendaftaran.lowongan.judul",
      "detail_lowongan.nama",
      "detail_lowongan.judul",
      "nama_lowongan",
      "lowongan_nama",
      "judul_lowongan",
      "judul_lowongan_magang",
      "lowongan.nama_lowongan",
      "magang.nama_lowongan",
      "pendaftaran.nama_lowongan",
      "vacancy.nama",
      "vacancy.judul",
      "job.nama",
      "job.judul",
      "job.title",
    ]),
    typeof item?.lowongan === "string" ? item.lowongan : null,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
};

export const normalizeLowonganId = normalizeId;
