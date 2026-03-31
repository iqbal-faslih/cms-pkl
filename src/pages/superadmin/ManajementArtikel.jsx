import React, { useState, useMemo } from "react";
import DataTable from "@/shared/components/table/Table";
import TableHeader from "@/shared/components/table/TableHeader";
import Notifikasi from "@/shared/components/modal/NotifikasiModal";
import Card from "@/components/cards/Card";
import { Icon } from "@iconify/react";
import { CiEdit } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

import {
  artikelColumns,
  artikelTableConfig,
  artikelHeaderConfig,
} from "./ManajementArtikelConfig";

export default function ManajemenArtikel() {
  // MOCK DATA
  const mockData = Array.from({ length: 30 }, (_, i) => ({
    number: 1001 + i,
    judul: "The Rise of Artificial Intelligence in Everyday Life",
    tanggal: "22 Januari 2024",
    tag: ["MachineLearning", "FutureTech"],
  }));

  const navigate = useNavigate();

  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("terbaru");

  // DELETE MODAL STATE
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Pagination
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);

  // Filter
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.judul.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  // Sort
 const sortedData = useMemo(() => {
  let sorted = [...filteredData];

  if (sortValue === "terbaru") {
    return sorted;
  }

  if (sortValue === "terlama") {
    return sorted.reverse();
  }

  if (sortValue === "a-z") {
    return sorted.sort((a, b) =>
      a.judul.localeCompare(b.judul)
    );
  }

  if (sortValue === "z-a") {
    return sorted.sort((a, b) =>
      b.judul.localeCompare(a.judul)
    );
  }

  return sorted;
}, [filteredData, sortValue]);


  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // WHEN DELETE CLICKED FROM COLUMNS
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setData((prev) =>
      prev.filter((item) => item.number !== selectedRow.number)
    );
    setIsDeleteOpen(false);
    setSelectedRow(null);
  };

  return (
    <Card className="rounded-2xl">
      {/* HEADER */}
      <TableHeader
        config={artikelHeaderConfig({
          search,
          setSearch,
          sortValue,
          setSortValue,
        })}
      />

      {/* TABLE */}
      <DataTable
        config={{
          ...artikelTableConfig,
          columns: artikelTableConfig.columns.map((col) => {
            if (col.key === "aksi") {
              return {
                ...col,
                render: (value, row) => {
                  return (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-1.5 shadow-sm"
                        onClick={() =>
                          navigate(`${row.number}/edit`)
                        }
                      >
                        <CiEdit className="w-5 h-5" />
                      </Button>

                      <Button
                        onClick={() => handleDeleteClick(row)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-1.5 shadow-sm"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  );
                },
              };
            }
            return col;
          }),
        }}
        data={paginatedData}
        pagination={{
          currentPage: page,
          totalPages,
          itemsPerPage,
          totalItems: filteredData.length,
          onPageChange: setPage,
        }}
      />

      {/* DELETE MODAL */}
      <Notifikasi
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Postingan?"
        message={`Apakah Anda yakin ingin menghapus postingan "${
          selectedRow?.judul || ""
        }"?`}
        confirmText="Hapus"
        cancelText="Batal"
        iconColor="text-red-500"
        confirmColor="bg-red-600 hover:bg-red-700"
        icon={() => <span>⚠️</span>}
      />
    </Card>
  );
}
