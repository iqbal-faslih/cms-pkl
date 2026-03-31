import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { updateJurnal } from "../../../helpers/apiClient";
import useModalEditStore from "../../../stores/useModalEditStore"
import { extractErrorMessage } from "../../../helpers/extractErrorMessage";
import { showErrorAlert, showSuccessAlert } from "../../../helpers/sweetAlertHelper";

export const useModalEditJurnal = () => {
  const { isOpen, jurnalData, closeModal } = useModalEditStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: ""
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_DESCRIPTION_LENGTH = 150;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    if (isOpen && jurnalData) {
      setFormData({
        title: jurnalData.title || "",
        description: jurnalData.description || "",
        image: jurnalData.image || ""
      });
      setPreviewImage(jurnalData.image || "");
    }
  }, [isOpen, jurnalData]);

  useEffect(() => {
    if (formData.image instanceof File) {
      const url = URL.createObjectURL(formData.image);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewImage(formData.image || "");
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      // Handle file removal (empty files array)
      if (!files || files.length === 0) {
        setFormData((prev) => ({ ...prev, image: "" }));
        setPreviewImage("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      
      // Handle file selection
      const file = files[0];
      
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        Swal.fire(
          "Format File Tidak Didukung!",
          "File harus berupa PNG, JPG, atau JPEG.",
          "warning"
        );
        return;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire("Peringatan", "Ukuran file maksimal 5MB", "warning");
        return;
      }
      
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create synthetic event for handleChange
      const syntheticEvent = {
        target: {
          name: 'image',
          files: [file]
        }
      };
      handleChange(syntheticEvent);
    }
  };

  const handleSave = async (onUpdate) => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Swal.fire("Peringatan", "Judul dan deskripsi wajib diisi.", "warning");
      return;
    }

    if (formData.description.length < MAX_DESCRIPTION_LENGTH) {
      Swal.fire("Peringatan", `Deskripsi harus minimal ${MAX_DESCRIPTION_LENGTH} karakter.`, "warning");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("judul", formData.title);
      fd.append("deskripsi", formData.description);
      if (formData.image instanceof File) {
        fd.append("bukti", formData.image);
      }

      await updateJurnal(jurnalData.id, fd);

      showSuccessAlert("Jurnal berhasil diperbarui");

      if (onUpdate) onUpdate();
      closeModal();
    } catch (error) {
      console.error("Gagal update jurnal:", error);
      showErrorAlert(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    jurnalData,
    formData,
    previewImage,
    loading,
    MAX_DESCRIPTION_LENGTH,
    fileInputRef,
    handleChange,
    handleFileClick,
    handleDragOver,
    handleDrop,
    handleSave,
    closeModal
  };
};