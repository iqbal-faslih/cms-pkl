import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearch } from "@/shared/hooks/useSearch";
import { SORT_SCHEMA } from "@/shared/schema/querySchemas";
import dayjs from "dayjs";
import { api } from "@/helpers/apiClient";
import { buildQuery } from "../../../shared/helpers/buildQuery";
import {
  buildPesertaEndpointCandidates,
  extractPesertaList,
  extractPesertaPagination,
  mapPesertaRow,
} from "./helpers/pesertaDataResolver";
import { filterEligiblePeserta } from "./helpers/pesertaApprovalRules";
import { buildApprovedMatcherFromApprovalPayload } from "./helpers/pesertaApprovalResolver";

export const useDaftarPeserta = (companyId, options = {}) => {
  const { itemsPerPage = 10, searchDelay = 800 } = options;

  const { keyword: searchTerm, debouncedKeyword, setKeyword: setSearchTerm } = useSearch(searchDelay);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiPayload, setApiPayload] = useState({
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage,
    },
  });

  const [dateFilter, setDateFilter] = useState({
    from: null,
    to: null,
  });

  const queryString = useMemo(() => {
    return buildQuery({
      search: debouncedKeyword,

      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
      },

      sort: sortOption,
      sortSchema: SORT_SCHEMA,

      filters: {
        status_magang: appliedFilters,
      },

      date: dateFilter,
    });
  }, [debouncedKeyword, currentPage, itemsPerPage, sortOption, appliedFilters, dateFilter]);

  const fetchPeserta = useCallback(async () => {
    setLoading(true);
    setError(null);

    let firstSuccessfulResult = null;
    let lastError = null;
    let approvalMatcher = null;

    try {
      const approvalResponse = await api.get("/perusahaan/approval/daftar?per_page=1000");
      approvalMatcher = buildApprovedMatcherFromApprovalPayload(approvalResponse?.data ?? {});
    } catch {
      approvalMatcher = null;
    }

    const endpoints = buildPesertaEndpointCandidates(companyId, queryString);

    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        const payload = response?.data ?? {};
        const items = filterEligiblePeserta(extractPesertaList(payload), approvalMatcher);
        const pagination = extractPesertaPagination(payload, {
          currentPage,
          itemsPerPage,
          totalItems: items.length,
        });

        const result = { items, pagination };

        if (!firstSuccessfulResult) {
          firstSuccessfulResult = result;
        }

        if (items.length > 0) {
          setApiPayload(result);
          setLoading(false);
          return;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (firstSuccessfulResult) {
      setApiPayload(firstSuccessfulResult);
    } else {
      setApiPayload((prev) => ({
        ...prev,
        items: [],
        pagination: {
          currentPage,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage,
        },
      }));
      if (lastError) {
        setError(lastError);
      }
    }

    setLoading(false);
  }, [companyId, queryString, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchPeserta();
  }, [fetchPeserta]);

  const data = useMemo(() => {
    return apiPayload.items.map((item, index) =>
      mapPesertaRow(item, index, currentPage, itemsPerPage)
    );
  }, [apiPayload.items, currentPage, itemsPerPage]);

  const paginationInfo = useMemo(() => {
    return {
      totalPages: apiPayload.pagination.totalPages || 1,
      totalItems: apiPayload.pagination.totalItems || 0,
      itemsPerPage: apiPayload.pagination.itemsPerPage || itemsPerPage,
    };
  }, [apiPayload.pagination, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, sortOption, appliedFilters, dateFilter]);

  const toggleFilter = (value) => {
    setSelectedFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const applyFilters = ({ dateFrom, dateTo }) => {
    setAppliedFilters(selectedFilters);

    setDateFilter({
      from: dateFrom ? dayjs(dateFrom).toDate() : undefined,
      to: dateTo ? dayjs(dateTo).toDate() : undefined,
    });
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setAppliedFilters([]);
    setDateFilter({ from: null, to: null });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > paginationInfo.totalPages) return;
    setCurrentPage(page);
  };

  return {
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
    ...paginationInfo,
    handlePageChange,
    refetch: fetchPeserta,
  };
};
