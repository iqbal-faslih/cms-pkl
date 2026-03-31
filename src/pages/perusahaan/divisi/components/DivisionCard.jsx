import React from "react";
import { Pencil, CalendarDays, ChevronUp } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";

const DivisionCard = ({
  division,
  openActionId,
  setOpenActionId,
  onDelete,
  onDetail,
  onEdit,
}) => {
  const isOpen = openActionId === division.id;

  const toggleOpen = () => {
    setOpenActionId(isOpen ? null : division.id);
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition relative p-4">
      <div className="bg-blue-50 rounded-lg flex justify-center items-center h-32 mb-4 overflow-hidden">
        <img
          src={division?.cover || "/assets/img/Cover3.png"}
          alt={division.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="font-semibold text-base mb-1">{division.title}</h2>

      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 text-[#3e7ff7]" />
        <p className="text-gray-500 text-sm">{division.tanggal}</p>
      </div>

      <button
        className="w-full py-2 bg-[#304fff] text-white rounded flex items-center justify-center gap-2"
        onClick={toggleOpen}
      >
        Actions
        <ChevronUp
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-md z-10 overflow-hidden">
          <button
            className=" w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            onClick={onEdit}
          >
            <Pencil size={20} />
            Edit
          </button>

          <button
            className=" w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-black"
            onClick={onDelete}
          >
            <MdDelete size={20} />
            Delete
          </button>

          <button
            onClick={onDetail}
            className=" w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <IoEyeOutline size={20} />
            Lihat Detail
          </button>
        </div>
      )}
    </div>
  );
};

export default DivisionCard;
