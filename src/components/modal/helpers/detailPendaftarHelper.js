const FILE_BASE_URL =
  import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || "";

const toTitleCase = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeStatusLabel = (status) => {
  const value = String(status || "").toLowerCase();
  if (["diterima", "approved", "approve"].includes(value)) return "Approve";
  if (["ditolak", "rejected", "reject"].includes(value)) return "Reject";
  if (["menunggu", "pending"].includes(value)) return "Pending";
  return status || "Pending";
};

const getFileUrl = (path) => {
  if (!path) return "";
  const rawPath = String(path).trim();
  if (!rawPath) return "";
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  const base = String(FILE_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) return rawPath;

  const normalizedPath = rawPath.replace(/^\/+/, "");
  const baseEndsWithStorage = /\/storage$/i.test(base);

  if (/^storage\//i.test(normalizedPath)) {
    return baseEndsWithStorage
      ? `${base}/${normalizedPath.replace(/^storage\/+/i, "")}`
      : `${base}/${normalizedPath}`;
  }

  return baseEndsWithStorage
    ? `${base}/${normalizedPath}`
    : `${base}/storage/${normalizedPath}`;
};

const getInitials = (name = "") => {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "NA";
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
};

const normalizeDocumentTitle = (value = "") => {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();
  if (!normalized) return "Berkas";
  if (normalized.includes("cv") || normalized.includes("curriculum")) return "Curriculum Vitae";
  if (normalized.includes("surat") && normalized.includes("pernyataan")) return "Surat Pernyataan Diri";
  return toTitleCase(normalized);
};
const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const DETAIL_INDICATOR_KEYS = [
  "nama",
  "user",
  "peserta",
  "foto",
  "foto_profile",
  "profil",
  "avatar",
  "sekolah",
  "jurusan",
  "nisn",
  "lowongan",
  "berkas",
  "berkas_pendaftaran",
];

const scoreDetailCandidate = (candidate) => {
  if (!isObject(candidate)) return -1;
  const keys = Object.keys(candidate);
  let score = 0;
  for (const key of DETAIL_INDICATOR_KEYS) {
    if (key in candidate) score += 1;
  }
  if (keys.length > 0) score += Math.min(keys.length / 50, 1);
  return score;
};

