import React from "react";
import Search from "@/shared/components/Search";
import Badge2 from "@/shared/components/Badge2";
import SortButton from "@/shared/components/button/Sort";
import FilterDropButton from "@/shared/components/button/FilterDrop";

export const divisionOptions = [
  { label: "All", value: "All" },
  { label: "FrontEnd", value: "FrontEnd" },
  { label: "BackEnd", value: "BackEnd" },
  { label: "UI/UX DESIGNER", value: "UI/UX DESIGNER" },
  { label: "QA", value: "QA" },
  { label: "PM", value: "PM" },
];

export const ListPesertaConfig = (
  searchQuery,
  setSearchQuery,
  sortValue,
  setSortValue,
  selectedDivision
) => ({
  headerConfig: {
    split: false,
    title: "List Peserta",
    subtitle:
      selectedDivision === "All"
        ? "All Divisi"
        : `Divisi ${selectedDivision}`,
    subtitleColor: "text-[#0069AB]",

    top: {
      left: [
        <Search
          key="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      ],

right: ["SORT_BUTTON", "FILTER_BUTTON"]
    },
  },

  tableConfig: {
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
      { key: "no", label: "Number" },
      {
        key: "nama",
        label: "Name",
        render: (value) => (
          <div className="flex justify-center items-center gap-3">
            <img
              src={"/assets/default-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-sm object-cover border"
            />
            <span>{value}</span>
          </div>
        ),
      },
      { key: "project", label: "Project" },
      {
        key: "proses",
        label: "Progress",
        render: (value) => {
          let color, textColor;

          switch (value) {
            case "Done":
              color = "#78C552";
              textColor = "#FFFFFF";
              break;
            default:
              color = "#E4E4E4";
              textColor = "#767C85";
          }

          return (
            <div className="flex justify-center">
              <Badge2
                color={color}
                textColor={textColor}
                textSize="0.90rem"
                rounded="0.375rem"
                className="w-28 h-7"
              >
                {value}
              </Badge2>
            </div>
          );
        },
      },
    ],
  },
});