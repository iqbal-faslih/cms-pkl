import { useState, useEffect, useMemo } from "react";
import { useFetch } from "../../../../shared/hooks/requests/useFetch";
import { useSearch } from "../../../../shared/hooks/useSearch";
import { buildQuery } from "../../../../shared/helpers/buildQuery";
import {
  formatDateToBackend,
  formatInternshipPeriod,
  formatInternshipPeriodLabel,
} from "../../../../utils/dateUtils";
import { SORT_SCHEMA } from "../../../../shared/schema/querySchemas";

const APPROVAL_ENDPOINTS = {
  pendaftaran: "/perusahaan/approval/daftar",
  izin: "/perusahaan/approval/izin",
};

const normalizeStatusLabel = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "diterima" || value === "approved" || value === "approve") return "Approve";
  if (value === "ditolak" || value === "rejected" || value === "reject") return "Reject";
  if (value === "menunggu" || value === "pending") return "Pending";

  return status || "Pending";
};

const getProfilePictureUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  const rawPath = String(path).trim();
  if (!rawPath) return "";
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  const base = String(
    import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || ""
  )
    .trim()
    .replace(/\/+$/, "");
  if (!base) return rawPath;

  const normalizedPath = rawPath.replace(/^\/+/, "");
  const baseEndsWithStorage = /\/storage$/i.test(base);

  if (/^storage\//i.test(normalizedPath)) {
    return baseEndsWithStorage
      ? `${base}/${normalizedPath.replace(/^storage\/+/i, "")}`
      : `${base}/${normalizedPath}`;
  }

  return baseEndsWithStorage
    ? `${base}/${normalizedPath}`
    : `${base}/storage/${normalizedPath}`;
};

const extractPhotoPath = (...sources) => {
  const typePriority = ["profile", "profil", "foto_profile", "avatar"];

  const readEntryPath = (entry) => {
    if (!entry) return "";
    if (typeof entry === "string") return entry;
    if (typeof entry !== "object") return "";
    return (
      entry?.path ||
      entry?.file_path ||
      entry?.filepath ||
      entry?.full_path ||
      entry?.url ||
      entry?.link ||
      ""
    );
  };

  for (const source of sources) {
    if (!source) continue;
    if (typeof source === "string") return source;

    if (Array.isArray(source)) {
      for (const type of typePriority) {
        const matched = source.find(
          (entry) => String(entry?.type || "").toLowerCase() === type
        );
        const matchedPath = readEntryPath(matched);
        if (matchedPath) return matchedPath;
      }

      for (const entry of source) {
        const path = readEntryPath(entry);
        if (path) return path;
      }
      continue;
    }

    if (typeof source === "object") {
      const directPath = readEntryPath(source);
      if (directPath) return directPath;

      const nestedFotoPath = extractPhotoPath(source?.foto);
      if (nestedFotoPath) return nestedFotoPath;
    }
  }

  return "";
};

const extractFirstArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return null;

  const preferred = [
    value?.data,
    value?.data?.data,
    value?.items,
    value?.rows,
    value?.results,
    value?.pendaftaran,
    value?.approval,
  ];

  for (const candidate of preferred) {
    if (Array.isArray(candidate)) return candidate;
  }

  for (const key of Object.keys(value)) {
    const found = extractFirstArray(value[key]);
    if (found) return found;
  }

  return null;
};

const readMeta = (source) => {
  if (!source || typeof source !== "object") return {};
  return (
    source?.meta ||
    source?.data?.meta ||
    source?.pagination ||
    source?.data?.pagination ||
    {}
  );
};

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

