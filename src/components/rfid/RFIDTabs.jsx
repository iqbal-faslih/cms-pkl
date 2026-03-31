import React from "react";
import { Database, UserPlus, Search } from "lucide-react";

const RFIDTabs = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div className="flex gap-2">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${activeTab === "dataSiswa" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`}
          onClick={() => setActiveTab("dataSiswa")}
        >
          <Database size={16} />
          Data Siswa
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${activeTab === "daftarkanRFID" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`}
          onClick={() => setActiveTab("daftarkanRFID")}
        >
          <UserPlus size={16} />
          Daftarkan RFID
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-3 top-2.5 text-gray-400">
          <Search size={16} />
        </span>
      </div>
    </div>
  );
};

export default RFIDTabs;
