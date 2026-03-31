import { editFotoSiswa } from "../../apiClient";
// Constants for image upload
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const MAX_DIMENSIONS = { width: 200, height: 200 }; // Default max dimensions

const FILE_BASE_URL =
  import.meta.env.VITE_API_URL_FILE || import.meta.env.VITE_FILE_URL || import.meta.env.VITE_API_URL || "";

const normalizeFileUrl = (path) => {
  const rawPath = String(path || "").trim();
  if (!rawPath) return "";
  if (/^(https?:\/\/|data:|blob:)/i.test(rawPath)) return rawPath;

  const cleanBase = String(FILE_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!cleanBase) return rawPath;

  const cleanPath = rawPath.replace(/^\/+/, "");
  const baseEndsWithStorage = /\/storage$/i.test(cleanBase);

  if (rawPath.startsWith("/storage/")) {
    if (baseEndsWithStorage) {
      return `${cleanBase}/${cleanPath.replace(/^storage\/+/, "")}`;
    }
    return `${cleanBase}${rawPath}`;
  }

  if (baseEndsWithStorage) {
    return `${cleanBase}/${cleanPath.replace(/^storage\/+/, "")}`;
  }

  return `${cleanBase}/storage/${cleanPath.replace(/^storage\/+/, "")}`;
};

const withCacheBust = (url) => {
  if (!url) return "";
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${Date.now()}`;
};

const pickProfilePath = (uploadedData = {}) => {
  const candidates = [
    uploadedData?.foto_profile?.path,
    uploadedData?.foto_profile?.url,
    uploadedData?.profile_image?.path,
    uploadedData?.profile_image?.url,
    uploadedData?.profile?.path,
    uploadedData?.profile?.url,
    uploadedData?.avatar?.path,
    uploadedData?.avatar?.url,
    typeof uploadedData?.profile_image === "string" ? uploadedData.profile_image : "",
    typeof uploadedData?.profile === "string" ? uploadedData.profile : "",
    typeof uploadedData?.avatar === "string" ? uploadedData.avatar : "",
    uploadedData?.user?.foto_profile?.path,
    uploadedData?.user?.foto_profile?.url,
    uploadedData?.user?.profile_image?.path,
    uploadedData?.user?.profile_image?.url,
    typeof uploadedData?.user?.avatar === "string" ? uploadedData.user.avatar : "",
  ];

  return candidates.find((item) => String(item || "").trim()) || "";
};

// Validation functions
export const validateImageFile = (file, maxSizeMB = 2) => {
  if (!file) {
    return { isValid: false, error: "File tidak ditemukan" };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: "File harus berupa gambar (JPG/PNG)" };
  }

  // Additional check for accepted types
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: "Format file harus JPG atau PNG" };
  }

  return { isValid: true, error: null };
};

// Validate image dimensions
export const validateImageDimensions = (file, maxDimensions = MAX_DIMENSIONS) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ isValid: false, error: "File tidak ditemukan" });
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width > maxDimensions.width || img.height > maxDimensions.height) {
        resolve({ 
          isValid: false, 
          error: `Ukuran maksimal ${maxDimensions.width}x${maxDimensions.height}px!` 
        });
      } else {
        resolve({ isValid: true, error: null });
      }
    };
    img.onerror = () => {
      resolve({ isValid: false, error: "Gagal memuat gambar!" });
    };
    img.src = URL.createObjectURL(file);
  });
};

// Create preview URL for image
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

// Upload profile image to server (specific for peserta profile photo)
export const uploadProfileImage = async (profileFile, pesertaId) => {
  if (!profileFile) {
    throw new Error("File profil tidak ditemukan atau belum dipilih");
  }

  if (!pesertaId) {
    throw new Error("ID peserta tidak ditemukan");
  }

  const formData = new FormData();
  formData.append("profile", profileFile);
  // Backend peserta tidak konsisten antar environment: kirim alias field juga.
  formData.append("foto", profileFile);
  formData.append("avatar", profileFile);

  try {
    const response = await editFotoSiswa(pesertaId, formData);
    const responseBody = response?.data || {};
    const isSuccess =
      String(responseBody?.meta?.status || "").toLowerCase() === "success" ||
      String(responseBody?.status || "").toLowerCase() === "success" ||
      Number(responseBody?.meta?.code) === 200;

    if (!isSuccess) {
      throw new Error(
        responseBody?.meta?.message || responseBody?.message || "Gagal mengupload foto profil"
      );
    }

    return responseBody?.data || {};
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Peserta dengan ID ${pesertaId} tidak ditemukan`);
    } else if (error.response?.status === 422) {
      throw new Error("Format file tidak valid atau ukuran terlalu besar");
    } else if (error.response?.status === 500) {
      throw new Error("Terjadi kesalahan pada server");
    }
    
    throw error;
  }
};

// Legacy function for backward compatibility (cover + profile)
export const uploadImages = async (coverFile, profileFile, pesertaId) => {
  // For now, only handle profile image since the new endpoint is for profile only
  if (profileFile && pesertaId) {
    return await uploadProfileImage(profileFile, pesertaId);
  }
  
  if (coverFile) {
    console.warn("Cover image upload not supported with new endpoint");
    throw new Error("Cover image upload tidak didukung pada endpoint baru");
  }
  
  throw new Error("Tidak ada file atau ID peserta yang valid");
};

// Process uploaded image URLs
export const processUploadedImages = (uploadedData) => {
  const processedImages = {};

  const profilePath = pickProfilePath(uploadedData);
  if (profilePath) {
    processedImages.profileImage = withCacheBust(normalizeFileUrl(profilePath));
  }

  // Legacy support for cover image (if still needed)
  if (uploadedData.cover_image) {
    processedImages.coverImage = uploadedData.cover_image.startsWith('http')
      ? uploadedData.cover_image
      : `${import.meta.env.VITE_API_URL}/${uploadedData.cover_image}`;
  }

  return processedImages;
};

// Complete validation function (file + dimensions)
export const validateImageFileComplete = async (file, maxSizeMB = 2, maxDimensions = MAX_DIMENSIONS) => {
  // Basic file validation
  const fileValidation = validateImageFile(file, maxSizeMB);
  if (!fileValidation.isValid) {
    return fileValidation;
  }

  // Dimensions validation
  const dimensionsValidation = await validateImageDimensions(file, maxDimensions);
  return dimensionsValidation;
};
