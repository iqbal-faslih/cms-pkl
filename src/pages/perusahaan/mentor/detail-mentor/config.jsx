import Search from "@/shared/components/Search";
import Badge2 from "@/shared/components/Badge2";
import SortButton  from "@/shared/components/button/Sort";
import SquaredProfile from "@/shared/components/SquaredProfile";
export const HalamanDetailMentorConfig = {
  headerConfig: {
    split: false,
    title: "Semua Peserta",
    subtitle: "Peserta Aktif",
    subtitleColor: "text-emerald-500",
    top: {
    left:  {},
    right: [
      <Search
        key="search"
      />,
      <SortButton
        key="sort-progress"
        label="Terbaru-Lama"
        options={[
          { label: "Terbaru-Lama", value: "Terbaru-Lama" },
          { label: "Lama-Terbaru", value: "Lama-Terbaru" },
          { label: "A-Z", value: "A-Z" },
          { label: "Z-A", value: "Z-A" },
        ]}
        onSelect={(v) => console.log("SORT BY:", v)}
        className="-ml-2 w-44"
        showOutsideLabel
        labelText="Sort By:"
      />,
    ],},
  },

  tableConfig: {
    className: "bg-transparent",
    headerStyle: {
      bgColor: "bg-transparent",
      textColor: "text-gray-400",
      fontWeight: "font-bold",
      px: "px-6",
      py: "py-4",
      textAlign: "text-center",
    },
    cellStyle: {
      px: "px-6",
      py: "py-3",
      textAlign: "text-center",
      textColor: "text-gray-700",
      fontWeight: "font-medium",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-150",
      borderBottom: "border-b border-gray-200",
    },

    columns: [
      {
        key: "id",
        label: "Number",
        headerClassName: "text-center w-[1%]",
        cellClassName: "text-center",
        render: (_, __, i) => i + 1,
      },
      {
        key: "name",
        label: "Name",
        headerClassName: "text-center",
        cellClassName: "text-center",
         render: (value, row) => {
          return (
            <div className="flex items-center gap-3">
              <SquaredProfile image={row.image} size="35px" />
              {value}
            </div>
          );
        },
      },
      {
        key: "email",
        label: "Email",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
      {
        key: "asalsekolah",
        label: "Asal Sekolah",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
      {
        key: "actions",
        label: "Aksi",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
    ],
  },
};