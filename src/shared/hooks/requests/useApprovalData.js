import { useMemo } from "react";
import { useFetch } from "./useFetch";

export const useApprovalData = ({
  searchTerm,
  sortBy,
  sortDirection,
  selectedDate,
  filterBy,
  selectedAlasanIzin,
}) => {
  // Build query params untuk pendaftaran
  const pendaftaranParams = useMemo(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (sortBy) params.sort_by = sortBy;
    if (sortDirection) params.sort_direction = sortDirection;
    if (selectedDate.start) params.startDate = selectedDate.start;
    if (selectedDate.end) params.endDate = selectedDate.end;
    if (filterBy.length > 0) params.status = filterBy.join(",");

    console.log("📋 Pendaftaran Params:", params);
    return params;
  }, [searchTerm, sortBy, sortDirection, selectedDate, filterBy]);

  // Build query params untuk izin
  const izinParams = useMemo(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (sortBy) params.sort_by = sortBy;
    if (sortDirection) params.sort_direction = sortDirection;
    if (selectedDate.start) params.startDate = selectedDate.start;
    if (selectedDate.end) params.endDate = selectedDate.end;
    if (filterBy.length > 0) params.status = filterBy.join(",");
    if (selectedAlasanIzin.length > 0) params.alasan = selectedAlasanIzin.join(",");

    console.log("📋 Izin Params:", params);
    return params;
  }, [searchTerm, sortBy, sortDirection, selectedDate, filterBy, selectedAlasanIzin]);

  // Fetch data pendaftaran
  const {
    data: pendaftaranResponse,
    loading: loadingPendaftaran,
    error: errorPendaftaran,
    refetch: refetchPendaftaran,
  } = useFetch("/cabang/approval/daftar", {
    params: pendaftaranParams,
  });

  // Fetch data izin
  const {
    data: izinResponse,
    loading: loadingIzin,
    error: errorIzin,
    refetch: refetchIzin,
  } = useFetch("/cabang/approval/izin", {
    params: izinParams,
  });

  // Extract data dari response
  const pendaftaranData = pendaftaranResponse?.data || [];
  const izinData = izinResponse?.data || [];

  // Extract current params from backend response (assuming meta.currentParams)
  const currentPendaftaranParams = pendaftaranResponse?.meta?.currentParams || {};
  const currentIzinParams = izinResponse?.meta?.currentParams || {};

  return {
    pendaftaranData,
    izinData,
    loadingPendaftaran,
    loadingIzin,
    errorPendaftaran,
    errorIzin,
    refetchPendaftaran,
    refetchIzin,
    pendaftaranParams,
    izinParams,
    currentPendaftaranParams,
    currentIzinParams,
  };
};
