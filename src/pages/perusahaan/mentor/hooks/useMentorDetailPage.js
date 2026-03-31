import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { resolveMentorProfileUrl } from "@/shared/helpers/mentorData";
import {
  api,
  getCabangDivisiList,
  getCabangMentorById,
  getCabangMentorList,
  getDivisiList,
  getMentorById,
  getPerusahaanMentorById,
  getPerusahaanMentorList,
} from "@/helpers/apiClient";
import { resolveMentorRoleContext } from "../helpers/mentorRoleContext";
import {
  extractMentorItem,
  extractMentorList,
  extractMentorStudents,
  extractSimpleDivisionList,
  extractStudentListFromResponse,
  findDivisionIdByName,
  findMentorFromList,
  getMentorIdCandidates,
  mergeMentorData,
  resolveMentorDivision,
  resolveMentorDivisionId,
  resolveMentorName,
  resolveStudentCreatedDate,
  resolveStudentDivision,
  resolveStudentIdentifierCandidates,
  resolveStudentMentorIdCandidates,
} from "../helpers/mentorResolvers";

const DEFAULT_MENTOR_NAME = "Mentor";
const DEFAULT_MENTOR_DIVISION = "Divisi belum tersedia";
const SORT_NEWEST = "newest";
const SORT_OLDEST = "oldest";
const ITEMS_PER_PAGE = 10;

const toDateValue = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const createPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, idx) => idx + 1);

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("...");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("...");
  pages.push(totalPages);
  return pages;
};

const normalizeText = (value = "") =>
  String(value).trim().toLowerCase().replace(/\s+/g, " ");

const getPerusahaanPesertaEndpoints = (companyId) =>
  [
    "/peserta/perusahaan?per_page=1000&status_magang=aktif",
    "/peserta/perusahaan?per_page=1000",
    "/peserta/perusahaan",
    companyId ? `/peserta/perusahaan/${companyId}?per_page=1000` : null,
    companyId ? `/peserta/perusahaan/${companyId}` : null,
  ].filter(Boolean);

const extractStudentSearchFields = (student) => ({
  name:
    student?.nama ||
    student?.user?.nama ||
    student?.peserta?.nama ||
    student?.peserta?.user?.nama ||
    "",
  email:
    student?.email ||
    student?.user?.email ||
    student?.peserta?.email ||
    student?.peserta?.user?.email ||
    "",
  school:
    student?.asal_sekolah ||
    student?.sekolah ||
    student?.instansi_pendidikan ||
    student?.peserta?.asal_sekolah ||
    student?.peserta?.sekolah ||
    student?.peserta?.instansi_pendidikan ||
    "",
});

const matchesMentorByIdOrName = (student, mentorIdCandidates, mentorNameNormalized) => {
  const studentMentorIds = resolveStudentMentorIdCandidates(student);
  if (studentMentorIds.some((studentMentorId) => mentorIdCandidates.has(studentMentorId))) {
    return true;
  }

  const mentorNameCandidates = [
    student?.mentor,
    student?.mentor_name,
    student?.nama_mentor,
    student?.detail_peserta?.mentor,
    student?.detail_peserta?.mentor_name,
    student?.peserta?.mentor,
    student?.peserta?.mentor_name,
    student?.peserta?.nama_mentor,
    student?.peserta?.detail_peserta?.mentor,
  ];

  const studentMentorNameNormalized = normalizeText(
    mentorNameCandidates.find((value) => typeof value === "string" && value.trim().length > 0) || ""
  );

  return Boolean(
    mentorNameNormalized &&
      studentMentorNameNormalized &&
      studentMentorNameNormalized === mentorNameNormalized
  );
};

