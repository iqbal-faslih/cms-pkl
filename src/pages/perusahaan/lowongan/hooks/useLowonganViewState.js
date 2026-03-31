import { useMemo, useState } from "react";

const getCompanyName = (job) => {
  if (!job) return "";
  if (typeof job.perusahaan === "string") return job.perusahaan;
  if (typeof job.nama_perusahaan === "string") return job.nama_perusahaan;

  return (
    job?.perusahaan?.nama ||
    job?.perusahaan?.nama_perusahaan ||
    job?.perusahaan?.perusahaan?.nama ||
    job?.nama_perusahaan?.nama ||
    job?.nama_perusahaan?.nama_perusahaan ||
    job?.company?.name ||
    job?.company_name ||
    job?.perusahaan_nama ||
    ""
  );
};

const getCity = (job) => job?.perusahaan?.kota || job?.perusahaan?.perusahaan?.kota || job?.kota || "";

const getProvince = (job) =>
  job?.perusahaan?.provinsi || job?.perusahaan?.perusahaan?.provinsi || job?.provinsi || "";

export const useLowonganViewState = ({ filteredData = [], lowongan = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const companyName = getCompanyName(lowongan?.[0]) || "ChaYoongin";

  const visibleData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return filteredData;

    return filteredData.filter((job) => {
      const cabang = job.cabang?.nama || "";
      const divisi = job.divisi?.nama || "";
      const namaLowongan = job.nama || "";
      const kota = job.cabang?.kota || getCity(job);
      const provinsi = job.cabang?.provinsi || getProvince(job);
      const perusahaan = getCompanyName(job);

      return [namaLowongan, cabang, divisi, kota, provinsi, perusahaan]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [filteredData, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    showFilter,
    setShowFilter,
    companyName,
    visibleData,
  };
};
