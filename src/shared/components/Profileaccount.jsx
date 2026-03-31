import { PencilLine } from "lucide-react";

export default function Profileaccount({ profileImage, onEdit, isEdit = false }) {
  return (
    <div className="p-3 rounded-full border-[2px] border-[#306BFF]">
      <div className="p-2 rounded-full relative border-[2px] border-[#306BFF]">
        <div className="size-50 rounded-full bg-gray-400 border-[5px] border-[#306BFF] overflow-hidden">
          <img
            src={profileImage}
            alt="Foto Profil"
            className="size-full object-cover"
          />
        </div>

        {!isEdit && (
          <button
            className="p-2 rounded-full bg-[#0D5EF4] hover:bg-[#0D42EF] flex items-center justify-center absolute bottom-5 right-5 cursor-pointer"
            onClick={onEdit}
          >
            <PencilLine size={20} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
