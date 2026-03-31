import React from "react";
import { Plus } from "lucide-react";
import SortButton from "../../../../shared/components/button/Sort.jsx";

const DivisiToolbar = ({
  setSortOption,
  setOpenActionId,
  onOpenAddPage,
}) => (
  <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
    <div>
      <h1 className="text-xl font-bold text-gray-800">Divisi Perusahaan</h1>
      <p className="text-sm text-teal-500">Kelola divisi perusahaan</p>
    </div>

    <div className="flex items-center gap-3">
      <SortButton onSelect={setSortOption} onOpen={() => setOpenActionId(null)} />
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={onOpenAddPage}
      >
        <Plus size={18} />
        <span className="text-sm font-medium">Tambah Divisi</span>
      </button>
    </div>
  </div>
);

export default DivisiToolbar;
