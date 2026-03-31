import Button from "@/shared/components/button/Button";
import Search from "@/shared/components/Search";
import SortButton from "@/shared/components/button/Sort";
import { Icon } from "@iconify/react";
import { CiEdit } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


// TABLE COLUMNS
export const artikelColumns = [
  {
    label: "Number",
    key: "number",
    cellClassName: "text-gray-600 font-normal text-base",
    headerClassName: "w-24 text-sm",
  },
  {
    label: "Judul Postingan",
    key: "judul",
    cellClassName: "text-gray-600 text-base",
    headerClassName: "w-96 text-sm",
  },
  {
    label: "Tanggal Publikasi",
    key: "tanggal",
    cellClassName: "text-gray-600 text-base",
    headerClassName: "w-40 text-sm",
  },
  {
    label: "Tag",
    key: "tag",
    headerClassName: "w-64 text-sm",
    render: (value) => (
      <div className="flex gap-2 flex-wrap">
        {value?.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: "Aksi",
    key: "aksi",
    headerClassName: "w-28 text-sm text-center",
    cellClassName: "text-gray-600 text-base flex justify-center",
  },
];


//  TABLE CONFIG

export const artikelTableConfig = {
  columns: artikelColumns,

  headerStyle: {
    bgColor: "bg-white",
    textColor: "text-gray-500",
    fontWeight: "font-extrabold",
    px: "px-6",
    py: "py-4",
    textAlign: "text-center",
    borderBottom: "border-b border-gray-200",
    fontSize: "text-lg uppercase tracking-wider",
  },

  cellStyle: {
    px: "px-6",
    py: "py-4",
    textColor: "text-gray-800",
    fontSize: "text-base",
    textAlign: "text-center",
    fontWeight: "font-medium",
    borderBottom: "border-b border-gray-100",
    rowHover: "hover:bg-gray-50",
    rowTransition: "transition-colors",
  },
};

//  HEADER CONFIG 

export const artikelHeaderConfig = ({
  search,
  setSearch,
  sortValue,
  setSortValue,
}) => {
  const navigate = useNavigate();

  return {
    title: "Semua Postingan",
    subtitle: "Seluruh postingan yang aktif!",
    subtitleColor: "text-green-500",

    top: {
      right: [
        <Search
          key="search"
          placeholder="Search here..."
          width="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="py-2 w-90 text-gray-600 bg-gray-100 border-0 rounded-lg"
          iconClass="text-blue-500"
        />,

        <SortButton
          key="sort"
          showOutsideLabel={true}

          options={[
            { value: "terbaru", label: "Terbaru" },
            { value: "terlama", label: "Terlama" },
            { value: "a-z", label: "A-Z" },
            { value: "z-a", label: "Z-A" },
          ]}
          onSelect={(val) => setSortValue(val)}
          className="py-2"
        />,

        <Button
          key="btn"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 border-0 rounded-lg flex items-center gap-2 shadow-sm"
          iconLeft={<Icon icon="mdi:plus" className="w-5 h-5" />}
          onClick={() => navigate('create')}
        >
          Buat Postingan
        </Button>,
      ],
    },
  };
};

