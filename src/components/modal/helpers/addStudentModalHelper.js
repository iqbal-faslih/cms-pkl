const parseStudentName = (student) =>
  student?.nama ||
  student?.user?.nama ||
  student?.peserta?.nama ||
  student?.peserta?.user?.nama ||
  `Student ID: ${student?.id || student?.id_peserta || "-"}`;

const toNormalizedId = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  return /^\d+$/.test(raw) ? Number(raw) : raw;
};

const collectDeepValuesByKeys = (node, keys, depth = 0, maxDepth = 4, bucket = []) => {
  if (!node || depth > maxDepth) return bucket;
  if (Array.isArray(node)) {
    node.forEach((item) => collectDeepValuesByKeys(item, keys, depth + 1, maxDepth, bucket));
    return bucket;
  }
  if (typeof node !== "object") return bucket;

  Object.entries(node).forEach(([key, value]) => {
    const normalizedKey = String(key || "").toLowerCase();
    if (keys.includes(normalizedKey) && value !== undefined && value !== null) {
      bucket.push(value);
    }
    collectDeepValuesByKeys(value, keys, depth + 1, maxDepth, bucket);
  });

  return bucket;
};

const collectPrioritizedStudentIdCandidates = (student) => {
  const pesertaPriority = [
    student?.id_peserta,
    student?.peserta_id,
    student?.peserta?.id_peserta,
    student?.pendaftaran?.id_peserta,
    student?.magang?.id_peserta,
    student?.detail_peserta?.id_peserta,
    ...collectDeepValuesByKeys(student, ["id_peserta", "peserta_id"], 0, 4),
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .map((value) => ({ value, source: "peserta" }));

  const fallbackIds = [
    student?.peserta?.id,
    student?.id,
    student?.user_id,
    student?.id_user,
    student?.user?.id,
    student?.peserta?.user_id,
    student?.peserta?.user?.id,
    student?.pendaftaran?.peserta?.id,
    student?.magang?.peserta?.id,
    student?.detail_peserta?.id,
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .map((value) => ({ value, source: "generic" }));

  const seen = new Set();
  return [...pesertaPriority, ...fallbackIds].filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
};

const parseStudentApiId = (student) => collectPrioritizedStudentIdCandidates(student)[0]?.value || "";

const normalizeStudentItem = (item) => {
  if (!item || typeof item !== "object") return item;
  const nestedStudent =
    item?.peserta ||
    item?.siswa ||
    item?.magang?.peserta ||
    item?.pendaftaran?.peserta ||
    item?.pendaftaran?.user;
  if (!nestedStudent || typeof nestedStudent !== "object") return item;
  return { ...item, ...nestedStudent };
};

const resolveStudentDivisionId = (student) => {
  const candidates = [
    student?.id_divisi,
    student?.divisi?.id,
    student?.division?.id,
    student?.divisi_id,
    student?.division_id,
  ];
  const value = candidates.find(
    (candidate) =>
      candidate !== undefined && candidate !== null && String(candidate).trim() !== ""
  );
  return String(value ?? "").trim();
};

const resolveStudentDivisionName = (student) => {
  const candidates = [
    student?.divisi?.nama,
    student?.division?.nama,
    student?.divisi?.name,
    student?.division?.name,
    student?.divisi_name,
    student?.division_name,
    student?.nama_divisi,
    typeof student?.divisi === "string" ? student.divisi : "",
    typeof student?.division === "string" ? student.division : "",
    student?.magang?.divisi?.nama,
    student?.magang?.divisi?.name,
    typeof student?.magang?.divisi === "string" ? student.magang.divisi : "",
    student?.magang?.lowongan?.divisi?.nama,
    student?.magang?.lowongan?.divisi?.name,
    typeof student?.magang?.lowongan?.divisi === "string"
      ? student.magang.lowongan.divisi
      : "",
    student?.lowongan?.divisi?.nama,
    student?.lowongan?.divisi?.name,
    typeof student?.lowongan?.divisi === "string" ? student.lowongan.divisi : "",
    student?.route?.divisi,
  ];
  const found = candidates.find(
    (value) => typeof value === "string" && value.trim() !== ""
  );
  return String(found || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const isUnsetMentorValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "" || normalized === "0" || normalized === "null";
  }
  if (typeof value === "number") return value <= 0;
  return false;
};

const isStudentUnassigned = (student) => {
  const mentorIdCandidates = [student?.id_mentor, student?.mentor_id, student?.id_manage_mentor];
  const hasAssignedMentor = mentorIdCandidates.some((value) => !isUnsetMentorValue(value));
  if (hasAssignedMentor) return false;

  const mentorNameCandidates = [
    student?.mentor,
    student?.nama_mentor,
    student?.mentor_name,
    student?.detail_peserta?.mentor,
  ];
  const mentorName = mentorNameCandidates.find(
    (value) => typeof value === "string" && value.trim() !== ""
  );
  if (!mentorName) return true;

  const normalized = mentorName.trim().toLowerCase();
  return ["-", "belum ada mentor", "belum ditentukan", "null", "none"].includes(normalized);
};

const APPROVED_STATUS_SET = new Set([
  "diterima",
  "approve",
  "approved",
  "accepted",
  "aktif",
  "active",
  "magang",
  "ongoing",
  "in_progress",
  "1",
  "true",
]);

const PENDING_STATUS_SET = new Set([
  "menunggu",
  "pending",
  "diproses",
  "proses",
  "review",
  "0",
  "false",
]);

const resolveStudentStatuses = (student) => {
  const candidates = [
    student?.status,
    student?.status_approval,
    student?.status_magang,
    student?.status_lamaran,
    student?.approval_status,
    student?.magang?.status,
    student?.magang?.status_magang,
    student?.pendaftaran?.status,
    student?.pendaftaran?.status_magang,
    student?.detail_peserta?.status,
    student?.detail_peserta?.status_magang,
    student?.peserta?.status,
    student?.peserta?.status_approval,
    student?.peserta?.status_magang,
    student?.peserta?.status_lamaran,
    student?.peserta?.magang?.status,
    student?.peserta?.magang?.status_magang,
  ];

  const normalized = candidates
    .map((value) => String(value ?? "").trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(normalized)];
};

const isStudentApproved = (student) => {
  const statuses = resolveStudentStatuses(student);
  if (statuses.length === 0) return true;
  if (
    statuses.some(
      (status) =>
        APPROVED_STATUS_SET.has(status) ||
        status.includes("approve") ||
        status.includes("accept") ||
        status.includes("terima") ||
        status.includes("aktif")
    )
  ) {
    return true;
  }
  if (statuses.some((status) => APPROVED_STATUS_SET.has(status))) return true;
  if (statuses.some((status) => PENDING_STATUS_SET.has(status))) return false;
  return false;
};

const isLikelyStudent = (student) => {
  if (!student || typeof student !== "object") return false;
  const hasIdentity = Boolean(parseStudentApiId(student));
  const hasName = Boolean(parseStudentName(student));
  const hasStudentTraits =
    Boolean(student?.sekolah) ||
    Boolean(student?.jurusan) ||
    Boolean(student?.nisn) ||
    Boolean(student?.nomor_identitas) ||
    Boolean(student?.status_magang) ||
    Boolean(student?.magang);
  return hasIdentity && (hasName || hasStudentTraits);
};

export const mapStudentOptions = (students = []) => {
  const seenOptionIds = new Set();
  const normalizedStudents = students.map(normalizeStudentItem).filter(isLikelyStudent);
  const approvedUnassignedStudents = normalizedStudents.filter(
    (student) => isStudentUnassigned(student) && isStudentApproved(student)
  );
  const unassignedStudents = normalizedStudents.filter((student) => isStudentUnassigned(student));
  const sourceStudents =
    approvedUnassignedStudents.length > 0 ? approvedUnassignedStudents : unassignedStudents;

  return sourceStudents
    .map((student, index) => {
      const prioritizedCandidates = collectPrioritizedStudentIdCandidates(student);
      const apiId = prioritizedCandidates[0]?.value || "";
      const fallbackIdCandidates = [student?.uuid, student?.nisn, student?.email, student?.nama]
        .map((value) => String(value ?? "").trim())
        .filter(Boolean);
      const optionId = apiId || fallbackIdCandidates[0] || `peserta-${index}`;

      return {
        id: `${optionId}-${index}`,
        optionValue: `${optionId}-${index}`,
        apiId,
        name: parseStudentName(student),
        idCandidates: prioritizedCandidates,
      };
    })
    .filter((item) => {
      if (!item.optionValue) return false;
      if (seenOptionIds.has(item.optionValue)) return false;
      seenOptionIds.add(item.optionValue);
      return true;
    });
};

const collectArraysDeep = (node, bucket = [], depth = 0) => {
  if (!node || depth > 6) return bucket;
  if (Array.isArray(node)) {
    bucket.push(node);
    return bucket;
  }
  if (typeof node !== "object") return bucket;

  Object.values(node).forEach((value) => {
    collectArraysDeep(value, bucket, depth + 1);
  });
  return bucket;
};

const scoreStudentArray = (arr = []) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sample = arr.slice(0, 6);
  let score = 0;

  sample.forEach((item) => {
    if (!item || typeof item !== "object") return;
    if (item?.id_peserta || item?.peserta || item?.user?.id) score += 4;
    if (item?.nama || item?.user?.nama || item?.peserta?.nama) score += 3;
    if (item?.sekolah || item?.jurusan || item?.nomor_identitas) score += 3;
    if (item?.status_magang || item?.magang) score += 2;
    if (item?.id_mentor || item?.mentor_id) score += 1;
  });

  return score;
};

export const extractStudentList = (response) => {
  const body = response?.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.result?.data)) return body.result.data;
  if (Array.isArray(body?.result)) return body.result;

  const allArrays = collectArraysDeep(body, []);
  if (allArrays.length === 0) return [];

  const ranked = [...allArrays].sort((a, b) => scoreStudentArray(b) - scoreStudentArray(a));
  return ranked[0] || [];
};

