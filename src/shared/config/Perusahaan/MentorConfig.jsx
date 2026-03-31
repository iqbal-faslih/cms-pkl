import React from "react";
import Search from "@/shared/components/Search";
import FilterDropButton from "@/shared/components/button/FilterDrop";
import SortButton from "@/shared/components/button/Sort";
import Button from "@/shared/components/button/Button";
import { Icon } from "@iconify/react";
import {
  formatMentorDate,
  getMentorCreatedAt,
  getMentorEmail,
  getMentorName,
  resolveMentorProfileUrl,
} from "@/shared/helpers/mentorData";

const MentorAvatar = ({ row }) => {
  const [failed, setFailed] = React.useState(false);
  const imageUrl = resolveMentorProfileUrl(row);
  const mentorName = getMentorName(row);
  const initial = mentorName?.charAt(0)?.toUpperCase() || "M";

  if (!imageUrl || failed) {
    return (
      <div className="w-8 h-8 rounded-full border bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      onError={() => setFailed(true)}
      className="w-8 h-8 rounded-full object-cover border"
      alt={mentorName}
    />
  );
};

export const MentorConfig = (
  filterState,
  divisionFilterOptions,
  searchQuery,
  setSearchQuery,
  rowState,
  modalActions
) => ({
  headerConfig: {
    split: false,
    title: "Daftar Akun Mentor",
    subtitle: "Pantau, Tambah, dan Kelola Akun Mentor",
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
          options={[
            { value: "terbaru", label: "Terbaru - Lama" },
            { value: "terlama", label: "Lama - Terbaru" },
            { value: "az", label: "A - Z" },
            { value: "za", label: "Z - A" },
          ]}
          onSelect={(v) => modalActions.setSortValue(v)}
        />,

        <Button
          onClick={modalActions.openAdd}
          className="bg-[#306bff] text-white px-3 sm:px-4 py-2 rounded-lg 
                    text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-none text-center"
        >
          Tambah Akun Mentor
        </Button>,

        <FilterDropButton
          key="filter"
          label="Filter"
          title="Filter"
          showDateFilter={true}
          compact={true}
          dateLabel="Tanggal Pembuatan"
          width="w-[300px]"
          content={{
            render: (filterComponents) => (
              <div className="flex flex-col gap-2">
                <p className="text-lg font-medium text-gray-700">Pilih Divisi</p>
                {divisionFilterOptions.map((val) => (
                  React.createElement(filterComponents.DefaultCheckbox, {
                    key: val,
                    label: val,
                    checked: filterState.selected.includes(val),
                    onChange: () => filterState.toggle(val),
                  })
                ))}
              </div>
            ),
            onApply: ({ dateFrom, dateTo }) =>
              filterState.apply({ dateFrom, dateTo }),
            onReset: () => filterState.reset(),
          }}
        />,
      ],
    },
  },

  tableConfig: {
    className: "bg-transparent",

    headerStyle: {
      textColor: "text-[#91969e]",
      fontWeight: "font-bold",
      px: "px-6",
      py: "py-4",
      textAlign: "text-center",
    },

    cellStyle: {
      px: "px-6",
      py: "py-3",
      textAlign: "text-center",
      fontWeight: "font-medium",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-150",
      borderBottom: "border-b border-[#E5F0FE]",
    },

    columns: [
      {
        key: "no",
        label: "Nomor",
      },

      {
        key: "nama_mentor",
        label: "Nama",
        render: (_, row) => (
          <div className="flex justify-start items-center gap-3">
            <MentorAvatar row={row} />
            <span>{getMentorName(row)}</span>
          </div>
        ),
      },

      {
        key: "divisi",
        label: "Divisi",
        render: (_, row) => row?.divisi?.nama || row?.divisi || "-",
      },

      {
        key: "email",
        label: "Email",
        render: (_, row) => getMentorEmail(row),
      },

      {
        key: "created_at",
        label: "Tanggal Pembuatan",
        render: (_, row) => formatMentorDate(getMentorCreatedAt(row)),
      },

      {
        key: "aksi",
        label: "Aksi",
        render: (_, row) => (
          <div className="flex justify-center gap-2">
            <Button onClick={() => modalActions.view(row)} className="bg-[#00C1B7] w-8 h-8 rounded-md">
              <Icon icon="mdi:eye" className="text-white w-5 h-5" />
            </Button>

            <Button onClick={() => modalActions.delete(row)} className="bg-red-500 w-8 h-8 rounded-md">
              <Icon
                icon="fluent:delete-12-regular"
                className="text-white w-5 h-5"
              />
            </Button>

            <Button onClick={() => modalActions.edit(row)} className="bg-[#FFB020] w-8 h-8 rounded-md">
              <Icon icon="iconamoon:edit" className="text-white w-5 h-5" />
            </Button>
          </div>
        ),
      },
    ],
  },
});
