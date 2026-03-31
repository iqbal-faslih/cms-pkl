import { useState, useEffect, useCallback } from "react";
import { useFetch } from "../shared/hooks/requests/useFetch";
import Swal from "sweetalert2";

const ENDPOINT = "/cabang-absensi/rekap-absensi";

const toApiDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0]; 
};

const formatApiDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID");
};

const mapApiToRow = (item) => ({
  id: item.id,
  number: item.id_peserta || "-",
  nama: item.nama_peserta || "-",
  tanggal: formatApiDate(item.tanggal),
  jamMasuk: item.jam_masuk || "-",
  jamKeluar: item.jam_pulang || "-",
  durasiKerja: item.durasi_kerja || "-",
  status: item.status || "-",
  metode: item.metode || "-",
  raw: item,
});

export const useAbsensiCabang = () => {
  const [absensiList, setAbsensiList] = useState([]);
  const [statCards, setStatCards] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    date_from: "",
    date_to: "",
    status: "",
    sort_by: "",
    sort_direction: "",
  });

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    params.append("page", pagination.page);
    params.append("per_page", pagination.per_page);

    return `?${params.toString()}`;
  }, [filters, pagination.page, pagination.per_page]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch(`${ENDPOINT}${buildQuery()}`, {});

  const { data: statsData } = useFetch("/absensi-cabang/statistik", {});

  useEffect(() => {
    if (data?.meta?.code === 200) {
      const apiData = data.data;

      const list = apiData?.data_absensi || [];
      setAbsensiList(list.map(mapApiToRow));

      setPagination((prev) => ({
        ...prev,
        total: apiData?.pagination?.total || list.length,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (statsData?.meta?.code === 200) {
      setStatCards([
        {
          title: "Total Pegawai",
          value: String(statsData.total_pegawai || 0),
          color: "#407AED",
          icon: "/icons/users.svg",
        },
        {
          title: "Hadir Hari Ini",
          value: String(statsData.hadir_hari_ini || 0),
          color: "#00c7b3",
          icon: "/icons/check-circle.svg",
        },
        {
          title: "Terlambat",
          value: String(statsData.terlambat_hari_ini || 0),
          color: "#FF6B6B",
          icon: "/icons/clock-alert.svg",
        },
        {
          title: "Izin/Sakit",
          value: String(statsData.izin_sakit_hari_ini || 0),
          color: "#FFA726",
          icon: "/icons/medical-bag.svg",
        },
      ]);
    }
  }, [statsData]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error?.message || "Terjadi kesalahan saat memuat data.",
      });

      setAbsensiList([]);
      setStatCards([]);
    }
  }, [error]);

  const applySearch = (value) => {
    setFilters((f) => ({ ...f, search: value }));
    setPagination((p) => ({ ...p, page: 1 }));
  };
  const applyDateFilter = (from, to) => {
    setFilters((f) => ({
      ...f,
      date_from: toApiDate(from),
      date_to: toApiDate(to),
    }));
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const applyStatusFilter = (statusObj) => {
    const active = Object.keys(statusObj)
      .filter((k) => statusObj[k])
      .join(",");

    setFilters((f) => ({ ...f, status: active }));
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const resetStatusFilter = () => {
    setFilters((f) => ({ ...f, status: "" }));
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const applySort = (field, direction) => {
    setFilters((f) => ({
      ...f,
      sort_by: field,
      sort_direction: direction,
    }));
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const getStatusFilterObject = useCallback(() => {
    const arr = filters.status ? filters.status.split(",") : [];
    return {
      Hadir: arr.includes("Hadir"),
      Alpa: arr.includes("Alpa"),
      Terlambat: arr.includes("Terlambat"),
      Izin: arr.includes("Izin"),
      Sakit: arr.includes("Sakit"),
    };
  }, [filters.status]);

  return {
    absensiList,
    statCards,
    loading,
    error,

    pagination,
    setPage: (p) => setPagination((x) => ({ ...x, page: p })),
    setPerPage: (p) => setPagination((x) => ({ ...x, per_page: p })),

    filters,
    setFilters,

    applySearch,
    applyDateFilter,
    applyStatusFilter,
    resetStatusFilter,
    applySort,

    handlePageChange: (p) => setPagination((x) => ({ ...x, page: p })),
    handlePerPageChange: (p) => setPagination((x) => ({ ...x, per_page: p })),

    getStatusFilterObject,
    refetch,
  };
};
