// @/shared/utils/fileUploadUtils.js

/**
 * Konfigurasi default untuk upload file
 */
export const FILE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: {
    image: ['image/jpeg', 'image/jpg', 'image/png'],
    document: ['application/pdf'],
    all: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  },
  acceptString: 'image/*,application/pdf'
};

/**
 * Validasi ukuran file
 * @param {File} file - File yang akan divalidasi
 * @param {number} maxSize - Ukuran maksimal dalam bytes
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateFileSize = (file, maxSize = FILE_UPLOAD_CONFIG.maxSize) => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Ukuran file terlalu besar! Maksimal ${maxSizeMB}MB`
    };
  }
  return { valid: true, error: null };
};

/**
 * Validasi tipe file
 * @param {File} file - File yang akan divalidasi
 * @param {Array} allowedTypes - Array tipe MIME yang diizinkan
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateFileType = (file, allowedTypes = FILE_UPLOAD_CONFIG.acceptedTypes.all) => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipe file tidak valid! Hanya JPG, PNG, atau PDF yang diizinkan'
    };
  }
  return { valid: true, error: null };
};

/**
 * Validasi file secara lengkap (size + type)
 * @param {File} file - File yang akan divalidasi
 * @param {Object} options - Opsi validasi { maxSize, allowedTypes }
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = FILE_UPLOAD_CONFIG.maxSize,
    allowedTypes = FILE_UPLOAD_CONFIG.acceptedTypes.all
  } = options;

  // Validasi ukuran
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  // Validasi tipe
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  return { valid: true, error: null };
};

/**
 * Konversi file ke base64
 * @param {File} file - File yang akan dikonversi
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(new Error('Gagal membaca file: ' + error.message));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get informasi file
 * @param {File} file - File object
 * @returns {Object} Informasi file
 */
export const getFileInfo = (file) => {
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    lastModified: file.lastModified,
    lastModifiedDate: new Date(file.lastModified)
  };
};

/**
 * Format ukuran file ke format readable
 * @param {number} bytes - Ukuran dalam bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Buka file picker dan handle file selection
 * @param {Object} options - Opsi upload
 * @param {string} options.accept - Accept attribute untuk input file
 * @param {boolean} options.multiple - Allow multiple files
 * @param {Function} options.onSelect - Callback saat file dipilih
 * @param {Function} options.onError - Callback saat error
 * @param {Object} options.validation - Opsi validasi
 * @returns {void}
 */
export const openFilePicker = (options = {}) => {
  const {
    accept = FILE_UPLOAD_CONFIG.acceptString,
    multiple = false,
    onSelect,
    onError,
    validation = {}
  } = options;

  // Buat input file tersembunyi
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.multiple = multiple;

  input.onchange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    try {
      // Validasi semua file
      for (const file of files) {
        const validationResult = validateFile(file, validation);
        if (!validationResult.valid) {
          if (onError) {
            onError(validationResult.error, file);
          } else {
            alert(validationResult.error);
          }
          return;
        }
      }

      // Konversi file ke base64
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          const info = getFileInfo(file);
          return {
            file,
            base64,
            info
          };
        })
      );

      // Callback dengan hasil
      if (onSelect) {
        if (multiple) {
          onSelect(processedFiles);
        } else {
          onSelect(processedFiles[0]);
        }
      }
    } catch (error) {
      if (onError) {
        onError(error.message);
      } else {
        alert('Terjadi kesalahan: ' + error.message);
      }
    }
  };

  input.click();
};

/**
 * Upload single file dengan validasi
 * @param {Object} options - Opsi upload
 * @returns {Promise<Object>} Hasil upload { base64, info }
 */
export const uploadSingleFile = (options = {}) => {
  return new Promise((resolve, reject) => {
    openFilePicker({
      ...options,
      multiple: false,
      onSelect: (result) => resolve(result),
      onError: (error) => reject(new Error(error))
    });
  });
};

/**
 * Upload multiple files dengan validasi
 * @param {Object} options - Opsi upload
 * @returns {Promise<Array>} Array hasil upload
 */
export const uploadMultipleFiles = (options = {}) => {
  return new Promise((resolve, reject) => {
    openFilePicker({
      ...options,
      multiple: true,
      onSelect: (results) => resolve(results),
      onError: (error) => reject(new Error(error))
    });
  });
};

/**
 * Download file dari base64 atau URL
 * @param {string} dataUrl - Base64 data URL atau URL file
 * @param {string} filename - Nama file untuk download
 */
export const downloadFile = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Check apakah file adalah PDF
 * @param {string} urlOrType - URL file atau MIME type
 * @returns {boolean}
 */
export const isPDF = (urlOrType) => {
  if (!urlOrType) return false;
  return urlOrType.includes('.pdf') || urlOrType.includes('application/pdf');
};

/**
 * Check apakah file adalah gambar
 * @param {string} urlOrType - URL file atau MIME type
 * @returns {boolean}
 */
export const isImage = (urlOrType) => {
  if (!urlOrType) return false;
  return urlOrType.includes('image/') || 
         /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(urlOrType);
};