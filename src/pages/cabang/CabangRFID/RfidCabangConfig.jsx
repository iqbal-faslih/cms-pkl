import React from "react";
import { Trash, Pencil } from "lucide-react";
import Button from "../../../shared/components/button/Button";
import Search from "../../../shared/components/Search";
import SortButton from "../../../shared/components/button/Sort";
import FilterDropButton from "../../../shared/components/button/FilterDrop";
import DatePicker from "react-datepicker";

export const RfidCabangConfig = (
  tanggalFrom,
  setTanggalFrom,
  tanggalTo,
  setTanggalTo,
  magangFrom,
  setMagangFrom,
  magangTo,
  setMagangTo,
  filterState,
  searchQuery,
  setSearchQuery,
  modalActions
) => ({
  headerConfig: {
    split: false,
    title: "Pendataan RFID",
    subtitle: "Kelola Pendataan Dengan Lebih Fleksibel",
    subtitleColor: "text-green-500",
    top: {
      left: [
        <Search
          key="search"
          placeholder="Search here ..."
          value={searchQuery}
          onChange={setSearchQuery}
        />,
      ],

      right: [
        <SortButton
          key="sort"
          labelText="Sort by"
          onSelect={modalActions.setSortValue}
          className="border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
        />,

        <Button
          key="add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg"
          onClick={modalActions.openAdd}
        >
          Tambahkan RFID
        </Button>,

        <FilterDropButton
          key="filter"
          label="Filter"
          showDateFilter={true}
          dateLabel="Tanggal Pembuatan"
          content={{
            // Fungsi untuk render filter masa magang
            render: ({ CustomDateInput }) => (
              <div className="mb-3">
                <p className="text-lg font-medium mb-2">Masa Magang</p>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Dari</p>
                    <DatePicker
                      selected={magangFrom}
                      onChange={(date) => setMagangFrom(date)}
                      dateFormat="dd/MM/yyyy"
                      customInput={<CustomDateInput />}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Ke</p>
                    <DatePicker
                      selected={magangTo}
                      onChange={(date) => setMagangTo(date)}
                      dateFormat="dd/MM/yyyy"
                      customInput={<CustomDateInput />}
                    />
                  </div>
                </div>
              </div>
            ),
            onApply: ({ dateFrom, dateTo }) => {
              filterState.apply({
                dateFrom,
                dateTo,
                magangFrom,
                magangTo,
              });
            },

            onReset: () => filterState.reset(),
          }}
        />,
      ],
    },
  },

  tableConfig: {
    className: "bg-white rounded-lg overflow-hidden",

    headerStyle: {
      bgColor: "bg-white",
      textColor: "text-gray-400",
      fontWeight: "font-semibold",
      fontSize: "text-sm",
      px: "px-6",
      py: "py-4",
      textAlign: "text-left",
    },

    cellStyle: {
      px: "px-6",
      py: "py-4",
      textAlign: "text-left",
      textColor: "text-gray-600",
      fontSize: "text-sm",
      borderBottom: "border-b border-gray-200",
      rowHover: "hover:bg-gray-50",
    },

    columns: [
      {
        key: "no",
        label: "Nomor",
        width: "w-20",
        render: (_, __, index) => index + 1,
      },
      {
        key: "nama",
        label: "Nama",
        width: "w-64",
        render: (value) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3a3 3 0 100 6 3 3 0 000-6zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <span className="text-gray-900">{value}</span>
          </div>
        ),
      },
      {
        key: "masaMagang",
        label: "Masa Magang",
      },
      {
        key: "email",
        label: "Email",
      },
      {
        key: "sekolah",
        label: "Sekolahan",
      },
      {
        key: "aksi",
        label: <div className="w-full text-center">Aksi</div>,
        width: "w-32",
        render: (_, row) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => modalActions.openEdit(row)}
              className="w-9 h-9 rounded-lg bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center"
            >
              <Pencil className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => modalActions.openDelete(row)}
              className="w-9 h-9 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center"
            >
              <Trash className="w-4 h-4 text-white" />
            </button>
          </div>
        ),
      },
    ],
  },
});
