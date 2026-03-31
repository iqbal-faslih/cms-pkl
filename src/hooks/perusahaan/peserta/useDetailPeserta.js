import { useFetch } from "@/shared/hooks/requests/useFetch";

const FILE_BASE_URL =
  import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || import.meta.env.VITE_API_URL || "";

const isMeaningful = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return true;
  if (typeof value !== "string") return false;
  const text = value.trim();
  return text.length > 0 && text !== "-";
};

const pickFirstText = (values = [], fallback = "-") => {
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

const collectSourceScopes = (source = {}) => {
  const scopes = [
    source,
    source?.user,
    source?.peserta,
    source?.detail_peserta,
    source?.detailPeserta,
    source?.data,
    source?.magang,
    source?.profile,
    source?.siswa,
  ];

  return scopes.filter((item) => item && typeof item === "object" && !Array.isArray(item));
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

      if (typeof value === "string" && isMeaningful(value)) return value.trim();
      if (typeof value === "number") return String(value);
      if (value && typeof value === "object") {
        const nestedLabel = pickFirstText(
          [value?.nama, value?.name, value?.label, value?.title, value?.value],
          ""
        );
        if (isMeaningful(nestedLabel)) return nestedLabel;
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

const resolveFotoArrayPath = (source = {}) => {
  const photos = Array.isArray(source?.foto) ? source.foto : [];
  const preferredPhoto = pickFirstTruthy([
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
  ]);

  return typeof preferredPhoto === "string" ? preferredPhoto.trim() : "";
};

const resolveDivision = (source = {}) => {
  const scopes = collectSourceScopes(source);
  const candidates = scopes.flatMap((item) => [
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
  ]);

  const directValue = pickFirstText(candidates, "");
  if (isMeaningful(directValue)) return directValue;

  const deepValue = findFirstValueByKeyPattern(source, /(divisi|division)/i);
  return pickFirstText([deepValue], "-");
};

const resolveNomorIdentitas = (source = {}) => {
  const scopes = collectSourceScopes(source);
  const candidates = scopes.flatMap((item) => [
    item?.nomor_identitas,
    item?.nomorIdentitas,
    item?.nomor_identitas_siswa,
    item?.nomor_identitas_peserta,
    item?.nomor_induk_siswa_nasional,
    item?.nisn_siswa,
    item?.nisn,
    item?.nis,
    item?.no_induk,
    item?.no_induk_siswa_nasional,
    item?.no_induk_siswa,
    item?.nomor_siswa,
    item?.id_number,
    item?.student_number,
    item?.identitas?.nisn,
    item?.identitas?.nomor_identitas,
    item?.biodata?.nisn,
    item?.biodata?.nomor_identitas,
  ]);

  const directValue = pickFirstText(candidates, "");
  if (isMeaningful(directValue)) return directValue;

  const deepValue = findFirstValueByKeyPattern(
    source,
    /(nisn|nomor[_\s-]*identitas|induk[_\s-]*siswa|student[_\s-]*number)/i
  );
  return pickFirstText([deepValue], "-");
};

const resolveImageUrl = (source = {}) => {
  const scopes = collectSourceScopes(source);
  const rawImage = pickFirstTruthy(
    scopes.flatMap((item) => [
      resolveFotoArrayPath(item),
      item?.foto_profile?.path,
      item?.foto_profile?.url,
      item?.profile_photo?.path,
      item?.profile_photo?.url,
      item?.profile_image?.path,
      item?.profile_image?.url,
      item?.foto_profil?.path,
      item?.foto_profil?.url,
      item?.foto,
      item?.photo,
      item?.image,
      item?.avatar,
      item?.profile_picture,
      item?.profilePicture,
    ])
  );

  if (!rawImage || !isMeaningful(String(rawImage))) return "";

  const imageValue = String(rawImage).trim();
  if (!imageValue) return "";
  return normalizeFileUrl(imageValue);
};

const extractDetailSource = (payload = {}) =>
  pickFirstObject([
    payload?.detail_peserta,
    payload?.detailPeserta,
    payload?.peserta_detail,
    payload?.peserta,
    payload?.data?.detail_peserta,
    payload?.data?.detailPeserta,
    payload?.data?.peserta_detail,
    payload?.data?.peserta,
    payload,
  ]);

const extractRiwayatJurnal = (payload = {}) => {
  const candidates = [
    payload?.riwayat_pengisian_jurnal?.data,
    payload?.riwayat_pengisian_jurnal,
    payload?.riwayatJurnal?.data,
    payload?.riwayatJurnal,
    payload?.data?.riwayat_pengisian_jurnal?.data,
    payload?.data?.riwayat_pengisian_jurnal,
    payload?.data?.riwayatJurnal?.data,
    payload?.data?.riwayatJurnal,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

const normalizeDateLabel = (value) => {
  if (!isMeaningful(value)) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const resolveTempatTanggalLahir = (dp = {}) => {
  const tempat = pickFirstText([dp?.tempat_lahir, dp?.tempatLahir], "");
  const tanggalRaw = pickFirstText([dp?.tanggal_lahir, dp?.tanggalLahir], "");
  const tanggal = normalizeDateLabel(tanggalRaw);

  if (tempat && tanggal && tanggal !== "-") return `${tempat}, ${tanggal}`;
  if (tempat) return tempat;
  if (tanggal && tanggal !== "-") return tanggal;
  return "-";
};

const resolvePenempatan = (dp = {}, source = {}) => {
  const perusahaanObj =
    (dp?.perusahaan && typeof dp.perusahaan === "object" ? dp.perusahaan : null) ||
    (source?.perusahaan && typeof source.perusahaan === "object" ? source.perusahaan : null) ||
    (source?.data?.perusahaan && typeof source.data.perusahaan === "object" ? source.data.perusahaan : null);

  const directPenempatan = pickFirstText(
    [dp?.penempatan, source?.penempatan, source?.detail_peserta?.penempatan, source?.detailPeserta?.penempatan],
    ""
  );
  if (directPenempatan) return directPenempatan;

  const provinsi = pickFirstText(
    [dp?.provinsi, perusahaanObj?.provinsi, source?.provinsi, source?.data?.provinsi],
    ""
  );
  const kotaKab = pickFirstText(
    [
      dp?.kota,
      dp?.kabupaten,
      perusahaanObj?.kota,
      perusahaanObj?.kabupaten,
      source?.kota,
      source?.kabupaten,
      source?.data?.kota,
      source?.data?.kabupaten,
    ],
    ""
  );

  if (provinsi && kotaKab) return `${provinsi}, ${kotaKab}`;
  return provinsi || kotaKab || "-";
};

const mapStatistikJurnal = (items = []) => {
  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    Mei: 4,
    Jun: 5,
    Jul: 6,
    Agu: 7,
    Sep: 8,
    Okt: 9,
    Nov: 10,
    Des: 11,
  };

  const grouped = {};

  items.forEach((item) => {
    const year = Number(item?.tahun);
    const monthIdx = monthMap[String(item?.bulan || "").trim()];
    if (!Number.isFinite(year) || monthIdx === undefined) return;

    if (!grouped[year]) {
      grouped[year] = {
        mengisi: Array(12).fill(0),
        tidakMengisi: Array(12).fill(0),
      };
    }

    grouped[year].mengisi[monthIdx] = Number(item?.mengisi_jurnal || 0);
    grouped[year].tidakMengisi[monthIdx] = Number(item?.tidak_mengisi_jurnal || 0);
  });

  return grouped;
};

const mapRiwayatJurnalRows = (items = []) =>
  items.map((item, index) => ({
    id: item?.id || index + 1,
    tgl: item?.tgl || item?.tanggal || item?.created_at || "",
    judul: item?.judul || item?.title || item?.nama_kegiatan || "-",
    bukti: normalizeFileUrl(
      item?.bukti?.path || item?.bukti?.url || item?.bukti || item?.gambar?.path || item?.gambar?.url || item?.gambar || ""
    ),
    desc: item?.desc || item?.deskripsi || item?.keterangan || "-",
    raw: item,
  }));

const mapApiToDetail = (data) => {
  if (!data || typeof data !== "object") return {};

  const dp = extractDetailSource(data);
  if (!dp || Object.keys(dp).length === 0) return {};

  return {
    nama: pickFirstText([dp.name, dp.nama], "-"),
    role: pickFirstText([dp.role, dp.posisi, dp.jabatan, dp.jurusan], "-"),
    divisi: resolveDivision(dp),
    sekolah: pickFirstText([dp.sekolah, dp.asal_sekolah, dp.school], "-"),
    nomorIdentitas: resolveNomorIdentitas(dp),
    email: pickFirstText([dp.email, dp.user?.email], "-"),
    perusahaan: pickFirstText(
      [dp.perusahaan, dp.perusahaan?.nama, dp.company, dp.company?.name],
      "-"
    ),
    cabang: pickFirstText([dp.cabang, dp.cabang?.nama, dp.branch, dp.branch?.nama], "-"),
    penempatan: resolvePenempatan(dp, data),
    mentor: pickFirstText(
      [dp.mentor, dp.mentor_name, dp.mentor?.nama, dp.mentor?.name, dp.nama_mentor],
      "-"
    ),
    ttl: pickFirstText([dp.ttl, dp.tempat_tanggal_lahir, resolveTempatTanggalLahir(dp)], "-"),
    rfid: pickFirstText([dp.rfid, dp.rfid_code], "-"),
    durasiMagang: pickFirstText([dp.waktu_magang, dp.durasi_magang, dp.internship_period], "-"),
    sistemMagang: pickFirstText([dp.sistem_magang, dp.sistem], "-"),
    image: resolveImageUrl(dp),
    totalAbsensi: dp.total_absensi || 0,
    totalHadir: dp.total_hadir || 0,
    totalIzinSakit: dp["total_izin/sakit"] || 0,
    totalAlpa: dp.total_alpa || 0,
    statusSuratPeringatan: pickFirstText([dp.status_surat_peringatan], ""),
    punishment: Array.isArray(dp.punishment)
      ? dp.punishment
      : Array.isArray(dp.surat_peringatan)
      ? dp.surat_peringatan
      : [],
    routeProject: Array.isArray(dp.route_project)
      ? dp.route_project
      : Array.isArray(dp.route)
      ? dp.route
      : [],
    hasSp:
      Boolean(dp.status_surat_peringatan) ||
      (Array.isArray(dp.surat_peringatan) && dp.surat_peringatan.length > 0),
    statusSpLabel:
      pickFirstText(
        [dp.status_surat_peringatan, dp.surat_peringatan?.[0]?.level, dp.surat_peringatan?.[0]?.status],
        ""
      ) || "",
    statusSpDescription:
      pickFirstText([dp.surat_peringatan?.[0]?.deskripsi, dp.surat_peringatan?.[0]?.description], ""),
    tanggalMulaiMagang: pickFirstText([dp.tanggal_mulai_magang, dp.tanggal_mulai, dp.start_date], ""),
    tanggalSelesaiMagang: pickFirstText(
      [dp.tanggal_selesai_magang, dp.tanggal_selesai, dp.tanggal_berakhir_magang, dp.end_date],
      ""
    ),
    waktuMagangLabel: pickFirstText([dp.waktu_magang], ""),
    createdAtLabel: normalizeDateLabel(dp.created_at),
    jurnalStatsByYear: mapStatistikJurnal(
      Array.isArray(dp.statistik_jurnal) ? dp.statistik_jurnal : []
    ),
    raw: dp,
  };
};


export const usePesertaDetail = (pesertaId) => {
  const { data, loading, error, refetch } = useFetch(
    `/peserta/detail/${pesertaId}`
  );

  const payload = data?.data || data || {};
  const detail = mapApiToDetail(payload);
  const riwayatJurnal = mapRiwayatJurnalRows(extractRiwayatJurnal(payload));
  const hasDetailData = Boolean(detail?.raw && Object.keys(detail.raw).length > 0);
  const isInitialLoading = loading || (!error && data === null);

  return {
    detail,
    hasDetailData,
    isInitialLoading,
    riwayatJurnal,
    loading,
    error,
    refetch,
  };
};
