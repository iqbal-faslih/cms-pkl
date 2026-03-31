import {
  formatNoHP,
  formatTanggalLahirDisplay,
} from "../../../helpers/siswa/pesertaDataHelper";

const formatDocumentDate = (value) => {
  const formatted = formatTanggalLahirDisplay(value);
  return formatted === "N/A" ? "-" : formatted;
};

export const buildProfilePesertaViewModel = ({
  dataPeserta,
  cvTanggal,
  suratPernyataanTanggal,
}) => {
  const hasAcceptedPlacement = Boolean(dataPeserta?.is_magang_disetujui);
  const pendingPlacementText = dataPeserta?.mulai_magang || "Belum Terdaftar Magang";

  const profileFieldsLeft = [
    { title: "nama", value: dataPeserta?.nama || "" },
    { title: "jenis kelamin", value: dataPeserta?.jenis_kelamin || "" },
    { title: "tempat lahir", value: dataPeserta?.tempat_lahir || "" },
    {
      title: "tanggal lahir",
      value: formatTanggalLahirDisplay(dataPeserta?.tanggal_lahir),
    },
    { title: "alamat", value: dataPeserta?.alamat || "" },
  ];

  const profileFieldsRight = [
    { title: "no HP", value: formatNoHP(dataPeserta?.telepon) || "" },
    { title: "NISN/NIM", value: dataPeserta?.nomor_identitas || "" },
    { title: "sekolah / universitas", value: dataPeserta?.sekolah || "" },
    { title: "jurusan", value: dataPeserta?.jurusan || "" },
  ];

  const placementFieldsPrimary = [
    {
      title: "perusahaan",
      value: hasAcceptedPlacement
        ? dataPeserta?.perusahaan || "Belum Terdaftar Magang"
        : pendingPlacementText,
    },
    {
      title: "penempatan",
      value: hasAcceptedPlacement
        ? dataPeserta?.penempatan || "Belum Terdaftar Magang"
        : pendingPlacementText,
    },
  ];

  const placementFieldsPeriod = [
    {
      title: "mulai magang",
      value: dataPeserta?.mulai_magang || "",
      style: "text-[#16A34A]",
    },
    {
      title: "selesai magang",
      value: dataPeserta?.selesai_magang || "",
      style: "text-[#EE0202]",
    },
  ];

  return {
    cvDateLabel: formatDocumentDate(cvTanggal),
    suratPernyataanDateLabel: formatDocumentDate(suratPernyataanTanggal),
    hasAcceptedPlacement,
    profileFieldsLeft,
    profileFieldsRight,
    placementFieldsPrimary,
    placementFieldsPeriod,
    placementDivisionValue: hasAcceptedPlacement
      ? dataPeserta?.divisi || "Belum Terdaftar Magang"
      : pendingPlacementText,
  };
};
