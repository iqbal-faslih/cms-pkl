import React, { useMemo, useState } from "react";
import DataTable from "../../../../shared/components/table/Table";
import { dummyData } from "../../../../shared/dummy/perusahaan/dummyPeserta";
import { useNavigate } from "react-router-dom";
import { suratConf } from "../config";

export default function DataPenerimaan({
  data,
  searchTerm,
  selectedDate,
  selectedJurusan,
  sortOption,
}) {
  // const realData = data; // asli
  const realData = dummyData; // pakai dummy

  const filteredData = useMemo(() => {
    return realData.filter((item) => {
      const peserta = item.peserta;
      const user = peserta?.user;

      // filter search
      const matchesSearch =
        !searchTerm ||
        user?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peserta.jurusan.toLowerCase().includes(searchTerm.toLowerCase());

      // filter jurusan
      const jurusanText = peserta.jurusan.toLowerCase();

      const jurusanMatch =
        (!selectedJurusan.rpl &&
          !selectedJurusan.dkv &&
          !selectedJurusan.tkj &&
          !selectedJurusan.uiux) || // jika tidak ada checkbox aktif → tampil semua
        (selectedJurusan.rpl &&
          jurusanText.includes("rekayasa perangkat lunak")) ||
        (selectedJurusan.dkv &&
          jurusanText.includes("desain komunikasi visual")) ||
        (selectedJurusan.tkj &&
          jurusanText.includes("teknik komputer dan jaringan")) ||
        (selectedJurusan.uiux && jurusanText.includes("ui/ux"));

      // --- DATE FILTER ---
      const matchesDate = (() => {
        if (!selectedDate || (!selectedDate.from && !selectedDate.to))
          return true;

        const selesai = new Date(peserta.magang.selesai);
        const from = selectedDate.from ? new Date(selectedDate.from) : null;
        const to = selectedDate.to ? new Date(selectedDate.to) : null;

        if (from && selesai < from) return false;
        if (to && selesai > to) return false;

        return true;
      })();

      return matchesSearch && jurusanMatch && matchesDate;
    });
  }, [realData, searchTerm, selectedDate, selectedJurusan]);

  const sortedData = useMemo(() => {
    let temp = [...filteredData];

    if (sortOption === "latest") {
      temp.sort(
        (a, b) =>
          new Date(b.peserta.magang.selesai) -
          new Date(a.peserta.magang.selesai)
      );
    }

    if (sortOption === "oldest") {
      temp.sort(
        (a, b) =>
          new Date(a.peserta.magang.selesai) -
          new Date(b.peserta.magang.selesai)
      );
    }

    if (sortOption === "az") {
      temp.sort((a, b) =>
        a.peserta.user.nama.localeCompare(b.peserta.user.nama)
      );
    }

    if (sortOption === "za") {
      temp.sort((a, b) =>
        b.peserta.user.nama.localeCompare(a.peserta.user.nama)
      );
    }

    return temp;
  }, [filteredData, sortOption]);

  // pagination — hitung data yang tampil di halaman
  const totalItems = sortedData.length;
  const itemsPerPage = 12; // batas data pagination per halaman
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  const navigate = useNavigate();

  // handle ganti halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full overflow-x-auto text-[10px] md:text-[15px] min-h-[370px]">
      <DataTable
        config={{
          ...suratConf.dataPenerimaanConfig,
          columns: suratConf.dataPenerimaanConfig.columns.map((col) => {
            if (col.key === "aksi") {
              return {
                ...col,
                render: (value, row) => {
                  return (
                    <button
                      onClick={() =>
                        navigate("/perusahaan/surat/detail", {
                          state: {
                            detail: {
                              nama: row.peserta.user.nama,
                              jurusan: row.peserta.jurusan,
                              no_surat: row.no_surat,
                              selesai_magang: new Date(
                                row.peserta.magang.selesai
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }),
                            },
                          },
                        })
                      }
                      className="text-white bg-[#304FFE] hover:bg-blue-800 px-4 py-1.5 lg:py-1 rounded-md whitespace-nowrap"
                    >
                      Lihat Detail
                    </button>
                  );
                },
              };
            }
            return col;
          }),
        }}
        data={paginatedData}
        pagination={{
          currentPage,
          totalPages,
          itemsPerPage,
          totalItems,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
