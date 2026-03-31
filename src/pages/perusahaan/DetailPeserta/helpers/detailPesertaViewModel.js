export const DEFAULT_PUNISH_IMAGE = "/assets/img/defaultPP.png";
export const DEFAULT_ROUTE_IMAGE = "/assets/img/Cover3.png";

export const formatDetailDateLong = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const toTitleCase = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "-";
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const buildStatsCards = (detail, statistics = []) => [
  { ...statistics[0], count: detail?.totalAbsensi ?? 0, chartData: [detail?.totalAbsensi ?? 0] },
  { ...statistics[1], count: detail?.totalHadir ?? 0, chartData: [detail?.totalHadir ?? 0] },
  { ...statistics[2], count: detail?.totalIzinSakit ?? 0, chartData: [detail?.totalIzinSakit ?? 0] },
  { ...statistics[3], count: detail?.totalAlpa ?? 0, chartData: [detail?.totalAlpa ?? 0] },
];

export const buildStatusSpView = (detail = {}) => ({
  hasSp: Boolean(detail?.hasSp),
  label: detail?.statusSpLabel || "",
  description: detail?.statusSpDescription || "",
});

export const getPunishmentItems = (detail = {}) =>
  Array.isArray(detail?.punishment) ? detail.punishment : [];

export const getRouteItems = (detail = {}) =>
  Array.isArray(detail?.routeProject) ? detail.routeProject : [];
