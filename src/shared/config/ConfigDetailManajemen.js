export const ConfigJamKantor = {
  headers: {
    title: "Jam Kantor",
  },
};

export const ColumnJamKantor = {
  columns: [
    { key: "hari", label: "Hari" },
    { key: "masuk", label: "Masuk" },
    { key: "kembali", label: "Kembali" },
    { key: "pulang", label: "Pulang" },
  ],

  headerStyle: {
    px: "px-6",
    py: "py-3",
    fontWeight: "font-bold",
    textColor: "text-gray-600",
    bgColor: "bg-[#EBEBEB]",
    borderBottom: "border-b border-gray-200",
  },

  cellStyle: {
    px: "px-6",
    py: "py-3",
    textAlign: "text-center",
  },
};
