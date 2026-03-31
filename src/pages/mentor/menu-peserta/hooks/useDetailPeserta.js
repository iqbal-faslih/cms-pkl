import { useFetch } from "@/shared/hooks/requests/useFetch";

export const useDetailPeserta = (id) => {
  const { data, loading, error, refetch } = useFetch(
    id ? `/mentor-manage-peserta/peserta-profile/${id}` : null
  );

  const profile = data?.data
    ? {
        id: data?.data?.id,
        name: data?.data?.nama,
        email: data?.data?.email,
        image: data?.data?.avatar,
        rfid: data?.data?.rfid_code,
        company: data?.data?.perusahaan,
        branch: data?.data?.cabang,
        nisn: data?.data?.nomor_identitas,
        sekolah: data?.data?.sekolah,
        mentor: data?.data?.mentor,
        role: data?.data?.divisi,
        internshipPeriod: `${data?.data?.magang?.tanggal_masuk} - ${data?.data?.magang?.tanggal_keluar}`,
      }
    : null;

  const jurnal = (data?.data?.jurnal || []).map((item) => ({
    judul: item.judul,
    tgl: item.tanggal, // Map tanggal → tgl
    desc: item.deskripsi, // Map deskripsi → desc
    bukti: item.bukti, // Keep for image modal
    gambar: item.bukti, // Map bukti → gambar for table column
  }));

  const project = data?.data?.project || [];

  const mapProjectStatus = (status) => {
    switch (status) {
      case "pending":
        return "revisi";
      case "on_progress":
        return "in_work";
      case "completed":
        return "completed";
      default:
        return "revisi";
    }
  };

  const trackRecords = {
    revisi: [],
    in_work: [],
    completed: [],
  };

  (project || []).forEach((item, index) => {
    const key = mapProjectStatus(item.status);
    trackRecords[key].push({
      id: index,
      task: item.nama_proyek,
      task_status: item.status,
      date: item.mulai,
      route: `/mentor/project/${index}`,
    });
  });

  return {
    profile,
    jurnal,
    project,
    trackRecords,
    loading,
    error,
    refetch,
  };
};
