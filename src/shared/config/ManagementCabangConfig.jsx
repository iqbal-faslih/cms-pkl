import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import Search from "../components/Search";
import Button from "../components/button/Button";
import SortButton from "../components/button/Sort";

export const ManagementCabangConfig = (filterState, searchQuery, setSearchQuery, modalActions) => ( {
  headerConfig: {
    split: false,
    title: "Daftar Admin",
    subtitle: "Admin Aktif & Non Aktif",
    subtitleColor: "text-emerald-500",
   top : {
    left: [],
    right: [
       <Search
        key="search"
        placeholder="Search here..."
        iconPosition="left"
        rounded="rounded-md"
        width="w-80"
        bgColor="bg-indigo-300/10"
        border={false}
        iconColor="text-indigo-500"
        className="px-3 py-2 w-80 bg-indigo-300/10 rounded-md"
        value={searchQuery}
        onChange={setSearchQuery}
      />,

      <SortButton
        showOutsideLabel
        labelText="Sort by"
        options={[
          { label: "Terbaru", value: "terbaru" },
          { label: "Terlama", value: "terlama" },
        ]}
        onSelect={(v) => modalActions.setSortValue(v)}
      />,

      <Button
        key="tambah-admin"
        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        TAMBAH ADMIN
      </Button>,
    ]
   }
  },

  tableConfig: {
    className: "bg-white rounded-2xl shadow-sm overflow-hidden",
    headerStyle: {
      bgColor: "bg-white",
      textColor: "text-gray-400",
      fontWeight: "font-bold",
      fontSize: "text-sm",
      px: "px-6",
      py: "py-4",
      textAlign: "text-left",
    },

    cellStyle: {
      px: "px-6",
      py: "py-3",
      textAlign: "text-left",
      textColor: "text-gray-700",
      fontSize: "text-sm",
      fontWeight: "font-medium",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-colors",
      borderBottom: "border-b border-gray-100",
    },

    columns: [
      {
        key: "no",
        label: "Nomor",
        headerClassName: "text-left",
        cellClassName: "text-left",
        render: (_, __, i) => <span className="text-gray-700">{i + 1}</span>,
      },

      {
        key: "nama",
        label: "Nama",
        headerClassName: "text-left px-20",
        cellClassName: "text-left px-2",
        render: (value) => {
          const initials = value
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {initials}
              </div>
              <span className="text-gray-700 font-medium">{value}</span>
            </div>
          );
        },
      },

      { key: "email", label: "Email" },
      { key: "password", label: "Password" },
      { key: "hp", label: "Nomor HP" },

      {
        key: "aksi",
        label: "Aksi",
        headerClassName: "text-center",
        cellClassName: "text-center",
        render: (_, row) => (
          <div className="flex items-center justify-center gap-2">
            <button
              className="w-9 h-9 bg-cyan-500 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-colors"
              onClick={() => console.log("View:", row)}
            >
              <Eye className="w-4 h-4 text-white" />
            </button>

            <button
              className="w-9 h-9 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
              onClick={() => console.log("Delete:", row)}
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>

            <button
              className="w-9 h-9 bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-colors"
              onClick={() => console.log("Edit:", row)}
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>
        ),
      },
    ],
  },
});