export const useMentorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isCabangRole, mentorRouteBase } = resolveMentorRoleContext();
  const companyId =
    user?.id_perusahaan ||
    user?.perusahaan?.id ||
    user?.company?.id ||
    sessionStorage.getItem("id_perusahaan") ||
    localStorage.getItem("id_perusahaan") ||
    "";

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(SORT_NEWEST);
  const [page, setPage] = useState(1);
  const [divisionIdByName, setDivisionIdByName] = useState("");
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isChangeDivisionModalOpen, setIsChangeDivisionModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentsFromIndex, setStudentsFromIndex] = useState([]);
  const [studentsRefreshKey, setStudentsRefreshKey] = useState(0);

  const fetchMentorDetail = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const detailResponse = await (isCabangRole
        ? getCabangMentorById(id)
        : getPerusahaanMentorById(id));
      const detailMentor = extractMentorItem(detailResponse);

      const fallbackSources = await Promise.allSettled([
        isCabangRole ? getCabangMentorList() : getPerusahaanMentorList(),
        getMentorById(id),
      ]);

      const mentorList =
        fallbackSources[0]?.status === "fulfilled"
          ? extractMentorList(fallbackSources[0].value)
          : [];

      const mentorFromList = findMentorFromList(mentorList, id, detailMentor);
      const mentorFromDirectEndpoint =
        fallbackSources[1]?.status === "fulfilled"
          ? extractMentorItem(fallbackSources[1].value)
          : null;

      const mergedWithList = mergeMentorData(detailMentor, mentorFromList);
      const fullyMergedMentor = mergeMentorData(mergedWithList, mentorFromDirectEndpoint);
      const baseMentor = fullyMergedMentor || detailMentor || null;

      if (baseMentor && !isCabangRole) {
        const embeddedStudents = extractMentorStudents(baseMentor);
        if (embeddedStudents.length === 0) {
          const mentorIdCandidates = new Set([String(id ?? "").trim(), ...getMentorIdCandidates(baseMentor)]);
          const pesertaEndpoints = getPerusahaanPesertaEndpoints(companyId);

          let assignedStudents = [];
          for (const endpoint of pesertaEndpoints) {
            try {
              const pesertaResponse = await api.get(endpoint);
              const list = extractStudentListFromResponse(pesertaResponse);
              const mentorNameNormalized = normalizeText(resolveMentorName(baseMentor, DEFAULT_MENTOR_NAME));
              const filtered = list.filter((student) =>
                matchesMentorByIdOrName(student, mentorIdCandidates, mentorNameNormalized)
              );

              if (filtered.length > 0) {
                assignedStudents = filtered;
                break;
              }

              const detailedResults = await Promise.allSettled(
                list.map(async (student) => {
                  const identifiers = resolveStudentIdentifierCandidates(student);
                  for (const identifier of identifiers) {
                    try {
                      const detailResponse = await api.get(`/peserta/detail/${identifier}`);
                      const detailPayload =
                        detailResponse?.data?.data?.detail_peserta ||
                        detailResponse?.data?.data ||
                        detailResponse?.data ||
                        {};
                      return { ...student, detail_peserta: detailPayload };
                    } catch {
                      // continue to next identifier
                    }
                  }
                  return student;
                })
              );

              const detailedList = detailedResults.map((result, index) =>
                result.status === "fulfilled" ? result.value : list[index]
              );

              const filteredFromDetail = detailedList.filter((student) => {
                const mentorIds = new Set([
                  ...resolveStudentMentorIdCandidates(student),
                  ...resolveStudentMentorIdCandidates(student?.detail_peserta || {}),
                ]);

                if (Array.from(mentorIds).some((studentMentorId) => mentorIdCandidates.has(studentMentorId))) {
                  return true;
                }

                const mentorNameFromDetail = normalizeText(
                  student?.detail_peserta?.mentor ||
                    student?.mentor ||
                    student?.detail_peserta?.mentor_name ||
                    ""
                );

                return Boolean(
                  mentorNameFromDetail &&
                    mentorNameNormalized &&
                    mentorNameFromDetail === mentorNameNormalized
                );
              });

              if (filteredFromDetail.length > 0) {
                assignedStudents = filteredFromDetail;
                break;
              }
            } catch {
              // continue to next endpoint
            }
          }

          if (assignedStudents.length > 0) {
            setMentor({
              ...baseMentor,
              peserta: assignedStudents,
              pesertas: assignedStudents,
            });
          } else {
            setMentor(baseMentor);
          }
        } else {
          setMentor(baseMentor);
        }
      } else {
        setMentor(baseMentor);
      }
    } catch (error) {
      console.error("Gagal memuat detail mentor:", error);
      setMentor(null);
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memuat detail mentor",
      });
    } finally {
      setLoading(false);
    }
  }, [id, isCabangRole, companyId]);

  useEffect(() => {
    fetchMentorDetail();
  }, [fetchMentorDetail]);

  useEffect(() => {
    const fetchStudentsFromIndex = async () => {
      if (isCabangRole || !mentor) {
        setStudentsFromIndex([]);
        return;
      }

      const mentorIdCandidates = new Set([String(id ?? "").trim(), ...getMentorIdCandidates(mentor)]);
      if (mentorIdCandidates.size === 0) {
        setStudentsFromIndex([]);
        return;
      }

      const endpoints = getPerusahaanPesertaEndpoints(companyId);

      const mentorNameNormalized = normalizeText(resolveMentorName(mentor, DEFAULT_MENTOR_NAME));
      let mappedStudents = [];
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          const list = extractStudentListFromResponse(response);
          const filtered = list.filter((student) =>
            matchesMentorByIdOrName(student, mentorIdCandidates, mentorNameNormalized)
          );
          if (filtered.length > 0) {
            mappedStudents = filtered;
            break;
          }
        } catch {
          // try next endpoint
        }
      }

      setStudentsFromIndex(mappedStudents);
    };

    fetchStudentsFromIndex();
  }, [isCabangRole, mentor, id, companyId, studentsRefreshKey]);

  const mentorName = resolveMentorName(mentor, DEFAULT_MENTOR_NAME);
  const mentorDivision = resolveMentorDivision(mentor, DEFAULT_MENTOR_DIVISION);
  const mentorDivisionId = resolveMentorDivisionId(mentor);
  const effectiveDivisionId = mentorDivisionId || divisionIdByName;
  const mentorPhoto = resolveMentorProfileUrl(mentor);

  const filteredStudents = useMemo(() => {
    const students =
      !isCabangRole && studentsFromIndex.length > 0
        ? studentsFromIndex
        : extractMentorStudents(mentor);
    const query = searchQuery.trim().toLowerCase();

    let data = students.filter((student) => {
      const { name, email, school } = extractStudentSearchFields(student);

      if (!query) return true;
      return [name, email, school].join(" ").toLowerCase().includes(query);
    });

    data = [...data].sort((left, right) => {
      const leftDate = toDateValue(resolveStudentCreatedDate(left));
      const rightDate = toDateValue(resolveStudentCreatedDate(right));
      if (!leftDate && !rightDate) return 0;
      if (!leftDate) return 1;
      if (!rightDate) return -1;
      if (sortOrder === SORT_OLDEST) return leftDate - rightDate;
      return rightDate - leftDate;
    });

    return data;
  }, [isCabangRole, studentsFromIndex, mentor, searchQuery, sortOrder]);

  const totalItems = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentData = filteredStudents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const paginationItems = useMemo(() => createPaginationItems(page, totalPages), [page, totalPages]);
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = totalItems === 0 ? 0 : Math.min(page * ITEMS_PER_PAGE, totalItems);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortOrder]);

  useEffect(() => {
    setPage((prevPage) => Math.min(prevPage, totalPages));
  }, [totalPages]);

  useEffect(() => {
    const resolveDivisionIdFallback = async () => {
      if (mentorDivisionId) {
        setDivisionIdByName("");
        return;
      }

      if (!mentorDivision || mentorDivision === DEFAULT_MENTOR_DIVISION) {
        setDivisionIdByName("");
        return;
      }

      try {
        const response = isCabangRole ? await getCabangDivisiList() : await getDivisiList();
        const divisions = extractSimpleDivisionList(response);
        setDivisionIdByName(findDivisionIdByName(divisions, mentorDivision) || "");
      } catch (error) {
        console.error("Gagal memetakan nama divisi ke id divisi:", error);
        setDivisionIdByName("");
      }
    };

    resolveDivisionIdFallback();
  }, [isCabangRole, mentorDivisionId, mentorDivision]);

  const handleOpenAddStudentModal = async () => {
    if (effectiveDivisionId) {
      setIsAddStudentModalOpen(true);
      return;
    }

    try {
      const response = isCabangRole ? await getCabangDivisiList() : await getDivisiList();
      const divisions = extractSimpleDivisionList(response);
      const matchedId = findDivisionIdByName(divisions, mentorDivision);
      if (matchedId) {
        setDivisionIdByName(matchedId);
        setIsAddStudentModalOpen(true);
        return;
      }
    } catch (error) {
      console.error("Gagal memuat daftar divisi saat membuka modal siswa:", error);
    }

    Swal.fire({
      icon: "warning",
      title: "Divisi tidak ditemukan",
      text: "ID divisi untuk mentor ini tidak ditemukan.",
    });
  };

  const handleOpenChangeDivisionModal = (student) => {
    setSelectedStudent(student);
    setIsChangeDivisionModalOpen(true);
  };

  const handleRefreshData = () => {
    fetchMentorDetail();
    setStudentsRefreshKey((prev) => prev + 1);
  };

  return {
    id,
    loading,
    navigate,
    mentorRouteBase,
    mentorName,
    mentorDivision,
    mentorPhoto,
    companyId,
    currentData,
    page,
    setPage,
    totalItems,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    paginationItems,
    rangeStart,
    rangeEnd,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    sortNewest: SORT_NEWEST,
    sortOldest: SORT_OLDEST,
    isAddStudentModalOpen,
    setIsAddStudentModalOpen,
    isChangeDivisionModalOpen,
    setIsChangeDivisionModalOpen,
    selectedStudent,
    effectiveDivisionId,
    resolveStudentDivision,
    resolveStudentPhotoUrl: resolveMentorProfileUrl,
    handleOpenAddStudentModal,
    handleOpenChangeDivisionModal,
    handleRefreshData,
  };
};
