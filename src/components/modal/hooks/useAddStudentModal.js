import { useEffect, useMemo, useState } from "react";
import { api } from "@/helpers/apiClient";
import {
  extractApiErrorMessage,
  extractStudentList,
  filterStudentsByDivision,
  mapStudentOptions,
  resolveMentorApiId,
  resolveStudentPesertaId,
  toApiId,
} from "../helpers/addStudentModalHelper";

export const useAddStudentModal = ({
  isOpen,
  mentorId,
  divisionId,
  divisionName = "",
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const role =
    String(localStorage.getItem("role") || sessionStorage.getItem("role") || "").toLowerCase();
  const mentorScope = role === "cabang" ? "cabang" : "perusahaan";

  const selectedStudentIds = useMemo(
    () => new Set(selectedStudents.map((student) => student.id)),
    [selectedStudents]
  );

  useEffect(() => {
    if (!isOpen) return;
    setSelectedStudentId("");
    setSelectedStudents([]);
    setError("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAvailableStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoints =
          mentorScope === "perusahaan"
            ? [
                `${import.meta.env.VITE_API_URL}/perusahaan/manage-mentor/peserta-by-divisi/${divisionId}`,
                `${import.meta.env.VITE_API_URL}/peserta/perusahaan?per_page=1000`,
                `${import.meta.env.VITE_API_URL}/peserta/perusahaan?per_page=1000&status_magang=aktif`,
                `${import.meta.env.VITE_API_URL}/peserta/perusahaan`,
              ].filter(Boolean)
            : [
                `${import.meta.env.VITE_API_URL}/cabang-peserta-magang?per_page=1000`,
                `${import.meta.env.VITE_API_URL}/cabang/divisi/${divisionId}`,
                `${import.meta.env.VITE_API_URL}/cabang/manage-mentor/peserta-by-divisi/${divisionId}`,
              ].filter(Boolean);

        let bestStudents = [];
        for (const url of endpoints) {
          try {
            const normalizedPath = url.replace(import.meta.env.VITE_API_URL, "");
            const response = await api.get(normalizedPath);
            const metaCode = Number(response?.data?.meta?.code ?? 0);
            if (metaCode >= 400) {
              continue;
            }
            const extracted = extractStudentList(response);
            if (extracted.length === 0) continue;

            const divisionScopedStudents = filterStudentsByDivision(
              extracted,
              divisionId,
              divisionName
            );
            const scopedOptions = mapStudentOptions(divisionScopedStudents);
            const currentBestOptions = mapStudentOptions(bestStudents);

            if (scopedOptions.length > currentBestOptions.length) {
              bestStudents = divisionScopedStudents;
            }
            if (scopedOptions.length > 0) break;
          } catch (requestError) {
            if (requestError?.response?.status === 404) continue;
            throw requestError;
          }
        }

        setStudents(mapStudentOptions(bestStudents));
      } catch (fetchError) {
        console.error("Error fetching students by division:", fetchError);
        setStudents([]);
        setError("Gagal memuat data siswa. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableStudents();
  }, [isOpen, divisionId, divisionName, mentorScope]);

  const handleSelectStudent = (event) => {
    const optionValue = event.target.value;
    setSelectedStudentId(optionValue);
    if (!optionValue || selectedStudentIds.has(optionValue)) return;

    const selected = students.find((student) => student.optionValue === optionValue);
    if (!selected) return;

    setSelectedStudents((prev) => [...prev, selected]);
    setSelectedStudentId("");
  };

  const handleRemoveStudent = (id) => {
    setSelectedStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      setError("Silakan pilih minimal satu siswa.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const mentorRawId = String(mentorId ?? "").trim();
      if (!mentorRawId) {
        setError("Mentor wajib dipilih.");
        return;
      }

      const resolvedPesertaIds = await Promise.all(
        selectedStudents.map((student) =>
          resolveStudentPesertaId(student, async (candidateId) => {
            const detailEndpoints = [
              () => api.get(`/peserta/detail/${candidateId}`),
              () => api.get("/peserta/detail", { params: { id: candidateId } }),
              () => api.get("/peserta/detail", { params: { peserta_id: candidateId } }),
              () => api.get("/peserta/detail", { params: { id_peserta: candidateId } }),
            ];

            let lastError = null;
            for (const request of detailEndpoints) {
              try {
                return await request();
              } catch (error) {
                lastError = error;
                if (error?.response?.status === 404) continue;
                throw error;
              }
            }

            throw lastError || new Error("Gagal memuat detail peserta");
          })
        )
      );
      const studentIds = resolvedPesertaIds
        .map((value) => toApiId(value))
        .filter((value) => String(value ?? "").trim() !== "");

      if (studentIds.length === 0) {
        setError("ID siswa tidak ditemukan. Silakan pilih ulang siswa.");
        return;
      }

      const mentorApiId = await resolveMentorApiId(mentorRawId, (candidateId) =>
        api.get(`/${mentorScope}/manage-mentor/${candidateId}`)
      );
      const normalizedMentorApiId = toApiId(mentorApiId);
      if (!String(normalizedMentorApiId ?? "").trim()) {
        setError("ID mentor tidak valid.");
        return;
      }

      const normalizedDivisionId = String(toApiId(divisionId) ?? "").trim();
      const submitEndpoint = `/${mentorScope}/manage-mentor/tambah-siswa`;
      let successCount = 0;
      let lastError = null;

      const isSuccessfulResponse = (response) => {
        if (!response || response.status < 200 || response.status >= 300) return false;
        const body = response.data || {};
        const metaCode = Number(body?.meta?.code ?? 0);
        if (metaCode >= 400) return false;
        if (body?.meta?.status === "error") return false;
        if (body?.status === "error") return false;
        return true;
      };

      const createPayloadVariants = (studentId) => {
        const base = {
          id_mentor: normalizedMentorApiId,
          id_divisi: normalizedDivisionId || undefined,
        };

        return [
          { ...base, id_peserta: studentId },
          { ...base, id_siswa: studentId },
          { ...base, siswa: studentId },
          { ...base, data_siswa: [studentId] },
          { ...base, siswa: [studentId] },
        ];
      };

      for (const studentId of studentIds) {
        const payloadVariants = createPayloadVariants(studentId);
        let studentSubmitted = false;

        for (const payload of payloadVariants) {
          try {
            const response = await api.post(submitEndpoint, payload, {
              headers: { "Content-Type": "application/json" },
            });
            if (!isSuccessfulResponse(response)) continue;
            successCount += 1;
            studentSubmitted = true;
            break;
          } catch (err) {
            lastError = err;
            if (![404, 405, 422].includes(err?.response?.status)) {
              throw err;
            }
          }
        }

        if (!studentSubmitted && lastError) {
          continue;
        }
      }

      if (successCount === 0) throw lastError || new Error("Gagal menambahkan siswa");

      onSuccess?.();
      onClose?.();
    } catch (submitError) {
      console.error("Error adding students to mentor:", submitError);
      setError(
        extractApiErrorMessage(
          submitError,
          "Terjadi kesalahan saat menambahkan siswa. Silakan coba lagi."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    students,
    selectedStudentId,
    selectedStudents,
    selectedStudentIds,
    setError,
    handleSelectStudent,
    handleRemoveStudent,
    handleSubmit,
  };
};
