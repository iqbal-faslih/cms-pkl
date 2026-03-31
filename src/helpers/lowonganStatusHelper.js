const CLOSED_STATUS_VALUES = new Set([
  "0",
  "false",
  "closed",
  "close",
  "selesai",
  "tutup",
  "ditutup",
  "nonaktif",
  "inactive",
]);
const OPEN_STATUS_VALUES = new Set([
  "1",
  "true",
  "open",
  "berlangsung",
  "aktif",
  "active",
]);
export const LOWONGAN_STATUS_CACHE_KEY = "lowongan_status_override_v1";

const pickFirstDefined = (values = []) => {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return null;
};

const toFiniteNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[, ]+/g, "").trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toCountValue = (value) => {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.length;
  const numberValue = toFiniteNumber(value);
  if (numberValue !== null) return numberValue;
  if (typeof value === "object") {
    const nested = pickFirstDefined([
      value?.count,
      value?.total,
      value?.jumlah,
      value?.length,
    ]);
    return toFiniteNumber(nested);
  }
  return null;
};

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

const readStatusOverrideMap = () => {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(LOWONGAN_STATUS_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

const writeStatusOverrideMap = (nextMap) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(LOWONGAN_STATUS_CACHE_KEY, JSON.stringify(nextMap));
  } catch {
    // ignore storage write failures (quota/private mode)
  }
};

const isObjectLike = (value) => value && typeof value === "object";

const findFirstByKeyPattern = (source, pattern) => {
  if (!isObjectLike(source)) return null;

  const queue = [source];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!isObjectLike(current) || visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      current.forEach((item) => {
        if (isObjectLike(item)) queue.push(item);
      });
      continue;
    }

    for (const [key, value] of Object.entries(current)) {
      if (pattern.test(String(key))) {
        const picked = pickFirstDefined([value]);
        if (picked !== null) return picked;
      }

      if (isObjectLike(value)) queue.push(value);
    }
  }

  return null;
};

const parseDateOnly = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const isoLike = raw.slice(0, 10);
  const isoParts = isoLike.split("-").map(Number);
  if (isoParts.length === 3 && !isoParts.some(Number.isNaN)) {
    const [year, month, day] = isoParts;
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const normalizeStatusNumber = (value) => {
  if (value === true) return 1;
  if (value === false) return 0;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value === 0 ? 0 : 1;
  }

  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;
  if (CLOSED_STATUS_VALUES.has(normalized)) return 0;
  if (OPEN_STATUS_VALUES.has(normalized)) return 1;
  return null;
};

const toJobIdKey = (jobId) => {
  if (jobId === null || jobId === undefined) return "";
  const normalized = String(jobId).trim();
  return normalized || "";
};

const resolveRawStatus = (job = {}) =>
  pickFirstDefined([
    job?.status,
    job?.status_lowongan,
    job?.statusLowongan,
    job?.is_open,
    job?.isOpen,
    job?.is_active,
    job?.isActive,
    job?.aktif,
    job?.active,
    job?.closed,
    job?.is_closed,
    job?.isClosed,
    job?.open,
    job?.buka_tutup,
    findFirstByKeyPattern(job, /^(status|status_lowongan|is_open|is_active|is_closed|open|closed)$/i),
  ]);

const resolveEndDateValue = (job = {}) =>
  pickFirstDefined([
    job?.tanggal_selesai,
    job?.tanggalSelesai,
    job?.penutupan,
    job?.tanggal_penutupan,
    job?.end_date,
    job?.endDate,
    job?.closed_at,
    job?.closedAt,
    job?.importantDates?.Penutupan,
    findFirstByKeyPattern(job, /(tanggal_selesai|tanggal_penutupan|penutupan|end_date|closed_at)$/i),
  ]);

const resolveStartDateValue = (job = {}) =>
  pickFirstDefined([
    job?.mulaiRaw,
    job?.mulai_raw,
    job?.mulai,
    job?.tanggal_mulai,
    job?.tanggalMulai,
    job?.pembukaan,
    job?.tanggal_pembukaan,
    job?.start_date,
    job?.startDate,
    job?.opened_at,
    job?.openedAt,
    job?.importantDates?.Pembukaan,
    findFirstByKeyPattern(job, /(tanggal_mulai|tanggal_pembukaan|pembukaan|start_date|opened_at)$/i),
  ]);

export const resolveApplicantCountValue = (job = {}) => {
  const direct = pickFirstDefined([
    job?.total_pendaftar,
    job?.jumlah_pendaftar,
    job?.pendaftar,
    job?.pendaftaran,
    job?.pendaftaran_lowongan,
    job?.riwayat_pendaftaran,
    job?.lamaran,
    job?.pendaftar_count,
    job?.total_pelamar,
    job?.jumlah_pelamar,
    job?.pelamar,
    job?.applications,
    job?.application,
    job?.registrations,
    job?.registration,
    job?.applicants,
    job?.applicant_count,
    job?.applicants_count,
    job?.jumlah_peserta,
    job?.total_peserta,
    job?.peserta,
    job?.participants,
    job?.participant_count,
  ]);

  const fromDirect = toCountValue(direct);
  if (fromDirect !== null) return fromDirect;

  const fromPattern = findFirstByKeyPattern(
    job,
    /(pendaftar|pendaftaran|pelamar|lamaran|applicant|application|registrat|peserta|participant).*?(count|total|jumlah)?$/i
  );
  const fromPatternValue = toCountValue(fromPattern);
  return fromPatternValue !== null ? fromPatternValue : 0;
};

