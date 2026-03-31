import { useEffect, useMemo, useState } from "react";
import { SORT_SCHEMA } from "../shared/schema/querySchemas";
import { useFetch } from "../shared/hooks/requests/useFetch";
import { useSearch } from "../shared/hooks/useSearch";
import { buildQuery } from "../shared/helpers/buildQuery";

export const useKelolaCabang = (options = {}) => {
  const { itemsPerPage = 9, searchDelay = 400 } = options;

  const { keyword: search, debouncedKeyword, setKeyword: setSearch } = useSearch(searchDelay);

  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const BASE_URL = import.meta.env.VITE_FILE_URL?.replace(/\/+$/, "");
  const [currentPage, setCurrentPage] = useState(1);

  const queryString = useMemo(() => {
    return buildQuery({
      search: debouncedKeyword,
      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
      },
      sort: sortOption,
      sortSchema: SORT_SCHEMA,
    });
  }, [debouncedKeyword, currentPage, itemsPerPage, sortOption]);

  const { data: apiData, loading, error, refetch } = useFetch(`/perusahaan/manage-cabang?${queryString}`);

  const cabangData = useMemo(() => {
    if (!apiData?.data) return [];

    return apiData.data.map((item) => {
      const coverPath = item.foto?.find((f) => f.type === "profil_cover")?.path;
      const logoPath = item.foto?.find((f) => f.type === "profile")?.path;

      const cover = coverPath
        ? `${BASE_URL}/${coverPath.replace(/^\/+/, "")}`
        : "/assets/img/default-cover.png";
      const logo = logoPath
        ? `${BASE_URL}/${logoPath.replace(/^\/+/, "")}`
        : "";

      return {
        id: item.id,
        nama: item.nama,
        lokasi: `${item.kota}, ${item.provinsi}`,
        cover,
        logo,
        slug: item.nama?.toLowerCase().replace(/\s+/g, "-"),
        rawData: item,
      };
    });
  }, [apiData]);

  const pagination = useMemo(() => {
    const meta = apiData?.meta || {};
    return {
      currentPage: meta.current_page || 1,
      totalPages: meta.last_page || 1,
      totalItems: meta.total || 0,
      itemsPerPage: meta.per_page || itemsPerPage,
    };
  }, [apiData, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, sortOption]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  return {
    loading,
    error,
    cabangData,
    pagination,
    handlePageChange,
    search,
    setSearch,
    sortOption,
    setSortOption,
    refetch,
  };
};
