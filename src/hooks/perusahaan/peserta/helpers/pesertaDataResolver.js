const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const appendQuery = (endpoint, queryString) =>
  queryString ? `${endpoint}?${queryString}` : endpoint;

export const buildPesertaEndpointCandidates = (companyId, queryString) => {
  const candidates = [
    appendQuery("/peserta/perusahaan", queryString),
    "/peserta/perusahaan",
  ].filter(Boolean);

  return [...new Set(candidates)];
};

export const extractPesertaList = (payload) => {
  const candidates = [
    payload?.data?.items,
    payload?.data?.data,
    payload?.data,
    payload?.items,
    payload?.result?.items,
    payload?.result?.data,
    payload?.result,
    payload?.meta?.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  const objectCandidates = [payload?.data, payload?.result, payload];
  for (const objectCandidate of objectCandidates) {
    if (!isObject(objectCandidate)) continue;
    for (const value of Object.values(objectCandidate)) {
      if (Array.isArray(value)) return value;
    }
  }

  return [];
};

const pickMetaObject = (payload) => {
  const metaCandidates = [
    payload?.meta?.meta,
    payload?.meta,
    payload?.data?.meta,
    payload?.data?.pagination,
    payload?.pagination,
  ];

  return metaCandidates.find((meta) => isObject(meta)) || {};
};

export const extractPesertaPagination = (
  payload,
  fallback = { currentPage: 1, itemsPerPage: 10, totalItems: 0 }
) => {
  const meta = pickMetaObject(payload);
  const perPage = Number(meta.per_page ?? meta.perPage ?? fallback.itemsPerPage ?? 10) || 10;
  const totalItems = Number(meta.total ?? meta.total_items ?? fallback.totalItems ?? 0) || 0;
  const currentPage = Number(meta.current_page ?? meta.page ?? fallback.currentPage ?? 1) || 1;
  const totalPages =
    Number(meta.last_page ?? meta.total_pages) ||
    Math.max(1, Math.ceil((totalItems || 0) / perPage));

  return {
    currentPage,
    itemsPerPage: perPage,
    totalItems,
    totalPages,
  };
};

const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

const formatTanggalIndonesia = (value) => {
  if (!value || value === "-") return "-";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${day} - ${month} - ${year}`;
};

const formatTanggalLongIndonesia = (value) => {
  if (!value || value === "-") return "-";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const parseDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const pickFirstTruthy = (values = []) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && !value.trim()) continue;
    return value;
  }
  return "";
};

const findFirstValueByKeyPattern = (source, keyPattern, maxDepth = 5) => {
  if (!source || typeof source !== "object") return "";

  const visited = new Set();

  const walk = (node, depth) => {
    if (!node || typeof node !== "object" || depth > maxDepth) return "";
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
      if (!keyPattern.test(String(key))) continue;

      if (typeof value === "string" && value.trim()) return value.trim();
      if (typeof value === "number") return String(value);
      if (value && typeof value === "object") {
        const nested = pickFirstTruthy([value?.path, value?.url, value?.value, value?.label]);
        if (nested) return String(nested).trim();
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

const extractWaktuMagangRange = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return { text: "-", startDate: null, endDate: null };

  const parts = raw.split(" - ").map((item) => item.trim());
  if (parts.length >= 2) {
    const startDate = parseDateValue(parts[0]);
    const endDate = parseDateValue(parts[1]);

    if (startDate && endDate) {
      return {
        text: `${formatTanggalLongIndonesia(startDate)} s/d ${formatTanggalLongIndonesia(endDate)}`,
        startDate,
        endDate,
      };
    }
  }

  return {
    text: raw,
    startDate: null,
    endDate: null,
  };
};

const resolveFotoProfilePath = (source = {}) => {
  const photoPools = [
    Array.isArray(source?.foto) ? source.foto : [],
    Array.isArray(source?.peserta?.foto) ? source.peserta.foto : [],
    Array.isArray(source?.detail_peserta?.foto) ? source.detail_peserta.foto : [],
    Array.isArray(source?.detailPeserta?.foto) ? source.detailPeserta.foto : [],
    Array.isArray(source?.user?.foto) ? source.user.foto : [],
  ];

  const fotoArray = photoPools.flat();
  const isLikelyImagePath = (value = "") =>
    /\.(jpe?g|png|gif|webp|bmp|svg)(\?|#|$)/i.test(String(value || "").trim());
  const typePriority = ["profile", "profil", "foto_profile", "foto_peserta", "avatar"];
  const normalizedFotoArray = fotoArray.map((item) => ({
    type: String(item?.type || "").toLowerCase(),
    path: item?.path || item?.url || "",
  }));

  const preferredTyped = typePriority
    .map((type) => normalizedFotoArray.find((item) => item.type === type)?.path)
    .find(Boolean);
  const firstImageLike = normalizedFotoArray
    .map((item) => item.path)
    .find((path) => path && isLikelyImagePath(path));
  const fallbackAny = normalizedFotoArray.map((item) => item.path).find(Boolean);
  const fotoProfileFromArray = preferredTyped || firstImageLike || fallbackAny || "";

  const nestedCandidate = findFirstValueByKeyPattern(
    source,
    /(foto[_\s-]*profile|foto[_\s-]*profil|foto[_\s-]*peserta|profile[_\s-]*photo|avatar|photo|image)/i
  );

  return (
    source?.foto_profile?.path ||
    source?.foto_profile?.url ||
    source?.profil ||
    source?.avatar ||
    source?.foto_peserta?.path ||
    source?.foto_peserta?.url ||
    source?.user?.foto_profile?.path ||
    source?.user?.foto_profile?.url ||
    source?.user?.profil ||
    source?.user?.avatar ||
    source?.user?.foto_peserta?.path ||
    source?.user?.foto_peserta?.url ||
    source?.peserta?.foto_profile?.path ||
    source?.peserta?.foto_profile?.url ||
    source?.peserta?.profil ||
    source?.peserta?.avatar ||
    source?.peserta?.foto_peserta?.path ||
    source?.peserta?.foto_peserta?.url ||
    source?.detail_peserta?.foto_profile?.path ||
    source?.detail_peserta?.foto_profile?.url ||
    source?.detail_peserta?.profil ||
    source?.detail_peserta?.avatar ||
    source?.detail_peserta?.foto_peserta?.path ||
    source?.detail_peserta?.foto_peserta?.url ||
    source?.detailPeserta?.foto_profile?.path ||
    source?.detailPeserta?.foto_profile?.url ||
    source?.detailPeserta?.profil ||
    source?.detailPeserta?.avatar ||
    source?.detailPeserta?.foto_peserta?.path ||
    source?.detailPeserta?.foto_peserta?.url ||
    fotoProfileFromArray ||
    nestedCandidate ||
    ""
  );
};

const resolveImageUrl = (item = {}) => {
  const path = resolveFotoProfilePath(item);
  if (!path) return "/default-avatar.png";
  if (/^(https?:\/\/|data:|blob:)/i.test(path)) return path;

  const base = String(
    import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || import.meta.env.VITE_API_URL || ""
  ).replace(/\/+$/, "");
  if (!base) return path;

  const rawPath = String(path).trim();
  const cleanPath = rawPath.replace(/^\/+/, "");
  const baseEndsWithStorage = /\/storage$/i.test(base);

  if (rawPath.startsWith("/storage/")) {
    if (baseEndsWithStorage) {
      return `${base}/${cleanPath.replace(/^storage\/+/, "")}`;
    }
    return `${base}${rawPath}`;
  }

  if (baseEndsWithStorage) {
    return `${base}/${cleanPath.replace(/^storage\/+/, "")}`;
  }

  return `${base}/storage/${cleanPath.replace(/^storage\/+/, "")}`;
};

const resolveStatusMagang = (item = {}, endDate = null) => {
  const explicitStatus = normalizeStatus(item?.status_magang || item?.status || "");
  const activeFlag = item?.is_active;

  if (activeFlag === false) return "alumni";
  if (activeFlag === true && explicitStatus === "alumni") return "aktif";

  if (endDate) {
    const now = new Date();
    if (now > endDate) return "alumni";
  }

  if (explicitStatus === "aktif" || explicitStatus === "alumni") return explicitStatus;
  if (activeFlag === true) return "aktif";
  return "-";
};

const formatDivisionDisplay = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "-";

  // Short division codes are usually acronyms (e.g. gme -> GME).
  if (raw.length <= 4 && !raw.includes(" ")) {
    return raw.toUpperCase();
  }

  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const toTitleCase = (value) => {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "-";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const mapPesertaRow = (item, index, currentPage, perPage) => {
  const fallbackIndex = (currentPage - 1) * perPage + index + 1;
  const participantId =
    item?.id_peserta ?? item?.id ?? item?.user?.id ?? item?.peserta?.id ?? fallbackIndex;

  const rawWaktuMagang = pickFirstTruthy([
    item?.waktu_magang,
    item?.internship_period,
    item?.durasi_magang,
    item?.periode_magang,
    item?.peserta?.waktu_magang,
    item?.detail_peserta?.waktu_magang,
    item?.detailPeserta?.waktu_magang,
    findFirstValueByKeyPattern(item, /(waktu[_\s-]*magang|durasi[_\s-]*magang|internship[_\s-]*period)/i),
  ]);

  const waktuMagangRange = extractWaktuMagangRange(rawWaktuMagang);

  const tanggalAkhirFallback =
    item?.tanggal_berakhir_magang || item?.akhir_magang || item?.end_date || item?.tanggal_selesai || "";
  const parsedTanggalAkhirFallback = parseDateValue(tanggalAkhirFallback);

  const effectiveEndDate = waktuMagangRange.endDate || parsedTanggalAkhirFallback;

  const rawDivisi =
    item?.divisi?.nama ||
    item?.division?.nama ||
    (typeof item?.divisi === "string" ? item.divisi : "") ||
    (typeof item?.division === "string" ? item.division : "") ||
    item?.nama_divisi ||
    item?.divisi_name ||
    "-";

  return {
    id: fallbackIndex,
    originalId: String(participantId),
    nama: item?.nama || item?.name || item?.user?.nama || item?.peserta?.nama || "-",
    masaMagang:
      waktuMagangRange.text !== "-"
        ? waktuMagangRange.text
        : formatTanggalIndonesia(tanggalAkhirFallback),
    status: resolveStatusMagang(item, effectiveEndDate),
    sekolah:
      item?.sekolah ||
      item?.asal_sekolah ||
      item?.instansi_pendidikan ||
      item?.pendidikan ||
      "-",
    sistemMagang: toTitleCase(
      pickFirstTruthy([
        item?.sistem_magang,
        item?.sistem,
        item?.peserta?.sistem_magang,
        item?.detail_peserta?.sistem_magang,
        item?.detailPeserta?.sistem_magang,
        findFirstValueByKeyPattern(item, /(sistem[_\s-]*magang|mode[_\s-]*magang|internship[_\s-]*system)/i),
        "-",
      ])
    ),
    divisi: formatDivisionDisplay(rawDivisi),
    image: resolveImageUrl(item),
    isActive: item?.is_active,
    raw: item,
  };
};