export const resolveMaxQuotaValue = (job = {}) => {
  const direct = pickFirstDefined([
    job?.max_kuota,
    job?.kuota,
    job?.quota,
    job?.capacity,
  ]);
  const fromDirect = toCountValue(direct);
  if (fromDirect !== null) return fromDirect;

  const fromPattern = findFirstByKeyPattern(
    job,
    /(max_?kuota|kuota|max_?quota|quota|capacity)/i
  );
  const fromPatternValue = toCountValue(fromPattern);
  return fromPatternValue !== null ? fromPatternValue : 0;
};

export const isLowonganQuotaFull = (job = {}) => {
  const maxQuota = resolveMaxQuotaValue(job);
  if (!Number.isFinite(maxQuota) || maxQuota <= 0) return false;
  const applicants = resolveApplicantCountValue(job);
  return Number.isFinite(applicants) && applicants >= maxQuota;
};

export const getCachedLowonganStatus = (jobId) => {
  const key = toJobIdKey(jobId);
  if (!key) return null;

  const cacheMap = readStatusOverrideMap();
  const cached = cacheMap[key];
  if (cached === undefined || cached === null) return null;

  const normalizedStatus = normalizeStatusNumber(cached?.status ?? cached);
  return normalizedStatus !== null ? normalizedStatus : null;
};

export const markLowonganClosedInCache = (jobId) => {
  const key = toJobIdKey(jobId);
  if (!key) return;

  const cacheMap = readStatusOverrideMap();
  cacheMap[key] = { status: 0, updatedAt: new Date().toISOString() };
  writeStatusOverrideMap(cacheMap);
};

export const isLowonganExpiredByEndDate = (tanggalSelesai) => {
  const endDate = parseDateOnly(tanggalSelesai);
  if (!endDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return endDate < today;
};

export const isLowonganUpcomingByStartDate = (tanggalMulai) => {
  const startDate = parseDateOnly(tanggalMulai);
  if (!startDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  return startDate > today;
};

export const getEffectiveLowonganStatus = (job = {}) => {
  const cachedStatus = getCachedLowonganStatus(job?.id ?? job?.id_lowongan);
  if (cachedStatus === 0) return 0;

  if (isLowonganExpiredByEndDate(resolveEndDateValue(job))) return 0;

  const normalizedStatus = normalizeStatusNumber(resolveRawStatus(job));
  if (normalizedStatus !== null) return normalizedStatus;

  return 1;
};

export const isLowonganClosed = (job = {}) => getEffectiveLowonganStatus(job) === 0;

export const isLowonganComingSoon = (job = {}) =>
  !isLowonganClosed(job) && isLowonganUpcomingByStartDate(resolveStartDateValue(job));

export const getLowonganLifecycleState = (job = {}) => {
  if (isLowonganClosed(job)) return "closed";
  if (isLowonganComingSoon(job)) return "coming_soon";
  return "open";
};

export const getLowonganLifecycleLabel = (
  job = {},
  {
    openLabel = "Open",
    closedLabel = "Closed",
    comingSoonLabel = "Coming Soon",
  } = {}
) => {
  const state = getLowonganLifecycleState(job);
  if (state === "closed") return closedLabel;
  if (state === "coming_soon") return comingSoonLabel;
  return openLabel;
};

export const resolveLowonganClosureReason = (job = {}) => {
  const cachedStatus = getCachedLowonganStatus(job?.id ?? job?.id_lowongan);
  if (cachedStatus === 0) {
    return {
      code: "manual_cache",
      label: "Ditutup manual oleh perusahaan",
      description: "Lowongan ini ditutup manual oleh perusahaan.",
    };
  }

  if (isLowonganExpiredByEndDate(resolveEndDateValue(job))) {
    return {
      code: "date_expired",
      label: "Melewati tanggal penutupan",
      description: "Lowongan ini ditutup karena melewati tanggal penutupan.",
    };
  }

  if (isLowonganQuotaFull(job)) {
    const applicantCount = resolveApplicantCountValue(job);
    const maxQuota = resolveMaxQuotaValue(job);
    return {
      code: "quota_full",
      label: "Kuota lowongan sudah penuh",
      description: `Lowongan ini ditutup karena kuota sudah penuh (${applicantCount}/${maxQuota}).`,
    };
  }

  const normalizedStatus = normalizeStatusNumber(resolveRawStatus(job));
  if (normalizedStatus === 0) {
    return {
      code: "manual_status",
      label: "Ditutup oleh status lowongan",
      description: "Lowongan ini ditutup berdasarkan status dari perusahaan.",
    };
  }

  return null;
};
