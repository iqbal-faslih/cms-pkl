const FALLBACK = "-";

const isMeaningful = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value !== "string") return true;
  const normalized = value.trim();
  return normalized.length > 0 && normalized !== "-";
};

const normalizeText = (value, fallback = FALLBACK) =>
  isMeaningful(value) ? String(value).trim() : fallback;

const toTitleCase = (value) => {
  const raw = normalizeText(value, "");
  if (!raw) return "";
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const MONTH_INDEX = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  agu: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

const parseDate = (value) => {
  if (!isMeaningful(value)) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  const raw = String(value).trim();
  if (!raw) return null;

  const direct = new Date(raw);
  if (!Number.isNaN(direct.getTime())) return direct;

  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s.*)?$/);
  if (isoMatch) {
    const parsedIso = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
    if (!Number.isNaN(parsedIso.getTime())) return parsedIso;
  }

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const parsedSlash = new Date(
      Number(slashMatch[3]),
      Number(slashMatch[2]) - 1,
      Number(slashMatch[1])
    );
    if (!Number.isNaN(parsedSlash.getTime())) return parsedSlash;
  }

  const indoMatch = raw.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/i);
  if (indoMatch) {
    const monthIndex = MONTH_INDEX[String(indoMatch[2]).toLowerCase()];
    if (monthIndex !== undefined) {
      const parsedIndo = new Date(Number(indoMatch[3]), monthIndex, Number(indoMatch[1]));
      if (!Number.isNaN(parsedIndo.getTime())) return parsedIndo;
    }
  }

  return null;
};

const formatDateId = (value) => {
  const parsed = parseDate(value);
  if (!parsed) return "";
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateSlash = (value) => {
  const parsed = parseDate(value);
  if (!parsed) return "";
  const dd = String(parsed.getDate()).padStart(2, "0");
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const yyyy = parsed.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const resolveTempatTanggalLahir = (detail) => {
  const raw = normalizeText(detail?.ttl, "");
  if (!raw) return FALLBACK;

  if (raw.includes(",")) {
    const [placeRaw, ...rest] = raw.split(",");
    const place = normalizeText(placeRaw, "");
    const datePart = normalizeText(rest.join(",").trim(), "");
    const dateLabel = formatDateId(datePart);
    if (place && dateLabel) return `${place}, ${dateLabel}`;
    return place || dateLabel || raw;
  }

  const onlyDate = formatDateId(raw);
  return onlyDate || raw;
};

const resolveDurasiMagang = (detail) => {
  const directDuration = normalizeText(detail?.durasiMagang, "");
  if (isMeaningful(directDuration)) {
    const [startRaw = "", endRaw = ""] = String(directDuration)
      .replace(/\s+s\/d\s+/gi, " - ")
      .split(" - ")
      .map((item) => item.trim());

    const start = formatDateSlash(startRaw);
    const end = formatDateSlash(endRaw);
    if (start && end) return `${start} s/d ${end}`;
  }

  const raw = detail?.raw || {};
  const startDate =
    raw.tanggal_mulai_magang || raw.tanggal_mulai || raw.mulai_magang || raw.start_date;
  const endDate =
    raw.tanggal_selesai_magang || raw.tanggal_selesai || raw.selesai_magang || raw.end_date;

  const startLabel = formatDateSlash(startDate);
  const endLabel = formatDateSlash(endDate);

  if (startLabel && endLabel) return `${startLabel} s/d ${endLabel}`;
  return startLabel || endLabel || FALLBACK;
};

const resolveNomorIdentitas = (detail) => {
  const raw = detail?.raw || {};
  return normalizeText(
    detail?.nomorIdentitas ||
      raw?.nomor_identitas ||
      raw?.nomorIdentitas ||
      raw?.nisn ||
      raw?.nis ||
      raw?.no_induk ||
      raw?.no_induk_siswa ||
      raw?.nomor_siswa ||
      raw?.student_number,
    FALLBACK
  );
};

export const buildDetailPesertaProfileView = (detail = {}) => {
  const sekolah = normalizeText(detail.sekolah);
  const nomorIdentitas = resolveNomorIdentitas(detail);
  const durasiMagang = resolveDurasiMagang(detail);

  const fields = [
    { key: "nisn", label: "NISN", value: nomorIdentitas },
    { key: "email", label: "Email", value: normalizeText(detail.email) },
    { key: "perusahaan", label: "Perusahaan", value: normalizeText(detail.perusahaan) },
    { key: "mentor", label: "Mentor", value: normalizeText(detail.mentor) },
    { key: "ttl", label: "Tempat Tanggal Lahir", value: resolveTempatTanggalLahir(detail) },
    { key: "durasi", label: "Durasi Magang", value: durasiMagang },
    { key: "penempatan", label: "Penempatan", value: normalizeText(detail.penempatan) },
  ];

  return {
    name: normalizeText(detail.nama),
    role: normalizeText(toTitleCase(detail.divisi) || detail.role),
    school: sekolah,
    identifier: nomorIdentitas,
    profileImage: normalizeText(detail.image, ""),
    fields,
  };
};