export const filterStudentsByDivision = (students, divisionId, divisionName = "") => {
  const normalizedDivisionId = String(divisionId || "").trim();
  const normalizedDivisionNameRaw = String(divisionName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  const invalidDivisionNames = new Set([
    "",
    "-",
    "divisi belum tersedia",
    "division not available",
    "belum ada divisi",
  ]);
  const normalizedDivisionName = invalidDivisionNames.has(normalizedDivisionNameRaw)
    ? ""
    : normalizedDivisionNameRaw;

  if (!normalizedDivisionId && !normalizedDivisionName) return students;

  const normalizedStudents = students.map(normalizeStudentItem);
  const hasDivisionIdInStudentData = normalizedStudents.some(
    (student) => String(resolveStudentDivisionId(student) || "").trim() !== ""
  );
  const shouldUseDivisionIdFilter = normalizedDivisionId && hasDivisionIdInStudentData;
  const shouldUseDivisionNameFilter = Boolean(normalizedDivisionName);

  if (!shouldUseDivisionIdFilter && !shouldUseDivisionNameFilter) return normalizedStudents;

  return students.filter((item) => {
    const student = normalizeStudentItem(item);
    const studentDivisionId = resolveStudentDivisionId(student);
    if (shouldUseDivisionIdFilter && studentDivisionId === normalizedDivisionId) return true;
    if (!shouldUseDivisionNameFilter) return !shouldUseDivisionIdFilter;
    const studentDivisionName = resolveStudentDivisionName(student);
    return (
      studentDivisionName === normalizedDivisionName ||
      studentDivisionName.includes(normalizedDivisionName) ||
      normalizedDivisionName.includes(studentDivisionName)
    );
  });
};

export const toApiId = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return raw;
  return /^\d+$/.test(raw) ? Number(raw) : raw;
};

