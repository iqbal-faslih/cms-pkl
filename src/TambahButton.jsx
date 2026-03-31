import React from "react";
import { Plus } from "lucide-react";

const AddButton = ({ onClick, children = "Tambah Data", className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-8 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl ${className}`}
      aria-label="Tambah Data"
      title="Tambah Data"
    >
      <Plus size={18} />
      <span>{children}</span>
    </button>
  );
};

export default AddButton;