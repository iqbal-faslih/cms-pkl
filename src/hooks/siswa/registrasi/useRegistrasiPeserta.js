import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { showErrorAlert, showSuccessAlert } from "../../../helpers/sweetAlertHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StatusContext } from "../../../pages/student/StatusContext";
import { registrasiPeserta } from "../../../helpers/apiClient";
import {
  dataDiriSiswaSchema,
  uploadPhotoSchema,
  uploadDocumentSchema,
  defaultDataDiriValues,
  cleanFormData,
} from "../../../schema/siswa/data-diri/validationSchema";

// Combined schema for the entire registration form
const registrationFormSchema = z.object({
  ...dataDiriSiswaSchema.shape,
  profile: uploadPhotoSchema.shape.photo.optional(),
  cv: uploadDocumentSchema.shape.document.optional(),
});

const REGISTRATION_PAYLOAD_KEY_MAP = {
  nomor_identitas: ["nisn", "nomor_identitas"],
};

const appendRegistrationFields = (formData, values) => {
  Object.entries(values).forEach(([key, value]) => {
    if (key === "profile" || key === "cv" || value === null || value === undefined) {
      return;
    }

    const targetKeys = REGISTRATION_PAYLOAD_KEY_MAP[key] || [key];
    targetKeys.forEach((targetKey) => {
      formData.append(targetKey, value);
    });
  });
};

const markProfileAsCompletedInCache = () => {
  sessionStorage.setItem("profileComplete", JSON.stringify(true));
  // Registrasi data diri tidak berarti sudah melamar/terdaftar magang.
  // Selalu reset kedua status ini agar guard tidak salah membuka fitur.
  sessionStorage.setItem("internshipStatus", JSON.stringify(false));
  sessionStorage.setItem("applyingStatus", JSON.stringify(false));
};

export const useRegistrasiPeserta = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cvFileName, setCvFileName] = useState("");

  const { refreshUserData } = useContext(StatusContext);

  // Initialize react-hook-form with Zod validation
  const form = useForm({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      ...defaultDataDiriValues,
      profile: null,
      cv: null,
    },
    mode: "onChange", // Validate on change for better UX
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    watch,
    clearErrors,
    control,
  } = form;

  // Watch all form values
  const watchedValues = watch();

  // Handle photo upload with preview
  const handlePhotoUpload = (file) => {
    if (!file) return;

    setValue("profile", file, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  // Handle CV file upload
  const handleCvUpload = (file) => {
    if (!file) return;

    setValue("cv", file, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
    setCvFileName(file.name);
  };

  // Reset entire form state
  const resetForm = () => {
    reset({
      ...defaultDataDiriValues,
      profile: null,
      cv: null,
    });
    setPreviewUrl("");
    setCvFileName("");
  };

  // Show success alert using SweetAlert

  // Main form submission handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Clean and prepare form data
      const cleanedData = cleanFormData(data);
      
      // Validate data again (extra safety)
      const validatedData = registrationFormSchema.parse(cleanedData);

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append basic data fields
      appendRegistrationFields(formDataToSend, validatedData);

      // Append files if they exist
      if (validatedData.cv && validatedData.cv instanceof File) {
        formDataToSend.append("cv", validatedData.cv);
      }
      if (validatedData.profile && validatedData.profile instanceof File) {
        formDataToSend.append("profile", validatedData.profile);
        // Backward compatibility for backends that still validate photo as `foto`.
        formDataToSend.append("foto", validatedData.profile);
      }

      // Submit to API
      const response = await registrasiPeserta(formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Optimistic update: registrasi sukses berarti profile sudah lengkap.
      markProfileAsCompletedInCache();

      // Refresh user data (non-blocking for UX)
      try {
        await refreshUserData({ silent: true });
      } catch (refreshError) {
        console.warn("Refresh user data failed after successful registration:", refreshError);
      }
      
      console.log("Registration successful:", response.data);
      
      // Show success modal or alert
      showSuccessAlert("Berhasil Melengkapi!").then(() => {
        window.location.reload(); // reload setelah user klik OK di alert
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (error) {
      console.error("Registration error:", error);
      console.error("Registration response:", error?.response?.data);

      // Handle Zod validation errors
      if (error.name === "ZodError") {
        showErrorAlert("Terdapat kesalahan validasi pada form");
        return;
      }

      // Handle API validation errors
      if (error.response?.status === 422) {
        const responseData = error.response?.data || {};
        const serverErrors =
          responseData.errors ||
          responseData.meta ||
          responseData.data?.errors ||
          {};
        const aliasMap = {
          nisn: "nomor_identitas",
          nim: "nomor_identitas",
          foto: "profile",
          avatar: "profile",
          image: "profile",
          foto_profile: "profile",
          dokumen: "cv",
          dokumen_cv: "cv",
          curriculum_vitae: "cv",
        };
        let firstErrorMessage = "";

        // Set server errors to form
        Object.keys(serverErrors).forEach((field) => {
          const fieldErrors = Array.isArray(serverErrors[field])
            ? serverErrors[field]
            : [serverErrors[field]];
          const message = fieldErrors?.[0];
          if (message) {
            if (!firstErrorMessage) firstErrorMessage = String(message);
            const normalizedField = aliasMap[field] || field;
            form.setError(normalizedField, {
              type: "server",
              message: String(message),
            });
          }
        });

        showErrorAlert(firstErrorMessage || responseData?.message || "Terdapat kesalahan pada form");
      } else if (error.response?.data?.message) {
        showErrorAlert(error.response.data.message);
      } else if (error.message) {
        showErrorAlert(`Gagal mendaftar: ${error.message}`);
      } else {
        showErrorAlert("Gagal melakukan pendaftaran");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form has any data entered
  const hasFormData = () => {
    return Object.keys(watchedValues).some((key) => {
      const value = watchedValues[key];
      if (key === 'profile' || key === 'cv') {
        return value instanceof File;
      }
      return value && value.trim() !== "";
    });
  };

  // Get field error message
  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message || "";
  };

  // Check if field has error
  const hasFieldError = (fieldName) => {
    return !!errors[fieldName];
  };

  // Clear specific field error
  const clearFieldError = (fieldName) => {
    clearErrors(fieldName);
  };

  // Set field value programmatically
  const setFieldValue = (fieldName, value) => {
    setValue(fieldName, value, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  // Get current form values
  const getFormValues = () => {
    return watchedValues;
  };

  // Check if specific field is dirty
  const isFieldDirty = (fieldName) => {
    return form.getFieldState(fieldName).isDirty;
  };

  // Validate specific field
  const validateField = async (fieldName) => {
    return await form.trigger(fieldName);
  };

  // Validate entire form
  const validateForm = async () => {
    return await form.trigger();
  };

  // Get file preview URL for specific field
  const getFilePreview = (fieldName) => {
    if (fieldName === 'profile') {
      return previewUrl;
    }
    if (fieldName === 'cv') {
      return cvFileName;
    }
    return null;
  };

  return {
    // Form state
    isSubmitting,
    isValid,
    isDirty,
    hasFormData: hasFormData(),
    errors,
    previewUrl,
    cvFileName,
    
    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    reset: resetForm,
    control,
    
    // File upload handlers
    handlePhotoUpload,
    handleCvUpload,
    
    
    // Utility methods
    getFieldError,
    hasFieldError,
    clearFieldError,
    setFieldValue,
    getFormValues,
    isFieldDirty,
    validateField,
    validateForm,
    getFilePreview,
    
    // Form object (for advanced usage)
    form,
  };
};