const extractMentorIdFromDetailResponse = (response) => {
  const body = response?.data;
  const detail =
    body?.data?.mentor ||
    body?.data?.detail_mentor ||
    body?.data?.data ||
    body?.data ||
    body?.result?.mentor ||
    body?.result?.detail_mentor ||
    body?.result?.data ||
    body?.result ||
    body ||
    {};

  const directCandidates = [
    detail?.id_mentor,
    detail?.mentor_id,
    detail?.id_manage_mentor,
    detail?.id,
    detail?.mentor?.id_mentor,
    detail?.mentor?.mentor_id,
    detail?.mentor?.id,
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  if (directCandidates.length > 0) {
    return toNormalizedId(directCandidates[0]);
  }

  const deepCandidates = collectDeepValuesByKeys(detail, ["id_mentor", "mentor_id"], 0, 5)
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  if (deepCandidates.length > 0) {
    return toNormalizedId(deepCandidates[0]);
  }

  return "";
};

export const resolveMentorApiId = async (mentorId, fetchMentorDetail) => {
  const rawMentorId = String(mentorId ?? "").trim();
  if (!rawMentorId) return "";
  if (/^\d+$/.test(rawMentorId)) return Number(rawMentorId);

  try {
    const detailResponse = await fetchMentorDetail(rawMentorId);
    const resolvedId = extractMentorIdFromDetailResponse(detailResponse);
    return resolvedId || rawMentorId;
  } catch {
    return rawMentorId;
  }
};

const extractPesertaIdFromDetailResponse = (response) => {
  const body = response?.data;
  const detail =
    body?.data?.detail_peserta || body?.data || body?.result?.detail_peserta || body?.result || body || {};

  const candidates = [detail?.id_peserta, detail?.peserta?.id_peserta, detail?.peserta?.id, detail?.id]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  return candidates[0] || "";
};

export const resolveStudentPesertaId = async (student, fetchPesertaDetail) => {
  const rawCandidates = [
    ...(Array.isArray(student?.idCandidates) ? student.idCandidates : []),
    { value: String(student?.apiId ?? "").trim(), source: "generic" },
  ].filter((item) => item && item.value);

  const seen = new Set();
  const idCandidates = rawCandidates.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });

  const directPesertaId = idCandidates.find(
    (item) => item.source === "peserta" && /^\d+$/.test(item.value)
  );
  if (directPesertaId) return directPesertaId.value;

  for (const candidate of idCandidates) {
    if (!/^\d+$/.test(candidate.value)) continue;
    try {
      const detailResponse = await fetchPesertaDetail(candidate.value);
      const pesertaId = extractPesertaIdFromDetailResponse(detailResponse);
      if (pesertaId) return pesertaId;
    } catch {
      // Try next candidate.
    }
  }

  const fallbackPesertaId = idCandidates.find((item) => item.source === "peserta");
  return fallbackPesertaId?.value || idCandidates[0]?.value || "";
};

