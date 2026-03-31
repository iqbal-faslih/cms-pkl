import { getJobDetails } from "./apiClient";
import {
  getEffectiveLowonganStatus,
  getLowonganLifecycleLabel,
  isLowonganClosed,
  resolveApplicantCountValue,
  resolveMaxQuotaValue,
} from "./lowonganStatusHelper";

const DEFAULT_IMAGE = "/assets/img/Cover.png";
const DEFAULT_REQUIRED_DOCUMENTS = ["CV", "Surat Pernyataan Diri"];
const FILE_BASE_URL = import.meta.env.VITE_FILE_URL;

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value || ""));

const toFileUrl = (value) => {
  if (!value) return "";
  if (isAbsoluteUrl(value)) return value;
  if (!FILE_BASE_URL) return String(value);
  return `${FILE_BASE_URL.replace(/\/+$/, "")}/${String(value).replace(
    /^\/+/,
    ""
  )}`;
};

const pickPhotoPath = (source, photoType) => {
  if (!source || !Array.isArray(source.foto)) return "";
  const match = source.foto.find(
    (item) => String(item?.type || "").toLowerCase() === photoType
  );
  return match?.path || "";
};

const getImagePath = (job, type) => {
  const normalizedType = String(type || "").toLowerCase();
  const isCoverType = normalizedType === "profil_cover";

  const candidates = isCoverType
    ? [
        pickPhotoPath(job?.cabang, "profil_cover"),
        pickPhotoPath(job?.cabang, "profile_cover"),
        pickPhotoPath(job?.perusahaan, "profil_cover"),
        pickPhotoPath(job?.perusahaan, "profile_cover"),
        job?.cabang?.coverPhotoUrl,
        job?.perusahaan?.coverPhotoUrl,
        job?.perusahaan?.profil_background,
        job?.perusahaan?.cover,
        job?.perusahaan?.background,
      ]
    : [
        pickPhotoPath(job?.cabang, "profile"),
        pickPhotoPath(job?.cabang, "logo"),
        pickPhotoPath(job?.perusahaan, "profile"),
        pickPhotoPath(job?.perusahaan, "logo"),
        job?.cabang?.profilePhotoUrl,
        job?.perusahaan?.profilePhotoUrl,
        job?.perusahaan?.foto_profile,
      ];

  const resolved = candidates.find(Boolean);
  return resolved ? toFileUrl(resolved) : DEFAULT_IMAGE;
};

const resolveInternshipSystem = (jobData) => {
  const raw =
    jobData?.status_magang ||
    jobData?.sistem_magang ||
    jobData?.metode_magang ||
    jobData?.tipe_magang ||
    "";
  const normalized = String(raw).trim().toLowerCase();
  if (normalized === "online" || normalized === "offline") return normalized;
  return "";
};

const mapJobData = (jobData) => {
  const perusahaan =
    typeof jobData?.perusahaan === "object" && jobData?.perusahaan
      ? jobData.perusahaan?.perusahaan || jobData.perusahaan
      : null;
  const companyId =
    perusahaan?.id ||
    perusahaan?.id_perusahaan ||
    jobData?.id_perusahaan ||
    jobData?.perusahaan_id ||
    null;

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "Tidak tersedia";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) return "Tanggal tidak valid";
    const diff = Math.max(1, Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1);
    return `${diff} hari`;
  };

  const getLocationComponents = () => ({
    kota: perusahaan?.kota || jobData.cabang?.kota || "",
    provinsi: perusahaan?.provinsi || jobData.cabang?.provinsi || "",
    alamatPerusahaan: perusahaan?.alamat || jobData.cabang?.alamat || "",
  });

  return {
    id: jobData.id,
    title: jobData.nama || jobData.judul || "-",
    position: jobData.divisi?.nama || "-",
    company: {
      id: companyId,
      name: perusahaan?.nama_perusahaan || perusahaan?.nama || "-",
      location: perusahaan?.alamat || "-",
      logo: getImagePath(jobData, "profile"),
      email: perusahaan?.email_perusahaan || perusahaan?.email || "-",
      website: perusahaan?.website || "-",
      description: perusahaan?.deskripsi || "-",
    },
    cabang: {
      nama: jobData.cabang?.nama || "",
      kota: perusahaan?.kota || jobData.cabang?.kota || "",
      provinsi: perusahaan?.provinsi || jobData.cabang?.provinsi || "",
      locationComponents: getLocationComponents(),
    },
    documents: DEFAULT_REQUIRED_DOCUMENTS,
    importantDates: {
      duration: calculateDuration(jobData.tanggal_mulai, jobData.tanggal_selesai),
      Pembukaan: jobData.tanggal_mulai,
      Penutupan: jobData.tanggal_selesai,
    },
    requirement: jobData.requirement
      ? jobData.requirement.split("\n")
      : [],
    jobdesc: jobData.jobdesc
      ? jobData.jobdesc.split("\n")
      : [],
    max_kuota: resolveMaxQuotaValue(jobData),
    total_pendaftar: resolveApplicantCountValue(jobData),
    cover: getImagePath(jobData, "profil_cover"),
    internshipSystem: resolveInternshipSystem(jobData),
    status: getEffectiveLowonganStatus(jobData),
    statusLabel: getLowonganLifecycleLabel(jobData),
    isClosed: isLowonganClosed(jobData),
  };
};

export const fetchMapJobDetail = async (jobId) => {
  try {
    const res = await getJobDetails(jobId);
    const jobData = res.data?.data;

    if (Array.isArray(jobData)) {
      return jobData.map(mapJobData);
    }

    if (jobData && typeof jobData === "object") {
      return [mapJobData(jobData)];
    }

    return [];
  } catch (err) {
    console.error("Failed to fetch jobDetail", err);
    return [];
  }
};

export const renderCompactLocation = (job) => {
  const loc = job?.cabang?.locationComponents || {};
  return loc.kota && loc.provinsi
    ? `${loc.kota}, ${loc.provinsi}`
    : loc.kota || loc.provinsi || loc.alamatPerusahaan || "Lokasi tidak tersedia";
};

export const getImportantDates = (job) => {
  const { Pembukaan, Penutupan } = job?.importantDates || {};
  if (!Pembukaan || !Penutupan) {
    return { duration: "Tidak tersedia", Pembukaan: "-", Penutupan: "-" };
  }
  const start = new Date(Pembukaan);
  const end = new Date(Penutupan);
  if (isNaN(start) || isNaN(end)) {
    return { duration: "Tanggal tidak valid", Pembukaan: "-", Penutupan: "-" };
  }

  const duration = Math.floor((end - start) / 86400000) + 1;
  const opts = { day: "numeric", month: "long", year: "numeric" };

  return {
    duration: `${duration} hari`,
    Pembukaan: start.toLocaleDateString("id-ID", opts),
    Penutupan: end.toLocaleDateString("id-ID", opts),
  };
};
