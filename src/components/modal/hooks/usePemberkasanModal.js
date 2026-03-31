import { useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { formatDate } from "../../../helpers/dateFormatterHelper";
import { useApplyJob, useFileInput, useModalLock } from "../../../hooks";

const getNextDayIso = (isoDateString) => {
  if (!isoDateString) return "";
  const baseDate = new Date(isoDateString);
  if (Number.isNaN(baseDate.getTime())) return "";
  baseDate.setDate(baseDate.getDate() + 1);
  return formatDate(baseDate);
};

export const usePemberkasanModal = ({ isOpen, onClose, jobData }) => {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const modalRef = useRef(null);
  useModalLock(modalRef, isOpen);

  const idLowongan = useMemo(() => jobData?.id, [jobData]);

  const { loading, handleSubmit, endDate, startDate, setStartDate, setEndDate } =
    useApplyJob(onClose);
  const { file, fileName, handleFileChange } = useFileInput(2);

  const requestCloseConfirmation = async (title, text, confirmButtonText) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText,
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) onClose();
  };

  const handleCloseClick = () => {
    requestCloseConfirmation(
      "Keluar dari form?",
      "Perubahan yang belum disimpan akan hilang",
      "Ya, keluar"
    );
  };

  const handleCancelClick = () => {
    if (!startDate && !endDate && !file) {
      onClose();
      return;
    }

    requestCloseConfirmation(
      "Batalkan pengajuan?",
      "Data yang telah diisi akan hilang",
      "Ya, batalkan"
    );
  };

  const handleStartDateChange = (date) => {
    setStartDate(formatDate(date));
    setShowStartCalendar(false);
    setEndDate("");
  };

  const handleEndInputClick = () => {
    if (!startDate) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Silahkan pilih tanggal mulai terlebih dahulu",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    setShowEndCalendar((prev) => !prev);
  };

  const handleEndDateChange = (date) => {
    const nextEndDate = formatDate(date);
    if (startDate && nextEndDate <= startDate) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Tanggal selesai harus setelah tanggal mulai",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    setEndDate(nextEndDate);
    setShowEndCalendar(false);
  };

  const downloadTemplate = () => {
    const templateUrl = "../berkas/Surat_Pernyataan_Diri.pdf";
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "Surat_Pernyataan_Diri.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "info",
      title: "Download Template",
      text: "Template surat pernyataan diri sedang diunduh",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const submitApply = () => {
    handleSubmit({ idLowongan, startDate, endDate, file });
  };

  return {
    modalRef,
    idLowongan,
    loading,
    file,
    fileName,
    handleFileChange,
    startDate,
    endDate,
    minEndDate: getNextDayIso(startDate),
    setShowStartCalendar,
    setShowEndCalendar,
    showStartCalendar,
    showEndCalendar,
    handleCloseClick,
    handleCancelClick,
    handleStartDateChange,
    handleEndInputClick,
    handleEndDateChange,
    downloadTemplate,
    submitApply,
  };
};
