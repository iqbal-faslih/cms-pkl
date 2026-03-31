import { useMemo } from "react";
import { useFetch } from "./useFetch";

export const useApprovalData = ({
  searchTerm,
  sortBy,
  selectedDate,
  filterBy,
  selectedAlasanIzin,
}) => {
  // Build query params untuk pendaftaran
  const pendaftaranParams = useMemo(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (sortBy) params.sort = sortBy;
    if (selectedDate.start) params.startDate = selectedDate.start;
    if (selectedDate.end) params.endDate = selectedDate.end;
    if (filterBy.length > 0) params.status = filterBy.join(",");

    console.log("📋 Pendaftaran Params:", params);
    return params;
  }, [searchTerm, sortBy, selectedDate, filterBy]);

  // Build query params untuk izin
  const izinParams = useMemo(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (sortBy) params.sort = sortBy;
    if (selectedDate.start) params.startDate = selectedDate.start;
    if (selectedDate.end) params.endDate = selectedDate.end;
    if (filterBy.length > 0) params.status = filterBy.join(",");
    if (selectedAlasanIzin.length > 0) params.alasan = selectedAlasanIzin.join(",");

    console.log("📋 Izin Params:", params);
    return params;
  }, [searchTerm, sortBy, selectedDate, filterBy, selectedAlasanIzin]);

  // Fetch data pendaftaran
  const {
    data: pendaftaranResponse,
    loading: loadingPendaftaran,
    error: errorPendaftaran,
    refetch: refetchPendaftaran,
  } = useFetch("/perusahaan/approval/daftar", {
    params: pendaftaranParams,
  });

  // Fetch data izin
  const {
    data: izinResponse,
    loading: loadingIzin,
    error: errorIzin,
    refetch: refetchIzin,
  } = useFetch("/perusahaan/approval/izin", {
    params: izinParams,
  });

  // Extract data dari response
  const pendaftaranData = pendaftaranResponse?.data || [];
  const izinData = izinResponse?.data || [];

  return {
    pendaftaranData,
    izinData,
    loadingPendaftaran,
    loadingIzin,
    errorPendaftaran,
    errorIzin,
    refetchPendaftaran,
    refetchIzin,
  };
};
