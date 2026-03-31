export const suratConf = {
  headerConfig: {
    title: "Data Surat",
    subtitle: "Kelola data surat",
    subtitleColor: "text-emerald-500",
  },
  dataPenerimaanConfig: {
    headerStyle: {
      textColor: "text-[#91969e]",
      fontWeight: "font-bold",
      textAlign: "text-center",
      py: "py-2",
    },
    cellStyle: {
      textColor: "text-gray-800",
      px: "px-5 py-2",
      borderBottom: "border-b border-gray-200",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-200",
      fontWeight: "font-medium",
      textAlign: "text-center",
    },
    columns: [
      {
        key: "id",
        label: "Number",
        cellClassName: "text-[10px] md:text-[15px]",
      },
      {
        key: "nama",
        label: "Nama",
        render: (value, row) => (
          <div className="flex items-center justify-center gap-1 md:gap-2">
            <img
              src={row.peserta.foto[0].path}
              alt={value}
              className="h-3 w-3 md:h-7 md:w-7 rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <span className="font-medium text-[8px] md:text-[12px] xl:text-[15px]">
              {row.peserta.user.nama}
            </span>
          </div>
        ),
      },
      {
        key: "jurusan",
        label: "Jurusan",
        render: (_, row) => (
          <span className="text-[8px] md:text-[12px] xl:text-[15px]">
            {row.peserta.jurusan.slice(0, 30)}
            {row.peserta.jurusan.length > 30 && "..."}
          </span>
        ),
      },
      {
        key: "no_surat",
        label: "Nomer Surat",
        render: (_, row) => (
          <span className="text-[8px] md:text-[12px] xl:text-[15px]">
            {row.no_surat}
          </span>
        ),
      },
      {
        key: "selesai",
        label: "Selesai Magang",
        render: (_, row) => (
          <span className="text-[8px] md:text-[12px] xl:text-[15px]">
            {new Date(row.peserta.magang.selesai).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        key: "aksi",
        label: "Aksi",
        cellClassName: "text-center text-[8px] md:text-[10px] xl:text-[12px]",
      },
    ],
  },
};

export const statusBadge = (v) => (
  <span
    className={
      `px-5 py-2 text-xs rounded-md text-white ` +
      (v === "SP 1"
        ? "bg-[#3DB878]"
        : v === "SP 2"
        ? "bg-[#F5D140]"
        : v === "SP 3"
        ? "bg-[#D65B4B]"
        : "bg-[#ffffff]")
    }
  >
    {v}
  </span>
);

import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export const suratPeringatanConf = ({
  currentPage,
  ITEMS_PER_PAGE,
  handleEdit,
  handleDelete,
}) => ({
  columns: [
    {
      label: "Number",
      key: "number",
      render: (_, __, rowIndex) =>
        (currentPage - 1) * ITEMS_PER_PAGE + rowIndex + 1,
      headerClassName: "text-center px-6 py-3",
      cellClassName: "text-center px-6 py-3 text-sm",
    },
    {
      key: "nama",
      label: "Nama",
      headerClassName: "w-[220px]",
      render: (value, row) => (
        <div className="flex items-center pl-10 gap-3">
          <img
            src={row.foto}
            alt={value}
            className="h-7 w-7 rounded-md object-cover"
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      label: "Sekolah",
      key: "sekolah",
      cellClassName: "text-left pl-15 px-6 py-3 text-sm text-gray-700",
    },
    {
      label: "Keterangan SP",
      key: "keterangan",
      cellClassName: "text-center px-6 py-3 text-sm text-gray-700",
    },
    {
      label: "Status",
      key: "status",
      render: (v) => statusBadge(v),
    },
    {
      label: "Tanggal",
      key: "tanggal",
      cellClassName: "text-left pl-10 px-6 py-3 text-sm text-gray-700",
    },
    {
      label: "Aksi",
      key: "aksi",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <Link
            to="/cabang/detail-surat-peringatan"
            state={{ detail: row }}
            className="w-9 h-9 flex items-center justify-center rounded-md bg-[#00C4B3]"
          >
            <Icon icon="mdi:eye" className="text-white w-5 h-5" />
          </Link>

          <button
            onClick={() => handleDelete(row)}
            className="w-9 h-9 rounded-md bg-[#EB1C24] flex items-center justify-center"
          >
            <Icon icon="qlementine-icons:trash-16" className="text-white w-5 h-5" />
          </button>

          <button
            onClick={() => handleEdit(row)}
            className="w-9 h-9 rounded-md bg-[#F4A100] flex items-center justify-center"
          >
            <Icon icon="lucide:pencil-line" className="text-white w-5 h-5" />
          </button>
        </div>
      ),
    },
  ],
  headerStyle: {
    textColor: "text-[#91969e]",
    fontWeight: "font-semibold",
    textAlign: "text-center",
    py: "py-3",
  },
  cellStyle: {
    textColor: "text-gray-800",
    py: "py-1.5",
    borderBottom: "border-b border-gray-200",
    rowHover: "hover:bg-gray-50",
    fontWeight: "font-semibold",
    textAlign: "text-center",
  },
});

