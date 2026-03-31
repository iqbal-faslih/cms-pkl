import { getLowonganStatusBadge } from "../../../helpers/lowonganStatusBadgeHelper";

export const formatMagangSystem = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "online") {
    return { label: "Online", className: "bg-[#e9f2ff] text-[#2f66ff]" };
  }
  if (normalized === "offline") {
    return { label: "Offline", className: "bg-[#f3f4f6] text-[#4b5563]" };
  }
  return { label: "-", className: "bg-[#f3f4f6] text-[#9ca3af]" };
};

export const getCompanyName = (job) => {
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
    job?.nama ||
    ""
  );
};

export const getCompanyLocation = (job) => {
  const city = job?.perusahaan?.kota || job?.perusahaan?.perusahaan?.kota || job?.kota || "";
  const province =
    job?.perusahaan?.provinsi || job?.perusahaan?.perusahaan?.provinsi || job?.provinsi || "";

  if (city && province) return `${city}, ${province}`;
  if (city) return city;
  if (province) return province;
  return "";
};

export const getLowonganName = (job) => job?.nama || job?.judul || "Lowongan tidak tersedia";

export const getCabangLocation = (cabang) => {
  if (cabang?.provinsi && cabang?.kota) return `${cabang.kota}, ${cabang.provinsi}`;
  return "Alamat tidak tersedia";
};

export const getStatusBadge = (jobOrStatus, tanggalSelesai) => {
  const source =
    typeof jobOrStatus === "object" && jobOrStatus !== null
      ? jobOrStatus
      : { status: jobOrStatus, tanggal_selesai: tanggalSelesai };
  return getLowonganStatusBadge(source);
};
