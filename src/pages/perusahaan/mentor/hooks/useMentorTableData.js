import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  deleteCabangMentor,
  deletePerusahaanMentor,
  getMentorById,
  getPerusahaanMentorById,
  getPerusahaanMentorList,
  getCabangMentorById,
  getCabangMentorList,
} from "@/helpers/apiClient";
import { getMentorCreatedAt, parseDateSafe } from "@/shared/helpers/mentorData";
import {
  extractMentorItem,
  extractMentorList,
  getMentorId,
  mergeMentorData,
} from "../helpers/mentorResolvers";

const DEFAULT_DIVISION_FILTERS = [
  "Frontend",
  "Backend",
  "Mobile",
  "UI/UX Design",
  "Digital Marketing",
  "Project Manager",
  "Quality Assurance",
];

const ITEMS_PER_PAGE = 10;

const toDateValue = (value) => parseDateSafe(value);

const getMentorSortTimestamp = (mentor) => {
  const createdAt = toDateValue(getMentorCreatedAt(mentor));
  if (createdAt) return createdAt.getTime();

  const numericId = Number(mentor?.id);
  return Number.isFinite(numericId) ? numericId : 0;
};

const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data || {};
  const metaMessage = data?.meta?.message;
  if (typeof metaMessage === "string" && metaMessage.trim()) return metaMessage;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  return fallback;
};

