import React from "react";
import { Plus } from "lucide-react";
import PrimaryButton from "../button/PrimaryButton";
import { formatMonthYear } from "../../utils/dateUtils";

const CalendarHeader = ({ 
  currentDate, 
  onPrev, 
  onNext, 
  onToday, 
  onAddJurnal 
}) => {
  return (
    <div className="flex items-center justify-between px-6">
      <div className="flex items-center py-2 justify-center gap-5">    
        <div className="flex items-center justify-center gap-1">
          <h2 className="text-4xl font-bold text-sky-800 mr-6 uppercase">
            {formatMonthYear(currentDate)}
          </h2>
          <div className="flex items-center justify-center">
            <button className="nav-btn prev" onClick={onPrev}>
              <span>‹</span>
            </button>
            <button className="nav-btn next" onClick={onNext}>
              <span>›</span>
            </button>
          </div>
        </div>    
        <PrimaryButton 
          onClick={onToday}
          rounded="rounded-lg"
        >
          Today
        </PrimaryButton>
      </div>

      <div className="flex items-center justify-center">
        <PrimaryButton
          onClick={onAddJurnal}
          icon={Plus}
          iconPosition="left"
          rounded="rounded-lg"
        >
          Tambah Jurnal
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CalendarHeader;