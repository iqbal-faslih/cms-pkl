import { useState } from "react";
import Swal from "sweetalert2";
import { ajukanIzin } from "../helpers/apiClient";
import useModalIzinStore from "../stores/useModalIzinStore";

export default function useIzinSubmission() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { closeModal } = useModalIzinStore();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Ukuran File Terlalu Besar",
          text: "Ukuran file maksimal 5 MB.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#F59E0B",
        });
        e.target.value = "";
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const submitIzin = async ({ tanggal, deskripsi }) => {
    if (!tanggal || !deskripsi || !file) {
      Swal.fire({
        title: "Input Tidak Lengkap!",
        text: "Pastikan tanggal, deskripsi, dan file bukti terisi.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("tanggal", tanggal);
      formData.append("deskripsi", deskripsi);
      formData.append("bukti", file);

      const response = await ajukanIzin(formData);

      if (response.data.status === "success") {
        Swal.fire({
          title: "Berhasil!",
          text: "Izin berhasil diajukan!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10B981",
        });
        resetForm();
        closeModal();
      }
    } catch (error) {
      console.error("Error during izin submission:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengajukan izin.",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
  };

  return { file, loading, handleFileChange, submitIzin, resetForm };
}