export const useMentorTableData = ({ isCabangRole, routeBase, navigate }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("terbaru");
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [appliedDivisions, setAppliedDivisions] = useState([]);
  const [appliedDateRange, setAppliedDateRange] = useState({
    from: null,
    to: null,
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const listResponses = await Promise.allSettled(
          isCabangRole
            ? [getCabangMentorList()]
            : [getPerusahaanMentorList()]
        );

        const fulfilledResponses = listResponses
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        let list = [];
        for (const response of fulfilledResponses) {
          const extracted = extractMentorList(response);
          if (extracted.length > 0) {
            list = extracted;
            break;
          }
        }

        const ids = [...new Set(list.map((item) => getMentorId(item)).filter(Boolean))];
        if (ids.length > 0) {
          const detailResults = await Promise.allSettled(
            ids.map(async (mentorId) => {
              try {
                return await (isCabangRole
                  ? getCabangMentorById(mentorId)
                  : getPerusahaanMentorById(mentorId));
              } catch {
                return await getMentorById(mentorId);
              }
            })
          );

          const detailMap = {};
          detailResults.forEach((result, index) => {
            if (result.status !== "fulfilled") return;
            const id = ids[index];
            const detail = extractMentorItem(result.value);
            if (detail) {
              detailMap[id] = detail;
            }
          });

          list = list.map((item) => {
            const itemId = getMentorId(item);
            const detail = detailMap[itemId];
            if (!detail) return item;
            return mergeMentorData(detail, item);
          });
        }

        setMentors(list);
      } catch (error) {
        console.error("Gagal memuat data mentor:", error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [isCabangRole]);

  const filterState = {
    selected: selectedDivisions,
    toggle: (val) =>
      setSelectedDivisions((prev) =>
        prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
      ),
    apply: ({ dateFrom, dateTo } = {}) => {
      setAppliedDivisions(selectedDivisions);
      setAppliedDateRange({
        from: dateFrom || null,
        to: dateTo || null,
      });
    },
    reset: () => {
      setSelectedDivisions([]);
      setAppliedDivisions([]);
      setAppliedDateRange({ from: null, to: null });
    },
  };

  const divisionFilterOptions = useMemo(() => {
    const fromData = mentors
      .map((item) => item?.divisi?.nama || item?.divisi || "")
      .map((item) => String(item).trim())
      .filter(Boolean);

    return [...new Set([...DEFAULT_DIVISION_FILTERS, ...fromData])];
  }, [mentors]);

  const filteredData = useMemo(() => {
    let data = mentors;

    if (searchQuery.trim() !== "") {
      const keyword = searchQuery.toLowerCase();
      data = data.filter((item) => {
        const nama = item?.user?.nama || item?.peserta?.user?.nama || "";
        const email = item?.user?.email || "";
        const telepon = item?.user?.telepon || item?.peserta?.nomor_hp || "";
        const divisi = item?.divisi?.nama || item?.divisi || "";
        return [nama, email, telepon, divisi]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      });
    }

    if (appliedDivisions.length > 0) {
      data = data.filter((item) =>
        appliedDivisions.includes(item?.divisi?.nama || item?.divisi)
      );
    }

    if (appliedDateRange.from || appliedDateRange.to) {
      const from = toDateValue(appliedDateRange.from);
      const to = toDateValue(appliedDateRange.to);
      if (to) to.setHours(23, 59, 59, 999);

      data = data.filter((item) => {
        const createdAt = toDateValue(getMentorCreatedAt(item));
        if (!createdAt) return false;
        if (from && createdAt < from) return false;
        if (to && createdAt > to) return false;
        return true;
      });
    }

    switch (sortValue) {
      case "az":
        data = [...data].sort((a, b) =>
          (a?.user?.nama || "").localeCompare(b?.user?.nama || "")
        );
        break;
      case "za":
        data = [...data].sort((a, b) =>
          (b?.user?.nama || "").localeCompare(a?.user?.nama || "")
        );
        break;
      case "terlama":
        data = [...data].sort(
          (a, b) => getMentorSortTimestamp(a) - getMentorSortTimestamp(b)
        );
        break;
      case "terbaru":
      default:
        data = [...data].sort(
          (a, b) => getMentorSortTimestamp(b) - getMentorSortTimestamp(a)
        );
        break;
    }

    return data;
  }, [mentors, searchQuery, appliedDivisions, appliedDateRange, sortValue]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortValue, appliedDivisions, appliedDateRange]);

  const paginated = useMemo(
    () =>
      filteredData
        .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
        .map((item, index) => ({
          ...item,
          no: (page - 1) * ITEMS_PER_PAGE + index + 1,
        })),
    [filteredData, page]
  );

  const openMentorDetail = (row) => {
    const mentorId = getMentorId(row);
    if (!mentorId) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "ID mentor tidak ditemukan",
      });
      return;
    }
    navigate(`${routeBase}/${mentorId}/detail`);
  };

  const openMentorEdit = (row) => {
    const mentorId = getMentorId(row);
    if (!mentorId) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "ID mentor tidak ditemukan",
      });
      return;
    }
    navigate(`${routeBase}/${mentorId}/edit`, {
      state: { mentor: row },
    });
  };

  const deleteMentor = async (row) => {
    const mentorId = getMentorId(row);
    if (!mentorId) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "ID mentor tidak ditemukan",
      });
      return;
    }

    const mentorName =
      row?.user?.nama || row?.nama || row?.mentor?.nama || "mentor ini";

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Hapus Mentor?",
      text: `Akun ${mentorName} akan dihapus permanen.`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#DC2626",
    });

    if (!confirmation.isConfirmed) return;

    try {
      if (isCabangRole) {
        await deleteCabangMentor(mentorId);
      } else {
        await deletePerusahaanMentor(mentorId);
      }

      setMentors((prev) =>
        prev.filter((item) => String(getMentorId(item)) !== String(mentorId))
      );

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Akun mentor berhasil dihapus",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: getApiErrorMessage(error, "Gagal menghapus mentor"),
      });
    }
  };

  return {
    loading,
    searchQuery,
    setSearchQuery,
    sortValue,
    setSortValue,
    filterState,
    divisionFilterOptions,
    filteredTotal: filteredData.length,
    page,
    setPage,
    itemsPerPage: ITEMS_PER_PAGE,
    paginated,
    openMentorDetail,
    openMentorEdit,
    deleteMentor,
    openAddMentor: () => navigate(`${routeBase}/tambah-mentor`),
  };
};
