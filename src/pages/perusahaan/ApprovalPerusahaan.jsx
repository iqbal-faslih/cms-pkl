import React, { useMemo, useState } from "react";

// ✅ import modal yang udah kamu buat sebelumnya
import ModalDetailIzin from "../../components/modal/ModalDetailIzin";
import ModalDetailPendaftar from "../../components/modal/ModalDetailPendaftar";
import FilterDropButton from "../../shared/components/button/FilterDrop";
import Checkbox from "../../shared/components/Checkbox";

// ==========================
// 🔹 Data dummy untuk testing
// ==========================
const dummyRows = Array.from({ length: 16 }).map((_, i) => {
  const statuses = ["Diterima", "Ditolak", "Menunggu Konfirmasi"];
  const reasons = ["Sakit", "Izin", "Keterangan"];
  return {
    id: `#${1000 + i}`,
    nama: ["Reivan Elysiafit Pratama", "William James Moriarty", "Loid Forger"][i % 3],
    sekolah: "SMK 6 Muhammadiyah Rogojampi",
    tanggalIzin: "30 September 2025",
    tanggalKembali: "04 Oktober 2025",
    alasan: reasons[i % reasons.length],
    status: statuses[i % statuses.length],
    avatar:
      i % 3 === 0
        ? "https://i.pravatar.cc/40?img=12"
        : i % 3 === 1
          ? "https://i.pravatar.cc/40?img=5"
          : "https://i.pravatar.cc/40?img=3",
    keterangan:
      "Keterangan tambahan contoh: peserta mengajukan izin karena ada keperluan keluarga.",
  };
});

// 🎨 Warna status di tabel
const statusClasses = {
  Diterima: "bg-green-100 text-green-600 border-green-200",
  Ditolak: "bg-red-100 text-red-600 border-red-200",
  "Menunggu Konfirmasi": "bg-yellow-100 text-yellow-600 border-yellow-200",
};

