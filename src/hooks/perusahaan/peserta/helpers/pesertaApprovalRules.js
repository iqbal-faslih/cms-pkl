const normalizeToken = (value) => String(value || "").trim().toLowerCase();

const APPROVED_TOKENS = new Set([
  "approved",
  "approve",
  "accepted",
  "diterima",
  "aktif",
  "active",
  "1",
  "true",
]);

const PENDING_TOKENS = new Set([
  "pending",
  "menunggu",
  "menunggu konfirmasi",
  "on review",
  "in review",
  "proses",
]);

const REJECTED_TOKENS = new Set([
  "rejected",
  "reject",
  "ditolak",
  "0",
  "false",
]);

const firstNonEmpty = (values = []) =>
  values.find((value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  });

const getStatusCandidates = (item = {}) => [
  item?.status_pendaftaran,
  item?.status_approval,
  item?.approval_status,
  item?.approval?.status,
  item?.pendaftaran?.status,
  item?.magang?.status,
  item?.registration?.status,
  item?.status,
  item?.status_magang,
  item?.internship_status,
];

const collectStatusTokens = (source, maxDepth = 4) => {
  const visited = new Set();
  const tokens = new Set();

  const walk = (node, depth) => {
    if (node == null || depth > maxDepth) return;
    if (typeof node !== "object") return;
    if (visited.has(node)) return;
    visited.add(node);

    if (Array.isArray(node)) {
      for (const entry of node) walk(entry, depth + 1);
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const keyToken = normalizeToken(key);
      const isStatusLikeKey =
        keyToken.includes("status") ||
        keyToken.includes("approval") ||
        keyToken.includes("pendaftaran") ||
        keyToken.includes("magang");

      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        if (isStatusLikeKey) {
          const token = normalizeToken(value);
          if (token) tokens.add(token);
        }
        continue;
      }

      if (value && typeof value === "object") {
        walk(value, depth + 1);
      }
    }
  };

  walk(source, 0);
  return tokens;
};

export const resolveApprovalStatus = (item = {}) => {
  const directToken = normalizeToken(firstNonEmpty(getStatusCandidates(item)));
  const statusTokens = collectStatusTokens(item);
  if (directToken) statusTokens.add(directToken);

  for (const token of statusTokens) {
    if (PENDING_TOKENS.has(token)) return "pending";
  }

  for (const token of statusTokens) {
    if (REJECTED_TOKENS.has(token)) return "rejected";
  }

  for (const token of statusTokens) {
    if (APPROVED_TOKENS.has(token)) return "approved";
  }

  if (item?.is_active === true) return "approved";

  return "unknown";
};

export const isEligiblePeserta = (item = {}) => {
  const approvalStatus = resolveApprovalStatus(item);
  return approvalStatus === "approved";
};

export const filterEligiblePeserta = (items = [], customMatcher = null) =>
  items.filter((item) => {
    if (typeof customMatcher === "function") {
      return customMatcher(item);
    }
    return isEligiblePeserta(item);
  });
