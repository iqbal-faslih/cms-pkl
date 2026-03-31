import { formatDate, formatTime } from "../utils/dateUtils";
export const USE_EXPIRED = true; // ubah ke false kalau kamu mau matikan expired

/**
 * Check if presentation is expired based on date and time
 * @param {string} dateString - Presentation date (YYYY-MM-DD)
 * @param {string} endTime - Presentation end time (HH:MM)
 * @returns {boolean}
 */
export const isPresentationExpired = (dateString, endTime = null, useExpired = USE_EXPIRED) => {
  if (!useExpired) return false;
  if (!dateString) return false;

  try {
    const now = new Date();

    if (endTime) {
      const [hours, minutes] = endTime.split(":").map(num => parseInt(num));
      const endDate = new Date(dateString);
      endDate.setHours(hours, minutes, 0, 0);
      return now > endDate;
    }

    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);
    return now > endOfDay;
  } catch {
    return false;
  }
};


/**
 * Get effective status considering expiration with date and time
 * @param {Object} presentation - Presentation object
 * @returns {string} - Effective status
 */
export const getEffectiveStatus = (presentation, useExpired = USE_EXPIRED) => {
  if (!presentation) return "Unknown";

  const originalStatus = presentation.status || "Dijadwalkan";

  if (["Selesai", "Dibatalkan", "Berlangsung"].includes(originalStatus)) {
    return originalStatus;
  }

  if (!useExpired) return originalStatus;

  const isExpiredNow = isPresentationExpired(
    presentation.originalData?.tanggal,
    presentation.originalData?.waktu_selesai,
    useExpired
  );

  return isExpiredNow ? "Kadaluarsa" : originalStatus;
};


/**
 * @param {string} status 
 * @returns {string}
 */
export const getBackgroundImage = (tipe) => {
  const lower = tipe?.toLowerCase() || "";

  if (lower.includes("online")) {
    return "/assets/svg/biru.svg";
  }

  return "/assets/svg/kuning.svg";
};


/**
 * @param {string} status 
 * @returns {string} 
 */
export const getStatusColor = (status) => {
  const statusColors = {
    "Selesai": "bg-[#0073FF]",
    "Dijadwalkan": "bg-[#FFA42E]", 
    "Dibatalkan": "bg-red-200",
    "Berlangsung": "bg-blue-200",
    "Kadaluarsa": "bg-gray-300"
  };
  return statusColors[status] || "bg-gray-200";
};

/**
 * @param {Array} apiData - Raw data from API (sesuai backend structure)
 * @returns {Array} - Transformed presentation data
 */


export const transformPresentationData = (apiData, useExpired = USE_EXPIRED) => {
  if (!Array.isArray(apiData)) return [];

  try {
    return apiData.map((presentation, index) => {
      const formattedDate = formatDate(presentation.tanggal);

      const base = {
        id: presentation.id || index + 1,
        tipe: presentation.tipe || "Presentasi Offline",
        date: formattedDate,
        time: formatTime(presentation.waktu_mulai, presentation.waktu_selesai),
        status: presentation.status || "Dijadwalkan",
        kuota: presentation.kuota || 30,
        applicants: presentation.jumlah_pendaftar || 0,
        linkZoom: presentation.link_zoom || null,
        lokasi: presentation.lokasi || null,
        catatan: presentation.catatan || null,
        originalData: presentation
      };

      const effectiveStatus = getEffectiveStatus(base, useExpired);
      const expired = isPresentationExpired(formattedDate, presentation.waktu_selesai, useExpired);

      return {
        ...base,
        status: effectiveStatus,
        isExpired: expired,
        backgroundImage: getBackgroundImage(presentation.tipe)
      };
    });
  } catch {
    return [];
  }
};


/**
 * @param {Object} presentation - Presentation object
 * @returns {boolean} - Whether presentation is available
 */
export const isPresentationAvailable = (presentation) => {
  if (!presentation) return false;
  
  const effectiveStatus = getEffectiveStatus(presentation);
  
  // Jika tidak ada kuota system, asumsi selalu available (kecuali status tertentu)
  const hasQuotaSystem = presentation.kuota && presentation.kuota > 0;
  const isQuotaFull = hasQuotaSystem && (presentation.applicants || 0) >= presentation.kuota;
  
  return effectiveStatus !== "Selesai" && 
         effectiveStatus !== "Dibatalkan" &&
         effectiveStatus !== "Kadaluarsa" &&
         !isQuotaFull;
};

/**
 * @param {string} status - Presentation status
 * @param {boolean} isAvailable - Whether presentation is available
 * @returns {string} - Button label
 */
export const getButtonLabel = (status, isAvailable) => {
  if (status === "Selesai") return "Selesai";
  if (status === "Dibatalkan") return "Dibatalkan";
  if (status === "Kadaluarsa") return "Kadaluarsa";
  if (!isAvailable) return "Kuota Penuh";
  return "Apply Presentation";
};

/**
 * Get presentations that are expired but not marked as finished
 * @param {Array} presentations - Array of presentations
 * @returns {Array} - Expired presentations
 */
export const getExpiredPresentations = (presentations) => {
  return presentations.filter(presentation => 
    presentation.isExpired && 
    !['Selesai', 'Dibatalkan'].includes(presentation.status)
  );
};

/**
 * Get presentations statistics including expired count
 * @param {Array} presentations - Array of presentations
 * @returns {Object} - Statistics object
 */
export const getPresentationStatsWithExpired = (presentations) => {
  const stats = presentations.reduce((acc, presentation) => {
    const effectiveStatus = getEffectiveStatus(presentation);
    acc[effectiveStatus] = (acc[effectiveStatus] || 0) + 1;
    return acc;
  }, {});

  return {
    total: presentations.length,
    selesai: stats['Selesai'] || 0,
    dijadwalkan: stats['Dijadwalkan'] || 0,
    berlangsung: stats['Berlangsung'] || 0,
    dibatalkan: stats['Dibatalkan'] || 0,
    kadaluarsa: stats['Kadaluarsa'] || 0,
    available: presentations.filter(isPresentationAvailable).length
  };
};