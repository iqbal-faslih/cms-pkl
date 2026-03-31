import Search from "@/shared/components/Search";
import Button from "../components/button/Button";
import SortButton from "../components/button/Sort";
import FilterDropButton from "../components/button/FilterDrop";
import { Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import { PiPencilSimple } from "react-icons/pi";

/* ================= HEADER CONFIG ================= */
export const ConfigTableHeaderRFID = (
  magangFrom,
  setMagangFrom,
  magangTo,
  setMagangTo,
  handleAddSiswa,
  searchQuery,
  setSearchQuery,
  filterState,
  modalActions
) => ({
  headerConfig: {
    split: false,
    title: "Pendataan RFID",
    subtitle: "Kelola pendataan dengan lebih fleksibel!",
    subtitleColor: "text-emerald-500",

    top: {
      left: [
        <Search key="search" value={searchQuery} onChange={setSearchQuery} />,
      ],
      right: [
        <SortButton
          key="sort"
          labelText="Sort by:"
          onSelect={(val) => modalActions.setSortValue(val)}
        />,
        <Button
          key="add"
          className="bg-[#304FFE] text-sm text-white px-4 py-2 rounded-md"
          onClick={handleAddSiswa}
        >
          Tambahkan RFID
        </Button>,
        <FilterDropButton
          key="filter"
          label="Filter"
          showDateFilter
          dateLabel="Tanggal Pembuatan"
          content={{
            render: ({ CustomDateInput }) => (
              <div className="mb-3">
                <p className="text-lg font-medium mb-2">Masa Magang</p>
                <div className="flex gap-4">
                  <DatePicker
                    selected={magangFrom}
                    onChange={setMagangFrom}
                    dateFormat="dd/MM/yyyy"
                    customInput={<CustomDateInput />}
                  />
                  <DatePicker
                    selected={magangTo}
                    onChange={setMagangTo}
                    dateFormat="dd/MM/yyyy"
                    customInput={<CustomDateInput />}
                  />
                </div>
              </div>
            ),
            onApply: () => filterState.applyFilter(),
            onReset: () => filterState.resetFilter(),
          }}
        />,
      ],
    },
  },
});

/* ================= TABLE COLUMN ================= */
export const ConfigColumn = {
  columns: (handleDeleteSiswa, handleEditSiswa) => [
    { key: "no", label: "Nomor" },
    {
      key: "nama",
      label: "Nama",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <img
            src={row.image || "/avatar.png"}
            alt={row.nama}
            className="w-7 h-7 rounded-md object-cover"
          />
          <p>{row.nama}</p>
        </div>
      ),
    },
    { key: "masaMagang", label: "Masa Magang" },
    { key: "email", label: "Email" },
    { key: "sekolah", label: "Sekolah" },
    {
      key: "actions",
      label: "Aksi",
      render: (_, row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleEditSiswa(row)}
            className="bg-[#FF9E42] text-white rounded-md px-2 py-2"
          >
            <PiPencilSimple size={20} />
          </button>
          <button
            onClick={() => handleDeleteSiswa(row)}
            className="bg-red-500 text-white rounded-md px-2 py-2"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    },
  ],

  headerStyle: {
    px: "px-6",
    py: "py-7",
    textColor: "text-[#91969e]",
    fontWeight: "font-bold text-lg",
    textAlign: "text-center",
  },

  cellStyle: {
    px: "px-6 py-2",
    textAlign: "text-center",
    textColor: "text-gray-800",
    fontWeight: "font-medium",
    rowHover: "hover:bg-gray-50",
    borderBottom: "border-b border-[#E5F0FE]",
  },
};

/* ================= MODAL CONFIG ================= */
export const Modal_Config = {
  DataSiswa: { title: "Ganti RFID Siswa" },
  TambahDataSiswa: { title: "Tambahkan RFID Siswa" },
};

/* ================= MODAL ACTION ================= */
export const Modal_Actions = {
  cancel: {
    label: "Batal",
    type: "button",
    className:
      "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 w-full",
  },
  save: {
    label: "Simpan",
    type: "submit",
    className:
      "px-6 py-2 rounded-md font-semibold text-white bg-blue-600 w-full",
  },
};
