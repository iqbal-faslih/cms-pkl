import { useState, useEffect, useCallback } from "react";
import { useFetch } from "../shared/hooks/requests/useFetch";
import Swal from "sweetalert2";

const ENDPOINT = "/perusahaan-jurnal";

const formatApiDate = (d) => {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

const mapApiToRow = (item) => ({
  id: item.id,
  nama: item.nama || "-",
  sekolah: item.sekolah || "-",
  judul: item.judul || "-",
  deskripsi: item.deskripsi || "-",
  tanggal: item.tanggal ? formatApiDate(item.tanggal) : "-",
  status: item.status === "Mengisi" ? "Mengisi" : "Kosong",
  bukti: item.bukti || null,
  raw: item,
});

export const useJurnalData = () => {
  const [jurnalList, setJurnalList] = useState([]);
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
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    params.append("page", pagination.page);
    params.append("per_page", pagination.per_page);
    return `?${params.toString()}`;
  }, [filters, pagination.page, pagination.per_page]);

  const { data, loading, error, refetch: fetchData } = useFetch(
    `${ENDPOINT}${buildQuery()}`,
    {}
  );

  useEffect(() => {
    if (data) {
      const meta = data?.meta;
      const apiData = data?.data || [];

      if (meta && meta.code === 200) {
        setJurnalList(apiData.map(mapApiToRow));
        setPagination((prev) => ({
          ...prev,
          total: meta.pagination?.total || 0,
        }));
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error?.message || "Terjadi kesalahan saat memuat data jurnal.",
      });
      setJurnalList([]);
    }
  }, [error]);

  const customRefetch = useCallback(async () => {
    try {
      await fetchData();
    } catch (err) {
      console.error("Refetch error:", err);
    }
  }, [fetchData]);

  return {
    jurnalList,
    loading,
    error,
    pagination,
    setPage: (page) => setPagination((p) => ({ ...p, page })),
    setPerPage: (per) => setPagination((p) => ({ ...p, per_page: per })),
    setFilters: (f) => setFilters((prev) => ({ ...prev, ...f })),
    applySearch: (v) => setFilters((f) => ({ ...f, search: v })),
    applyDateFrom: (v) => setFilters((f) => ({ ...f, date_from: v })),
    applyDateTo: (v) => setFilters((f) => ({ ...f, date_to: v })),
    applyStatus: (v) => setFilters((f) => ({ ...f, status: v })),
    applySort: (field, direction) =>
      setFilters((f) => ({ ...f, sort_by: field, sort_direction: direction })),
    handlePageChange: (p) => setPagination((x) => ({ ...x, page: p })),
    handlePerPageChange: (p) => setPagination((x) => ({ ...x, per_page: p })),
    refetch: customRefetch,
  };
};