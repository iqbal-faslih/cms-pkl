import { useState, useRef, useCallback } from "react";
import { 
  validateImageFile, 
  createImagePreview, 
  uploadProfileImage, 
  processUploadedImages 
} from "../../../helpers/siswa/account-settings/imageUploadHelper";
import useFileInput from "../../useFileInput";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../../helpers/sweetAlertHelper";

const useEditPP = ({ 
  profileImage, 
  setProfileImage, 
  onSuccess,
  maxSizeMB = 2,
  maxDimensions = { width: 1800, height: 1200 },
  pesertaId
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const {
    file: profileFile,
    fileName: profileFileName,
    setFile: setProfileFile,
    setFileName: setProfileFileName
  } = useFileInput(maxSizeMB);

  const [tempProfilePreview, setTempProfilePreview] = useState(null);

  const profileInputRef = useRef(null);

  // ✅ Enhanced validation function with dimensions check
  const validateFileWithDimensions = useCallback((file, onValid) => {
    if (!file) return;

    // Basic file validation using helper
    const validation = validateImageFile(file, maxSizeMB);
    
    if (!validation.isValid) {
      showErrorAlert(validation.error);
      return;
    }

    // Format check (additional to helper validation)
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      showErrorAlert("Hanya boleh JPEG atau PNG!");
      return;
    }

    // Dimension check
    const img = new Image();
    img.onload = () => {
      if (img.width > maxDimensions.width || img.height > maxDimensions.height) {
        showErrorAlert(`Ukuran maksimal ${maxDimensions.width}x${maxDimensions.height}px!`);
        return;
      }
      onValid(file);
    };
    img.onerror = () => {
      showErrorAlert("Gagal memuat gambar!");
    };
    img.src = URL.createObjectURL(file);
  }, [maxSizeMB, maxDimensions]);

  const handleImageSelect = useCallback((e, type) => {
    const file = e.target.files[0];
    
    validateFileWithDimensions(file, (validFile) => {
      // Create preview
      const previewUrl = createImagePreview(validFile);

       if (type === "profile") {
        setProfileFile(validFile);
        setProfileFileName(validFile.name);
        setTempProfilePreview(previewUrl);
      }

      setUploadError(null);
    });
  }, [validateFileWithDimensions, setProfileFile, setProfileFileName]);

  // Handle drag and drop
  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateFileWithDimensions(file, (validFile) => {
        const fakeEvent = { target: { files: [validFile] } };
        handleImageSelect(fakeEvent, type);
      });
    }
  }, [validateFileWithDimensions, handleImageSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleOpenModal = useCallback(() => {
    // Reset temp states when opening modal
    setTempProfilePreview(profileImage);
    setShowUploadModal(true);
    setUploadError(null);
  }, [profileImage]);

  const handleCloseModal = useCallback(() => {
    setShowUploadModal(false);
    
    // Reset file inputs
    setProfileFile(null);
    setProfileFileName("");
    
    // Reset previews
    setTempProfilePreview(null);
    
    setUploadError(null);
  }, [ setProfileFile, setProfileFileName]);

  const handleSaveImages = useCallback(async () => {
    if (!profileFile) {
      showWarningAlert("Pilih Foto", "Pilih minimal satu foto untuk diupload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedData = await uploadProfileImage(profileFile, pesertaId);
      const processedImages = processUploadedImages(uploadedData);

      // Update images in parent component
      if (processedImages.profileImage) {
        setProfileImage(processedImages.profileImage);
      }

      // Reset all states
      handleCloseModal();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      showSuccessAlert("Foto berhasil diupload").then(() => {
        window.location.reload();
      });

    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Gagal mengupload foto";
      setUploadError(errorMessage);
      
      showErrorAlert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [profileFile, pesertaId, onSuccess, setProfileImage, handleCloseModal]);

  const resetTempImage = useCallback((type) => {
    if (type === "profile") {
      setProfileFile(null);
      setProfileFileName("");
      setTempProfilePreview(profileImage);
      // Reset input value
      if (profileInputRef.current) {
        profileInputRef.current.value = "";
      }
    }
  }, [setProfileFile, setProfileFileName, profileImage]);

  return {
    // Modal state
    showUploadModal,
    isUploading,
    uploadError,
    
    // File data (profile only)
    profileFile,
    profileFileName,
    tempProfilePreview,
    
    // Refs
    profileInputRef,
    
    // Handlers
    handleImageSelect,
    handleDrop,
    handleDragOver,
    handleOpenModal,
    handleSaveImages,
    handleCloseModal,
    resetTempImage,
    
    // Computed values
    hasChanges: Boolean(profileFile),
    isDisabled: !profileFile || isUploading
  };
};

export default useEditPP;
