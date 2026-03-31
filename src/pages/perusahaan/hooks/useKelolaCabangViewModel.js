import { useMemo } from "react";
import useKelolaCabang from "../../../shared/hooks/useKelolaCabang";

const defaultRekap = {
  total_admin: 0,
  total_divisi: 0,
  total_mentor: 0,
  total_peserta: 0,
  peserta_per_divisi: {},
  mentor_per_divisi: {},
};

export const useKelolaCabangViewModel = (branchIdOrSlug) => {
  const { cabang, rekap, jamKerjaToday, loading, error } =
    useKelolaCabang(branchIdOrSlug);

  const safeRekap = rekap || defaultRekap;

  const statCards = useMemo(
    () => [
      {
        key: "admin",
        title: "Admin",
        subtitle: `${safeRekap.total_admin ?? 0} Admin`,
        cardBg: "#EFE7FF",
        iconBg: "#A46AF3",
      },
      {
        key: "divisi",
        title: "Divisi",
        subtitle: `${safeRekap.total_divisi ?? 0} Divisi`,
        cardBg: "#FCE8EE",
        iconBg: "#FB5B8E",
      },
      {
        key: "mentor",
        title: "Mentor",
        subtitle: `${safeRekap.total_mentor ?? 0} Mentor`,
        cardBg: "#FFF2DD",
        iconBg: "#FF9E6A",
      },
      {
        key: "magang",
        title: "Magang",
        subtitle: `${safeRekap.total_peserta ?? 0} Peserta Magang`,
        cardBg: "#DBF5E3",
        iconBg: "#37C76C",
      },
    ],
    [safeRekap]
  );

  const welcomeName = useMemo(() => {
    return cabang?.nama || "Cabang";
  }, [cabang]);

  const companyLabel = useMemo(() => {
    return (
      cabang?.perusahaan?.nama ||
      cabang?.nama_perusahaan ||
      "PT. Hummatech"
    );
  }, [cabang]);

  return {
    loading,
    error,
    statCards,
    welcomeName,
    companyLabel,
    pesertaPerDivisi: safeRekap.peserta_per_divisi || {},
    mentorPerDivisi: safeRekap.mentor_per_divisi || {},
    jamKerjaToday: Array.isArray(jamKerjaToday) ? jamKerjaToday : [],
  };
};

export default useKelolaCabangViewModel;
