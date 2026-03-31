import {
  getAllJobs,
  getCabangLowonganList,
  getJobDetails,
  getLowonganList,
} from "./apiClient";
import {
  getCachedLowonganStatus,
  getEffectiveLowonganStatus,
  getLowonganLifecycleLabel,
  isLowonganClosed,
  markLowonganClosedInCache,
  resolveApplicantCountValue,
  resolveMaxQuotaValue,
} from "./lowonganStatusHelper";

const FILE_BASE_URL = import.meta.env.VITE_FILE_URL;

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value || ""));

const toFileUrl = (path) => {
  if (!path) return "/assets/img/Cover.png";
  if (isAbsoluteUrl(path)) return path;
  if (!FILE_BASE_URL) return String(path);
  return `${FILE_BASE_URL.replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
};

const resolveDivisionName = (job) => {
  if (typeof job?.divisi === "string") return job.divisi;
  return job?.divisi?.nama || "-";
};

const resolveCompanyName = (job) => {
  if (typeof job?.perusahaan === "string") return job.perusahaan;
  return job?.perusahaan?.nama_perusahaan || job?.perusahaan?.nama || "-";
};

const resolveLocation = (job) => {
  const city =
    job?.perusahaan?.kota ||
    job?.kota ||
    job?.cabang?.kota ||
    "";
  const province =
    job?.perusahaan?.provinsi ||
    job?.provinsi ||
    job?.cabang?.provinsi ||
    "";

  const location = [city, province].filter(Boolean).join(", ");
  return location || "-";
};

const resolveInternshipSystem = (job) => {
  const raw =
    job?.status_magang ||
    job?.sistem_magang ||
    job?.metode_magang ||
    job?.tipe_magang ||
    "";
  const normalized = String(raw).trim().toLowerCase();
  if (normalized === "online" || normalized === "offline") return normalized;
  return "";
};

const resolveCoverPath = (job) => {
  const fromPhotos =
    job?.foto?.find?.((f) =>
      ["profil_cover", "profile_cover", "cover", "banner"].includes(
        String(f?.type || "").toLowerCase()
      )
    )?.path;

  return (
    fromPhotos ||
    job?.divisi?.foto_cover ||
    job?.cover ||
    ""
  );
};

const formatDate = (str) => {
  const d = new Date(str);
  if (isNaN(d)) return "-";
  return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
};

const resolveRole = () =>
  String(sessionStorage.getItem("role") || localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

const normalizeJobId = (value) => String(value ?? "").trim();

const buildManageStatusMap = async () => {
  const role = resolveRole();
  if (role !== "perusahaan" && role !== "cabang") return new Map();

  try {
    const response =
      role === "cabang"
        ? await getCabangLowonganList()
        : await getLowonganList();
    const rows = response?.data?.data || [];
    if (!Array.isArray(rows)) return new Map();

    return rows.reduce((acc, item) => {
      const id = normalizeJobId(item?.id);
      if (!id) return acc;
      const status = getEffectiveLowonganStatus(item);
      acc.set(id, status);
      if (status === 0) {
        markLowonganClosedInCache(id);
      }
      return acc;
    }, new Map());
  } catch {
    return new Map();
  }
};

const extractDetailItem = (responseData) => {
  if (!responseData) return null;

  const candidates = [
    responseData?.data,
    responseData?.data?.data,
    responseData?.result,
    responseData?.item,
    responseData,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate[0];
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
};

const buildDetailStatusMap = async (jobs = []) => {
  if (!Array.isArray(jobs) || jobs.length === 0) return new Map();

  const requests = jobs
    .map((job) => normalizeJobId(job?.id))
    .filter(Boolean)
    .map((id) =>
      getJobDetails(id)
        .then((res) => ({ id, res }))
        .catch(() => null)
    );

  const settled = await Promise.all(requests);

  return settled.reduce((acc, item) => {
    if (!item?.id || !item?.res) return acc;
    const detail = extractDetailItem(item.res?.data);
    if (!detail || typeof detail !== "object") return acc;
    const status = getEffectiveLowonganStatus(detail);
    acc.set(item.id, status);
    if (status === 0) {
      markLowonganClosedInCache(item.id);
    }
    return acc;
  }, new Map());
};

const mapJobData = (
  job,
  manageStatusMap = new Map(),
  detailStatusMap = new Map()
) => {
  const coverPath = resolveCoverPath(job);
  const pendaftar = resolveApplicantCountValue(job);
  const maxKuota = resolveMaxQuotaValue(job);

  const normalizedJobId = normalizeJobId(job?.id);
  const managedStatus = manageStatusMap.get(normalizedJobId);
  const detailStatus = detailStatusMap.get(normalizedJobId);
  const cachedStatus = getCachedLowonganStatus(job?.id);
  const effectiveStatus =
    managedStatus === 0 || managedStatus === 1
      ? managedStatus
      : detailStatus === 0 || detailStatus === 1
        ? detailStatus
      : cachedStatus === 0
        ? 0
        : getEffectiveLowonganStatus(job);
  const closedByEffectiveStatus = effectiveStatus === 0;

  return {
    id: job.id,
    namaLowongan: job?.nama || job?.judul || "Lowongan",
    title: job?.nama || job?.judul || "Lowongan",
    divisi: resolveDivisionName(job),
    perusahaan: resolveCompanyName(job),
    lokasi: resolveLocation(job),
    statusMagang: resolveInternshipSystem(job),
    mulai: formatDate(job.tanggal_mulai),
    mulaiRaw: job.tanggal_mulai,
    selesai: formatDate(job.tanggal_selesai),
    selesaiRaw: job.tanggal_selesai,
    createdAt: job?.created_at || job?.createdAt || "",
    status: effectiveStatus,
    statusLabel: closedByEffectiveStatus
      ? "Closed"
      : getLowonganLifecycleLabel(job, {
        openLabel: "Open",
        closedLabel: "Closed",
      }),
    isClosed: closedByEffectiveStatus || isLowonganClosed(job),
    pendaftar,
    maxKuota,
    max_kuota: maxKuota,
    image: toFileUrl(coverPath),
  };
};

export const fetchAndMapJobs = async () => {
  try {
    const res = await getAllJobs();
    const jobs = res.data?.data || [];
    const [manageStatusMap, detailStatusMap] = await Promise.all([
      buildManageStatusMap(),
      buildDetailStatusMap(jobs),
    ]);
    return jobs.map((job) => mapJobData(job, manageStatusMap, detailStatusMap));
  } catch (err) {
    console.error("fetchAndMapJobs failed", err);
    return [];
  }
};

export const extractDivisions = (jobs) => {
  const unique = [...new Set(jobs.map((j) => String(j.divisi || "-").toLowerCase()))];
  return unique.map((name, i) => {
    const original = jobs.find((j) => String(j.divisi || "-").toLowerCase() === name)?.divisi;
    return { id: `div-${i}`, name: original || name };
  });
};
