export const DEFAULT_COVER = "/assets/img/Cover.png";
export const DEFAULT_PROFILE = "/assets/img/defaultPP.png";
const DEFAULT_DIVISION = "Belum tergabung dalam divisi";
const DEFAULT_INTERNSHIP_TEXT = "Belum terdaftar magang";

const FILE_BASE_URL =
  import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || import.meta.env.VITE_API_URL || "";

const isMeaningful = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return true;
  if (typeof value !== "string") return false;
  const text = value.trim();
  return text.length > 0 && text !== "-";
};

const pickFirstText = (values = [], fallback = "") => {
  for (const value of values) {
    if (isMeaningful(value)) return String(value).trim();
  }
  return fallback;
};

const pickFirstObject = (values = []) => {
  for (const value of values) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  }
  return {};
};

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const INDONESIAN_PROVINCES = [
  "aceh",
  "sumatera utara",
  "sumatera barat",
  "riau",
  "jambi",
  "sumatera selatan",
  "bengkulu",
  "lampung",
  "kepulauan bangka belitung",
  "kepulauan riau",
  "dki jakarta",
  "jakarta",
  "jawa barat",
  "jawa tengah",
  "di yogyakarta",
  "daerah istimewa yogyakarta",
  "jawa timur",
  "banten",
  "bali",
  "nusa tenggara barat",
  "nusa tenggara timur",
  "kalimantan barat",
  "kalimantan tengah",
  "kalimantan selatan",
  "kalimantan timur",
  "kalimantan utara",
  "sulawesi utara",
  "sulawesi tengah",
  "sulawesi selatan",
  "sulawesi tenggara",
  "gorontalo",
  "sulawesi barat",
  "maluku",
  "maluku utara",
  "papua",
  "papua barat",
  "papua selatan",
  "papua tengah",
  "papua pegunungan",
  "papua barat daya",
];

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

const toRegionText = (value) => {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  if (!isObject(value)) return "";

  const direct = pickFirstText(
    [
      value?.nama,
      value?.name,
      value?.label,
      value?.value,
      value?.nama_kabupaten,
      value?.nama_kota,
      value?.nama_provinsi,
      value?.city,
      value?.regency,
      value?.province,
    ],
    ""
  );
  if (direct) return direct;

  return pickFirstText(
    [
      toRegionText(value?.kota),
      toRegionText(value?.kabupaten),
      toRegionText(value?.provinsi),
      toRegionText(value?.city),
      toRegionText(value?.regency),
      toRegionText(value?.province),
    ],
    ""
  );
};

const normalizeWhitespace = (value = "") => String(value).replace(/\s+/g, " ").trim();

const normalizeRegionLabel = (value = "") =>
  normalizeWhitespace(String(value || "").replace(/^(provinsi|kabupaten|kota)\s+/i, ""));

const findProvinceInText = (text = "") => {
  const normalized = normalizeWhitespace(text).toLowerCase();
  const match = INDONESIAN_PROVINCES.find((province) => normalized.includes(province));
  return match ? normalizeRegionLabel(match) : "";
};

const pickAddressText = (value) => {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") {
    return normalizeWhitespace(value);
  }
  if (!isObject(value)) return "";

  return pickFirstText(
    [
      value?.alamat,
      value?.address,
      value?.full_address,
      value?.location,
      value?.name,
      value?.nama,
    ],
    ""
  );
};

const extractRegionFromAddress = (address = "") => {
  const text = normalizeWhitespace(address);
  if (!text) return { kabupaten: "", provinsi: "" };

  const segments = text
    .split(",")
    .map((segment) => normalizeWhitespace(segment))
    .filter(Boolean);

  const kabupatenSegment = segments.find((segment) => /^(kabupaten|kota)\b/i.test(segment)) || "";
  const provinsiSegment = segments.find((segment) => /^provinsi\b/i.test(segment)) || "";

  const provinsiFromName = findProvinceInText(text);
  const fallbackProvinsi = provinsiSegment
    ? normalizeRegionLabel(provinsiSegment)
    : provinsiFromName;

  let kabupaten = kabupatenSegment ? normalizeRegionLabel(kabupatenSegment) : "";
  if (!kabupaten && segments.length >= 2) {
    const candidate = normalizeRegionLabel(segments[segments.length - 2]);
    if (candidate && !INDONESIAN_PROVINCES.includes(candidate.toLowerCase())) {
      kabupaten = candidate;
    }
  }

  const provinsi = fallbackProvinsi || (segments.length >= 1 ? findProvinceInText(segments[segments.length - 1]) : "");
  return { kabupaten, provinsi };
};

const isInternshipPlaceholderText = (value = "") =>
  normalizeWhitespace(value).toLowerCase() === DEFAULT_INTERNSHIP_TEXT.toLowerCase();

const normalizeDateToIso = (value) => {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const raw = String(value).trim();
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, "0");
    const month = slashMatch[2].padStart(2, "0");
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

export const formatTanggalLahirDisplay = (value) => {
  const iso = normalizeDateToIso(value);
  if (!iso) return "N/A";

  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "N/A";
  return `${day}/${month}/${year}`;
};

