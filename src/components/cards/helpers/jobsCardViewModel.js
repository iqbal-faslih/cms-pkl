import {
  getLowonganLifecycleState,
  getLowonganLifecycleLabel,
  isLowonganClosed,
} from "@/helpers/lowonganStatusHelper";

const DEFAULT_JOB_NAME = "Lowongan";
const DEFAULT_DURATION_LABEL = "Tanggal belum tersedia";
const DEFAULT_MAX_QUOTA = 0;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const resolveInternshipBadge = (statusMagang) => {
  const internshipSystem = String(statusMagang || "").toLowerCase();
  if (internshipSystem === "online") {
    return {
      label: "Online",
      className: "bg-[#e9f2ff] text-[#2f66ff]",
    };
  }

  if (internshipSystem === "offline") {
    return {
      label: "Offline",
      className: "bg-[#f3f4f6] text-[#4b5563]",
    };
  }

  return null;
};

const toStartOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

const parseDateOnly = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toStartOfDay(value);
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const isoCandidate = raw.slice(0, 10);
  const isoMatch = isoCandidate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return toStartOfDay(parsed);
};

const resolveRemainingDurationLabel = (selesaiRaw, selesai) => {
  const endDate = parseDateOnly(selesaiRaw || selesai);
  if (!endDate) return DEFAULT_DURATION_LABEL;

  const today = toStartOfDay(new Date());
  const remainingDays = Math.floor((endDate - today) / DAY_IN_MS) + 1;
  const normalizedDays = Math.max(1, remainingDays);

  return normalizedDays >= 30
    ? `${Math.floor(normalizedDays / 30)} bulan`
    : `${normalizedDays} hari`;
};

const normalizeNonNegativeNumber = (value, fallback = DEFAULT_MAX_QUOTA) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
};

const resolveMaxQuota = (job) =>
  normalizeNonNegativeNumber(
    job?.maxKuota ?? job?.max_kuota ?? job?.kuota ?? job?.quota,
    DEFAULT_MAX_QUOTA
  );

const formatMaxQuotaLabel = (maxKuota) => `Max Kuota: ${maxKuota} orang`;

export const resolveJobsCardViewModel = (job = {}) => {
  const jobName = job?.namaLowongan || job?.title || job?.nama || job?.judul || DEFAULT_JOB_NAME;
  const internshipBadge = resolveInternshipBadge(job?.statusMagang);
  const maxKuota = resolveMaxQuota(job);
  const lowonganClosed = isLowonganClosed(job);
  const lifecycleState = getLowonganLifecycleState(job);

  const durationLabel = resolveRemainingDurationLabel(job?.selesaiRaw, job?.selesai);

  return {
    jobName,
    internshipBadge,
    showHeaderBadge: !lowonganClosed,
    showLifecycleBadge: lifecycleState !== "coming_soon",
    lifecycleBadgeLabel: getLowonganLifecycleLabel(job, {
      openLabel: "Open",
      closedLabel: "Closed",
    }),
    lifecycleBadgeClassName:
      lifecycleState === "closed"
        ? "bg-[#ffe8e8] text-[#dc2626]"
        : lifecycleState === "coming_soon"
          ? "bg-amber-100 text-amber-700"
          : "bg-[#e8f7ee] text-[#16a34a]",
    headerBadgeLabel: durationLabel,
    headerBadgeClassName: "bg-blue-600 text-white",
    maxKuota,
    maxKuotaLabel: formatMaxQuotaLabel(maxKuota),
  };
};
