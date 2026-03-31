import React from "react";
import { Link } from "react-router-dom";
import SortButton from "../components/button/Sort";
import Search from "@/shared/components/Search";
import FilterDropButton from "@/shared/components/button/FilterDrop";

export const ConfigTableHeaderSiswa = (
  filterState,
  searchQuery,
  setSearchQuery,
  modalActions
) => {
  const selectedStatus =  filterState.selected || [];

  return {
    headers: {
      split: false,
      title: "Peserta Magang",
      subtitle: "Peserta Active & Non Active",
      subtitleColor: "text-emerald-500",

      top: {
        left: [
          <Search
            key="search"
            value={searchQuery}
            onChange={setSearchQuery}
          />,
        ],

        right: [
          <SortButton
            key="sort"
            labelText="Sort by:"
            value={modalActions.sortValue}
            onSelect={modalActions.setSortValue}
          />,

          <FilterDropButton
            key="filter"
            label="Filter"
            showDateFilter
            dateLabel="Tanggal Pembuatan"
            content={{
              render: (renderProps) => {
                const Checkbox = renderProps?.DefaultCheckbox;

                if (!Checkbox) {
                  return null;
                }

                return (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Status Magang</p>

                      <Checkbox
                        label="Aktif"
                        checked={selectedStatus.includes("aktif")}
                        onChange={() => filterState.toggle("aktif")}
                      />

                      <Checkbox
                        label="Alumni"
                        checked={selectedStatus.includes("alumni")}
                        onChange={() => filterState.toggle("alumni")}
                      />
                    </div>
                  </div>
                );
              },
              onApply: ({ dateFrom, dateTo }) => {
                filterState.apply({
                  dateFrom: dateFrom || null,
                  dateTo: dateTo || null,
                });
              },
              onReset: filterState.reset,
            }}
          />,
        ],
      },
    },

    columns: [
      { key: "id", label: "No" },

      {
        key: "nama",
        label: "Nama Lengkap",
        render: (_, row) => (
          <div className="flex items-center">
            <img
              src={row.image}
              alt={row.nama}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/default-avatar.png";
              }}
              className="w-7 h-7 rounded-full object-cover mr-3"
            />
            <span>{row.nama}</span>
          </div>
        ),
      },

      {
        key: "masaMagang",
        label: "Masa Magang",
        render: (value) => (
          <span className="inline-flex items-center justify-center px-3 h-7 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
            {value || "-"}
          </span>
        ),
      },

      {
        key: "sistemMagang",
        label: "Sistem Magang",
        render: (value) => {
          const normalized = String(value || "-").toLowerCase();
          const isOffline = normalized === "offline";

          return (
            <span
              className={`inline-flex items-center justify-center w-20 h-7 text-xs font-medium rounded-md ${
                isOffline ? "bg-amber-50 text-amber-700" : "bg-cyan-50 text-cyan-700"
              }`}
            >
              {normalized}
            </span>
          );
        },
      },

      {
        key: "status",
        label: "Status",
        render: (value) => {
          const normalized = String(value || "").toLowerCase();
          const label =
            normalized.length > 0
              ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
              : "-";

          return (
            <span
              className={`inline-flex items-center justify-center w-24 h-7 text-sm font-medium rounded-md ${
                normalized === "aktif"
                  ? "bg-green-50 text-green-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {label}
            </span>
          );
        },
      },

      { key: "sekolah", label: "Sekolah" },
      { key: "divisi", label: "Divisi" },

      {
        key: "aksi",
        label: "Aksi",
        render: (_, row) => (
          <Link
            to={`${row.originalId}/detail`}
            className="px-4 py-1 bg-[#304FFE] text-white rounded-lg"
          >
            Detail
          </Link>
        ),
      },
    ],

    headerStyle: {
      px: "px-10",
      py: "py-4",
      textColor: "text-gray-500",
      textCenter: "text-center",
    },

    cellStyle: {
      px: "px-6",
      py: "py-2",
      textAlign: "text-center",
      fontWeight: "font-medium text-sm",
      textColor: "text-gray-800",
      borderBottom: "border-b border-gray-200",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-150",
      whitespace: "whitespace-nowrap",
    },
  };
};
