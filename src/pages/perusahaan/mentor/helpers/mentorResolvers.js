export const pickFirstText = (values, fallback = "") => {
  const found = values.find((value) => typeof value === "string" && value.trim().length > 0);
  return found ? found.trim() : fallback;
};

const isMentorLikeObject = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Boolean(
    value?.id ||
      value?.id_mentor ||
      value?.mentor_id ||
      value?.id_user ||
      value?.nama ||
      value?.email ||
      value?.user
  );
};

export const extractMentorList = (response) => {
  const body = response?.data;
  const dataObject = body?.data && typeof body.data === "object" ? body.data : null;
  const resultObject = body?.result && typeof body.result === "object" ? body.result : null;
  const candidates = [
    body?.data,
    body?.data?.data,
    body?.data?.items,
    body?.data?.mentors,
    body?.data?.mentor,
    body?.mentors,
    body?.mentor,
    body?.meta?.data,
    body?.result,
    body?.result?.data,
    body?.result?.mentors,
    body?.result?.mentor,
    ...(dataObject ? Object.values(dataObject) : []),
    ...(resultObject ? Object.values(resultObject) : []),
    body,
  ];
  const found = candidates.find((item) => Array.isArray(item));
  if (found) return found;

  const objectCandidates = [
    body?.data,
    body?.result,
    body?.mentor,
    body?.data?.mentor,
    body?.result?.mentor,
    body,
  ];
  const singleMentor = objectCandidates.find((item) => isMentorLikeObject(item));
  return singleMentor ? [singleMentor] : [];
};

export const extractMentorItem = (response) => {
  const body = response?.data;
  const candidates = [body?.data, body?.data?.data, body?.result, body?.result?.data, body];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate[0];
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) return candidate;
  }
  return null;
};

export const getMentorId = (row) =>
  row?.id || row?.id_mentor || row?.mentor_id || row?.id_user || row?.user?.id || null;

export const getMentorIdCandidates = (mentor) =>
  [mentor?.id, mentor?.id_mentor, mentor?.mentor_id, mentor?.user?.id, mentor?.id_user]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

export const getMentorEmail = (mentor) =>
  pickFirstText([mentor?.user?.email, mentor?.email, mentor?.mentor?.email], "");

export const resolveMentorName = (mentor, fallback = "") =>
  pickFirstText([mentor?.user?.nama, mentor?.nama, mentor?.mentor?.nama], fallback);

export const resolveMentorPhone = (mentor) =>
  pickFirstText(
    [
      mentor?.user?.telepon,
      mentor?.telepon,
      mentor?.nomor_hp,
      mentor?.phone,
      mentor?.user?.nomor_hp,
      mentor?.mentor?.telepon,
      mentor?.mentor?.nomor_hp,
    ],
    ""
  );

export const resolveMentorEmail = (mentor) =>
  pickFirstText([mentor?.user?.email, mentor?.email, mentor?.mentor?.email, mentor?.user_email], "");

export const resolveMentorDivision = (mentor, fallback = "") =>
  pickFirstText(
    [
      mentor?.divisi?.nama,
      mentor?.divisi?.name,
      typeof mentor?.divisi === "string" ? mentor.divisi : "",
      mentor?.division?.nama,
      mentor?.division?.name,
      typeof mentor?.division === "string" ? mentor.division : "",
      mentor?.nama_divisi,
      mentor?.divisi_name,
      mentor?.division_name,
      mentor?.user?.divisi?.nama,
      mentor?.user?.divisi?.name,
      typeof mentor?.user?.divisi === "string" ? mentor.user.divisi : "",
      mentor?.mentor?.divisi?.nama,
      mentor?.mentor?.divisi?.name,
      typeof mentor?.mentor?.divisi === "string" ? mentor.mentor.divisi : "",
    ],
    fallback
  );

export const resolveMentorDivisionName = (mentor) =>
  pickFirstText(
    [
      mentor?.divisi?.nama,
      mentor?.divisi?.name,
      typeof mentor?.divisi === "string" ? mentor.divisi : "",
      mentor?.division?.nama,
      mentor?.division?.name,
      typeof mentor?.division === "string" ? mentor.division : "",
      mentor?.nama_divisi,
      mentor?.divisi_name,
      mentor?.mentor?.divisi?.nama,
      typeof mentor?.mentor?.divisi === "string" ? mentor.mentor.divisi : "",
    ],
    ""
  );

