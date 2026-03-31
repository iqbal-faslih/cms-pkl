// src/hooks/useApplyPresentation.js
import { useState } from "react";
import { applyPresentation } from "../helpers/apiClient";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "../helpers/sweetAlertHelper";

export const useApplyPresentation = (onClose) => {
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyClick = async (id) => {
    try {
      setIsApplying(true);

      const response = await applyPresentation(id);

      if (
        response.data.status === "success" ||
        response.status === 200 ||
        response.status === 201
      ) {
        onClose();
        showSuccessAlert("Presentasi berhasil dipilih").then((result) => {
          if (result.isConfirmed) {
            navigate("/peserta/riwayat-presentasi");
          }
        });
      } else {
        throw new Error(response.data.message || "Gagal mendaftar presentasi");
      }
    } catch (error) {
      onClose();
      const errorMessage = error.response?.data?.message || error.message || "";

      if (
        errorMessage.toLowerCase().includes("sudah") ||
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("duplicate")
      ) {
        showErrorAlert("Anda sudah mendaftar untuk presentasi ini sebelumnya.");
      } else {
        showErrorAlert(
          errorMessage || "Terjadi kesalahan saat mendaftar presentasi"
        );
      }
    } finally {
      setIsApplying(false);
    }
  };

  return { isApplying, handleApplyClick };
};