export const extractApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data || {};
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof data?.meta?.message === "string" && data.meta.message.trim()) return data.meta.message;
  const errors = data?.errors || data?.meta || {};
  if (errors && typeof errors === "object") {
    const first = Object.values(errors).find(
      (value) =>
        (Array.isArray(value) && value[0]) || (typeof value === "string" && value.trim())
    );
    if (Array.isArray(first) && first[0]) return String(first[0]);
    if (typeof first === "string" && first.trim()) return first;
  }
  return fallback;
};

const toFormData = (payload) => {
  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          Object.entries(item).forEach(([nestedKey, nestedValue], index) => {
            formData.append(`${key}[${index}][${nestedKey}]`, String(nestedValue ?? ""));
          });
        } else {
          formData.append(`${key}[]`, String(item ?? ""));
        }
      });
      return;
    }
    formData.append(key, String(value ?? ""));
  });
  return formData;
};

const createIndexedFormData = ({
  mentorApiId,
  studentIds,
  divisionId = "",
  rootField = "data_siswa",
  nestedKey = "",
}) => {
  const formData = new FormData();
  formData.append("id_mentor", String(mentorApiId ?? ""));
  if (String(divisionId ?? "").trim() !== "") {
    formData.append("id_divisi", String(divisionId));
  }
  studentIds.forEach((idValue, index) => {
    if (nestedKey) {
      formData.append(`${rootField}[${index}][${nestedKey}]`, String(idValue ?? ""));
      return;
    }
    formData.append(`${rootField}[${index}]`, String(idValue ?? ""));
  });
  return formData;
};

const createIndexedUrlEncoded = ({
  mentorApiId,
  studentIds,
  divisionId = "",
  rootField = "data_siswa",
  nestedKey = "",
}) => {
  const params = new URLSearchParams();
  params.append("id_mentor", String(mentorApiId ?? ""));
  if (String(divisionId ?? "").trim() !== "") {
    params.append("id_divisi", String(divisionId));
  }
  studentIds.forEach((idValue, index) => {
    if (nestedKey) {
      params.append(`${rootField}[${index}][${nestedKey}]`, String(idValue ?? ""));
      return;
    }
    params.append(`${rootField}[${index}]`, String(idValue ?? ""));
  });
  return params;
};

