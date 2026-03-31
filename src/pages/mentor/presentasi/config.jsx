import React from "react";
import Search from "@/shared/components/Search";
import Badge2 from "@/shared/components/Badge2";
import Checkbox from "@/shared/components/Checkbox";
import FilterDropButton from "@/shared/components/button/FilterDrop";
import Button from "@/shared/components/button/Button";
import SortButton from "@/shared/components/button/Sort";
import { Icon } from "@iconify/react";

export const presentasiConfig = (
  // filterState,
  // searchQuery,
  // setSearchQuery,
  modalActions
) => ({
  headerConfig: {
    split: false,
    top: {
      left: [
        <Search
          key="search-bar"
          // value={searchQuery}
          // onChange={setSearchQuery}
        />,
      ],

      right: [
        <SortButton
          labelText="Sort by:"
          onSelect={(val) => modalActions.setSortValue(val)}
        />,
        <FilterDropButton
          label="Filter"
          showDateFilter={true}
          dateLabel="Tanggal Pembuatan"
          //   content={{
          //     render: ({ close, DefaultCheckbox }) => (
          //       <div className="space-y-3">
          //         <div className="space-y-2">
          //           <p className="text-sm font-semibold">Status</p>
          //           <DefaultCheckbox
          //             label="Aktif"
          //             checked={filterState.selected.includes("Aktif")}
          //             onChange={() => filterState.toggle("Aktif")}
          //           />

          //           <DefaultCheckbox
          //             label="Non Aktif"
          //             checked={filterState.selected.includes("Non Aktif")}
          //             onChange={() => filterState.toggle("Non Aktif")}
          //           />
          //         </div>
          //       </div>
          //     ),
          //     onApply: () => filterState.apply(),
          //   }}
        />,
        <Button onClick={() => modalActions.openAdd()} className="text-sm text-white px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
          <Icon icon="ic:baseline-plus" width="20" height="20" />
          <span>Tambah Jadwal</span>
        </Button>,
      ],
    },
  },
});