export const resolveMentorDivisionId = (mentor) =>
  pickFirstText(
    [
      String(mentor?.divisi?.id || ""),
      String(mentor?.division?.id || ""),
      String(mentor?.id_divisi || ""),
      String(mentor?.divisi_id || ""),
      String(mentor?.division_id || ""),
      String(mentor?.user?.divisi?.id || ""),
    ],
    ""
  );

export const resolveMentorEntityId = (mentor) =>
  pickFirstText(
    [
      String(mentor?.id || ""),
      String(mentor?.id_mentor || ""),
      String(mentor?.mentor_id || ""),
      String(mentor?.user?.id || ""),
    ],
    ""
  );

export const mergeMentorData = (baseMentor, fallbackMentor) => {
  if (!baseMentor) return fallbackMentor || null;
  if (!fallbackMentor) return baseMentor;

  const mergedPeserta =
    baseMentor.peserta ??
    baseMentor.pesertas ??
    fallbackMentor.peserta ??
    fallbackMentor.pesertas ??
    [];

  return {
    ...fallbackMentor,
    ...baseMentor,
    user: {
      ...(fallbackMentor.user || {}),
      ...(baseMentor.user || {}),
    },
    divisi: baseMentor.divisi || fallbackMentor.divisi,
    foto: baseMentor.foto || fallbackMentor.foto,
    peserta: mergedPeserta,
    pesertas: mergedPeserta,
  };
};

export const extractMentorStudents = (mentor) => {
  const candidates = [
    mentor?.peserta,
    mentor?.pesertas,
    mentor?.siswa_bimbingan,
    mentor?.detail_siswa_bimbingan,
    mentor?.daftar_siswa,
    mentor?.peserta_bimbingan,
    mentor?.siswa,
    mentor?.students,
    mentor?.data_peserta,
    mentor?.mentor?.peserta,
    mentor?.mentor?.pesertas,
    mentor?.mentor?.siswa_bimbingan,
    mentor?.data?.peserta,
    mentor?.data?.pesertas,
    mentor?.data?.siswa_bimbingan,
    mentor?.data?.daftar_siswa,
  ];

  const directList = candidates.find((item) => Array.isArray(item));
  if (directList) return directList;

  const objectCandidates = [mentor?.data, mentor?.mentor, mentor];
  for (const objectCandidate of objectCandidates) {
    if (!objectCandidate || typeof objectCandidate !== "object") continue;
    const nestedArray = Object.values(objectCandidate).find((item) => Array.isArray(item));
    if (nestedArray) return nestedArray;
  }

  return [];
};

export const resolveStudentDivision = (student) =>
  pickFirstText(
    [
      student?.divisi?.nama,
      student?.division?.nama,
      student?.peserta?.divisi?.nama,
      student?.peserta?.division?.nama,
      student?.divisi_name,
      student?.division_name,
      student?.peserta?.divisi_name,
      student?.peserta?.division_name,
      typeof student?.divisi === "string" ? student.divisi : "",
      typeof student?.division === "string" ? student.division : "",
      typeof student?.peserta?.divisi === "string" ? student.peserta.divisi : "",
      typeof student?.peserta?.division === "string" ? student.peserta.division : "",
      student?.route?.divisi,
      student?.magang?.divisi,
      student?.peserta?.route?.divisi,
      student?.peserta?.magang?.divisi,
    ],
    "-"
  );

export const resolveStudentCreatedDate = (student) =>
  pickFirstText(
    [
      student?.created_at,
      student?.createdAt,
      student?.peserta?.created_at,
      student?.peserta?.createdAt,
      student?.tanggal_pembuatan,
      student?.tanggal_dibuat,
      student?.peserta?.tanggal_pembuatan,
      student?.peserta?.tanggal_dibuat,
      student?.updated_at,
      student?.peserta?.updated_at,
    ],
    ""
  );

