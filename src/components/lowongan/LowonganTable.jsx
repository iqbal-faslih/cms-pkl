import React from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  getCabangLocation,
  formatMagangSystem,
  getCompanyLocation,
  getCompanyName,
  getLowonganName,
  getStatusBadge,
} from "./helpers/lowonganTableFormatter";
import { useLowonganTableLogic } from "./hooks/useLowonganTableLogic";
import LowonganTableSkeletonRows from "./LowonganTableSkeletonRows";

const HEADER_CELL_CLASS = "text-left px-4 py-3 text-xs font-semibold text-[#9aa6bf]";
const ACTION_BUTTON_BASE_CLASS =
  "h-6 w-6 rounded text-white flex items-center justify-center";

const LowonganTable = ({
  filteredData,
  loading = false,
  handleAddNewJob,
  searchQuery,
  onSearchChange,
  onViewJob,
  onEditJob,
  onDeleteJob,
  role = "",
  onToggleFilter,
  filterOpen = false,
  renderFilterPanel,
}) => {
  const {
    sortBy,
    setSortBy,
    sortOptions,
    setCurrentPage,
    totalPages,
    safePage,
    startIndex,
    rows,
    fromData,
    toData,
    isPerusahaanRole,
    totalRows,
  } = useLowonganTableLogic({ filteredData, role });

  return (
    <div className="relative bg-white rounded-2xl border border-[#dbe4ff] overflow-visible">
      <div className="px-6 py-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full xl:w-auto">
            <div>
              <h2 className="text-2xl leading-tight font-bold text-[#1a2143]">
                {isPerusahaanRole ? "Lowongan Perusahaan" : "Lowongan Cabang"}
              </h2>
              <p className="text-xs text-[#14a4a4] mt-1">
                {isPerusahaanRole
                  ? "Kelola data lowongan perusahaan"
                  : "Kelola data lowongan cabang"}
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 text-[#3c68ff] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={onSearchChange}
                className="w-full rounded-xl border border-transparent bg-[#eef1f6] py-3 pl-12 pr-4 text-sm text-gray-700 placeholder:text-[#8e97ad] focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              Sort by:
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none h-9 rounded-md border border-[#d7dfef] bg-white px-3 py-1.5 text-[11px] text-gray-700 pr-7"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleAddNewJob}
              className="h-9 bg-[#3c68ff] text-white hover:bg-[#3158dc] transition-all rounded-md px-3 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Lowongan
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={onToggleFilter}
                className={`h-9 transition-all rounded-md px-3 py-2 text-xs font-semibold flex items-center gap-1.5 ${
                  filterOpen
                    ? "bg-[#3158dc] text-white"
                    : "bg-[#3c68ff] text-white hover:bg-[#3158dc]"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                Filter
                <ChevronDown className="w-3.5 h-3.5 -mr-0.5" />
              </button>
              {filterOpen && renderFilterPanel ? (
                <div className="absolute right-0 top-full mt-2 z-50 w-[290px] rounded-xl border border-[#d7dfef] bg-white shadow-lg">
                  {renderFilterPanel()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/80">
              <th className={HEADER_CELL_CLASS}>
                Nomor
              </th>
              <th className={HEADER_CELL_CLASS}>
                Nama Lowongan
              </th>
              <th className={HEADER_CELL_CLASS}>
                Divisi
              </th>
              <th className={HEADER_CELL_CLASS}>
                Alamat
              </th>
              <th className={HEADER_CELL_CLASS}>
                Jumlah Kuota
              </th>
              <th className={HEADER_CELL_CLASS}>
                Sistem Magang
              </th>
              <th className={HEADER_CELL_CLASS}>
                Status
              </th>
              <th className={HEADER_CELL_CLASS}>
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e2e9f7] bg-white">
            {loading ? (
              <LowonganTableSkeletonRows />
            ) : rows.length > 0 ? (
              rows.map((job, index) => {
                const magangSystem = formatMagangSystem(job.status_magang);
                const statusBadge = getStatusBadge(job);
                return (
                  <tr key={job.id} className="transition-colors hover:bg-blue-50/30">
                    <td className="px-4 py-3 text-xs text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-[#1f2b52]">
                      <p className="text-sm md:text-base font-bold leading-tight">
                        {getLowonganName(job)}
                      </p>
                      <p className="text-[10px] text-gray-500 font-normal mt-1">
                        {isPerusahaanRole
                          ? getCompanyName(job) || "Perusahaan tidak tersedia"
                          : job.cabang?.nama || "Cabang tidak tersedia"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#1f2b52]">
                      <span className="inline-flex items-center rounded-md bg-[#eef3ff] px-2 py-1 text-[11px] font-semibold text-[#3c68ff]">
                        {job.divisi?.nama || "Umum"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {isPerusahaanRole
                        ? getCompanyLocation(job) || "Alamat tidak tersedia"
                        : getCabangLocation(job.cabang)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#1f2b52] font-medium">
                      {job.max_kuota}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`inline-flex min-w-[85px] items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${magangSystem.className}`}
                      >
                        {magangSystem.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`inline-flex min-w-[85px] items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewJob && onViewJob(job.id)}
                          className={`${ACTION_BUTTON_BASE_CLASS} bg-[#17bfb0] hover:bg-[#13ad9f]`}
                          title="Lihat detail"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteJob && onDeleteJob(job)}
                          className={`${ACTION_BUTTON_BASE_CLASS} bg-[#e1231b] hover:bg-[#ca1d17]`}
                          title="Hapus"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditJob && onEditJob(job)}
                          className={`${ACTION_BUTTON_BASE_CLASS} bg-[#f5a623] hover:bg-[#de961f]`}
                          title="Edit"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Filter className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Tidak ada lowongan ditemukan
                    </h3>
                    <p className="text-xs text-gray-500">
                      Coba ubah filter atau tambah lowongan baru
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading ? (
        <div className="px-6 py-4 border-t border-[#d7dfef] bg-white/80 rounded-b-2xl">
          <p className="text-[11px] text-[#9aa6bf]">Memuat data lowongan...</p>
        </div>
      ) : totalRows > 0 && (
        <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-[#d7dfef] bg-white rounded-b-2xl">
          <p className="text-[11px] text-[#9aa6bf]">
            Showing data {fromData} to {toData} of {totalRows} entries
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="h-8 w-8 rounded-md bg-[#f3f6fb] text-slate-600 flex items-center justify-center hover:bg-slate-200"
            >
              &lsaquo;
            </button>

            {Array.from({ length: Math.min(4, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-8 w-8 rounded-md text-xs font-semibold ${
                    safePage === pageNum
                      ? "bg-[#3c68ff] text-white"
                      : "bg-[#f3f6fb] text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 4 && (
              <>
                <span className="px-1 text-slate-400">...</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className={`h-8 w-8 rounded-md text-xs font-semibold ${
                    safePage === totalPages
                      ? "bg-[#3c68ff] text-white"
                      : "bg-[#f3f6fb] text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="h-8 w-8 rounded-md bg-[#f3f6fb] text-slate-600 flex items-center justify-center hover:bg-slate-200"
            >
              &rsaquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowonganTable;
