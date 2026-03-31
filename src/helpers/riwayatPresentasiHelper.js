import { FULL_MONTH_NAMES, FULL_DAY_LABELS } from "./dateConstant";

export const capitalizeMethod = (method) => {
  if (!method) return "Offline";
  return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
};

export const formatTime = (timeString) => {
  if (!timeString) return "00.00";
  try {
    return timeString.split(':').slice(0, 2).join('.');
  } catch {
    return timeString;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "Tanggal belum tersedia";
  try {
    const date = new Date(dateString);
    const days = FULL_DAY_LABELS;
    const months = FULL_MONTH_NAMES;

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
};

export const transformStatus = (status) => {
  if (!status) return "Dijadwalkan";
  if (typeof status === "string") {
    const lowerStatus = status.toLowerCase();
    if (
      lowerStatus.includes("selesai") ||
      lowerStatus.includes("hadir") ||
      lowerStatus.includes("completed") ||
      lowerStatus.includes("done")
    ) {
      return "Selesai";
    }
    if (
      lowerStatus.includes("dijadwalkan") ||
      lowerStatus.includes("scheduled") ||
      lowerStatus.includes("pending")
    ) {
      return "Dijadwalkan";
    }
  }
  if (typeof status === "number") return status === 1 ? "Selesai" : "Dijadwalkan";
  if (typeof status === "boolean") return status ? "Selesai" : "Dijadwalkan";
  return "Dijadwalkan";
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};
