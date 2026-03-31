import TableHeader from "@/shared/components/table/TableHeader";
import DataTable from "@/shared/components/table/Table";
import { ConfigTableHeaderSiswa } from "@/shared/config/ConfigPesertaBranch";
import { usePesertaMagangCabang } from "@/hooks/usePesertaMagangCabang";

export default function PesertaCabang() {
  const idCabang = localStorage.getItem("id_cabang");

  const {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    resetFilters,
    sortOption,
    setSortOption,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,
  } = usePesertaMagangCabang({
    itemsPerPage: 10,
    idCabang,
  });

  const filterState = {
    selected: selectedFilters,
    toggle: (value) => toggleFilter(value),

    apply: ({ dateFrom, dateTo }) =>
      applyFilters({
        dateFrom,
        dateTo,
      }),
    reset: resetFilters,
  };

  const modalActions = {
    sortValue: sortOption,
    setSortValue: setSortOption,
  };

  const config = ConfigTableHeaderSiswa(
    filterState,
    searchTerm,
    setSearchTerm,
    modalActions
  );

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <TableHeader config={config.headers} />

      {loading ? (
        <div className="py-6 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="py-6 text-center text-red-500">
          Gagal memuat data
        </div>
      ) : data?.length === 0 ? (
        <div className="py-6 text-center text-gray-500">
          Tidak ada data ditemukan
        </div>
      ) : (
        <DataTable
          config={{
            columns: config.columns,
            headerStyle: config.headerStyle,
            cellStyle: config.cellStyle,
          }}
          data={data}
          pagination={{
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            onPageChange: handlePageChange,
          }}
        />
      )}
    </div>
  );
}