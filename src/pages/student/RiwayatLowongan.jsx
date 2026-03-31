import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { useRiwayatLowongan } from "../../hooks/siswa/riwayat-lowongan/useRiwayatLowongan";
import { useTableData } from "../../hooks";
import { lowonganStatusColor } from "../../helpers/siswa/dashboard/riwayatLowonganHelper";
import { formatSimpleDate } from "../../utils/dateUtils";
import TableRiwayatSkeleton from "../../components/skeletons/siswa/riwayat-lowongan/TableRiwayatSkeleton";
import PrimaryButton from "../../components/button/PrimaryButton";

const ITEMS_PER_PAGE = 6;

const byCompanyName = (item, searchTerm) =>
  item.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase());

const getSortIndicator = (sortConfig, key) => {
  if (sortConfig.key !== key) return "⇅";
  return sortConfig.order === "asc" ? "▲" : "▼";
};

const RiwayatLowongan = () => {
  const { lowongan, loading, error, refetch } = useRiwayatLowongan();

  const {
    search,
    setSearch,
    sortConfig,
    handleSort,
    currentPage,
    setCurrentPage,
    currentData,
    totalPages,
    startIndex,
    endIndex,
    getPaginationRange,
    totalItems,
  } = useTableData(
    lowongan,
    byCompanyName,
    { key: "id", order: "asc" },
    ITEMS_PER_PAGE
  );

  return (
    <div className="w-full h-full bg-white rounded-2xl relative">
      <div className="py-5 px-7 flex items-center justify-between">
        <h2 className="font-medium">{totalItems} Lowongan yang didaftar</h2>
        <div className="rounded-full py-3 px-5 w-89 flex items-center justify-between overflow-hidden bg-[#F3F7FB]">
          <input
            type="text"
            placeholder="Cari Perusahaan"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[#4D5765] border-0 focus:ring-0 focus:outline-none bg-transparent max-w-full"
          />
          <div className="flex items-center justify-center text-[#0D5EF4] border-l-2 pl-3 border-[#0D5EF4]">
            <Search size={20} />
          </div>
        </div>
      </div>

      {loading ? (
        <TableRiwayatSkeleton rows={ITEMS_PER_PAGE} />
      ) : error ? (
        <div className="bg-white flex items-center justify-center absolute top-60 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-red-500 mb-4">
              <i
                className="bi bi-exclamation-triangle"
                style={{ fontSize: "2rem" }}
              ></i>
            </div>
            <div className="text-red-500 text-center mb-4">
              <p className="font-semibold mb-2">Terjadi Kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
            <PrimaryButton onClick={refetch} rounded="rounded-lg">
              Coba Lagi
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          <div className="pb-30">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-[#DFE8FF] h-15">
                <tr className="text-left">
                  <th className="font-medium px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      No.
                      <button
                        onClick={() => handleSort("id")}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {getSortIndicator(sortConfig, "id")}
                      </button>
                    </div>
                  </th>
                  <th className="font-medium px-4 py-2">Nama Perusahaan</th>
                  <th className="font-medium px-4 py-2">
                    <div className="flex items-center gap-1">
                      Tanggal Daftar
                      <button
                        onClick={() => handleSort("tanggal_daftar")}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {getSortIndicator(sortConfig, "tanggal_daftar")}
                      </button>
                    </div>
                  </th>
                  <th className="font-medium px-4 py-2">Posisi Magang</th>
                  <th className="font-medium px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {totalItems === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="text-sm">
                      <td className="px-4 py-2 text-center">{startIndex + index + 1}</td>
                      <td className="px-4 py-2 uppercase font-medium align-middle">
                        <div className="flex items-center gap-5">
                          <img
                            src={item.logo_perusahaan}
                            alt="logo"
                            className="size-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/assets/img/Cover.png";
                            }}
                          />
                          <span>{item.nama_perusahaan}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {formatSimpleDate(item.tanggal_daftar)}
                      </td>
                      <td className="px-4 py-2 capitalize font-medium">
                        {item.posisi_magang}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className="inline-flex px-3 py-2 rounded-md text-white text-sm font-medium"
                          style={{
                            backgroundColor: lowonganStatusColor(item.status),
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 pt-4 pb-5 text-sm text-gray-600 absolute bottom-0 w-full">
            <span className="text-sm opacity-80">
              Menampilkan data {totalItems === 0 ? 0 : startIndex + 1} sampai{" "}
              {endIndex} dari {totalItems} total
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`p-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#5932EA] text-white"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              {getPaginationRange().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-[#5932EA] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`p-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#5932EA] text-white"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RiwayatLowongan;
