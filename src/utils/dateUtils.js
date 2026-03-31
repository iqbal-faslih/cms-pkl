export const formatMonthYear = (date) => {
  const options = { month: "long", year: "numeric" };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
};

export const getDateString = (date) => {
  return date.toISOString().split("T")[0];
};

export const formatDetailDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatSimpleDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateDayMonthYear = (dateInput) => {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDateDDMMYYYY = (dateInput) => {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatInternshipPeriod = (startDate, endDate) => {
  const start = formatDateDDMMYYYY(startDate);
  const end = formatDateDDMMYYYY(endDate);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;
  return "-";
};

export const formatInternshipPeriodLabel = (value) => {
  if (!value) return "-";

  const text = String(value).trim();
  if (!text) return "-";

  const rangeMatch = text.match(
    /^(\d{4}-\d{2}-\d{2})\s*(?:s\/d|-|to|hingga)\s*(\d{4}-\d{2}-\d{2})$/i
  );

  if (rangeMatch) {
    return formatInternshipPeriod(rangeMatch[1], rangeMatch[2]);
  }

  const singleDate = formatDateDDMMYYYY(text);
  return singleDate || text;
};

/**
 * Format date string to Indonesian locale (alias for consistency)
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  return formatDetailDate(dateString);
};

/**
 * Format time range or duration
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @param {string} duration - Duration
 * @returns {string} - Formatted time string
 */
export const formatTime = (startTime, endTime, duration) => {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }
  if (startTime && duration) {
    return `${startTime} (${duration})`;
  }
  return startTime || "";
};

/**
 * Ambil informasi tanggal hari ini
 * @returns {{
 *   dateObj: Date,
 *   formatted: string,
 *   short: string
 * }}
 */
export const getTodayInfo = () => {
  const today = new Date();

  return {
    dateObj: today,
    formatted: today.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }), // contoh: "Selasa, 2 September 2025"

    short: today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }), // contoh: "2 Sep 2025"
  };
};

export const isPastDate = (date) => {
  const today = new Date().toISOString().split("T")[0];
  return new Date(date) < new Date(today);
};

import dayjs from "dayjs";

export const formatDateToBackend = (date) =>
  date ? dayjs(date).format("YYYY-MM-DD") : undefined;
