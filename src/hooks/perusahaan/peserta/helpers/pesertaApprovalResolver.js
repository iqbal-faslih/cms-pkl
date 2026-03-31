const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const APPROVED_TOKENS = new Set(["approved", "approve", "accepted", "diterima"]);
const PENDING_TOKENS = new Set(["pending", "menunggu", "menunggu konfirmasi", "proses"]);
const REJECTED_TOKENS = new Set(["rejected", "reject", "ditolak"]);

const extractFirstArray = (payload) => {
  const candidates = [
    payload?.data?.items,
    payload?.data?.data,
    payload?.data,
    payload?.items,
    payload?.result?.items,
    payload?.result?.data,
    payload?.result,
    payload?.meta?.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  const objectCandidates = [payload?.data, payload?.result, payload];
  for (const objectCandidate of objectCandidates) {
    if (!isObject(objectCandidate)) continue;
    for (const value of Object.values(objectCandidate)) {
      if (Array.isArray(value)) return value;
    }
  }

  return [];
};

const readStatusToken = (item = {}) =>
  normalizeText(
    item?.status ??
      item?.status_pendaftaran ??
      item?.status_approval ??
      item?.approval_status ??
      item?.approval?.status ??
      item?.pendaftaran?.status ??
      item?.magang?.status
  );

const isApprovedPendaftaran = (item = {}) => {
  const token = readStatusToken(item);
  if (!token) return false;
  if (PENDING_TOKENS.has(token)) return false;
  if (REJECTED_TOKENS.has(token)) return false;
  return APPROVED_TOKENS.has(token);
};

const sanitizeId = (value) => {
  const parsed = String(value ?? "").trim();
  return parsed ? parsed : "";
};

const getIdCandidates = (item = {}) => {
  const ids = [
    item?.id_peserta,
    item?.peserta?.id,
    item?.peserta?.id_peserta,
    item?.peserta_id,
    item?.user_id,
    item?.user?.id,
    item?.peserta?.user?.id,
    item?.id_user,
    item?.id,
  ]
    .map(sanitizeId)
    .filter(Boolean);

  return [...new Set(ids)];
};

const getNameToken = (item = {}) => {
  const value = item?.nama || item?.peserta?.nama || item?.user?.nama || item?.peserta?.user?.nama || "";
  return normalizeText(value);
};

export const buildApprovedMatcherFromApprovalPayload = (payload) => {
  const rows = extractFirstArray(payload);
  const approvedIds = new Set();
  const approvedNames = new Set();

  rows.forEach((row) => {
    if (!isApprovedPendaftaran(row)) return;

    getIdCandidates(row).forEach((id) => approvedIds.add(id));

    const name = getNameToken(row);
    if (name) approvedNames.add(name);
  });

  return (pesertaItem = {}) => {
    const pesertaIds = getIdCandidates(pesertaItem);
    if (pesertaIds.some((id) => approvedIds.has(id))) return true;

    const pesertaName = getNameToken(pesertaItem);
    if (pesertaName && approvedNames.has(pesertaName)) return true;

    return false;
  };
};
