import React, { useState, useMemo } from "react";
import TableHeader from "@/shared/components/table/TableHeader";
import DataTable from "@/shared/components/table/Table";
import { tambahAdminConfig } from "@/shared/config/Superadmin/TambahAdminConf";

const TambahAdmin = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [checkedRows, setCheckedRows] = useState({});
  const [selected, setSelected] = useState([]); 
  const [applied, setApplied] = useState([]); 
  const [uploadedFile, setUploadedFile] = useState(null);

  const toggle = (value) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((x) => x !== value)
          : [...prev, value]
      );
    };

    const toggleRow = (index) => {
    setCheckedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const apply = () => {
    setApplied(selected); 
    setPage(1);  
  };

  const filterState = { selected, toggle, apply };

  const rawData = [
    { nama: "Siti Rahma", jenis: "Rekomendasi", tanggal: "2025-11-12", status: "Menunggu" },
    { nama: "Andi Putra", jenis: "Surat Jalan", tanggal: "2025-11-11", status: "Disetujui" },
    { nama: "Budi Santoso", jenis: "Rekomendasi", tanggal: "2025-11-10", status: "Ditolak" },
    { nama: "Winda Lestari", jenis: "Surat Jalan", tanggal: "2025-11-09", status: "Disetujui" },
    { nama: "Siti Rahma", jenis: "Rekomendasi", tanggal: "2025-11-08", status: "Ditolak" },
  ];

  const filteredData = useMemo(() => {
    let data = rawData;

    if (applied.length > 0) {
      data = data.filter((item) => applied.includes(item.status));
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      data = data.filter((item) =>
        item.nama.toLowerCase().includes(q) ||
        item.jenis.toLowerCase().includes(q)
      );
    }

    return data;
  }, [applied, searchQuery]); // ← dependensi applied

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const config = tambahAdminConfig(filterState, searchQuery, setSearchQuery, { checkedRows, toggleRow, uploadedFile, setUploadedFile });

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-2xl p-6">
        <TableHeader config={config.headerConfig} />

        <DataTable
          config={config.tableConfig}
          data={paginatedData}
          pagination={{
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: itemsPerPage,
            totalItems: filteredData.length,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
};

export default TambahAdmin;