const deepFindLowonganName = (node) => {
  if (!node || typeof node !== "object") return null;

  const directCandidates = [
    node?.nama_lowongan,
    node?.judul_lowongan,
    node?.lowongan_nama,
    node?.lowongan?.nama,
    node?.lowongan?.judul,
    node?.lowongan?.title,
  ];
  for (const value of directCandidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  for (const [key, value] of Object.entries(node)) {
    const lowerKey = String(key || "").toLowerCase();
    if (
      (lowerKey.includes("lowongan") || lowerKey.includes("vacancy")) &&
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }

    if (value && typeof value === "object") {
      const found = deepFindLowonganName(value);
      if (found) return found;
    }
  }

  return null;
};

const resolveLowonganName = (item) => {
  const candidates = [
    findFirstTruthyByPaths(item, [
      "lowongan.nama",
      "lowongan.judul",
      "lowongan.title",
      "magang.lowongan.nama",
      "magang.lowongan.judul",
      "pendaftaran.lowongan.nama",
      "pendaftaran.lowongan.judul",
      "detail_lowongan.nama",
      "detail_lowongan.judul",
      "nama_lowongan",
      "lowongan_nama",
      "judul_lowongan",
      "judul_lowongan_magang",
      "lowongan.nama_lowongan",
      "magang.nama_lowongan",
      "pendaftaran.nama_lowongan",
    ]),
    typeof item?.lowongan === "string" ? item.lowongan : null,
    deepFindLowonganName(item),
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "-";
};

const resolveMasaMagang = (item, magang) => {
  const directMasaMagang = findFirstTruthyByPaths(item, [
    "masa_magang",
    "durasi_magang",
    "magang.durasi_magang",
    "pendaftaran.durasi_magang",
  ]);
  if (typeof directMasaMagang === "string" && directMasaMagang.trim()) {
    return formatInternshipPeriodLabel(directMasaMagang);
  }

  const mulai =
    findFirstTruthyByPaths(item, [
      "mulai",
      "tanggal_mulai",
      "mulai_magang",
      "magang.mulai",
      "magang.tanggal_mulai",
      "magang.mulai_magang",
      "pendaftaran.mulai",
      "pendaftaran.tanggal_mulai",
      "periode.mulai",
    ]) || magang?.mulai || magang?.tanggal_mulai;
  const selesai =
    findFirstTruthyByPaths(item, [
      "selesai",
      "tanggal_selesai",
      "selesai_magang",
      "magang.selesai",
      "magang.tanggal_selesai",
      "magang.selesai_magang",
      "pendaftaran.selesai",
      "pendaftaran.tanggal_selesai",
      "periode.selesai",
    ]) || magang?.selesai || magang?.tanggal_selesai;

  return formatInternshipPeriod(mulai, selesai);
};

const mapPendaftaranItem = (item, generatedId) => {
  const user = item?.user || item?.peserta?.user || item?.peserta || {};
  const magang = item?.magang || item?.pendaftaran || {};
  const profilePath = extractPhotoPath(
    item?.foto_profile,
    item?.profil,
    item?.foto,
    item?.peserta?.foto_profile,
    user?.profil,
    user?.foto_profile,
    user?.foto,
    item?.peserta?.foto
  );

  return {
    no: generatedId,
    id: item?.id || item?.id_pendaftaran || item?.id_magang || user?.id,
    nama: item?.nama || user?.nama || "-",
    sekolah: item?.sekolah || user?.sekolah || "-",
    jurusan: item?.jurusan || user?.jurusan || "-",
    lowongan: resolveLowonganName(item),
    status: normalizeStatusLabel(item?.status || magang?.status),
    status_magang: String(item?.status_magang || magang?.status_magang || "-"),
    email: item?.email || user?.email || "-",
    masa_magang: resolveMasaMagang(item, magang),
    profilePicture: getProfilePictureUrl(profilePath),
  };
};

const mapIzinItem = (item, generatedId) => {
  const profilePath = extractPhotoPath(
    item?.foto_profile,
    item?.profil,
    item?.foto,
    item?.peserta?.foto_profile,
    item?.user?.profil,
    item?.user?.foto_profile,
    item?.user?.foto
  );

  return {
    no: generatedId,
    id: item?.id,
    nama: item?.nama || "-",
    sekolah: item?.sekolah || "-",
    profilePicture: getProfilePictureUrl(profilePath),
    status_izin: normalizeStatusLabel(item?.status_izin || item?.status),
    email: item?.email || "-",
    tanggal_izin: item?.tanggal_izin || "-",
    alasan: item?.keterangan || "-",
  };
};

export const useApprovalData = (activeTab = "pendaftaran", options = {}) => {
  const { itemsPerPage = 10, searchDelay = 500 } = options;

  const {
    keyword: searchTerm,
    debouncedKeyword,
    setKeyword: setSearchTerm,
  } = useSearch(searchDelay);

  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedAlasan, setSelectedAlasan] = useState([]);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [masaMagangFilter, setMasaMagangFilter] = useState({
    from: null,
    to: null,
  });

  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const [currentPage, setCurrentPage] = useState(1);

  const endpoint =
    APPROVAL_ENDPOINTS[activeTab] || APPROVAL_ENDPOINTS.pendaftaran;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedKeyword,
    selectedStatus,
    selectedAlasan,
    dateFilter,
    masaMagangFilter,
    activeTab,
  ]);

  const queryString = useMemo(() => {
    const mapStatusToApi = (statusList) => {
      return statusList.map((s) =>
        s.toLowerCase() === "pending" ? "menunggu" : s.toLowerCase()
      );
    };

    const activeSortSchema = {
      ...SORT_SCHEMA,
      "status-asc": {
        by: activeTab === "pendaftaran" ? "status" : "status_izin",
        dir: "asc",
      },
      "status-desc": {
        by: activeTab === "pendaftaran" ? "status" : "status_izin",
        dir: "desc",
      },
    };

    return buildQuery({
      search: debouncedKeyword,
      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
      },
      sort: sortOption,
      sortSchema: activeSortSchema,
      filters: {
        ...(selectedStatus.length > 0 && {
          status: mapStatusToApi(selectedStatus),
        }),
        ...(activeTab === "izin" && { keterangan: selectedAlasan }),
        ...(activeTab === "pendaftaran" && {
          selesai_from: formatDateToBackend(masaMagangFilter.from),
          selesai_to: formatDateToBackend(masaMagangFilter.to),
        }),
      },
      date: dateFilter,
    });
  }, [
    debouncedKeyword,
    currentPage,
    itemsPerPage,
    sortOption,
    selectedStatus,
    selectedAlasan,
    masaMagangFilter,
    dateFilter,
    activeTab,
  ]);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch(`${endpoint}?${queryString}`);

  const hasResolvedOnce = apiData !== null || error !== null;
  const isTableLoading = loading || !hasResolvedOnce;

  const transformedData = useMemo(() => {
    const rows = extractFirstArray(apiData) || [];
    if (!rows.length) return [];

    return rows.map((item, index) => {
      const generatedId = (currentPage - 1) * itemsPerPage + index + 1;

      if (activeTab === "pendaftaran") {
        return mapPendaftaranItem(item, generatedId);
      }

      return mapIzinItem(item, generatedId);
    });
  }, [apiData, activeTab, currentPage, itemsPerPage]);

  const paginationInfo = useMemo(() => {
    const meta = readMeta(apiData);
    return {
      totalPages: meta.last_page || 1,
      totalItems: meta.total || 0,
      itemsPerPage: meta.per_page || itemsPerPage,
      currentPage: meta.current_page || 1,
      from: meta.from || 0,
      to: meta.to || 0,
    };
  }, [apiData, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleFilterChange = (filters) => {
    if (filters.status) setSelectedStatus(filters.status);
    if (filters.alasan) setSelectedAlasan(filters.alasan);
    if (filters.date) setDateFilter(filters.date);
    if (filters.masaMagang) setMasaMagangFilter(filters.masaMagang);
  };


  const resetFilters = () => {
    setSelectedStatus([]);
    setSelectedAlasan([]);
    setDateFilter({ from: null, to: null });
    setMasaMagangFilter({ from: null, to: null });
  };

  useEffect(() => {
    resetFilters();
  }, [activeTab]);

  return {
    data: transformedData,
    loading: isTableLoading,
    error,
    pagination: {
      ...paginationInfo,
      onPageChange: handlePageChange,
    },
    search: searchTerm,
    setSearch: setSearchTerm,
    filters: {
      setStatus: setSelectedStatus,
      setAlasan: setSelectedAlasan,
      setDate: setDateFilter,
      setSort: setSortOption,
      reset: resetFilters,
      onFilterChange: handleFilterChange,
    },
    refetch,
  };
};
