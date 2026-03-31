import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableHeader from "@/shared/components/table/TableHeader";
import { ConfigSesiJamKantor } from "../../../shared/config/Perusahaan/ConfigSesiJamKantor";
import { dummyPesertaSesi } from "../../../shared/dummy/perusahaan/dummyJamKantor";
import DataTable from "../../../shared/components/table/Table";

export default function TabelJamKantorCabang() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataPerusahaan, setDataPerusahaan] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const rawSesi = query.get("sesi") || "1";

  const sesiParam = rawSesi.match(/\d+$/)?.[0] || "1";
  const sesiTitle = `Sesi ${sesiParam}`;

  const navigate = useNavigate();

  // dummy
  useEffect(() => {
    setDataPerusahaan(dummyPesertaSesi);
  }, []);

  // filter
  const filteredData = dataPerusahaan.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === "mostStudent") {
      return parseInt(b.jml_peserta) - parseInt(a.jml_peserta);
    } else if (sortOption === "mostBranch") {
      return parseInt(b.jml_cabang) - parseInt(a.jml_cabang);
    } else if (sortOption === "az") {
      return a.nama.localeCompare(b.nama);
    }
    return 0;
  });

  // paginaton
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  // filter divisi
  const [selectedDivisi, setSelectedDivisi] = useState({
    fe: false,
    be: false,
    mob: false,
    uiux: false,
    digmar: false,
    pm: false,
  });

  const filterState = {
    selectedDivisi,
    setSelectedDivisi,

    apply: () => {
      // jika nanti perlu apply (masih dummy)
    },
  };

  const modalActions = {
    setSortValue: (val) => setSortOption(val),
    navigate: navigate,
  };

  const config = ConfigSesiJamKantor(
    filterState,
    searchTerm,
    setSearchTerm,
    modalActions,
    sesiParam
  );

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-5">
      <TableHeader config={config.headerConfig} />

      <DataTable
        config={config.tableConfig}
        data={paginatedData}
        pagination={{
          currentPage,
          totalPages,
          itemsPerPage,
          totalItems: filteredData.length,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
