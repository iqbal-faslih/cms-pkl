import { useContext, useEffect, useRef, useState } from "react";
import { useDaftarPeserta } from "@/hooks/perusahaan/peserta/useDaftarPeserta";
import { useLoader } from "@/hooks/useLoader";
import { AuthContext } from "@/contexts/AuthContext";
import { subscribeError } from "@/utils/errorUtils";
import { ConfigTableHeaderSiswa } from "@/shared/config/ConfigPesertaBranch";

export const usePesertaBranchTable = () => {
  const { user } = useContext(AuthContext);
  const companyId =
    user?.id_perusahaan ||
    user?.perusahaan?.id ||
    user?.company?.id ||
    sessionStorage.getItem("id_perusahaan") ||
    localStorage.getItem("id_perusahaan") ||
    user?.id;

  const {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    resetFilters,
    sortOption,
    setSortOption,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    handlePageChange,
    refetch,
  } = useDaftarPeserta(companyId, { itemsPerPage: 10 });

  const { showSkeleton } = useLoader({ loading });

  const [errorMessage, setErrorMessage] = useState(null);
  const isErrorOpenRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeError((message) => {
      if (isErrorOpenRef.current) return;
      isErrorOpenRef.current = true;
      setErrorMessage(message);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!error || isErrorOpenRef.current) return;
    const message =
      error?.response?.data?.message || error?.message || "Gagal memuat data peserta";
    isErrorOpenRef.current = true;
    setErrorMessage(message);
  }, [error]);

  const filterState = {
    selected: selectedFilters,
    toggle: (value) => toggleFilter(value),
    apply: ({ dateFrom, dateTo }) =>
      applyFilters({
        dateFrom,
        dateTo,
      }),
    reset: resetFilters,
  };

  const modalActions = {
    sortValue: sortOption,
    setSortValue: setSortOption,
  };

  const config = ConfigTableHeaderSiswa(
    filterState,
    searchTerm,
    setSearchTerm,
    modalActions
  );

  const closeError = () => {
    isErrorOpenRef.current = false;
    setErrorMessage(null);
  };

  return {
    config,
    data,
    showSkeleton,
    itemsPerPage,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    errorMessage,
    closeError,
    refetch,
  };
};
