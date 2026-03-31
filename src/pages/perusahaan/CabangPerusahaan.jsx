import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Search from "../../shared/components/Search";
import Pagination from "../../shared/components/Pagination";
import SortButton from "../../shared/components/button/Sort";
import { useKelolaCabang } from "../../hooks/useKelolaCabang";

export default function CabangPerusahaan() {
  const {
    loading,
    cabangData,
    pagination,
    handlePageChange,
    search,
    setSearch,
    sortOption,
    setSortOption,
  } = useKelolaCabang();

  if (loading) return null;

  const coverFallback = "/assets/img/Company.png";
  const logoFallback = "/assets/img/logoperusahaan.png";

  return (
    <div className="w-full bg-[#EEF4FF] rounded-2xl p-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Semua Cabang
            </h2>
            <p className="text-xs text-teal-600">
              Cabang Perusahaan Active &amp; Non Active
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[220px]">
              <Search value={search} onChange={(text) => setSearch(text)} />
            </div>
            <SortButton value={sortOption} onSelect={(val) => setSortOption(val)} />
            <Link
              to="/perusahaan/kelola-cabang/tambah"
              className="bg-[#3F51FF] text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-blue-800 transition"
            >
              Tambah Cabang
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {cabangData.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="h-36 w-full overflow-hidden">
                <img
                  src={item.cover || coverFallback}
                  alt={item.nama}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="px-5 pb-5 pt-4 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full border border-white bg-white shadow -mt-10 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.logo || logoFallback}
                    alt="Logo"
                    className="h-10 w-10 object-cover"
                  />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase">
                  {item.nama}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {item.lokasi || item.kota || "-"}
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Link
                    to={`${item.slug}/detail`}
                    className="bg-[#3F51FF] text-white text-xs px-3 py-1 rounded-md hover:bg-blue-800"
                  >
                    Lihat Detail
                  </Link>
                  <Link
                    to={`/perusahaan/kelola-cabang/edit/${item.id}`}
                    state={item}
                    className="bg-[#3F51FF] text-white text-xs px-3 py-1 rounded-md hover:bg-blue-800"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/hapus/${item.id}`}
                    className="bg-[#3F51FF] text-white text-xs px-3 py-1 rounded-md hover:bg-blue-800"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pagination && (
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-500">
            <span>
              Showing data 1 to {cabangData.length} of {pagination.totalItems}{" "}
              entries
            </span>
            <div className="flex justify-end">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={pagination.totalItems}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
