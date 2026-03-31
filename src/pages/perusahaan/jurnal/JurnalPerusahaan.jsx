import React, { useState, useEffect } from "react";
import DataTable from "@/shared/components/table/Table.jsx";
import TableHeader from "@/shared/components/table/TableHeader.jsx";
import JurnalModalCabang from "@/components/modal/JurnalModalCabang";
import Modal from "@/components/Modal";
import Calendar from "@/components/Calendar";
import dayjs from "dayjs";
import { JurnalConfig } from "@/shared/config/cabang/jurnalConfig";
import { useJurnal } from "./hooks/useJurnal";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";
import Card from "../../../components/cards/Card";
import { useApiActions } from "@/shared/hooks/requests/useApiActions";
import { formatDataForModal } from "../../cabang/jurnal/helpers/jurnalHelpers";
import { usePerusahaanExport } from "@/shared/hooks/requests/usePerusahaanExport";

const JurnalPerusahaan = () => {
  const { onExport, loading: exportLoading } = usePerusahaanExport();

  const {
    data,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    sortOption,
    setSortOption,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,
    resetFilters,
  } = useJurnal({ itemsPerPage: 10 });

  const { headerConfig, tableConfig, paginationConfig } = JurnalConfig(
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    sortOption,
    setSortOption,
    () => {},
    () => {},
    "/assets/icons/Rectangle.png",
    resetFilters,
    onExport,
    exportLoading
  );

  return (
    <>
      <Card className="rounded-2xl">
        <TableHeader config={headerConfig} />

        <DataTable
          data={data}
          config={tableConfig}
          pagination={{
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            onPageChange: handlePageChange,
            label: paginationConfig.label,
          }}
        />
      </Card>
    </>
  );
};

export default JurnalPerusahaan;
