import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { createJurnal } from "../../../helpers/apiClient";
import useModalTambahStore from "../../../stores/useModalTambahStore"
import { extractErrorMessage } from "../../../helpers/extractErrorMessage";
import { showErrorAlert } from "../../../helpers/sweetAlertHelper";

export const useModalTambahJurnal = (onSubmitSuccess) => {
  const { isOpen, openModal, closeModal } = useModalTambahStore();
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const MAX_DESCRIPTION_LENGTH = 150;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (file) => {
    // Handle file removal
    if (file === null) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setErrors((prev) => ({ ...prev, bukti: null }));
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      Swal.fire(
        "Format File Tidak Didukung!",
        "File harus berupa PNG, JPG, atau JPEG.",
        "warning"
      );
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Add file size validation
    if (file.size > MAX_FILE_SIZE) {
      Swal.fire("Peringatan", "Ukuran file maksimal 5MB", "warning");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, bukti: null }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Judul wajib diisi.";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi wajib diisi.";
    else if (formData.description.length < MAX_DESCRIPTION_LENGTH)
      newErrors.description = `Deskripsi harus minimal ${MAX_DESCRIPTION_LENGTH} karakter.`;
    if (!selectedFile) newErrors.bukti = "Bukti wajib diunggah.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    const form = new FormData();
    form.append("judul", formData.title);
    form.append("deskripsi", formData.description);
    form.append("bukti", selectedFile);

    try {
      await createJurnal(form);
      Swal.fire("Berhasil!", "Jurnal berhasil ditambahkan.", "success");
      if (onSubmitSuccess) onSubmitSuccess();
      closeModal();
      resetForm();
    } catch (error) {
      const statusCode = error.response?.status;
      if (statusCode === 409) {
        Swal.fire("Perhatian!", error.response.data.message, "warning");
      } else {
        showErrorAlert(extractErrorMessage(error))
      }
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrors({});
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    formData,
    setFormData,
    selectedFile,
    previewUrl,
    isSubmitting,
    errors,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleSubmit,
    resetForm,
  };
};