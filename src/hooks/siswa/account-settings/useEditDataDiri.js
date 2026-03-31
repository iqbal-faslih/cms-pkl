import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editDataDiriSiswa } from "../../../helpers/apiClient";
import {
  dataDiriSiswaSchema,
  defaultDataDiriValues,
  cleanFormData,
} from "../../../schema/siswa/data-diri/validationSchema";
import {
  showErrorAlert,
  showSuccessAlert,
} from "../../../helpers/sweetAlertHelper";
import { toDateInputValue } from "../../../helpers/siswa/pesertaDataHelper";

export const useEditDataDiri = ({ initialData, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form with Zod validation
  const form = useForm({
    resolver: zodResolver(dataDiriSiswaSchema),
    defaultValues: defaultDataDiriValues,
    mode: "onChange", // Validate on change for sbetter UX
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    watch,
    clearErrors,
  } = form;

  // Watch all form values to detect changes
  const watchedValues = watch();

  const normalizeGenderValue = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    if (["l", "laki-laki", "laki", "male", "pria"].includes(normalized)) return "L";
    if (["p", "perempuan", "female", "wanita"].includes(normalized)) return "P";
    return "";
  };

  // Initialize form data when modal opens
  const handleOpenModal = () => {
    if (initialData) {
      // Reset form with initial data
      const formData = {
        nama: initialData.nama || "",
        jenis_kelamin: normalizeGenderValue(initialData.jenis_kelamin),
        tempat_lahir: initialData.tempat_lahir || "",
        tanggal_lahir: toDateInputValue(initialData.tanggal_lahir),
        alamat: initialData.alamat || "",
        telepon: initialData.telepon || "",
        nomor_identitas: initialData.nomor_identitas || "",
        sekolah: initialData.sekolah || "",
        jurusan: initialData.jurusan || "",
      };

      reset(formData);
    } else {
      reset(defaultDataDiriValues);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return; // Prevent closing while submitting

    setShowModal(false);

    // Reset form after a brief delay to prevent flash
    setTimeout(() => {
      reset(defaultDataDiriValues);
    }, 150);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Clean and prepare form data
      const cleanedData = cleanFormData(data);

      // Validate data again (extra safety)
      const validatedData = dataDiriSiswaSchema.parse(cleanedData);

      // Submit to API
      await editDataDiriSiswa(
        initialData.updateIdCandidates || initialData.id,
        validatedData
      );

      showSuccessAlert("Data diri berhasil diperbarui!").then(() => {
        window.location.reload(); // reload setelah user klik OK di alert
      });
      handleCloseModal();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating data:", error);

      // Handle Zod validation errors (shouldn't happen if form is valid)
      if (error.name === "ZodError") {
        showErrorAlert("Terdapat kesalahan validasi pada form");
        return;
      }

      // Handle API validation errors
      if (error.response?.status === 422 && error.response.data?.errors) {
        const serverErrors = error.response.data.errors;
        const aliasMap = {
          nisn: "nomor_identitas",
          nim: "nomor_identitas",
          gender: "jenis_kelamin",
        };
        let firstErrorMessage = "";

        // Set server errors to form
        Object.keys(serverErrors).forEach((field) => {
          const message = serverErrors[field]?.[0];
          if (message) {
            if (!firstErrorMessage) firstErrorMessage = String(message);
            const normalizedField = aliasMap[field] || field;
            form.setError(normalizedField, {
              type: "server",
              message: String(message),
            });
          }
        });

        showErrorAlert(firstErrorMessage || "Terdapat kesalahan pada form");
      } else if (error.response?.data?.message) {
        showErrorAlert(error.response.data.message);
      } else if (error.message) {
        showErrorAlert(`Gagal memperbarui data: ${error.message}`);
      } else {
        showErrorAlert("Gagal memperbarui data diri");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form has changes compared to initial data
  const hasChanges = () => {
    if (!initialData || !isDirty) return false;

    return Object.keys(watchedValues).some((key) => {
      const currentValue = watchedValues[key] || "";
      const initialValue = initialData[key] || "";
      return currentValue !== initialValue;
    });
  };

  // Utility function to get field error
  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message || "";
  };

  // Utility function to check if field has error
  const hasFieldError = (fieldName) => {
    return !!errors[fieldName];
  };

  // Utility function to clear specific field error
  const clearFieldError = (fieldName) => {
    clearErrors(fieldName);
  };

  // Utility function to set field value programmatically
  const setFieldValue = (fieldName, value) => {
    setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return {
    // Modal state
    showModal,
    isSubmitting,

    // Form state
    isValid,
    isDirty,
    hasChanges: hasChanges(),
    errors,

    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    reset,

    // Modal handlers
    handleOpenModal,
    handleCloseModal,

    // Utility methods
    getFieldError,
    hasFieldError,
    clearFieldError,
    setFieldValue,

    // Form object (for advanced usage)
    form,
  };
};
