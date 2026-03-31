import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 15;

const SORT_OPTIONS = [
  { label: "Terbaru - Lama", value: "newest" },
  { label: "Lama - Terbaru", value: "oldest" },
];

export const useLowonganTableLogic = ({ filteredData = [], role = "" }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedRole = String(role || "").toLowerCase();
  const isPerusahaanRole = normalizedRole === "perusahaan";

  const sortedData = useMemo(() => {
    const getTimestamp = (job) => {
      const rawDate =
        job?.created_at ||
        job?.updated_at ||
        job?.tanggal_dibuat ||
        job?.tanggal_mulai ||
        null;
      const timestamp = rawDate ? new Date(rawDate).getTime() : NaN;
      if (!Number.isNaN(timestamp)) return timestamp;
      return Number(job?.id) || 0;
    };

    const items = [...filteredData];
    items.sort((a, b) => {
      const aTime = getTimestamp(a);
      const bTime = getTimestamp(b);
      if (sortBy === "oldest") return aTime - bTime;
      return bTime - aTime;
    });
    return items;
  }, [filteredData, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const rows = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const fromData = sortedData.length === 0 ? 0 : startIndex + 1;
  const toData = Math.min(startIndex + ITEMS_PER_PAGE, sortedData.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filteredData.length]);

  return {
    sortBy,
    setSortBy,
    sortOptions: SORT_OPTIONS,
    currentPage,
    setCurrentPage,
    totalPages,
    safePage,
    startIndex,
    rows,
    fromData,
    toData,
    isPerusahaanRole,
    totalRows: sortedData.length,
  };
};
