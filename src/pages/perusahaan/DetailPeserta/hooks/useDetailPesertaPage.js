import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePesertaDetail } from "@/hooks/perusahaan/peserta/useDetailPeserta";
import { buildDetailPesertaProfileView } from "../helpers/detailPesertaProfile";

const ITEMS_PER_PAGE = 5;

const getYearFromDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getFullYear();
};

const buildMonthlyJurnalSeries = (rows = [], year) => {
  const mengisi = Array(12).fill(0);
  const tidakMengisi = Array(12).fill(0);

  rows.forEach((row) => {
    const parsed = new Date(row?.tgl);
    if (Number.isNaN(parsed.getTime())) return;
    if (parsed.getFullYear() !== year) return;

    const month = parsed.getMonth();
    mengisi[month] += 1;
  });

  return [
    { name: "Mengisi", data: mengisi },
    { name: "Tidak Mengisi", data: tidakMengisi },
  ];
};

export const useDetailPesertaPage = () => {
  const { id: pesertaId } = useParams();
  const { detail, hasDetailData, isInitialLoading, riwayatJurnal, loading, error } = usePesertaDetail(pesertaId);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);

  const availableYears = useMemo(() => {
    const years = new Set();
    (riwayatJurnal || []).forEach((item) => {
      const year = getYearFromDate(item?.tgl);
      if (year) years.add(year);
    });
    if (years.size === 0) years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [riwayatJurnal, currentYear]);

  const filteredJurnal = useMemo(
    () =>
      (riwayatJurnal || []).filter((item) => {
        const year = getYearFromDate(item?.tgl);
        if (!year) return true;
        return year === selectedYear;
      }),
    [riwayatJurnal, selectedYear]
  );

  const totalItems = filteredJurnal.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredJurnal.slice(startIndex, endIndex) || [];
  }, [filteredJurnal, page]);

  const chartSeries = useMemo(
    () => {
      const fromDetailStats = detail?.jurnalStatsByYear?.[selectedYear];
      if (fromDetailStats) {
        return [
          { name: "Mengisi", data: fromDetailStats.mengisi || Array(12).fill(0) },
          {
            name: "Tidak Mengisi",
            data: fromDetailStats.tidakMengisi || Array(12).fill(0),
          },
        ];
      }

      return buildMonthlyJurnalSeries(riwayatJurnal || [], selectedYear);
    },
    [detail, riwayatJurnal, selectedYear]
  );

  const profileView = useMemo(() => buildDetailPesertaProfileView(detail), [detail]);

  const openDetailModal = (journal) => {
    setSelectedJournal(journal);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => setIsDetailModalOpen(false);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageOpen(true);
  };

  const closeImageModal = () => setIsImageOpen(false);

  const safeSetSelectedYear = (year) => {
    setSelectedYear(year);
    setPage(1);
  };

  return {
    detail,
    hasDetailData,
    isInitialLoading,
    profileView,
    loading,
    error,
    selectedYear,
    setSelectedYear: safeSetSelectedYear,
    availableYears,
    itemsPerPage: ITEMS_PER_PAGE,
    page,
    setPage,
    totalItems,
    totalPages,
    paginatedData,
    chartSeries,
    isDetailModalOpen,
    selectedJournal,
    openDetailModal,
    closeDetailModal,
    isImageOpen,
    selectedImage,
    openImageModal,
    closeImageModal,
  };
};