export const toDateInputValue = (value) => normalizeDateToIso(value);

const formatDateDisplay = (value) => {
  const iso = normalizeDateToIso(value);
  if (!iso) return String(value || "").trim();
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return String(value || "").trim();
  return `${day}/${month}/${year}`;
};

const resolveDetailSource = (rawData = {}) =>
  pickFirstObject([
    rawData?.detail_peserta,
    rawData?.detailPeserta,
    rawData?.peserta_detail,
    rawData?.peserta,
    rawData?.data?.detail_peserta,
    rawData?.data?.detailPeserta,
    rawData?.data?.peserta_detail,
    rawData?.data?.peserta,
    rawData,
  ]);

const withLowonganContext = (source = {}, lowonganItems = [], companyDirectory = []) => {
  const next = { ...source };

  if (Array.isArray(lowonganItems) && lowonganItems.length > 0) {
    next.riwayat_lowongan = lowonganItems;
    next.riwayatLowongan = lowonganItems;
    next.lowongan = lowonganItems;
  }

  if (Array.isArray(companyDirectory) && companyDirectory.length > 0) {
    next.companyDirectory = companyDirectory;
  }

  return next;
};

const collectScopes = (source = {}) => {
  const scopes = [
    source,
    source?.user,
    source?.peserta,
    source?.detail_peserta,
    source?.detailPeserta,
    source?.magang,
    source?.profile,
    source?.data,
  ];
  return scopes.filter((item) => item && typeof item === "object" && !Array.isArray(item));
};

const resolveIdCandidates = (source = {}) => {
  const scopes = collectScopes(source);
  const rawCandidates = scopes.flatMap((item) => [
    item?.id_peserta,
    item?.id,
    item?.peserta_id,
    item?.id_user,
    item?.user_id,
    item?.user?.id,
    item?.peserta?.id,
    item?.detail_peserta?.id,
    item?.detailPeserta?.id,
  ]);

  const uniqueCandidates = [];
  rawCandidates.forEach((value) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return;
    if (uniqueCandidates.includes(normalized)) return;
    uniqueCandidates.push(normalized);
  });

  return uniqueCandidates;
};

