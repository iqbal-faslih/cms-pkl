const toText = (value) => String(value || "").trim();

export const normalizeDivisionText = (value) => toText(value).toLowerCase();

export const extractCurrentDivisionFromDetail = (response) => {
  const body = response?.data;
  const data = body?.data?.detail_peserta || body?.data || body || {};

  const id = toText(
    data?.id_divisi || data?.divisi_id || data?.divisi?.id || data?.division?.id || ""
  );

  const name = normalizeDivisionText(
    data?.divisi?.nama ||
      data?.divisi?.name ||
      (typeof data?.divisi === "string" ? data.divisi : "") ||
      data?.nama_divisi ||
      data?.divisi_name ||
      data?.division_name ||
      ""
  );

  return { id, name };
};

export const resolvePesertaIdCandidates = (student) => {
  const rawCandidates = [
    student?.id_peserta,
    student?.peserta_id,
    student?.peserta?.id_peserta,
    student?.peserta?.id,
    student?.detail_peserta?.id_peserta,
    student?.detail_peserta?.id,
    student?.id,
    student?.user?.id,
  ];

  const unique = [];
  rawCandidates.forEach((value) => {
    const normalized = toText(value);
    if (!normalized) return;
    if (unique.includes(normalized)) return;
    unique.push(normalized);
  });

  return unique;
};

export const resolveDivisionNameById = (divisions = [], divisionId = "") => {
  const targetId = toText(divisionId);
  if (!targetId || !Array.isArray(divisions)) return "";

  const found = divisions.find(
    (division) => toText(division?.id || division?.id_divisi || "") === targetId
  );

  return normalizeDivisionText(found?.nama || found?.nama_divisi || found?.name || "");
};

export const isSameDivisionSelection = ({
  selectedDivision,
  currentDivisionId = "",
  currentDivisionName = "",
  divisions = [],
  compareByName = true,
}) => {
  const selectedId = toText(selectedDivision);
  const activeCurrentId = toText(currentDivisionId);

  if (selectedId && activeCurrentId && selectedId === activeCurrentId) {
    return true;
  }

  if (!compareByName) return false;

  const selectedName = resolveDivisionNameById(divisions, selectedId);
  const activeCurrentName = normalizeDivisionText(currentDivisionName);
  return Boolean(selectedName && activeCurrentName && selectedName === activeCurrentName);
};

export const resolveScopeByRole = () => {
  const role = String(localStorage.getItem("role") || sessionStorage.getItem("role") || "")
    .toLowerCase()
    .trim();
  return role === "cabang" ? "cabang" : "perusahaan";
};

export const extractApiArray = (response) => {
  const body = response?.data;
  const candidates = [
    body?.data,
    body?.data?.data,
    body?.data?.items,
    body?.data?.divisi,
    body?.result,
    body?.result?.data,
    body?.items,
    body?.divisi,
    body,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  const flattened = [];
  candidates.forEach((candidate) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return;
    Object.values(candidate).forEach((value) => {
      if (Array.isArray(value)) flattened.push(...value);
    });
  });

  return flattened;
};

export const uniqueDivisionsById = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const divisionId = toText(item?.id ?? item?.id_divisi ?? "");
    if (!divisionId || seen.has(divisionId)) return false;
    seen.add(divisionId);
    return true;
  });
};

export const resolveMentorNameById = (mentors = [], mentorId = "") => {
  const selectedMentor = mentors.find(
    (mentor) => toText(mentor?.id || mentor?.id_mentor || "") === toText(mentorId)
  );
  return selectedMentor?.user?.nama || selectedMentor?.nama || "";
};
