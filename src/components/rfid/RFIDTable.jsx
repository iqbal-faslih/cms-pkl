import React from "react";

const RFIDTable = ({ filteredData, activeTab, handleRFIDAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white-50 border-t border-[#D5DBE7]">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">No</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Nama Lengkap</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Masa Magang</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Sekolah</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 flex items-center gap-3 text-sm">
                  <img src={item.image} alt={item.nama} className="w-10 h-10 rounded-full" />
                  {item.nama}
                </td>
                <td className="px-6 py-4 text-sm">{item.email}</td>
                <td className="px-6 py-4 text-sm">{item.masaMagang}</td>
                <td className="px-6 py-4 text-sm">{item.sekolah}</td>
                <td className="px-6 py-4 text-center">
                  {activeTab === "dataSiswa" && item.rfidTag && (
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => handleRFIDAction(item.id, "Ubah")}
                    >
                      Ubah RFID
                    </button>
                  )}
                  {activeTab === "daftarkanRFID" && !item.rfidTag && (
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => handleRFIDAction(item.id, "Daftarkan")}
                    >
                      Daftarkan RFID
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm">Tidak ada data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RFIDTable;
