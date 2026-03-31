// hooks/siswa/jurnal/useJurnalModals.js
import { useState } from "react";
import { useModalDetailJurnal } from "./useModalDetailJurnal";
import { useModalEditJurnal } from "./useModalEditJurnal";
import useModalTidakMengisiStore from "../../../stores/useModalTidakMengisiStore";
import { transformEventToModalData } from "../../../utils/siswa/jurnal/jurnalTransform";
import Swal from "sweetalert2";

export const useJurnalModals = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState(null);

  const { openModal: openDetailModal } = useModalDetailJurnal();
  const { openModal: openEditModal } = useModalEditJurnal();
  const { openModal: openTidakMengisiModal } = useModalTidakMengisiStore();

  const handleEventClick = (info) => {
    const transformedData = transformEventToModalData(info);

    if (transformedData.status === "tidak_mengisi") {
      openTidakMengisiModal(transformedData);
    } else {
      openDetailModal(transformedData);
    }
  };

  const handleEditClick = (jurnalData) => {
    if (!jurnalData) return;

    if (jurnalData.isPast) {
      Swal.fire({
        title: "Tidak Dapat Mengedit",
        text: "Jurnal pada tanggal yang sudah terlewati tidak dapat diedit.",
        icon: "warning",
        confirmButtonText: "Mengerti",
      });
      return;
    }

    openEditModal(jurnalData);
  };

  const handleCreateFromEmpty = (dateStr) => {
    setPrefilledDate(dateStr);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setPrefilledDate(null);
  };

  const openAddModal = () => {
    const today = new Date().toISOString().split("T")[0];
    setPrefilledDate(today);
    setShowAddModal(true);
  };

  return {
    showAddModal,
    prefilledDate,
    handleEventClick,
    handleEditClick,
    handleCreateFromEmpty,
    closeAddModal,
    openAddModal,
  };
};
