import { AlertCircle, RotateCcw } from "lucide-react";

const AlertVerification = ({ message, onReload, reloadButton = false }) => {
  return (
    <div className="w-full h-14 bg-[#FFCDCD] rounded-2xl flex justify-between text-[#EE0202] font-medium text-2xl py-1 px-5 items-center mb-4 absolute top-0">
      <div className="flex gap-3 items-center">
        <AlertCircle size={20} />
        <h1 className="text-red-600 font-semibold text-sm">{message}</h1>
      </div>
      {reloadButton && 
        <button
        onClick={onReload}
        className="text-[#0D5EF4]"
      >
        <RotateCcw size={20} />
      </button>
      }
      
    </div>
  );
};

export default AlertVerification;
