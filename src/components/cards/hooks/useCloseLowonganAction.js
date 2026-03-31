import Swal from "sweetalert2";
import { closeLowongan } from "../../../helpers/apiClient";
import { markLowonganClosedInCache } from "../../../helpers/lowonganStatusHelper";

export const useCloseLowonganAction = ({ onSuccess, onLocalClosed }) => {
  const requestCloseLowongan = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi Tutup Lowongan",
      text: "Apakah Anda yakin ingin menutup lowongan ini? Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Tutup Lowongan",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: "Menutup Lowongan",
      text: "Mohon tunggu...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await closeLowongan(id);
      markLowonganClosedInCache(id);
      onLocalClosed?.();
      Swal.close();
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Lowongan berhasil ditutup",
        confirmButtonColor: "#3085d6",
      });
      onSuccess?.({ status: 0 });
    } catch (error) {
      Swal.close();
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error?.response?.data?.message || "Terjadi kesalahan saat menutup lowongan",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return { requestCloseLowongan };
};

