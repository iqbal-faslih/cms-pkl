import { useState, useEffect, useMemo } from "react";
import { useFetch } from "../../../../shared/hooks/requests/useFetch";
import { useSearch } from "../../../../shared/hooks/useSearch";
import { buildQuery } from "../../../../shared/helpers/buildQuery";
import { formatDateToBackend, formatInternshipPeriod } from "../../../../utils/dateUtils";
import { SORT_SCHEMA } from "../../../../shared/schema/querySchemas";

export const useApprovalData = (activeTab = "pendaftaran", options = {}) => {
  const { itemsPerPage = 10, searchDelay = 500 } = options;

  const {
    keyword: searchTerm,
    debouncedKeyword,
    setKeyword: setSearchTerm,
  } = useSearch(searchDelay);

  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedAlasan, setSelectedAlasan] = useState([]);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [masaMagangFilter, setMasaMagangFilter] = useState({
  from: null,
  to: null,
});

  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const [currentPage, setCurrentPage] = useState(1);

  const endpoint =
    activeTab === "pendaftaran"
      ? "/cabang/approval/daftar"
      : "/cabang/approval/izin";

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, selectedStatus, selectedAlasan, dateFilter, masaMagangFilter, activeTab]);

  const queryString = useMemo(() => {
    const mapStatusToApi = (statusList) => {
      return statusList.map((s) =>
        s.toLowerCase() === "pending" ? "menunggu" : s.toLowerCase()
      );
    };

    return buildQuery({
      search: debouncedKeyword,
      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
      },
      sort: sortOption,
      sortSchema: SORT_SCHEMA,
      filters: {
        status: mapStatusToApi(selectedStatus),
        ...(activeTab === "izin" && { keterangan: selectedAlasan }),
         ...(activeTab === "pendaftaran" && {
    selesai_from: formatDateToBackend(masaMagangFilter.from),
    selesai_to: formatDateToBackend(masaMagangFilter.to),
  }),
      },
      date: dateFilter,
    });
  }, [
    debouncedKeyword,
    currentPage,
    itemsPerPage,
    sortOption,
    selectedStatus,
    selectedAlasan,
    masaMagangFilter,
    dateFilter,
    activeTab,
  ]);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch(`${endpoint}?${queryString}`);

  const transformedData = useMemo(() => {
    if (!apiData?.data) return [];

    return apiData.data.map((item, index) => {
      const generatedId = (currentPage - 1) * itemsPerPage + index + 1;

      if (activeTab === "pendaftaran") {
        return {
          no: generatedId,
          id: item.id,
          nama: item.nama,
          sekolah: item.sekolah,
          jurusan: item.jurusan,
          status: item.status,
          email: item.email,
          masa_magang: formatInternshipPeriod(item.mulai, item.selesai),
          avatar: item.profil,
        };
      } else {
        return {
          no: generatedId,
          id: item.id,
          nama: item.nama,
          sekolah: item.sekolah,
          profilePicture: `${import.meta.env.VITE_FILE_URL}/${item.profil}`,
          status_izin: item.status,
          email: item.email,
          tanggal_izin: item.tanggal_izin,
          alasan: item.keterangan,
        };
      }
    });
  }, [apiData, activeTab, currentPage, itemsPerPage]);

  const paginationInfo = useMemo(() => {
    const meta = apiData?.meta || {};
    return {
      totalPages: meta.last_page || 1,
      totalItems: meta.total || 0,
      itemsPerPage: meta.per_page || itemsPerPage,
      currentPage: meta.current_page || 1,
      from: meta.from || 0,
      to: meta.to || 0,
    };
  }, [apiData, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);

const handleFilterChange = (filters) => {
  if (filters.status) setSelectedStatus(filters.status);
  if (filters.alasan) setSelectedAlasan(filters.alasan);
  if (filters.date) setDateFilter(filters.date);
  if (filters.masaMagang) setMasaMagangFilter(filters.masaMagang);
};


  const resetFilters = () => {
    setSelectedStatus([]);
    setSelectedAlasan([]);
    setDateFilter({ from: null, to: null });
  };

  useEffect(() => {
    resetFilters();
  }, [activeTab]);

  return {
    data: transformedData,
    loading,
    error,
    pagination: {
      ...paginationInfo,
      onPageChange: handlePageChange,
    },
    search: searchTerm,
    setSearch: setSearchTerm,
    filters: {
      setStatus: setSelectedStatus,
      setAlasan: setSelectedAlasan,
      setDate: setDateFilter,
      setSort: setSortOption,
      reset: resetFilters,
      onFilterChange: handleFilterChange,
    },
    refetch,
  };
};
