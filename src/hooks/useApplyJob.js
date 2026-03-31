import { useState } from "react";
import Swal from "sweetalert2";
import { applyJob } from "../helpers/apiClient";
import { useNavigate } from "react-router-dom";

const WARNING_NEED_PROFILE = "Silahkan lengkapi data diri terlebih dahulu";

const showIncompleteFormAlert = () =>
  Swal.fire({
    icon: "warning",
    title: "Data Belum Lengkap",
    text: "Mohon lengkapi semua data yang diperlukan",
    confirmButtonColor: "#3085d6",
  });

const showInvalidDateRangeAlert = () =>
  Swal.fire({
    icon: "warning",
    title: "Rentang Tanggal Tidak Valid",
    text: "Tanggal selesai harus setelah tanggal mulai.",
    confirmButtonColor: "#3085d6",
  });

const showProcessingAlert = () =>
  Swal.fire({
    title: "Sedang Memproses",
    html: "Mohon tunggu sebentar...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

const showApplyResult = (response) =>
  Swal.fire({
    icon: response.status === 201 ? "success" : "info",
    title: response.status === 201 ? "Berhasil!" : "Informasi",
    text: response.data?.message || "Permohonan magang diproses.",
    confirmButtonColor: "#3085d6",
  });

const isProfileCompletionError = (error, message) =>
  Boolean(
    error?.response &&
      error.response.status === 403 &&
      (message === WARNING_NEED_PROFILE ||
        String(message || "").toLowerCase().includes("lengkapi data"))
  );

const showProfileCompletionAlert = (errorMessage, navigate) =>
  Swal.fire({
    icon: "warning",
    title: "Perhatian",
    text: errorMessage,
    showCancelButton: true,
    confirmButtonText: "Lengkapi Data",
    cancelButtonText: "Tutup",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/peserta/registrasi");
    }
  });

const showDefaultErrorAlert = (errorMessage) =>
  Swal.fire({
    icon: "error",
    title: "Gagal",
    text: errorMessage || "Gagal menyimpan. Periksa kembali input Anda.",
    confirmButtonColor: "#3085d6",
  });

const useApplyJob = (onClose) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async ({ idLowongan, startDate, endDate, file }) => {
    if (!startDate || !endDate || !file) {
      showIncompleteFormAlert();
      return;
    }

    if (endDate <= startDate) {
      showInvalidDateRangeAlert();
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("id_lowongan", idLowongan);
    formData.append("mulai", startDate);
    formData.append("selesai", endDate);
    formData.append("surat_pernyataan_diri", file);

    try {
      showProcessingAlert();

      const response = await applyJob(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.close();
      const result = await showApplyResult(response);
      if (result.isConfirmed) {
        navigate("/peserta/dashboard");
        onClose?.();
      }
    } catch (error) {
      Swal.close();
      const errorMessage = error?.response?.data?.meta?.message || error?.response?.data?.message;

      if (isProfileCompletionError(error, errorMessage)) {
        await showProfileCompletionAlert(errorMessage, navigate);
      } else {
        await showDefaultErrorAlert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
    endDate,
    startDate,
    setStartDate,
    setEndDate,
  };
};

export default useApplyJob;
