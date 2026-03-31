import React from "react";
import Card from "./cards/Card";

const AbsensiTable = ({ data, loading, page, lastPage, total, perPage, onPageChange }) => {
  const showingFrom = data.length > 0 ? (page - 1) * (perPage || data.length) + 1 : 0;
  const showingTo = data.length > 0 ? (page - 1) * (perPage || data.length) + data.length : 0;

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case "telat":
      case "terlambat":
        return "bg-red-500 text-white";
      case "hadir":
      case "masuk": 
        return "bg-blue-500 text-white"; 
      case "sakit":
        return "bg-orange-100 text-orange-600"; 
      case "izin":
        return "bg-orange-400 text-white"; 
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxPageButtons = 5; 
    const startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(lastPage, startPage + maxPageButtons - 1);

    // Tombol untuk halaman 1
    if (startPage > 1) {
        pageButtons.push(
            <button
                key={1}
                onClick={() => onPageChange(1)}
                className={`w-8 h-8 font-semibold rounded-lg border border-gray-400/[0.5] ${
                    page === 1 ? "bg-[#306BFF] text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
            >
                1
            </button>
        );
        if (startPage > 2) {
            pageButtons.push(<span key="dots1">...</span>);
        }
    }

    // Tombol untuk halaman di sekitar halaman aktif
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`w-8 h-8 font-semibold rounded-lg border border-gray-400/[0.5] ${
                    page === i ? "bg-[#306BFF] text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
            >
                {i}
            </button>
        );
    }

    // Tombol untuk halaman terakhir
    if (endPage < lastPage) {
        if (endPage < lastPage - 1) {
            pageButtons.push(<span key="dots2">...</span>);
        }
        pageButtons.push(
            <button
                key={lastPage}
                onClick={() => onPageChange(lastPage)}
                className={`w-8 h-8 font-semibold rounded-lg border border-gray-400/[0.5] ${
                    page === lastPage ? "bg-[#306BFF] text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
            >
                {lastPage}
            </button>
        );
    }
  return pageButtons;
};

  return (
    <>
      <Card className="mt-5 min-h-[300px]">
        {loading ? (
          <p className="text-center py-10">Memuat data...</p>
        ) : data.length === 0 ? (
          <p className="text-center py-10">Tidak ada data absensi untuk periode ini.</p>
        ) : (
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-white text-black font-bold text-sm">
              <tr>
                <th className="py-3 px-6">Nama</th>
                <th className="py-3 px-6">Tanggal</th>
                <th className="py-3 px-6">Masuk</th>
                <th className="py-3 px-6">Kembali</th>
                <th className="py-3 px-6">Istirahat</th>
                <th className="py-3 px-6">Pulang</th>
                <th className="py-3 px-6 text-center">Keterangan</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition-all duration-150">
                  <td className="py-3 px-6 flex items-center gap-3">
                    <img src={item.profile_photo || "/default-profile.png"} alt={item.nama} className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-gray-900">{item.nama}</span>
                  </td>
                  <td className="py-3 px-6">{item.tanggal}</td>
                  <td className="py-3 px-6">{item.jam_masuk || "-"}</td>
                  <td className="py-3 px-6">{item.jam_kembali || "-"}</td>
                  <td className="py-3 px-6">{item.jam_istirahat || "-"}</td>
                  <td className="py-3 px-6">{item.jam_pulang || "-"}</td>
                  <td className="py-3 px-6 text-center">
                    <span 
                      className={`px-3 py-1 text-xs rounded-lg font-semibold ${getStatusClass(item.status)}`}
                    >
                      {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="flex justify-between items-center px-6 py-4">
        <span className="text-sm text-gray-500">
          Showing {showingFrom} to {showingTo} of {total} entries
        </span>
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="w-8 h-8 font-semibold rounded-lg border border-gray-400/[0.5] text-gray-600 hover:bg-gray-200 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          <div className="flex gap-1">
              {renderPageNumbers()}
          </div>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === lastPage}
            className="w-8 h-8 font-semibold rounded-lg border border-gray-400/[0.5] text-gray-600 hover:bg-gray-200 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default AbsensiTable;