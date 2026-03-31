import React from "react";
import { FilterDropButton, SortButton } from "../../components/button";
import Checkbox from "../../components/Checkbox";
import { Icon } from "@iconify/react";
import Button from "../../../shared/components/button/Button";
import Search from "../../components/Search";

export const ConfigSesiJamKantor = (
  filterState,
  searchQuery,
  setSearchQuery,
  modalActions,
  sesiParam
) => ({
  headerConfig: {
    split: false,
    title: (
      <div className="flex items-center gap-3 mb-1">
        <Icon
          icon="mdi:arrow-left"
          className="w-6 h-6 cursor-pointer text-black hover:text-gray-500 hover:scale-125 duration-200 hover:duration-200"
          onClick={() => modalActions.navigate(-1)}
        />
        <span>Sesi {sesiParam}</span>
      </div>
    ),
    subtitle: `Informasi Detail Data Sesi ${sesiParam}`,
    subtitleColor: "text-emerald-500",

    top: {
      left: [
        <div key="top-left-wrapper" className="w-full flex flex-col gap-3">
          <Search
            placeholder="Search here ..."
            className="w-full bg-[#f7f9fa] rounded-lg"
            iconClass="text-[#3E80F8] font-bold"
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex gap-2 lg:hidden">
            <SortButton
              onSelect={(val) => modalActions.setSortValue(val)}
              className="w-full whitespace-nowrap"
            />

            <FilterDropButton
              showDateFilter={true}
              dateLabel="Tanggal Pembuatan"
              title="Filter"
              customStyles="w-full text-sm text-white px-6 py-1.5 rounded-lg border border-gray-300 bg-[#304FFE] hover:bg-blue-800 duration-300"
              content={{
                render: ({ close }) => (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Divisi</p>

                      <Checkbox
                        label="Frontend"
                        checked={filterState.selectedDivisi.fe}
                        onChange={() =>
                          filterState.setSelectedDivisi((prev) => ({
                            ...prev,
                            fe: !prev.fe,
                          }))
                        }
                        boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                        checkIconClass="text-white"
                      />

                      <Checkbox
                        label="Backend"
                        checked={filterState.selectedDivisi.be}
                        onChange={() =>
                          filterState.setSelectedDivisi((prev) => ({
                            ...prev,
                            be: !prev.be,
                          }))
                        }
                        boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                        checkIconClass="text-white"
                      />

                      <Checkbox
                        label="Mobile"
                        checked={filterState.selectedDivisi.mobile}
                        onChange={() =>
                          filterState.setSelectedDivisi((prev) => ({
                            ...prev,
                            mobile: !prev.mobile,
                          }))
                        }
                        boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                        checkIconClass="text-white"
                      />

                      <Checkbox
                        label="UI/UX Designer"
                        checked={filterState.selectedDivisi.uiux}
                        onChange={() =>
                          filterState.setSelectedDivisi((prev) => ({
                            ...prev,
                            uiux: !prev.uiux,
                          }))
                        }
                        boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                        checkIconClass="text-white"
                      />

                      <Checkbox
                        label="Digital Marketing"
                        checked={filterState.selectedDivisi.digmar}
                        onChange={() =>
                          filterState.setSelectedDivisi((prev) => ({
                            ...prev,
                            digmar: !prev.digmar,
                          }))
                        }
                        boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                        checkIconClass="text-white"
                      />

                      <Checkbox
                        label="Project Manager"
                        checked={filterState.selectedDivisi.pm}
                        onChange={() =>
                          filterState.setSelectedDivisi((prev) => ({
                            ...prev,
                            pm: !prev.pm,
                          }))
                        }
                        boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                        checkIconClass="text-white"
                      />
                    </div>
                  </div>
                ),
                onApply: () => filterState.apply(),
              }}
            />
          </div>
        </div>,
      ],

      right: [
        <div key="top-right-xl" className="hidden lg:flex gap-2">
          <SortButton
            onSelect={(val) => modalActions.setSortValue(val)}
            className="whitespace-nowrap"
          />
          <FilterDropButton
            showDateFilter={true}
            dateLabel="Tanggal Pembuatan"
            title="Filter"
            customStyles="text-sm text-white px-6 py-1.5 rounded-lg border border-gray-300 bg-[#304FFE] hover:bg-blue-800 duration-300 hover:duration-300"
            content={{
              render: ({ close }) => (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Divisi</p>
                    <Checkbox
                      label="Frontend"
                      checked={filterState.selectedDivisi.fe}
                      onChange={() =>
                        filterState.setSelectedDivisi((prev) => ({
                          ...prev,
                          fe: !prev.fe,
                        }))
                      }
                      boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                      checkIconClass="text-white"
                    />
                    <Checkbox
                      label="Backend"
                      checked={filterState.selectedDivisi.be}
                      onChange={() =>
                        filterState.setSelectedDivisi((prev) => ({
                          ...prev,
                          be: !prev.be,
                        }))
                      }
                      boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                      checkIconClass="text-white"
                    />
                    <Checkbox
                      label="Mobile"
                      checked={filterState.selectedDivisi.mobile}
                      onChange={() =>
                        filterState.setSelectedDivisi((prev) => ({
                          ...prev,
                          mobile: !prev.mobile,
                        }))
                      }
                      boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                      checkIconClass="text-white"
                    />
                    <Checkbox
                      label="UI/UX Designer"
                      checked={filterState.selectedDivisi.uiux}
                      onChange={() =>
                        filterState.setSelectedDivisi((prev) => ({
                          ...prev,
                          uiux: !prev.uiux,
                        }))
                      }
                      boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                      checkIconClass="text-white"
                    />
                    <Checkbox
                      label="Digital Marketing"
                      checked={filterState.selectedDivisi.digmar}
                      onChange={() =>
                        filterState.setSelectedDivisi((prev) => ({
                          ...prev,
                          digmar: !prev.digmar,
                        }))
                      }
                      boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                      checkIconClass="text-white"
                    />
                    <Checkbox
                      label="Project Manager"
                      checked={filterState.selectedDivisi.pm}
                      onChange={() =>
                        filterState.setSelectedDivisi((prev) => ({
                          ...prev,
                          pm: !prev.pm,
                        }))
                      }
                      boxClass="w-4 h-4 rounded-md data-[checked=true]:bg-[#304FFE]"
                      checkIconClass="text-white"
                    />
                  </div>
                </div>
              ),
              onApply: () => filterState.apply(),
            }}
          />
        </div>,
      ],
    },
  },

  tableConfig: {
    className: "bg-transparent table-fixed w-full mt-10",

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
      textAlign: "text-center",
    },

    columns: [
      {
        key: "id",
        label: "No",
        headerClassName: "xl:w-[60px]",
        cellClassName: "text-[10px] md:text-[12px] lg:text-sm font-medium",
      },

      {
        key: "nama",
        label: "Nama",
        headerClassName: "xl:w-[180px]",
        render: (value, row) => (
          <div className="flex items-center gap-3 justify-center">
            <img
              src={row.foto}
              alt={value}
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="text-[10px] md:text-[12px] lg:text-sm font-medium">
              {value}
            </span>
          </div>
        ),
      },

      {
        key: "produk",
        label: "Produk",
        headerClassName: "xl:w-[100px]",
        cellClassName: "text-[10px] md:text-[12px] lg:text-sm font-medium",
      },

      {
        key: "divisi",
        label: "Divisi",
        headerClassName: "xl:w-[160px]",
        cellClassName: "text-[10px] md:text-[12px] lg:text-sm font-medium",
      },

      {
        key: "aksi",
        label: "Aksi",
        headerClassName: "xl:w-[100px]",
        cellClassName: "text-center",
        render: () => (
          <div className="flex items-center justify-center gap-2">
            <Button
              className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-md"
              iconLeft={
                <Icon
                  icon="qlementine-icons:trash-16"
                  className="text-white w-4 h-4"
                />
              }
            >
              <></>
            </Button>
          </div>
        ),
      },
    ],
  },
});
