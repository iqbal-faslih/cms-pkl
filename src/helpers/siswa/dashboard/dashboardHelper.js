import { getDashboardSiswa, getPesertaDetail } from "../../apiClient";
import { MONTH_NAMES } from "../../dateConstant";

const FILE_BASE_URL =
  import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || import.meta.env.VITE_API_URL || "";

const isPlainObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);

const pickFirstText = (values = [], fallback = "") => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
};

const pickPathFromValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (isPlainObject(value)) {
    return value.path || value.url || value.foto || value.logo || value.profil || "";
  }
  return "";
};

const findFirstValueByKeyPattern = (source, pattern) => {
  if (!isPlainObject(source) && !Array.isArray(source)) return undefined;
  const queue = [source];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      current.forEach((item) => {
        if (isPlainObject(item) || Array.isArray(item)) queue.push(item);
      });
      continue;
    }

    for (const [key, value] of Object.entries(current)) {
      if (pattern.test(String(key))) {
        if (typeof value === "string" && value.trim()) return value.trim();
        if (typeof value === "number") return String(value);
        if (isPlainObject(value)) {
          const nestedPath = pickPathFromValue(value);
          if (nestedPath) return nestedPath;
        }
      }
      if (isPlainObject(value) || Array.isArray(value)) queue.push(value);
    }
  }

  return undefined;
};