const pickDetailRoot = (payload) => {
  const directCandidates = [
    payload?.data?.data,
    payload?.data?.item,
    payload?.data,
    payload?.item?.data,
    payload?.item,
    payload?.result?.data,
    payload?.result,
    payload,
  ].filter(isObject);

  let best = null;
  let bestScore = -1;

  for (const candidate of directCandidates) {
    const score = scoreDetailCandidate(candidate);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best || {};
};

const extractPhotoPath = (...sources) => {
  const typePriority = ["profile", "profil", "foto_profile", "avatar", "foto_peserta"];

  const readEntryPath = (entry) => {
    if (!entry) return "";
    if (typeof entry === "string") return entry;
    if (typeof entry !== "object") return "";

    return (
      entry?.path ||
      entry?.file_path ||
      entry?.filepath ||
      entry?.full_path ||
      entry?.url ||
      entry?.link ||
      ""
    );
  };

  for (const source of sources) {
    if (!source) continue;
    if (typeof source === "string") return source;

    if (Array.isArray(source)) {
      for (const type of typePriority) {
        const matched = source.find(
          (entry) => String(entry?.type || "").toLowerCase() === type
        );
        const matchedPath = readEntryPath(matched);
        if (matchedPath) return matchedPath;
      }

      for (const entry of source) {
        const path = readEntryPath(entry);
        if (path) return path;
      }
      continue;
    }

    if (typeof source === "object") {
      const directPath = readEntryPath(source);
      if (directPath) return directPath;

      const nestedFotoPath = extractPhotoPath(source?.foto);
      if (nestedFotoPath) return nestedFotoPath;
    }
  }

  return "";
};

const extractDocPath = (entry) => {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  if (typeof entry !== "object") return "";

  return (
    entry?.path ||
    entry?.file_path ||
    entry?.filepath ||
    entry?.full_path ||
    entry?.url ||
    entry?.link ||
    entry?.file ||
    entry?.dokumen ||
    entry?.value ||
    ""
  );
};

const collectBerkas = (root, user, pesertaUser) => {
  const listSources = [
    { files: root?.berkas_pendaftaran },
    { files: root?.berkas },
    { files: user?.berkas },
    { files: user?.foto },
    { files: pesertaUser?.berkas },
    { files: pesertaUser?.foto },
    { files: root?.foto },
    { files: root?.cv, forcedTitle: "Curriculum Vitae" },
    { files: user?.cv, forcedTitle: "Curriculum Vitae" },
    { files: pesertaUser?.cv, forcedTitle: "Curriculum Vitae" },
  ];

  const ignoreTypes = new Set(["profile", "profil", "foto_profile", "avatar", "cover", "logo"]);
  const result = [];

  const pushDoc = (doc) => {
    if (!doc?.url) return;
    const exists = result.some(
      (item) =>
        item.url === doc.url &&
        String(item.title || "").toLowerCase() === String(doc.title || "").toLowerCase()
    );
    if (!exists) result.push(doc);
  };

  listSources.forEach(({ files, forcedTitle }) => {
    if (!Array.isArray(files)) return;

    files.forEach((entry) => {
      const typeValue = String(entry?.type || entry?.label || "").toLowerCase();
      if (ignoreTypes.has(typeValue)) return;

      const url = getFileUrl(extractDocPath(entry));
      if (!url) return;

      const title =
        forcedTitle || normalizeDocumentTitle(entry?.title || entry?.name || entry?.type || "Berkas");
      pushDoc({ title, url });
    });
  });

  const singleSources = [
    {
      title: "Curriculum Vitae",
      value:
        root?.cv ||
        root?.cv_peserta ||
        root?.curriculum_vitae ||
        root?.dokumen_cv ||
        user?.cv ||
        user?.cv_peserta ||
        user?.curriculum_vitae ||
        user?.dokumen_cv ||
        pesertaUser?.cv ||
        pesertaUser?.cv_peserta ||
        pesertaUser?.curriculum_vitae ||
        pesertaUser?.dokumen_cv,
    },
    {
      title: "Surat Pernyataan Diri",
      value:
        root?.surat_pernyataan_diri ||
        root?.surat_pernyataan ||
        root?.dokumen_surat_pernyataan ||
        user?.surat_pernyataan_diri ||
        user?.surat_pernyataan ||
        user?.dokumen_surat_pernyataan ||
        pesertaUser?.surat_pernyataan_diri ||
        pesertaUser?.surat_pernyataan ||
        pesertaUser?.dokumen_surat_pernyataan,
    },
  ];

  singleSources.forEach((entry) => {
    const url = getFileUrl(extractDocPath(entry.value));
    if (!url) return;
    pushDoc({ title: entry.title, url });
  });

  return result;
};

export const formatDisplayDate = (value) => {
  if (!value || value === "-") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatShortDate = (value) => {
  if (!value || value === "-") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const resolveDetailData = (payload) => {
  const root = pickDetailRoot(payload);
  const peserta = root?.peserta || {};
  const pesertaUser = peserta?.user || {};
  const user = root?.user || pesertaUser || peserta || {};
  const mulai = root?.mulai || root?.tanggal_mulai || user?.mulai || "-";
  const selesai = root?.selesai || root?.tanggal_selesai || user?.selesai || "-";
  const nama = root?.nama || user?.nama || "-";
  const profilePath = extractPhotoPath(
    root?.profil,
    root?.foto_profile,
    root?.avatar,
    root?.foto,
    peserta?.profil,
    peserta?.foto_profile,
    peserta?.avatar,
    peserta?.foto,
    user?.profil,
    user?.foto_profile,
    user?.avatar,
    user?.foto,
    pesertaUser?.profil,
    pesertaUser?.foto_profile,
    pesertaUser?.avatar,
    pesertaUser?.foto
  );
  const profileUrl = getFileUrl(profilePath);

  const lowongan =
    root?.lowongan?.nama ||
    root?.lowongan?.judul ||
    root?.nama_lowongan ||
    root?.lowongan_nama ||
    root?.judul_lowongan ||
    root?.lowongan ||
    "-";

  return {
    nama,
    email: root?.email || user?.email || "-",
    alamat: root?.alamat || user?.alamat || "-",
    jenis_kelamin: root?.jenis_kelamin || user?.jenis_kelamin || "-",
    telepon: root?.telepon || user?.telepon || "-",
    tempat_lahir: root?.tempat_lahir || user?.tempat_lahir || "-",
    tanggal_lahir: root?.tanggal_lahir || user?.tanggal_lahir || "-",
    sekolah: root?.sekolah || user?.sekolah || "-",
    jurusan: root?.jurusan || user?.jurusan || "-",
    nisn: root?.nisn || user?.nomor_identitas || user?.nisn || "-",
    mulai,
    selesai,
    lowongan,
    status: normalizeStatusLabel(root?.status || user?.status),
    profil: profileUrl,
    initials: getInitials(nama),
    berkas: collectBerkas(root, user, pesertaUser),
  };
};

export const resolveLowonganLabel = (detail) =>
  (typeof detail?.lowongan === "string" ? detail.lowongan : "") ||
  detail?.lowongan?.nama ||
  detail?.lowongan?.judul ||
  detail?.nama_lowongan ||
  detail?.lowongan_nama ||
  detail?.judul_lowongan ||
  detail?.divisi?.nama ||
  "-";
