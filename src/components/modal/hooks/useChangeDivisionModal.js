import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  api,
  getCabangDivisiList,
  getCabangMentorList,
  getDivisiList,
  getPerusahaanMentorList,
} from "@/helpers/apiClient";
import {
  extractApiArray,
  isSameDivisionSelection,
  normalizeDivisionText,
  resolvePesertaIdCandidates,
  resolveDivisionNameById,
  resolveMentorNameById,
  resolveScopeByRole,
  uniqueDivisionsById,
} from "../helpers/changeDivisionModalHelper";

const TOAST_OPTIONS = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const toText = (value) => String(value || "").trim();

export const useChangeDivisionModal = ({ isOpen, student, onSuccess, onClose }) => {
  const scope = resolveScopeByRole();
  const [divisions, setDivisions] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [originDivisionId, setOriginDivisionId] = useState("");
  const [originDivisionName, setOriginDivisionName] = useState("");
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !student) return;
    const initialDivision = toText(
      student?.id_divisi ||
        student?.divisi?.id ||
        student?.division?.id ||
        student?.peserta?.id_divisi ||
        student?.peserta?.divisi?.id ||
        student?.peserta?.division?.id ||
        ""
    );
    const initialMentor = toText(
      student?.id_mentor ||
        student?.mentor_id ||
        student?.id_manage_mentor ||
        student?.mentor?.id ||
        student?.mentor?.id_mentor ||
        student?.peserta?.id_mentor ||
        student?.peserta?.mentor_id ||
        student?.peserta?.id_manage_mentor ||
        student?.peserta?.mentor?.id ||
        student?.peserta?.mentor?.id_mentor ||
        ""
    );
    const initialDivisionName = normalizeDivisionText(
      student?.divisi?.nama ||
        student?.divisi?.name ||
        (typeof student?.divisi === "string" ? student.divisi : "") ||
        student?.nama_divisi ||
        student?.divisi_name ||
        student?.peserta?.divisi?.nama ||
        student?.peserta?.divisi?.name ||
        (typeof student?.peserta?.divisi === "string" ? student.peserta.divisi : "") ||
        student?.peserta?.nama_divisi ||
        student?.peserta?.divisi_name ||
        ""
    );

    setOriginDivisionId(initialDivision);
    setOriginDivisionName(initialDivisionName);
    setSelectedDivision(initialDivision);
    setSelectedMentor(initialMentor);
  }, [isOpen, student]);

  useEffect(() => {
    if (!isOpen) return;
    if (originDivisionId || !originDivisionName) return;
    if (!Array.isArray(divisions) || divisions.length === 0) return;

    const matchedDivision = divisions.find((division) => {
      const divisionName = normalizeDivisionText(
        division?.nama || division?.nama_divisi || division?.name || ""
      );
      return (
        divisionName === originDivisionName ||
        divisionName.includes(originDivisionName) ||
        originDivisionName.includes(divisionName)
      );
    });

    const mappedId = String(matchedDivision?.id || matchedDivision?.id_divisi || "").trim();
    if (!mappedId) return;

    setOriginDivisionId(mappedId);
    if (!selectedDivision) setSelectedDivision(mappedId);
  }, [divisions, isOpen, originDivisionId, originDivisionName, selectedDivision]);

  const fetchDivisions = useCallback(async () => {
    setLoadingDivisions(true);
    try {
      let response = await api.get(`/${scope}/divisi`, { params: { per_page: 1000 } });
      let list = extractApiArray(response);

      if (list.length === 0) {
        response = scope === "cabang" ? await getCabangDivisiList() : await getDivisiList();
        list = extractApiArray(response);
      }

      setDivisions(uniqueDivisionsById(list));
    } catch (fetchError) {
      console.error("Gagal memuat data divisi:", fetchError);
      setError("Gagal memuat daftar divisi");
    } finally {
      setLoadingDivisions(false);
    }
  }, [scope]);

  const fetchAllMentors = useCallback(async () => {
    setLoadingMentors(true);
    try {
      let response = await api.get(`/${scope}/manage-mentor`, { params: { per_page: 1000 } });
      let list = extractApiArray(response);

      if (list.length === 0) {
        response = scope === "cabang" ? await getCabangMentorList() : await getPerusahaanMentorList();
        list = extractApiArray(response);
      }

      setAllMentors(list);
    } catch (fetchError) {
      console.error("Gagal memuat data mentor:", fetchError);
      setError("Gagal memuat daftar mentor");
    } finally {
      setLoadingMentors(false);
    }
  }, [scope]);

  useEffect(() => {
    if (!isOpen) return;
    fetchDivisions();
    fetchAllMentors();
    setError(null);
  }, [fetchAllMentors, fetchDivisions, isOpen]);

  const filteredMentors = useMemo(() => {
    if (!selectedDivision) return [];

    const selectedDivisionId = String(selectedDivision).trim();
    const selectedDivisionName = resolveDivisionNameById(divisions, selectedDivisionId);

    return allMentors.filter((mentor) => {
      const divisionIds = [
        mentor?.divisi?.id,
        mentor?.division?.id,
        mentor?.user?.divisi?.id,
        mentor?.id_divisi,
        mentor?.divisi_id,
        mentor?.division_id,
      ]
        .map((value) => String(value || "").trim())
        .filter(Boolean);

      if (divisionIds.includes(selectedDivisionId)) return true;

      const divisionNames = [
        mentor?.divisi?.nama,
        mentor?.divisi?.name,
        typeof mentor?.divisi === "string" ? mentor.divisi : "",
        mentor?.division?.nama,
        mentor?.division?.name,
        typeof mentor?.division === "string" ? mentor.division : "",
        mentor?.user?.divisi?.nama,
        mentor?.user?.divisi?.name,
        mentor?.nama_divisi,
        mentor?.divisi_name,
      ]
        .map((value) => normalizeDivisionText(value))
        .filter(Boolean);

      if (!selectedDivisionName) return false;
      return divisionNames.some(
        (name) =>
          name === selectedDivisionName ||
          name.includes(selectedDivisionName) ||
          selectedDivisionName.includes(name)
      );
    });
  }, [allMentors, divisions, selectedDivision]);

  const isSameDivision = useMemo(
    () =>
      isSameDivisionSelection({
        selectedDivision,
        currentDivisionId: originDivisionId,
        currentDivisionName: originDivisionName,
        divisions,
        compareByName: !originDivisionId,
      }),
    [divisions, originDivisionId, originDivisionName, selectedDivision]
  );

  useEffect(() => {
    if (!selectedDivision) {
      setSelectedMentor("");
      return;
    }

    const exactMentor = filteredMentors.find(
      (mentor) => String(mentor?.id || mentor?.id_mentor || "") === String(selectedMentor)
    );
    if (exactMentor) return;

    const firstMentor = filteredMentors[0];
    const nextMentorId = String(firstMentor?.id || firstMentor?.id_mentor || "").trim();
    setSelectedMentor(nextMentorId);
  }, [filteredMentors, selectedDivision, selectedMentor]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const pesertaId = resolvePesertaIdCandidates(student)[0] || "";
      if (!pesertaId) {
        setError("ID peserta tidak ditemukan.");
        return;
      }

      if (isSameDivision) {
        const sameDivisionMessage = "Peserta sudah berada di divisi ini.";
        setError(sameDivisionMessage);
        toast.warning(sameDivisionMessage, TOAST_OPTIONS);
        return;
      }

      if (!selectedMentor) {
        const noMentorMessage = "Tidak ada mentor pada divisi yang dipilih.";
        setError(noMentorMessage);
        toast.error(noMentorMessage, TOAST_OPTIONS);
        return;
      }

      const payload = {
        id_divisi: selectedDivision,
        id_mentor: selectedMentor,
      };
      const endpointCandidates = [
        `/manage-mentor/pindah-divisi-siswa/${pesertaId}`,
        `/${scope}/manage-mentor/pindah-divisi-siswa/${pesertaId}`,
      ];

      let updated = false;
      let lastError = null;

      for (const endpoint of endpointCandidates) {
        try {
          await api.put(endpoint, payload);
          updated = true;
          break;
        } catch (submitError) {
          lastError = submitError;
          if (![404, 405].includes(submitError?.response?.status)) {
            throw submitError;
          }
        }
      }

      if (!updated) {
        throw lastError || new Error("Gagal mengubah mentor dan divisi peserta");
      }

      toast.success("Berhasil pindah divisi", TOAST_OPTIONS);
      onSuccess();
      onClose();
    } catch (submitError) {
      console.error("Gagal mengubah mentor dan divisi:", submitError);

      let errorMessage = "Gagal mengubah mentor dan divisi peserta";
      if (submitError.response?.data?.message) {
        errorMessage = submitError.response.data.message;
      } else if (submitError.response?.data?.errors) {
        errorMessage = Object.values(submitError.response.data.errors).flat().join(", ");
      }

      setError(errorMessage);
      toast.error(errorMessage, TOAST_OPTIONS);
    } finally {
      setLoading(false);
    }
  };

  return {
    divisions,
    error,
    handleSubmit,
    isSameDivision,
    loading,
    loadingDivisions,
    loadingMentors,
    selectedDivision,
    selectedMentor,
    selectedMentorName: resolveMentorNameById(filteredMentors, selectedMentor),
    setSelectedDivision,
    setSelectedMentor,
  };
};
