import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../helpers/apiClient";
import { stripHtml } from "../shared/helpers/stripHtml";

const PROFILE_ENDPOINTS = ["/perusahaan/profile"];

const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const resolveFirstObject = (value) => {
  if (Array.isArray(value)) return value[0] || {};
  if (Array.isArray(value?.data)) return resolveFirstObject(value.data);
  if (isObject(value?.data)) return resolveFirstObject(value.data);
  if (isObject(value)) return value;
  return {};
};

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const resolveFotoPath = (foto = [], types = []) => {
  if (!Array.isArray(foto)) return "";
  const match = foto.find((item) => types.includes(item?.type));
  return match?.path || "";
};

const rewriteLocalFileHost = (value) => {
  if (typeof value !== "string" || !value.trim()) return value;
  if (!/^https?:\/\//i.test(value)) return value;

  try {
    const parsed = new URL(value);
    const isLocalBackendHost =
      parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost";
    if (!isLocalBackendHost) return value;

    const fileBase = import.meta.env.VITE_FILE_URL || import.meta.env.VITE_API_URL_FILE || "";
    if (!fileBase) return value;

    const normalizedPath = parsed.pathname.replace(/^\/+/, "");
    return `${String(fileBase).replace(/\/+$/, "")}/${normalizedPath}`;
  } catch {
    return value;
  }
};

const resolveMediaValue = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return rewriteLocalFileHost(value);
    }
    if (Array.isArray(value)) {
      const fromArray = value.find((item) => typeof item === "string" && item.trim() !== "");
      if (fromArray) return fromArray;
      const withPath = value.find((item) => isObject(item) && typeof item?.path === "string");
      if (withPath?.path) return withPath.path;
    }
    if (isObject(value)) {
      const objectCandidate =
        value?.path ||
        value?.url ||
        value?.avatar ||
        value?.profil ||
        value?.logo ||
        value?.foto ||
        "";
      if (typeof objectCandidate === "string" && objectCandidate.trim() !== "") {
        return rewriteLocalFileHost(objectCandidate);
      }
    }
  }
  return "";
};

const normalizePerusahaanData = (rawPayload) => {
  const raw = resolveFirstObject(rawPayload);
  const namaPerusahaanObj = isObject(raw?.nama_perusahaan)
    ? raw.nama_perusahaan
    : null;
  const perusahaanObj = isObject(raw?.perusahaan) ? raw.perusahaan : null;
  const userObj = isObject(raw?.user) ? raw.user : null;
  const source = namaPerusahaanObj || perusahaanObj || raw;
  const foto = source?.foto || raw?.foto || raw?.nama_perusahaan?.foto || userObj?.foto || [];

  const nama = pickFirst(
    source?.nama,
    raw?.nama,
    source?.nama_perusahaan,
    raw?.nama_perusahaan,
    userObj?.nama
  );
  const emailPerusahaan = pickFirst(
    raw?.email_perusahaan,
    raw?.email,
    raw?.nama_perusahaan?.email_perusahaan,
    raw?.nama_perusahaan?.email,
    source?.email_perusahaan,
    source?.email,
    userObj?.email
  );
  const legalitas = pickFirst(
    source?.legalitas_perusahaan,
    source?.legalitas,
    raw?.legalitas_perusahaan,
    raw?.legalitas
  );
  const npwp = pickFirst(
    source?.npwp_perusahaan,
    source?.npwp,
    raw?.npwp_perusahaan,
    raw?.npwp
  );
  const profilBg = resolveMediaValue(
    source?.profil_background,
    source?.profil_bg,
    raw?.profil_background,
    raw?.profil_bg,
    userObj?.profil_background,
    userObj?.cover,
    userObj?.background,
    resolveFotoPath(foto, ["profil_background", "profil_cover", "cover"])
  );
  const logo = resolveMediaValue(
    source?.avatar,
    source?.logo,
    source?.profil,
    raw?.avatar,
    raw?.logo,
    raw?.profil,
    userObj?.logo,
    userObj?.avatar,
    userObj?.foto,
    userObj?.foto_profile,
    userObj?.profile_photo,
    resolveFotoPath(foto, ["logo", "profile", "profil"])
  );

  return {
    ...source,
    deskripsi: stripHtml(source?.deskripsi || raw?.deskripsi || ""),
    nama: nama || "",
    email: emailPerusahaan || "",
    email_perusahaan: emailPerusahaan || "",
    legalitas: legalitas || "",
    npwp: npwp || "",
    profil_bg: profilBg || "",
    legalitas_perusahaan: legalitas || "",
    npwp_perusahaan: npwp || "",
    profil_background: profilBg || "",
    avatar: logo || "",
    logo: logo || "",
    profil: logo || "",
    nama_penanggung_jawab: pickFirst(
      source?.nama_penanggung_jawab,
      raw?.nama_penanggung_jawab
    ) || "",
    nomor_penanggung_jawab: pickFirst(
      source?.nomor_penanggung_jawab,
      source?.nomor_hp_penanggung_jawab,
      source?.hp_penanggung_jawab,
      raw?.nomor_penanggung_jawab,
      userObj?.telepon,
      userObj?.nomor_hp
    ) || "",
    jabatan_penanggung_jawab: pickFirst(
      source?.jabatan_penanggung_jawab,
      raw?.jabatan_penanggung_jawab
    ) || "",
    email_penanggung_jawab: pickFirst(
      source?.email_penanggung_jawab,
      raw?.email_penanggung_jawab
    ) || "",
    tanggal_berdiri: pickFirst(source?.tanggal_berdiri, raw?.tanggal_berdiri) || "",
    alamat: pickFirst(source?.alamat, raw?.alamat) || "",
    provinsi: pickFirst(source?.provinsi, raw?.provinsi) || "",
    kota: pickFirst(source?.kota, raw?.kota) || "",
    kecamatan: pickFirst(source?.kecamatan, raw?.kecamatan) || "",
    kode_pos: pickFirst(source?.kode_pos, raw?.kode_pos) || "",
    telepon: pickFirst(source?.telepon, raw?.telepon) || "",
    website: pickFirst(source?.website, raw?.website) || "",
    id: pickFirst(source?.id, source?.id_perusahaan, raw?.id, raw?.id_perusahaan),
  };
};

const hasRenderableProfileData = (data) => {
  if (!isObject(data)) return false;
  const importantFields = [
    data.nama,
    data.deskripsi,
    data.alamat,
    data.logo,
    data.profil_bg,
    data.nama_penanggung_jawab,
  ];
  return importantFields.some(Boolean);
};

export const usePerusahaan = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    let fallbackResult = {};
    let lastError = null;

    try {
      for (const endpoint of PROFILE_ENDPOINTS) {
        const response = await api.get(endpoint);
        const normalized = normalizePerusahaanData(response?.data);
        setData(normalized);

        if (hasRenderableProfileData(normalized)) {
          return normalized;
        }

        fallbackResult = normalized;
      }
    } catch (error) {
      lastError = error;
    } finally {
      setLoading(false);
    }

    if (hasRenderableProfileData(fallbackResult)) {
      return fallbackResult;
    }

    setError(lastError);
    setData({});
    return {};
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      refetch: fetchProfile,
    }),
    [data, error, fetchProfile, loading]
  );
};
