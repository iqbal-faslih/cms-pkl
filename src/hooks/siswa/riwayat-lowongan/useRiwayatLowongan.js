import { useState, useEffect, useCallback } from "react";
import { getDashboardSiswa, getRiwayatLowongan } from "../../../helpers/apiClient";
import { extractErrorMessage } from "../../../helpers/extractErrorMessage";
import { toDisplayStatus } from "../../../helpers/siswa/dashboard/riwayatLowonganHelper";

const BASE_URL =
  import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || import.meta.env.VITE_API_URL || "";
const DEFAULT_LOGO = "/assets/img/Cover.png";
const isPlainObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);

const pickPathFromValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (isPlainObject(value)) {
    return value.path || value.url || value.foto || value.logo || value.profil || "";
  }
  return "";
};

const pickPhotoFromCollection = (photos = []) => {
  if (!Array.isArray(photos)) return "";
  const preferred = photos.find((item) => {
    const type = String(item?.type || item?.kategori || "").toLowerCase();
    return ["profile", "profil", "logo", "foto_profile"].includes(type);
  });
  const first = preferred || photos[0];
  return first?.path || first?.url || first?.foto || "";
};

const findFirstValueByKeyPattern = (source, pattern) => {
  if (!isPlainObject(source) && !Array.isArray(source)) return "";
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
        const path = pickPathFromValue(value);
        if (path) return path;
      }
      if (isPlainObject(value) || Array.isArray(value)) queue.push(value);
    }
  }

  return "";
};

const getCompanyName = (item) =>
  item?.nama_perusahaan ||
  item?.perusahaan?.nama_perusahaan ||
  item?.perusahaan?.nama ||
  item?.nama_perusahaan?.nama ||
  item?.nama_perusahaan?.nama_perusahaan ||
  item?.company?.name ||
  "-";

const getCompanyLogoPath = (item, fallbackLogoPath = "") => {
  const magangRaw = item?.magang;
  const magang = Array.isArray(magangRaw)
    ? magangRaw[0] || {}
    : isPlainObject(magangRaw)
      ? magangRaw
      : {};
  const dataMagangRaw = item?.data?.magang;
  const dataMagang = Array.isArray(dataMagangRaw)
    ? dataMagangRaw[0] || {}
    : isPlainObject(dataMagangRaw)
      ? dataMagangRaw
      : {};
  const magangPerusahaanObj = isPlainObject(magang?.perusahaan) ? magang.perusahaan : {};
  const magangNamaPerusahaanObj =
    isPlainObject(magang?.nama_perusahaan) ? magang.nama_perusahaan : {};
  const dataMagangPerusahaanObj = isPlainObject(dataMagang?.perusahaan) ? dataMagang.perusahaan : {};
  const dataMagangNamaPerusahaanObj =
    isPlainObject(dataMagang?.nama_perusahaan) ? dataMagang.nama_perusahaan : {};
  const perusahaanObj = isPlainObject(item?.perusahaan) ? item.perusahaan : {};
  const namaPerusahaanObj = isPlainObject(item?.nama_perusahaan) ? item.nama_perusahaan : {};
  const companyObj = isPlainObject(item?.company) ? item.company : {};

  return (
    pickPathFromValue(magang?.avatar) ||
    pickPathFromValue(magang?.logo) ||
    pickPathFromValue(magang?.logo_perusahaan) ||
    pickPathFromValue(magang?.foto_perusahaan) ||
    pickPathFromValue(magang?.profil) ||
    pickPathFromValue(magang?.foto_profile) ||
    pickPathFromValue(magangPerusahaanObj?.profil) ||
    pickPathFromValue(magangPerusahaanObj?.logo) ||
    pickPathFromValue(magangPerusahaanObj?.foto_profile) ||
    pickPathFromValue(magangNamaPerusahaanObj?.profil) ||
    pickPathFromValue(magangNamaPerusahaanObj?.logo) ||
    pickPhotoFromCollection(magang?.foto) ||
    pickPhotoFromCollection(magangPerusahaanObj?.foto) ||
    pickPhotoFromCollection(magangNamaPerusahaanObj?.foto) ||
    pickPathFromValue(dataMagang?.avatar) ||
    pickPathFromValue(dataMagang?.logo) ||
    pickPathFromValue(dataMagang?.logo_perusahaan) ||
    pickPathFromValue(dataMagang?.foto_perusahaan) ||
    pickPathFromValue(dataMagang?.profil) ||
    pickPathFromValue(dataMagang?.foto_profile) ||
    pickPathFromValue(dataMagangPerusahaanObj?.profil) ||
    pickPathFromValue(dataMagangPerusahaanObj?.logo) ||
    pickPathFromValue(dataMagangPerusahaanObj?.foto_profile) ||
    pickPathFromValue(dataMagangNamaPerusahaanObj?.profil) ||
    pickPathFromValue(dataMagangNamaPerusahaanObj?.logo) ||
    pickPhotoFromCollection(dataMagang?.foto) ||
    pickPhotoFromCollection(dataMagangPerusahaanObj?.foto) ||
    pickPhotoFromCollection(dataMagangNamaPerusahaanObj?.foto) ||
    pickPathFromValue(item?.data?.magang?.logo) ||
    pickPathFromValue(item?.magang?.logo) ||
    pickPathFromValue(fallbackLogoPath) ||
    pickPathFromValue(item?.logo_perusahaan) ||
    pickPathFromValue(item?.foto_perusahaan) ||
    pickPathFromValue(item?.profil) ||
    pickPathFromValue(item?.logo) ||
    pickPathFromValue(perusahaanObj?.profil) ||
    pickPathFromValue(perusahaanObj?.logo) ||
    pickPathFromValue(perusahaanObj?.foto_profile) ||
    pickPathFromValue(namaPerusahaanObj?.profil) ||
    pickPathFromValue(namaPerusahaanObj?.logo) ||
    pickPathFromValue(companyObj?.logo) ||
    pickPathFromValue(companyObj?.profil) ||
    pickPhotoFromCollection(item?.foto) ||
    pickPhotoFromCollection(perusahaanObj?.foto) ||
    pickPhotoFromCollection(namaPerusahaanObj?.foto) ||
    pickPhotoFromCollection(companyObj?.foto) ||
    findFirstValueByKeyPattern(item, /(logo|profil|profile|foto)/i)
  );
};

