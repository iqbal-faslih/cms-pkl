export const getStoredValue = (key) =>
  sessionStorage.getItem(key) || localStorage.getItem(key) || "";

export const resolveStoredRole = () =>
  String(getStoredValue("role")).trim().toLowerCase();
