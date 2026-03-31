import { useMemo } from "react";
import { useFetch } from "../../../../shared/hooks/requests/useFetch";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickNumber = (obj, keys) => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return toNumber(value);
    }
  }
  return 0;
};

const buildSummaryCards = (rekap) => {
  const totalCabang = pickNumber(rekap, ["total_cabang", "jml_cabang"]);
  const totalPesertaMagang =
    pickNumber(rekap?.peserta, ["total", "jumlah", "count"]) ||
    pickNumber(rekap, [
      "total_peserta",
      "peserta_total",
      "jumlah_peserta",
      "total_peserta_magang",
    ]);
  const totalJurnal = pickNumber(rekap, [
    "total_jurnal",
    "jumlah_jurnal",
    "jml_jurnal",
  ]);

  return [
    { label: "Total Cabang", value: totalCabang },
    { label: "Total Peserta Magang", value: totalPesertaMagang },
    { label: "Pengisian Jurnal", value: totalJurnal },
  ];
};

export const usePerusahaanDashboardData = () => {
  const {
    data: rekapResponse,
    loading: rekapLoading,
    error: rekapError,
  } = useFetch("/perusahaan/rekap/perusahaan");

  const {
    data: cabangResponse,
    loading: cabangLoading,
    error: cabangError,
  } = useFetch("/perusahaan/manage-cabang");

  const loading = rekapLoading || cabangLoading;

  return useMemo(() => {
    const rekap = rekapResponse?.data ?? rekapResponse ?? {};
    const cabangs = cabangResponse?.data ?? cabangResponse ?? [];

    return {
      rekap,
      cabangs,
      loading,
      rekapError,
      cabangError,
      summaryCards: buildSummaryCards(rekap),
    };
  }, [cabangError, cabangResponse, loading, rekapError, rekapResponse]);
};