const normalizeFileUrl = (path) => {
  const rawPath = String(pickPathFromValue(path) || "").trim();
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

const pickPhotoFromCollection = (photos = []) => {
  if (!Array.isArray(photos)) return "";
  const preferred = photos.find((item) => {
    const type = String(item?.type || item?.kategori || "").toLowerCase();
    return ["profile", "profil", "logo"].includes(type);
  });
  const first = preferred || photos[0];
  return first?.path || first?.url || first?.foto || "";
};

const resolveSistemMagang = (actualData = {}, magang = {}, pesertaDetailData = {}) => {
  const rawValue = pickFirstText(
    [
      pesertaDetailData?.sistem_magang,
      pesertaDetailData?.data?.sistem_magang,
      magang?.sistem_magang,
      magang?.internship_system,
      actualData?.sistem_magang,
      actualData?.internship_system,
      findFirstValueByKeyPattern(actualData, /(sistem.*magang|internship.*system)/i),
    ],
    ""
  );

  const normalized = String(rawValue || "").trim().toLowerCase();
  if (normalized === "online") return "Online";
  if (normalized === "offline") return "Offline";
  return "-";
};

const resolveDashboardDivision = (actualData = {}, magang = {}, pesertaDetailData = {}) => {
  const divisiObj = magang?.divisi && typeof magang.divisi === "object" ? magang.divisi : {};
  const pesertaDetailSource =
    (pesertaDetailData?.detail_peserta && typeof pesertaDetailData.detail_peserta === "object"
      ? pesertaDetailData.detail_peserta
      : null) ||
    (pesertaDetailData?.peserta && typeof pesertaDetailData.peserta === "object"
      ? pesertaDetailData.peserta
      : null) ||
    (pesertaDetailData?.data?.detail_peserta &&
    typeof pesertaDetailData.data.detail_peserta === "object"
      ? pesertaDetailData.data.detail_peserta
      : null) ||
    (pesertaDetailData?.data && typeof pesertaDetailData.data === "object"
      ? pesertaDetailData.data
      : null) ||
    pesertaDetailData;
  const pesertaDetailDivisiObj =
    pesertaDetailSource?.divisi && typeof pesertaDetailSource.divisi === "object"
      ? pesertaDetailSource.divisi
      : {};

  return pickFirstText(
    [
      pesertaDetailDivisiObj?.nama,
      pesertaDetailDivisiObj?.name,
      typeof pesertaDetailSource?.divisi === "string" ? pesertaDetailSource.divisi : "",
      pesertaDetailSource?.nama_divisi,
      pesertaDetailSource?.divisi_name,
      pesertaDetailSource?.division_name,
      pesertaDetailSource?.route?.divisi,
      pesertaDetailSource?.posisi_magang,
      pesertaDetailSource?.posisi,
      pesertaDetailSource?.jabatan,
      actualData?.divisi?.nama,
      actualData?.divisi?.name,
      actualData?.nama_divisi,
      actualData?.divisi_name,
      actualData?.division_name,
      typeof magang?.divisi === "string" ? magang.divisi : "",
      divisiObj?.nama,
      divisiObj?.name,
      magang?.nama_divisi,
      magang?.divisi_name,
      magang?.division_name,
      magang?.posisi_magang,
      magang?.posisi,
      magang?.jabatan,
    ],
    "-"
  );
};

const resolveMagangInfo = (actualData = {}, pesertaDetailData = {}) => {
  const magangRaw = actualData?.magang;
  const magang = Array.isArray(magangRaw) ? magangRaw[0] || {} : isPlainObject(magangRaw) ? magangRaw : {};
  const perusahaanObj = magang?.perusahaan && typeof magang.perusahaan === "object" ? magang.perusahaan : {};
  const perusahaanNameObj =
    magang?.nama_perusahaan && typeof magang.nama_perusahaan === "object" ? magang.nama_perusahaan : {};

  const perusahaan = pickFirstText(
    [
      typeof magang?.perusahaan === "string" ? magang.perusahaan : "",
      typeof magang?.nama_perusahaan === "string" ? magang.nama_perusahaan : "",
      magang?.company_name,
      perusahaanObj?.nama_perusahaan,
      perusahaanObj?.nama,
      perusahaanNameObj?.nama_perusahaan,
      perusahaanNameObj?.nama,
      actualData?.perusahaan?.nama_perusahaan,
      actualData?.perusahaan?.nama,
      actualData?.nama_perusahaan,
      actualData?.company_name,
      findFirstValueByKeyPattern(actualData, /(nama.*perusahaan|company.*name|perusahaan)/i),
    ],
    "-"
  );

  const divisi = resolveDashboardDivision(actualData, magang, pesertaDetailData);

  const fotoPathFromArray =
    pickPhotoFromCollection(magang?.foto) ||
    pickPhotoFromCollection(perusahaanObj?.foto) ||
    pickPhotoFromCollection(perusahaanNameObj?.foto) ||
    pickPhotoFromCollection(actualData?.perusahaan?.foto);

  const logoPath =
    pickPathFromValue(magang?.avatar) ||
    pickPathFromValue(magang?.logo) ||
    pickPathFromValue(magang?.logo_perusahaan) ||
    pickPathFromValue(magang?.foto_perusahaan) ||
    pickPathFromValue(magang?.profil) ||
    pickPathFromValue(magang?.foto_profile) ||
    pickPathFromValue(perusahaanObj?.profil) ||
    pickPathFromValue(perusahaanObj?.logo) ||
    pickPathFromValue(perusahaanObj?.foto_profile) ||
    pickPathFromValue(perusahaanNameObj?.profil) ||
    pickPathFromValue(perusahaanNameObj?.logo) ||
    pickPathFromValue(actualData?.perusahaan?.profil) ||
    pickPathFromValue(actualData?.perusahaan?.logo) ||
    pickPathFromValue(actualData?.perusahaan?.foto_profile) ||
    pickPathFromValue(actualData?.logo_perusahaan) ||
    pickPathFromValue(actualData?.foto_perusahaan) ||
    pickPathFromValue(findFirstValueByKeyPattern(actualData, /(logo|profil|profile|foto)/i)) ||
    fotoPathFromArray ||
    "";
  const sistemMagang = resolveSistemMagang(actualData, magang, pesertaDetailData);

  return {
    perusahaan: String(perusahaan || "-"),
    divisi: String(divisi || "-"),
    sistemMagang,
    logo: normalizeFileUrl(logoPath),
  };
};

export const fetchDashboardData = async () => {
  try {
    const [dashboardResponse, pesertaDetailResponse] = await Promise.allSettled([
      getDashboardSiswa(),
      getPesertaDetail(),
    ]);

    if (dashboardResponse.status !== "fulfilled") {
      throw dashboardResponse.reason;
    }

    console.log("📡 Raw API Response:", dashboardResponse.value);

    const apiResponse = dashboardResponse.value.data;
    const actualData = apiResponse.data;
    const pesertaDetailData =
      pesertaDetailResponse.status === "fulfilled"
        ? pesertaDetailResponse.value?.data?.data || {}
        : {};

    console.log("📊 API Response:", apiResponse);
    console.log("📊 Actual Data:", actualData);
    const magangInfo = resolveMagangInfo(actualData, pesertaDetailData);

    const mappedData = {
      kehadiran: actualData?.kehadiran ?? null,
      magang: magangInfo,
      route: Array.isArray(actualData?.route)
        ? actualData.route.map((r) => ({
            id: r.id_route,
            kategori: r.nama_kategori_proyek,
            mulai: r.mulai,
            selesai: r.selesai,
          }))
        : [],
      jurnal: Array.isArray(actualData?.jurnal)
        ? actualData.jurnal.map((j) => ({
            bulan: j.bulan,
            jurnal_terisi: j.jurnal_terisi,
            jurnal_tidak_terisi: j.jurnal_tidak_terisi,
          }))
        : [],
      statsData: [
        {
          title: "Total Hadir",
          value: actualData?.kehadiran?.total_hadir || 0,
          icon: "/assets/icons/absensi/book.png",
          color: "#BF83FF",
          bgColor: "bg-[#F3E8FF]",
        },
        {
          title: "Total Izin",
          value: actualData?.kehadiran?.total_izin || 0,
          icon: "/assets/icons/absensi/graduate.png",
          color: "#3CD856",
          bgColor: "bg-[#DCFCE7]",
        },
        {
          title: "Total Terlambat",
          value: actualData?.kehadiran?.total_terlambat || 0,
          icon: "/assets/icons/absensi/mens.png",
          color: "#FF947A",
          bgColor: "bg-[#FFF4DE]",
        },
        {
          title: "Total Alpha",
          value: actualData?.kehadiran?.total_alpha || 0,
          icon: "/assets/icons/absensi/certificateLogo.png",
          color: "#FA5A7D",
          bgColor: "bg-[#FFE2E5]",
        },
      ],
    };

    console.log("✅ Mapped Data:", mappedData);
    return mappedData;
  } catch (error) {
    console.error("❌ Error di fetchDashboardData:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    throw error;
  }
};

export const calculateRouteProgress = (startDate, endDate) => {
  if (!startDate) return 0;

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const now = new Date();

  if (now < start) return 0;
  if (endDate && now > end) return 100;

  const estimatedEnd = endDate
    ? end
    : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
  const totalDuration = estimatedEnd - start;
  const elapsed = now - start;

  return Math.min(Math.round((elapsed / totalDuration) * 100), 100);
};

export const processJurnalData = (apiData) => {
  if (!apiData || apiData.length === 0) {
    return {
      categories: [],
      mengisi: [{ name: "Mengisi Jurnal", data: [] }],
      tidakMengisi: [{ name: "Tidak Mengisi Jurnal", data: [] }],
    };
  }

  const sortedData = apiData.sort((a, b) => a.bulan - b.bulan);

  return {
    categories: sortedData.map((item) => MONTH_NAMES[item.bulan - 1]),
    mengisi: [
      {
        name: "Mengisi Jurnal",
        data: sortedData.map((item) => item.jurnal_terisi),
      },
    ],
    tidakMengisi: [
      {
        name: "Tidak Mengisi Jurnal",
        data: sortedData.map((item) => item.jurnal_tidak_terisi),
      },
    ],
  };
};