const normalizeFileUrl = (path) => {
  const rawPath = String(path || "").trim();
  if (!rawPath) return "";
  if (/^(https?:\/\/|data:|blob:)/i.test(rawPath)) return rawPath;

  const cleanBase = String(FILE_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!cleanBase) return rawPath;

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

const resolveDivisionName = (source = {}) => {
  const scopes = collectScopes(source);
  const division = pickFirstText(
    scopes.flatMap((item) => [
      item?.id_divisi?.nama,
      item?.id_divisi?.name,
      item?.id_divisi?.nama_divisi,
      item?.divisi?.nama,
      item?.divisi?.name,
      typeof item?.divisi === "string" ? item.divisi : "",
      item?.division?.nama,
      item?.division?.name,
      typeof item?.division === "string" ? item.division : "",
      item?.nama_divisi,
      item?.divisi_name,
      item?.division_name,
      item?.route?.divisi,
      item?.posisi_magang,
      item?.posisi,
      item?.jabatan,
    ]),
    ""
  );

  return division || DEFAULT_DIVISION;
};

const normalizeStatusText = (value) => String(value || "").trim().toLowerCase();

const APPROVED_PLACEMENT_EXPLICIT_STATUS_SET = new Set([
  "diterima",
  "disetujui",
  "accepted",
  "approve",
  "approved",
]);

const APPROVED_PLACEMENT_GENERIC_STATUS_SET = new Set([
  "aktif",
  "active",
  "1",
  "true",
]);

const isAcceptedLowonganStatus = (value, { allowGeneric = false } = {}) => {
  const normalized = normalizeStatusText(value);
  if (APPROVED_PLACEMENT_EXPLICIT_STATUS_SET.has(normalized)) return true;
  if (!allowGeneric) return false;
  return APPROVED_PLACEMENT_GENERIC_STATUS_SET.has(normalized);
};

const resolvePlacementApprovalStatuses = (item = {}) => [
  item?.status_lamaran,
  item?.status_magang,
  item?.approval_status,
  item?.status_pendaftaran,
  item?.approval?.status,
  item?.magang?.status_magang,
  item?.magang?.status_lamaran,
  item?.magang?.approval_status,
  item?.pendaftaran?.status,
  item?.pendaftaran?.status_lamaran,
  item?.pendaftaran?.status_magang,
  item?.lowongan?.status_lamaran,
  item?.lowongan?.status_magang,
  item?.lowongan?.approval_status,
];

const resolvePlacementGenericStatuses = (item = {}) => [
  item?.magang?.status,
  item?.pendaftaran?.status,
];

const hasAcceptedPlacementSignal = (item = {}) => {
  const hasExplicitApproval = [
    ...resolvePlacementApprovalStatuses(item),
    item?.status,
  ].some((status) => isAcceptedLowonganStatus(status));

  if (hasExplicitApproval) return true;

  return resolvePlacementGenericStatuses(item).some((status) =>
    isAcceptedLowonganStatus(status, { allowGeneric: true })
  );
};

const collectLowonganItems = (source = {}) => {
  const scopes = collectScopes(source);
  const items = [];

  scopes.forEach((scope) => {
    const candidates = [
      scope?.lowongan,
      scope?.riwayat_lowongan,
      scope?.riwayatLowongan,
      scope?.pendaftaran_lowongan,
      scope?.pendaftaranLowongan,
      scope?.magang,
      scope?.penempatan,
    ];

    candidates.forEach((candidate) => {
      if (Array.isArray(candidate)) {
        candidate.forEach((item) => {
          if (item && typeof item === "object") items.push(item);
        });
        return;
      }
      if (candidate && typeof candidate === "object") {
        items.push(candidate);
      }
    });
  });

  return items;
};

const resolveAcceptedLowongan = (source = {}) => {
  const lowonganItems = collectLowonganItems(source);
  const accepted = lowonganItems.find((item) => hasAcceptedPlacementSignal(item));

  return accepted || null;
};

const hasAcceptedPlacementFromSource = (source = {}) => {
  const scopes = collectScopes(source);

  return scopes.some((item) => hasAcceptedPlacementSignal(item));
};

const hasPlacementDataFromDetailSource = (source = {}) => {
  const scopes = collectScopes(source);

  return scopes.some((item) => {
    const hasCompanySignal = [
      item?.id_perusahaan?.nama,
      item?.id_perusahaan?.nama_perusahaan,
      item?.id_perusahaan?.name,
      item?.perusahaan?.nama,
      item?.perusahaan?.nama_perusahaan,
      typeof item?.perusahaan === "string" ? item.perusahaan : "",
      item?.nama_perusahaan?.nama,
      item?.nama_perusahaan?.nama_perusahaan,
      typeof item?.nama_perusahaan === "string" ? item.nama_perusahaan : "",
    ].some((value) => isMeaningful(value));

    const hasDivisionSignal = [
      item?.id_divisi?.nama,
      item?.id_divisi?.name,
      item?.divisi?.nama,
      item?.divisi?.name,
      typeof item?.divisi === "string" ? item.divisi : "",
      item?.id_divisi,
      item?.divisi_id,
      item?.nama_divisi,
    ].some((value) => isMeaningful(value));

    const hasInternshipPeriodSignal = [
      item?.waktu_magang,
      item?.internship_period,
      item?.durasi_magang,
      item?.mulai_magang,
      item?.selesai_magang,
      item?.tanggal_mulai,
      item?.tanggal_selesai,
    ].some((value) => isMeaningful(value));

    return hasCompanySignal || hasDivisionSignal || hasInternshipPeriodSignal;
  });
};

const resolveCompanyIdentityFromSource = (source = {}, placementFallback = null) => {
  const scopes = collectScopes(source);
  return {
    companyId: pickFirstText(
      [
        placementFallback?.companyId,
        ...scopes.flatMap((item) => [
          item?.id_perusahaan?.id,
          item?.id_perusahaan?.id_perusahaan,
          item?.id_perusahaan,
          item?.perusahaan_id,
          item?.company_id,
          item?.id_divisi?.id_perusahaan,
          item?.divisi?.id_perusahaan,
          item?.route?.id_perusahaan,
          item?.magang?.id_perusahaan,
          item?.lowongan?.id_perusahaan,
          item?.perusahaan?.id,
          item?.perusahaan?.id_perusahaan,
          item?.lowongan?.perusahaan?.id,
          item?.lowongan?.perusahaan?.id_perusahaan,
        ]),
      ],
      ""
    ),
    companyName: pickFirstText(
      [
        ...scopes.flatMap((item) => [
          item?.id_perusahaan?.nama,
          item?.id_perusahaan?.nama_perusahaan,
          item?.id_perusahaan?.name,
          item?.nama_perusahaan,
          item?.perusahaan?.nama,
          item?.perusahaan?.nama_perusahaan,
          item?.company?.name,
          item?.user?.nama_perusahaan,
        ]),
        placementFallback?.perusahaan,
      ],
      ""
    ),
  };
};

const resolvePlacementFallback = (source = {}) => {
  const acceptedLowongan = resolveAcceptedLowongan(source);
  if (!acceptedLowongan) return null;

  const lowonganDetail = acceptedLowongan?.lowongan || acceptedLowongan?.vacancy || {};
  const perusahaanDetail = pickFirstObject([
    acceptedLowongan?.perusahaan,
    acceptedLowongan?.nama_perusahaan,
    lowonganDetail?.perusahaan,
    lowonganDetail?.nama_perusahaan,
    acceptedLowongan?.company,
    lowonganDetail?.company,
  ]);
  const cabangDetail = pickFirstObject([
    acceptedLowongan?.cabang,
    lowonganDetail?.cabang,
    acceptedLowongan?.branch,
    lowonganDetail?.branch,
  ]);
  const periodRange =
    String(
      acceptedLowongan?.durasi_magang ||
        acceptedLowongan?.internship_period ||
        lowonganDetail?.durasi_magang ||
        lowonganDetail?.internship_period ||
        ""
    ).trim() || "";

  const periodParts = periodRange
    ? periodRange.split(/\s*[-–]\s*/).map((part) => String(part || "").trim())
    : [];
  const periodStart = periodParts[0] || "";
  const periodEnd = periodParts[1] || "";

  const tanggalMulaiValue = pickFirstText(
    [
      findFirstTruthyByPaths(acceptedLowongan, [
        "mulai",
        "tanggal_mulai",
        "tanggal_awal",
        "mulai_magang",
        "start_date",
        "mulaiMagang",
        "tanggalMulai",
        "magang.mulai",
        "magang.tanggal_mulai",
        "magang.mulai_magang",
        "magang.start_date",
        "pendaftaran.mulai",
        "pendaftaran.tanggal_mulai",
        "pendaftaran.start_date",
        "periode.mulai",
      ]),
      findFirstTruthyByPaths(lowonganDetail, [
        "mulai",
        "tanggal_mulai",
        "tanggal_awal",
        "mulai_magang",
        "start_date",
        "mulaiMagang",
        "tanggalMulai",
        "magang.mulai",
        "magang.tanggal_mulai",
        "magang.mulai_magang",
        "magang.start_date",
        "pendaftaran.mulai",
        "pendaftaran.tanggal_mulai",
        "pendaftaran.start_date",
        "periode.mulai",
      ]),
      periodStart,
    ],
    ""
  );

  const tanggalSelesaiValue = pickFirstText(
    [
      findFirstTruthyByPaths(acceptedLowongan, [
        "selesai",
        "tanggal_selesai",
        "tanggal_akhir",
        "selesai_magang",
        "end_date",
        "selesaiMagang",
        "tanggalSelesai",
        "magang.selesai",
        "magang.tanggal_selesai",
        "magang.selesai_magang",
        "magang.end_date",
        "pendaftaran.selesai",
        "pendaftaran.tanggal_selesai",
        "pendaftaran.end_date",
        "periode.selesai",
      ]),
      findFirstTruthyByPaths(lowonganDetail, [
        "selesai",
        "tanggal_selesai",
        "tanggal_akhir",
        "selesai_magang",
        "end_date",
        "selesaiMagang",
        "tanggalSelesai",
        "magang.selesai",
        "magang.tanggal_selesai",
        "magang.selesai_magang",
        "magang.end_date",
        "pendaftaran.selesai",
        "pendaftaran.tanggal_selesai",
        "pendaftaran.end_date",
        "periode.selesai",
      ]),
      periodEnd,
    ],
    ""
  );

  return {
    divisi: pickFirstText(
      [
        acceptedLowongan?.divisi?.nama,
        acceptedLowongan?.divisi?.name,
        acceptedLowongan?.lowongan?.divisi?.nama,
        acceptedLowongan?.lowongan?.divisi?.name,
        acceptedLowongan?.nama_divisi,
        acceptedLowongan?.divisi_name,
        acceptedLowongan?.division_name,
        acceptedLowongan?.posisi_magang,
        acceptedLowongan?.posisi,
        acceptedLowongan?.jabatan,
        acceptedLowongan?.route?.divisi,
        lowonganDetail?.divisi?.nama,
        lowonganDetail?.divisi?.name,
        lowonganDetail?.nama_divisi,
        lowonganDetail?.divisi_name,
        lowonganDetail?.division_name,
        lowonganDetail?.posisi_magang,
        lowonganDetail?.posisi,
        lowonganDetail?.jabatan,
      ],
      ""
    ),
    perusahaan: pickFirstText(
      [
        acceptedLowongan?.perusahaan?.nama,
        acceptedLowongan?.perusahaan?.nama_perusahaan,
        acceptedLowongan?.nama_perusahaan,
        acceptedLowongan?.company?.name,
        lowonganDetail?.perusahaan?.nama,
        lowonganDetail?.perusahaan?.nama_perusahaan,
        lowonganDetail?.nama_perusahaan,
      ],
      ""
    ),
    cabang: pickFirstText(
      [
        acceptedLowongan?.cabang?.nama,
        acceptedLowongan?.branch?.name,
        acceptedLowongan?.nama_cabang,
        lowonganDetail?.cabang?.nama,
        lowonganDetail?.branch?.name,
        lowonganDetail?.nama_cabang,
      ],
      ""
    ),
    kabupaten: pickFirstText(
      [
        toRegionText(acceptedLowongan?.kabupaten),
        toRegionText(acceptedLowongan?.kota),
        toRegionText(acceptedLowongan?.kota_kabupaten),
        toRegionText(acceptedLowongan?.regency),
        toRegionText(acceptedLowongan?.city),
        toRegionText(lowonganDetail?.kabupaten),
        toRegionText(lowonganDetail?.kota),
        toRegionText(lowonganDetail?.kota_kabupaten),
        toRegionText(lowonganDetail?.regency),
        toRegionText(lowonganDetail?.city),
        toRegionText(perusahaanDetail?.kabupaten),
        toRegionText(perusahaanDetail?.kota),
        toRegionText(perusahaanDetail?.kota_kabupaten),
        toRegionText(perusahaanDetail?.regency),
        toRegionText(perusahaanDetail?.city),
        toRegionText(cabangDetail?.kabupaten),
        toRegionText(cabangDetail?.kota),
        toRegionText(cabangDetail?.kota_kabupaten),
        toRegionText(cabangDetail?.regency),
        toRegionText(cabangDetail?.city),
      ],
      ""
    ),
    provinsi: pickFirstText(
      [
        toRegionText(acceptedLowongan?.provinsi),
        toRegionText(acceptedLowongan?.province),
        toRegionText(lowonganDetail?.provinsi),
        toRegionText(lowonganDetail?.province),
        toRegionText(perusahaanDetail?.provinsi),
        toRegionText(perusahaanDetail?.province),
        toRegionText(cabangDetail?.provinsi),
        toRegionText(cabangDetail?.province),
      ],
      ""
    ),
    companyId: pickFirstText(
      [
        acceptedLowongan?.id_perusahaan,
        acceptedLowongan?.perusahaan_id,
        acceptedLowongan?.company_id,
        acceptedLowongan?.perusahaan?.id,
        acceptedLowongan?.perusahaan?.id_perusahaan,
        lowonganDetail?.id_perusahaan,
        lowonganDetail?.perusahaan_id,
        lowonganDetail?.company_id,
        lowonganDetail?.perusahaan?.id,
        lowonganDetail?.perusahaan?.id_perusahaan,
      ],
      ""
    ),
    alamat: pickFirstText(
      [
        pickAddressText(acceptedLowongan?.alamat),
        pickAddressText(lowonganDetail?.alamat),
        pickAddressText(perusahaanDetail?.alamat),
        pickAddressText(perusahaanDetail?.address),
        pickAddressText(cabangDetail?.alamat),
        pickAddressText(cabangDetail?.address),
      ],
      ""
    ),
    mulaiMagang: tanggalMulaiValue,
    selesaiMagang: tanggalSelesaiValue,
  };
};

const resolveCompanyPlacementParts = (company = {}, placementFallback = null) => {
  const addressSource = pickFirstText(
    [
      pickAddressText(company?.alamat),
      pickAddressText(company?.address),
      pickAddressText(placementFallback?.alamat),
    ],
    ""
  );
  const fromAddress = extractRegionFromAddress(addressSource);

  const kabupaten = pickFirstText(
    [
      toRegionText(company?.kabupaten),
      toRegionText(company?.kota),
      toRegionText(company?.kota_kabupaten),
      toRegionText(company?.regency),
      toRegionText(company?.city),
      fromAddress.kabupaten,
      placementFallback?.kabupaten,
    ],
    ""
  );

  const provinsi = pickFirstText(
    [
      toRegionText(company?.provinsi),
      toRegionText(company?.province),
      fromAddress.provinsi,
      placementFallback?.provinsi,
    ],
    ""
  );

  return { kabupaten, provinsi };
};

const resolveScopePlacementParts = (scopes = [], placementFallback = null) => {
  const scopeKabupaten = pickFirstText(
    scopes.flatMap((scope) => [
      toRegionText(scope?.kabupaten),
      toRegionText(scope?.kota),
      toRegionText(scope?.kota_kabupaten),
      toRegionText(scope?.regency),
      toRegionText(scope?.city),
    ]),
    ""
  );

  const scopeProvinsi = pickFirstText(
    scopes.flatMap((scope) => [
      toRegionText(scope?.provinsi),
      toRegionText(scope?.province),
    ]),
    ""
  );

  const penempatanText = pickFirstText(
    scopes.flatMap((scope) => [
      scope?.penempatan,
      scope?.placement,
      scope?.lokasi_penempatan,
    ]),
    ""
  );
  const fromPenempatanText =
    penempatanText && !isInternshipPlaceholderText(penempatanText)
      ? extractRegionFromAddress(penempatanText)
      : { kabupaten: "", provinsi: "" };

  const alamatText = pickFirstText(
    scopes.flatMap((scope) => [
      pickAddressText(scope?.alamat),
      pickAddressText(scope?.address),
      pickAddressText(scope?.alamat_perusahaan),
      pickAddressText(scope?.company_address),
    ]),
    ""
  );
  const fromAlamatText = extractRegionFromAddress(alamatText);

  return {
    kabupaten: pickFirstText(
      [
        scopeKabupaten,
        fromPenempatanText.kabupaten,
        fromAlamatText.kabupaten,
        placementFallback?.kabupaten,
      ],
      ""
    ),
    provinsi: pickFirstText(
      [
        scopeProvinsi,
        fromPenempatanText.provinsi,
        fromAlamatText.provinsi,
        placementFallback?.provinsi,
      ],
      ""
    ),
  };
};

const formatPenempatan = ({ kabupaten = "", provinsi = "" } = {}) => {
  if (kabupaten && provinsi) return `${kabupaten}, ${provinsi}`;
  return pickFirstText([kabupaten, provinsi], "");
};

const normalizeComparableText = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const findCompanyInDirectory = ({ source = {}, companyName = "", companyId = "" }) => {
  const directory = Array.isArray(source?.companyDirectory) ? source.companyDirectory : [];
  if (directory.length === 0) return null;

  const normalizedCompanyId = normalizeComparableText(companyId);
  const normalizedCompanyName = normalizeComparableText(companyName);

  let matched = null;

  if (normalizedCompanyId) {
    matched = directory.find((item) => {
      const itemId = normalizeComparableText(item?.id || item?.id_perusahaan || item?.perusahaan_id);
      return itemId && itemId === normalizedCompanyId;
    });
  }

  if (!matched && normalizedCompanyName) {
    matched = directory.find((item) => {
      const candidateName = pickFirstText(
        [item?.nama_perusahaan, item?.nama, item?.user?.nama, item?.company?.name],
        ""
      );
      return normalizeComparableText(candidateName) === normalizedCompanyName;
    });
  }

  if (!matched && directory.length === 1) {
    matched = directory[0];
  }

  if (!matched) {
    matched = directory.find((item) =>
      pickFirstText(
        [toRegionText(item?.kota), toRegionText(item?.kabupaten), toRegionText(item?.provinsi)],
        ""
      )
    );
  }

  return matched || null;
};

const findCompanyLocationFromDirectory = ({ source = {}, companyName = "", companyId = "" }) => {
  const matched = findCompanyInDirectory({ source, companyName, companyId });
  if (!matched) return "";

  return formatPenempatan({
    kabupaten: pickFirstText(
      [
        toRegionText(matched?.kota),
        toRegionText(matched?.kabupaten),
        toRegionText(matched?.kota_kabupaten),
        toRegionText(matched?.regency),
        toRegionText(matched?.city),
      ],
      ""
    ),
    provinsi: pickFirstText([toRegionText(matched?.provinsi), toRegionText(matched?.province)], ""),
  });
};

const findCompanyNameFromDirectory = ({ source = {}, companyName = "", companyId = "" }) => {
  const matched = findCompanyInDirectory({ source, companyName, companyId });
  if (!matched) return "";
  return pickFirstText(
    [matched?.nama_perusahaan, matched?.nama, matched?.user?.nama, matched?.company?.name],
    ""
  );
};

const resolvePenempatan = (source = {}, placementFallback = null) => {
  const scopes = collectScopes(source);
  const companyCandidates = scopes.flatMap((item) => [
    item?.id_perusahaan,
    item?.perusahaan,
    item?.company,
    item?.nama_perusahaan,
    item?.lowongan?.perusahaan,
    item?.lowongan?.company,
    item?.lowongan?.nama_perusahaan,
    item?.magang?.perusahaan,
    item?.magang?.nama_perusahaan,
    item?.lowongan?.perusahaan,
    item?.lowongan?.nama_perusahaan,
    item?.cabang,
    item?.branch,
  ]);
  const company = pickFirstObject(companyCandidates);
  const companyPlacement = resolveCompanyPlacementParts(company, placementFallback);
  const scopePlacement = resolveScopePlacementParts(scopes, placementFallback);
  const placement = formatPenempatan({
    kabupaten: pickFirstText([companyPlacement.kabupaten, scopePlacement.kabupaten], ""),
    provinsi: pickFirstText([companyPlacement.provinsi, scopePlacement.provinsi], ""),
  });
  return placement || DEFAULT_INTERNSHIP_TEXT;
};

const resolveWaktuMagangRange = (source = {}) => {
  const scopes = collectScopes(source);
  const rawRange = pickFirstText(
    scopes.flatMap((item) => [item?.waktu_magang, item?.internship_period, item?.durasi_magang]),
    ""
  );

  if (!rawRange) return { mulai: "", selesai: "" };

  const normalizedRange = String(rawRange).replace(/[–—]/g, "-");
  const isoDateMatches = normalizedRange.match(/\d{4}-\d{2}-\d{2}/g);
  if (Array.isArray(isoDateMatches) && isoDateMatches.length >= 2) {
    return { mulai: isoDateMatches[0], selesai: isoDateMatches[1] };
  }

  return { mulai: "", selesai: "" };
};

const resolveNomorIdentitas = (source = {}) => {
  const scopes = collectScopes(source);
  return pickFirstText(
    scopes.flatMap((item) => [
      item?.nomor_identitas,
      item?.nomorIdentitas,
      item?.nomor_identitas_siswa,
      item?.nomor_identitas_peserta,
      item?.nomor_induk_siswa_nasional,
      item?.nisn_siswa,
      item?.nisn,
      item?.nim,
      item?.nis,
      item?.no_induk,
      item?.no_induk_siswa,
      item?.no_induk_siswa_nasional,
      item?.student_number,
      item?.id_number,
      item?.identitas?.nisn,
      item?.identitas?.nomor_identitas,
      item?.biodata?.nisn,
      item?.biodata?.nomor_identitas,
    ]),
    "N/A"
  );
};

const resolvePhotoList = (source = {}) => {
  const scopes = collectScopes(source);
  for (const item of scopes) {
    if (Array.isArray(item?.foto) && item.foto.length > 0) return item.foto;
  }
  return [];
};

const resolveProfilePhoto = (source = {}) => {
  const scopes = collectScopes(source);
  const fromField = pickFirstText(
    scopes.flatMap((item) => [
      item?.foto_profile?.path,
      item?.foto_profile?.url,
      item?.profile_photo?.path,
      item?.profile_photo?.url,
      item?.profile_image?.path,
      item?.profile_image?.url,
      item?.foto_profil?.path,
      item?.foto_profil?.url,
      item?.avatar,
      item?.image,
      item?.photo,
      item?.profile_picture,
      item?.profilePicture,
      typeof item?.foto === "string" ? item.foto : "",
    ]),
    ""
  );
  if (fromField) return normalizeFileUrl(fromField);

  const photos = resolvePhotoList(source);
  const fromArray = pickFirstText(
    [
      photos.find((item) => item?.type === "profile")?.path,
      photos.find((item) => item?.type === "profil")?.path,
      photos.find((item) => item?.type === "foto_profile")?.path,
      photos.find((item) => item?.type === "avatar")?.path,
      photos[0]?.path,
      photos.find((item) => item?.type === "profile")?.url,
      photos.find((item) => item?.type === "profil")?.url,
      photos.find((item) => item?.type === "foto_profile")?.url,
      photos.find((item) => item?.type === "avatar")?.url,
      photos[0]?.url,
    ],
    ""
  );
  return fromArray ? normalizeFileUrl(fromArray) : DEFAULT_PROFILE;
};

const resolveCoverPhoto = (source = {}) => {
  const photos = resolvePhotoList(source);
  const fromArray = pickFirstText(
    [
      photos.find((item) => item?.type === "profil_cover")?.path,
      photos.find((item) => item?.type === "cover")?.path,
      photos.find((item) => item?.type === "foto_cover")?.path,
      photos.find((item) => item?.type === "profil_cover")?.url,
      photos.find((item) => item?.type === "cover")?.url,
      photos.find((item) => item?.type === "foto_cover")?.url,
    ],
    ""
  );
  if (fromArray) return normalizeFileUrl(fromArray);

  const scopes = collectScopes(source);
  const fromField = pickFirstText(
    scopes.flatMap((item) => [
      item?.cover_image,
      item?.cover,
      item?.profil_cover,
      item?.foto_cover,
    ]),
    ""
  );
  return fromField ? normalizeFileUrl(fromField) : DEFAULT_COVER;
};

const resolveDocumentPath = (source = {}, type) => {
  const scopes = collectScopes(source);
  for (const item of scopes) {
    const docs = Array.isArray(item?.berkas) ? item.berkas : [];
    const match = docs.find((doc) => doc?.type === type);
    if (match?.path) return normalizeFileUrl(match.path);
    if (match?.url) return normalizeFileUrl(match.url);
  }
  return null;
};

const resolveCvDocumentMeta = (source = {}) => {
  const scopes = collectScopes(source);

  for (const item of scopes) {
    const cvField = item?.cv;
    if (cvField && typeof cvField === "object") {
      const rawPath = pickFirstText([cvField?.path, cvField?.url], "");
      if (rawPath) {
        return {
          url: normalizeFileUrl(rawPath),
          tanggal: pickFirstText([cvField?.tanggal, cvField?.created_at, cvField?.updated_at], ""),
        };
      }
    }
    if (typeof cvField === "string" && cvField.trim()) {
      return { url: normalizeFileUrl(cvField), tanggal: "" };
    }
  }

  const fromBerkas = resolveDocumentPath(source, "cv");
  return { url: fromBerkas, tanggal: "" };
};

const resolveSuratPernyataanMeta = (source = {}) => {
  const scopes = collectScopes(source);
  for (const item of scopes) {
    const docs = Array.isArray(item?.berkas) ? item.berkas : [];
    const match = docs.find((doc) => doc?.type === "surat_pernyataan_diri");
    if (!match) continue;

    const rawPath = pickFirstText([match?.path, match?.url], "");
    return {
      url: rawPath ? normalizeFileUrl(rawPath) : null,
      tanggal: pickFirstText([match?.tanggal, match?.created_at, match?.updated_at], ""),
    };
  }

  return {
    url: resolveDocumentPath(source, "surat_pernyataan_diri"),
    tanggal: "",
  };
};

const resolveTanggalLahir = (source = {}) => {
  const scopes = collectScopes(source);
  const rawTanggalLahir = pickFirstText(
    scopes.flatMap((item) => [
      item?.tanggal_lahir,
      item?.tanggalLahir,
      item?.tgl_lahir,
      item?.tglLahir,
      item?.birth_date,
      item?.birthDate,
      item?.date_of_birth,
      item?.dob,
      item?.biodata?.tanggal_lahir,
      item?.identitas?.tanggal_lahir,
    ]),
    ""
  );
  return normalizeDateToIso(rawTanggalLahir);
};

const mapData = (source = {}) => {
  const scopes = collectScopes(source);
  const top = scopes[0] || source;
  const idCandidates = resolveIdCandidates(source);
  const placementFallback = resolvePlacementFallback(source);
  const hasAcceptedPlacement =
    Boolean(placementFallback) ||
    hasAcceptedPlacementFromSource(source) ||
    hasPlacementDataFromDetailSource(source);
  const companyIdentity = resolveCompanyIdentityFromSource(source, placementFallback);
  const waktuMagangRange = resolveWaktuMagangRange(source);
  const resolvedDivision = resolveDivisionName(source);
  const mulaiMagangRaw = pickFirstText(
    scopes.flatMap((item) => [
      item?.mulai_magang,
      item?.tanggal_mulai_magang,
      item?.tanggal_mulai,
      item?.tanggal_awal,
      item?.start_date,
      item?.mulaiMagang,
      item?.tanggalMulai,
    ]),
    waktuMagangRange.mulai || placementFallback?.mulaiMagang || DEFAULT_INTERNSHIP_TEXT
  );
  const selesaiMagangRaw = pickFirstText(
    scopes.flatMap((item) => [
      item?.selesai_magang,
      item?.tanggal_selesai_magang,
      item?.tanggal_selesai,
      item?.tanggal_akhir,
      item?.end_date,
      item?.selesaiMagang,
      item?.tanggalSelesai,
    ]),
    waktuMagangRange.selesai || placementFallback?.selesaiMagang || DEFAULT_INTERNSHIP_TEXT
  );

  const perusahaanFromDirectory = findCompanyNameFromDirectory({
    source,
    companyName: companyIdentity.companyName,
    companyId: companyIdentity.companyId,
  });
  const perusahaanDiterima = pickFirstText(
    [
      ...scopes.map((item) => item?.perusahaan?.nama || item?.perusahaan),
      companyIdentity.companyName,
      perusahaanFromDirectory,
    ],
    placementFallback?.perusahaan || DEFAULT_INTERNSHIP_TEXT
  );

  const divisiDiterima =
    resolvedDivision !== DEFAULT_DIVISION
      ? resolvedDivision
      : placementFallback?.divisi || DEFAULT_DIVISION;

  return {
    id: idCandidates[0] || top?.id || top?.id_peserta || top?.user?.id || null,
    updateIdCandidates: idCandidates,
    nama: pickFirstText([top?.nama, top?.name, top?.user?.nama], "N/A"),
    email: pickFirstText([top?.email, top?.user?.email], "N/A"),
    divisi: hasAcceptedPlacement ? divisiDiterima : DEFAULT_DIVISION,
    alamat: pickFirstText(scopes.map((item) => item?.alamat), "N/A"),
    jenis_kelamin: pickFirstText(scopes.map((item) => item?.jenis_kelamin), "N/A"),
    tempat_lahir: pickFirstText(scopes.map((item) => item?.tempat_lahir), "N/A"),
    telepon: pickFirstText(scopes.map((item) => item?.telepon || item?.no_telp), "N/A"),
    tanggal_lahir: resolveTanggalLahir(source),
    nomor_identitas: resolveNomorIdentitas(source),
    sekolah: pickFirstText(scopes.map((item) => item?.sekolah || item?.asal_sekolah), "N/A"),
    jurusan: pickFirstText(scopes.map((item) => item?.jurusan), "N/A"),
    is_magang_disetujui: hasAcceptedPlacement,
    mulai_magang: hasAcceptedPlacement
      ? formatDateDisplay(mulaiMagangRaw)
      : DEFAULT_INTERNSHIP_TEXT,
    selesai_magang: hasAcceptedPlacement
      ? formatDateDisplay(selesaiMagangRaw)
      : DEFAULT_INTERNSHIP_TEXT,
    perusahaan: hasAcceptedPlacement ? perusahaanDiterima : DEFAULT_INTERNSHIP_TEXT,
    penempatan: hasAcceptedPlacement
      ? pickFirstText(
          [
            findCompanyLocationFromDirectory({
              source,
              companyName: pickFirstText([companyIdentity.companyName, perusahaanDiterima], ""),
              companyId: pickFirstText([companyIdentity.companyId, placementFallback?.companyId], ""),
            }),
            resolvePenempatan(source, placementFallback),
          ],
          DEFAULT_INTERNSHIP_TEXT
        )
      : DEFAULT_INTERNSHIP_TEXT,
    foto: resolvePhotoList(source),
    cover_image: resolveCoverPhoto(source),
  };
};

export const formatNoHP = (no) => {
  if (!no) return "N/A";
  return no.replace(/\D/g, "").match(/.{1,4}/g)?.join("-") || "N/A";
};

export const mapPesertaData = (rawData, lowonganItems = [], companyDirectory = []) => {
  if (!rawData) return null;

  const source = resolveDetailSource(rawData);
  const sourceWithLowongan = withLowonganContext(source, lowonganItems, companyDirectory);
  const mappedData = mapData(sourceWithLowongan);
  const cvMeta = resolveCvDocumentMeta(sourceWithLowongan);
  const suratMeta = resolveSuratPernyataanMeta(sourceWithLowongan);

  return {
    data: mappedData,
    profileImage: resolveProfilePhoto(sourceWithLowongan),
    coverImage: resolveCoverPhoto(sourceWithLowongan),
    cv: cvMeta.url,
    cvTanggal: cvMeta.tanggal,
    suratPernyataan: suratMeta.url,
    suratPernyataanTanggal: suratMeta.tanggal,
  };
};