export const extractStudentListFromResponse = (response) => {
  const body = response?.data;
  const candidates = [
    body?.data,
    body?.data?.data,
    body?.data?.items,
    body?.result,
    body?.result?.data,
    body?.items,
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

export const resolveStudentMentorIdCandidates = (student) =>
  [
    student?.id_mentor,
    student?.mentor_id,
    student?.id_manage_mentor,
    student?.manage_mentor_id,
    student?.mentorId,
    student?.mentor?.mentor_id,
    student?.mentor?.id,
    student?.mentor?.id_mentor,
    student?.mentor?.id_manage_mentor,
    student?.detail_peserta?.mentor_id,
    student?.detail_peserta?.id_mentor,
    student?.peserta?.id_mentor,
    student?.peserta?.mentor_id,
    student?.peserta?.id_manage_mentor,
    student?.peserta?.mentor?.id,
    student?.peserta?.mentor?.id_mentor,
    student?.peserta?.mentor?.mentor_id,
    student?.peserta?.detail_peserta?.id_mentor,
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

export const resolveStudentIdentifierCandidates = (student) =>
  [student?.id_peserta, student?.id, student?.user?.id, student?.peserta?.id_peserta, student?.peserta?.id, student?.peserta?.user?.id]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

export const resolveStudentRowData = (student, fallbackIndex = 0) => {
  const name = pickFirstText(
    [student?.nama, student?.user?.nama, student?.peserta?.nama, student?.peserta?.user?.nama],
    "-"
  );
  const email = pickFirstText(
    [student?.email, student?.user?.email, student?.peserta?.email, student?.peserta?.user?.email],
    "-"
  );
  const school = pickFirstText(
    [
      student?.asal_sekolah,
      student?.sekolah,
      student?.instansi_pendidikan,
      student?.peserta?.asal_sekolah,
      student?.peserta?.sekolah,
      student?.peserta?.instansi_pendidikan,
    ],
    "-"
  );
  const rowKey = pickFirstText(
    [
      String(student?.id || ""),
      String(student?.id_peserta || ""),
      String(student?.peserta?.id || ""),
      String(student?.peserta?.id_peserta || ""),
    ],
    `${name}-${fallbackIndex}`
  );

  return {
    name,
    email,
    school,
    rowKey,
  };
};

export const extractDivisiList = (response) => {
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

export const extractSimpleDivisionList = (response) => {
  const body = response?.data;
  const candidates = [body?.data, body?.result, body];
  const list = candidates.find((item) => Array.isArray(item));
  return list || [];
};

const normalizeDivisionName = (value = "") =>
  String(value).trim().toLowerCase().replace(/\s+/g, " ");

export const findDivisionIdByName = (list, divisionName) => {
  const normalizedTarget = normalizeDivisionName(divisionName);
  if (!normalizedTarget || !Array.isArray(list)) return "";

  const found = list.find((item) => {
    const name = item?.nama || item?.nama_divisi || item?.name || item?.divisi || "";
    return normalizeDivisionName(name) === normalizedTarget;
  });

  return String(found?.id || found?.id_divisi || "").trim();
};

export const findMentorFromList = (list, id, referenceMentor = null) => {
  const normalizedId = String(id ?? "").trim();
  if (!Array.isArray(list) || list.length === 0) return null;

  const byId = normalizedId
    ? list.find((item) => getMentorIdCandidates(item).includes(normalizedId))
    : null;
  if (byId) return byId;

  const referenceEmail = getMentorEmail(referenceMentor);
  if (referenceEmail) {
    const emailMatches = list.filter((item) => getMentorEmail(item) === referenceEmail);
    if (emailMatches.length === 1) return emailMatches[0];
  }

  return null;
};

export const getFileNameFromPath = (path = "") => {
  const parts = String(path).split("/");
  return parts[parts.length - 1] || "";
};

export const resolveMentorPhotoName = (mentor) => {
  const path =
    mentor?.foto?.find?.((item) => item.type === "profile")?.path ||
    mentor?.foto?.[0]?.path ||
    mentor?.avatar ||
    mentor?.user?.avatar ||
    mentor?.user?.foto ||
    "";

  return path ? getFileNameFromPath(path) : "";
};
