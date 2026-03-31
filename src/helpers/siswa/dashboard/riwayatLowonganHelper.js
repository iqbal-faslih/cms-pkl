const STATUS_COLORS = {
  diterima: "#16A34A",
  menunggu: "#FF9F43",
  ditolak: "#EE0202",
  "-": "#6B7280",
};

export const normalizeLowonganStatus = (status) => {
  if (status === null || status === undefined) return "-";
  const normalized = String(status).trim();
  return normalized || "-";
};

export const lowonganStatusColor = (status) => {
  const normalized = normalizeLowonganStatus(status).toLowerCase();
  return STATUS_COLORS[normalized] || STATUS_COLORS["-"];
};

export const toDisplayStatus = (status) => {
  const normalized = normalizeLowonganStatus(status).toLowerCase();
  if (normalized === "-") return "-";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};