export const buildSubmitRequests = ({ mentorApiId, studentIds, divisionId = "" }) => {
  const firstStudentId = studentIds[0];
  const attachDivision = (payload) =>
    String(divisionId ?? "").trim() !== ""
      ? { ...payload, id_divisi: divisionId }
      : payload;
  const payloadVariants = [
    attachDivision({ id_mentor: mentorApiId, data_siswa: studentIds }),
    attachDivision({ id_mentor: mentorApiId, siswa: studentIds }),
    attachDivision({ id_mentor: mentorApiId, data_siswa_ids: studentIds }),
    attachDivision({ id_mentor: mentorApiId, data_siswa: studentIds.map((item) => String(item)) }),
    attachDivision({ id_mentor: mentorApiId, siswa: studentIds.map((item) => String(item)) }),
    attachDivision({ id_mentor: mentorApiId, data_siswa: studentIds.map((item) => ({ id_peserta: item })) }),
    attachDivision({ id_mentor: mentorApiId, siswa: studentIds.map((item) => ({ id_peserta: item })) }),
    attachDivision({ id_mentor: mentorApiId, data_siswa: studentIds.map((item) => ({ id: item })) }),
    attachDivision({ id_mentor: mentorApiId, siswa: studentIds.map((item) => ({ id: item })) }),
    attachDivision({ id_mentor: mentorApiId, id_siswa: studentIds }),
    attachDivision({ id_mentor: mentorApiId, siswa_ids: studentIds }),
    attachDivision({ id_mentor: mentorApiId, peserta: studentIds }),
    attachDivision({ id_mentor: mentorApiId, pesertas: studentIds }),
    attachDivision({ id_mentor: mentorApiId, peserta_ids: studentIds }),
    attachDivision({ id_mentor: mentorApiId, id_peserta: studentIds }),
    attachDivision({ id_mentor: mentorApiId, siswa: firstStudentId }),
    attachDivision({ id_mentor: mentorApiId, data_siswa: firstStudentId }),
    attachDivision({ id_mentor: mentorApiId, id_siswa: firstStudentId }),
    attachDivision({ id_mentor: mentorApiId, siswa: { id_peserta: firstStudentId } }),
  ];

  const jsonAndMultipartRequests = payloadVariants.flatMap((payload) => [
    { data: payload, headers: { "Content-Type": "application/json" } },
    { data: toFormData(payload), headers: { "Content-Type": "multipart/form-data" } },
  ]);

  const indexedFormDataRequests = [
    {
      data: createIndexedFormData({ mentorApiId, studentIds, rootField: "siswa" }),
      headers: { "Content-Type": "multipart/form-data" },
    },
    {
      data: createIndexedFormData({ mentorApiId, studentIds, rootField: "data_siswa" }),
      headers: { "Content-Type": "multipart/form-data" },
    },
    {
      data: createIndexedFormData({
        mentorApiId,
        studentIds,
        divisionId,
        rootField: "siswa",
        nestedKey: "id_peserta",
      }),
      headers: { "Content-Type": "multipart/form-data" },
    },
    {
      data: createIndexedFormData({
        mentorApiId,
        studentIds,
        divisionId,
        rootField: "data_siswa",
        nestedKey: "id_peserta",
      }),
      headers: { "Content-Type": "multipart/form-data" },
    },
    {
      data: createIndexedFormData({
        mentorApiId,
        studentIds,
        divisionId,
        rootField: "siswa",
        nestedKey: "id",
      }),
      headers: { "Content-Type": "multipart/form-data" },
    },
    {
      data: createIndexedFormData({
        mentorApiId,
        studentIds,
        divisionId,
        rootField: "data_siswa",
        nestedKey: "id",
      }),
      headers: { "Content-Type": "multipart/form-data" },
    },
    {
      data: createIndexedFormData({ mentorApiId, studentIds, divisionId, rootField: "id_siswa" }),
      headers: { "Content-Type": "multipart/form-data" },
    },
  ];

  const indexedUrlEncodedRequests = [
    {
      data: createIndexedUrlEncoded({ mentorApiId, studentIds, divisionId, rootField: "siswa" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
    {
      data: createIndexedUrlEncoded({ mentorApiId, studentIds, divisionId, rootField: "data_siswa" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
    {
      data: createIndexedUrlEncoded({
        mentorApiId,
        studentIds,
        divisionId,
        rootField: "siswa",
        nestedKey: "id_peserta",
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
    {
      data: createIndexedUrlEncoded({
        mentorApiId,
        studentIds,
        divisionId,
        rootField: "data_siswa",
        nestedKey: "id_peserta",
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
    {
      data: createIndexedUrlEncoded({
        mentorApiId,
        studentIds,
        divisionId,
        rootField: "siswa",
        nestedKey: "id",
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
    {
      data: createIndexedUrlEncoded({ mentorApiId, studentIds, divisionId, rootField: "id_siswa" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  ];

  return [...jsonAndMultipartRequests, ...indexedFormDataRequests, ...indexedUrlEncodedRequests];
};