const getTanggalDaftar = (item) =>
  item?.tanggal_daftar || item?.tgl_daftar || item?.tanggal || item?.created_at;

const getPosisiMagang = (item) =>
  item?.posisi_magang || item?.divisi?.nama || item?.posisi || item?.jabatan || "-";

const getStatusValue = (item) =>
  item?.status || item?.status_lamaran || item?.status_magang || "-";

const getDashboardLogoPath = (responseData) => {
  const actualData = responseData?.data;
  const magangRaw = actualData?.magang;
  const magang = Array.isArray(magangRaw)
    ? magangRaw[0] || {}
    : isPlainObject(magangRaw)
      ? magangRaw
      : {};
  const perusahaanObj = isPlainObject(magang?.perusahaan) ? magang.perusahaan : {};
  const perusahaanNameObj =
    isPlainObject(magang?.nama_perusahaan) ? magang.nama_perusahaan : {};

  return (
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
    pickPhotoFromCollection(magang?.foto) ||
    pickPhotoFromCollection(perusahaanObj?.foto) ||
    pickPhotoFromCollection(perusahaanNameObj?.foto) ||
    ""
  );
};

const extractArrayFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (!responseData || typeof responseData !== "object") return [];

  const preferred = [
    responseData?.data,
    responseData?.data?.data,
    responseData?.data?.items,
    responseData?.data?.rows,
    responseData?.data?.results,
    responseData?.data?.riwayat_lowongan,
    responseData?.data?.riwayatLowongan,
    responseData?.data?.lowongan,
    responseData?.items,
    responseData?.rows,
    responseData?.results,
  ];

  for (const candidate of preferred) {
    if (Array.isArray(candidate)) return candidate;
  }

  const findFirstArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return null;
    for (const key of Object.keys(value)) {
      const found = findFirstArray(value[key]);
      if (found) return found;
    }
    return null;
  };

  return findFirstArray(responseData) || [];
};

const normalizeLogoUrl = (logoPath) => {
  if (!logoPath) return DEFAULT_LOGO;
  const rawPath = String(logoPath).trim();
  if (!rawPath) return DEFAULT_LOGO;
  if (/^(https?:\/\/|data:|blob:)/i.test(rawPath)) return rawPath;

  const cleanBase = String(BASE_URL || "").trim().replace(/\/+$/, "");
  if (!cleanBase) return rawPath;
  const baseEndsWithStorage = /\/storage$/i.test(cleanBase);

  if (rawPath.startsWith("/storage/")) {
    if (baseEndsWithStorage) {
      return `${cleanBase}/${rawPath.replace(/^\/storage\/+/, "")}`;
    }
    return `${cleanBase}${rawPath}`;
  }

  const cleanPath = rawPath.replace(/^\/+/, "");
  if (baseEndsWithStorage) {
    return `${cleanBase}/${cleanPath.replace(/^storage\/+/, "")}`;
  }
  return `${cleanBase}/storage/${cleanPath.replace(/^storage\/+/, "")}`;
};

const mapRiwayatItem = (item, fallbackLogoPath = "") => {
  const rawStatus = getStatusValue(item);

  return {
    ...item,
    nama_perusahaan: getCompanyName(item),
    logo_perusahaan: normalizeLogoUrl(getCompanyLogoPath(item, fallbackLogoPath)),
    tanggal_daftar: getTanggalDaftar(item),
    posisi_magang: getPosisiMagang(item),
    status: toDisplayStatus(rawStatus),
    status_raw: rawStatus,
  };
};

export const useRiwayatLowongan = () => {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(null);

  const fetchLowongan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setEmptyMessage(null);

    try {
      const [riwayatRes, dashboardRes] = await Promise.allSettled([
        getRiwayatLowongan(),
        getDashboardSiswa(),
      ]);

      if (riwayatRes.status !== "fulfilled") {
        throw riwayatRes.reason;
      }

      const res = riwayatRes.value;
      const data = extractArrayFromResponse(res?.data);
      const dashboardLogo =
        dashboardRes.status === "fulfilled" ? getDashboardLogoPath(dashboardRes.value?.data) : "";
      const responseFallbackLogo =
        pickPathFromValue(res?.data?.data?.magang?.logo) ||
        pickPathFromValue(res?.data?.magang?.logo) ||
        dashboardLogo ||
        "";

      if (data.length === 0 && typeof res?.data?.data === "boolean") {
        const metaMessage =
          res?.data?.meta?.message ||
          res?.data?.message ||
          "Data riwayat belum tersedia dari backend.";
        setEmptyMessage(metaMessage);
      }

      setLowongan(data.map((item) => mapRiwayatItem(item, responseFallbackLogo)));
    } catch (err) {
      console.error("riwayat lowongan error:", err);
      setError(extractErrorMessage(err) || "Gagal mengambil data lowongan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLowongan();
  }, [fetchLowongan]);

  return { lowongan, loading, error, emptyMessage, refetch: fetchLowongan };
};