// =============================
// 🔹 Komponen utama halaman
// =============================
const ApprovalPerusahaan = () => {
  // 🧠 state utama
  const [rows, setRows] = useState(dummyRows);
  const [tab, setTab] = useState("Izin/Sakit"); // bisa diubah ke "Pendaftaran"
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showDetail, setShowDetail] = useState(false);
  const [detailRow, setDetailRow] = useState(null);
  const [filterStatus, setFilterStatus] = useState(new Set());
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // =========================
  // 🔍 Filter pencarian + tab
  // =========================
  const filtered = useMemo(() => {
    let out = rows.filter((r) =>
      r.nama.toLowerCase().includes(search.toLowerCase())
    );
    if (filterStatus.size > 0) {
      out = out.filter((r) => filterStatus.has(r.status));
    }
    if (dateFrom || dateTo) {
      out = out.filter((r) => {
        const dateStr = r.tanggalIzin;
        const date = new Date(dateStr.replace(/(\d{1,2}) (\w+) (\d{4})/, '$2 $1, $3'));
        if (dateFrom && date < dateFrom) return false;
        if (dateTo && date > dateTo) return false;
        return true;
      });
    }
    return out;
  }, [rows, search, filterStatus, dateFrom, dateTo, tab]);

  // 📄 Pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ===========================
  // 🔘 Fungsi pilih checkbox dll
  // ===========================
  const toggleSelect = (id) => {
    const copy = new Set(selectedRows);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    setSelectedRows(copy);
  };

  const toggleSelectAllOnPage = () => {
    const copy = new Set(selectedRows);
    const allIds = pageData.map((r) => r.id);
    const allSelected = allIds.every((id) => copy.has(id));
    if (allSelected) allIds.forEach((id) => copy.delete(id));
    else allIds.forEach((id) => copy.add(id));
    setSelectedRows(copy);
  };

  // ===========================
  // 👁 Buka modal detail
  // ===========================
  const openDetail = (row) => {
    setDetailRow(row);
    setShowDetail(true);
  };

  // ===========================
  // ⚙ Aksi terima / tolak data
  // ===========================
  const applyActionToSelected = (action) => {
    setRows((prev) =>
      prev.map((r) =>
        selectedRows.has(r.id)
          ? {
              ...r,
              status:
                action === "accept"
                  ? "Diterima"
                  : action === "reject"
                  ? "Ditolak"
                  : r.status,
            }
          : r
      )
    );
    setSelectedRows(new Set());
  };

  // ===========================
  // 🔽 Filter status
  // ===========================
  const handleFilterApply = (filters) => {
    setDateFrom(filters.dateFrom);
    setDateTo(filters.dateTo);
  };

  const handleCheckboxChange = (status) => {
    const copy = new Set(filterStatus);
    if (copy.has(status)) copy.delete(status);
    else copy.add(status);
    setFilterStatus(copy);
  };

  // ===========================
  // 🧱 Tampilan UI halaman
  // ===========================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ================== HEADER ================== */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 flex items-center gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
            alt="logo"
            className="w-16 h-16 rounded-full bg-white p-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                CV. NAMA CABANG
              </h2>
              <span className="text-blue-600 text-sm">✔</span>
            </div>
            <p className="text-gray-500 text-sm md:text-base">
              Perusahaan ini bergerak di bidang Informasi dan Teknologi untuk
              perkembangan Industri
            </p>
            <p className="text-gray-400 text-sm">Malang, Jawa Timur</p>
          </div>
        </div>

        <div className="w-full h-44 md:h-56">
          <img
            src="https://images.unsplash.com/photo-1542223616-8f62b9b6b0b1?auto=format&fit=crop&w=2000&q=60"
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ================== TABLE CARD ================== */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header Card (Tabs, Search, Filter) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Daftar Approval</h3>
            <p className="text-sm text-gray-500"></p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs switch */}
            <div className="bg-gray-50 rounded-lg p-1 flex items-center">
              <button
                onClick={() => setTab("Pendaftaran")}
                className={`px-3 py-1 rounded-md text-sm ${
                  tab === "Pendaftaran"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-600"
                }`}
              >
                Pendaftaran
              </button>
              <button
                onClick={() => setTab("Izin/Sakit")}
                className={`px-3 py-1 rounded-md text-sm ${
                  tab === "Izin/Sakit"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-600"
                }`}
              >
                Izin/Sakit
              </button>
            </div>

            {/* Action buttons */}
            <button
              onClick={() => applyActionToSelected("accept")}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
            >
              Terima
            </button>
            <button
              onClick={() => applyActionToSelected("reject")}
              className="bg-white border border-red-400 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-50"
            >
              Tolak
            </button>

            {/* Search box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              <svg
                className="w-4 h-4 absolute right-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter button */}
            <FilterDropButton
              label="Filter"
              showDateFilter={true}
              content={{
                render: ({ close }) => {
                  const selected = Array.from(filterStatus);
                  return (
                    <div className="space-y-2 py-3">
                      <p className="text-lg font-medium">Status</p>
                      {["Diterima", "Ditolak", "Menunggu Konfirmasi"].map((status) => (
                        <Checkbox
                          key={status}
                          label={status}
                          checked={selected.includes(status)}
                          onChange={() => handleCheckboxChange(status)}
                          boxClass="!border-blue-500 !bg-white hover:bg-blue-100
                            data-[checked=true]:!bg-blue-500
                            data-[checked=true]:!border-blue-500
                            data-[checked=true]:hover:!bg-blue-500"
                          checkIconClass="text-white"
                        />
                      ))}
                    </div>
                  );
                },
                onApply: handleFilterApply,
              }}
            />
          </div>
        </div>

        {/* ================== TABLE ================== */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="w-12 px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAllOnPage}
                    checked={
                      pageData.length > 0 &&
                      pageData.every((r) => selectedRows.has(r.id))
                    }
                  />
                </th>
                <th className="px-3 py-3 text-left">No</th>
                <th className="px-3 py-3 text-left">Nama</th>
                <th className="px-3 py-3 text-left">Asal Sekolah</th>
                <th className="px-3 py-3 text-left">Tanggal Izin</th>
                <th className="px-3 py-3 text-left">Alasan</th>
                <th className="px-3 py-3 text-left">Status</th>
                <th className="px-3 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                pageData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 border-b last:border-b-0">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-3 py-3">{row.id}</td>

                    {/* Kolom Nama */}
                    <td className="px-3 py-3 flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-700">{row.nama}</div>
                        <div className="text-xs text-gray-400">#student</div>
                      </div>
                    </td>

                    {/* Kolom Asal Sekolah */}
                    <td className="px-3 py-3 text-gray-600">{row.sekolah}</td>

                    {/* Kolom Tanggal Izin */}
                    <td className="px-3 py-3 text-gray-600">{row.tanggalIzin}</td>

                    {/* Kolom Alasan */}
                    <td className="px-3 py-3 text-gray-600">{row.alasan}</td>

                    {/* Kolom Status */}
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Kolom Aksi */}
                    <td className="px-3 py-3 text-center">
                      {/* 🔘 Tombol buka modal detail */}
                      <button
                        onClick={() => openDetail(row)}
                        className="text-white bg-blue-600 px-3 py-1 rounded-md text-xs hover:bg-blue-700"
                      >
                        LIHAT DETAIL
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================== PAGINATION ================== */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Prev
            </button>
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pg = idx + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pg === page ? "bg-blue-600 text-white" : "border"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal - Detail (versi komponen terpisah) */}
      {showDetail && detailRow && (
        <>
          {/* Jika tab aktif adalah "Izin/Sakit" */}
          {tab === "Izin/Sakit" && (
            <ModalDetailIzin
              isOpen={showDetail}
              onClose={() => setShowDetail(false)}
              data={{
                tanggal: `${detailRow.tanggalIzin} - ${detailRow.tanggalKembali}`,
                deskripsi: detailRow.keterangan,
                suratUrl: detailRow.avatar,
              }}
            />
          )}

          {/* Jika tab aktif adalah "Pendaftaran" */}
          {tab === "Pendaftaran" && (
            <ModalDetailPendaftar
              isOpen={showDetail}
              onClose={() => setShowDetail(false)}
              data={{
                nama: detailRow.nama,
                jk: "Laki-laki",
                sekolah: detailRow.sekolah,
                jurusan: "RPL",
                alamat: "Jl. Contoh No. 123",
                berkas: [
                  {
                    title: "CV",
                    imageUrl: "https://i.ibb.co/4tY1LbT/sample-cv.png",
                  },
                  {
                    title: "Surat Pengantar",
                    imageUrl: "https://i.ibb.co/mJzDR8v/sample-letter.png",
                  },
                ],
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ApprovalPerusahaan;
