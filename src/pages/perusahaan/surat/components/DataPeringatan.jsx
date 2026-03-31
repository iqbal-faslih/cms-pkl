import React, { useState, useMemo } from "react";
import DataTable from "@/shared/components/table/Table";
import Pagination from "@/shared/components/Pagination";
import { Eye, Pencil, Trash2 } from "lucide-react";
import DummySuratPeringatan from "@/shared/dummy/Cabang/DummySuratPeringatan";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { suratPeringatanConf } from "../config";

const ITEMS_PER_PAGE = 10;

export default function SuratPeringatan() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  /* FILTER DATA */
  const filteredData = useMemo(() => {
    let res = [...DummySuratPeringatan];
    const keyword = search.toLowerCase();
    res = res.filter((i) =>
      `${i.nama} ${i.sekolah} ${i.keterangan} ${i.status}`
        .toLowerCase()
        .includes(keyword)
    );
    return res;
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* BADGE */
const tableConfig = useMemo(
  () =>
    suratPeringatanConf({
      currentPage,
      ITEMS_PER_PAGE,
      // handleEdit,
      // handleDelete,
    }),
  [currentPage]
);
  return (
    <div>
      <DataTable
        config={tableConfig}
        data={paginatedData}
        pagination={{
          currentPage,
          totalPages,
          itemsPerPage: ITEMS_PER_PAGE,
          totalItems: filteredData.length,
          onPageChange: setCurrentPage,
          label: "surat peringatan",
        }}
      />
    </div>
  );
}
