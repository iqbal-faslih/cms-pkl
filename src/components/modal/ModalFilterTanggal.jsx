import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { useModalTanggalFilter } from "../../hooks/useModalTanggalFilter";

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const formatDateForDisplay = (date) => {
  if (!date) return "";
  return format(date, "d MMMM yyyy");
};


const ModalTanggalFilter = ({ isOpen, onClose, onApplyFilter }) => {
  const {
    dateRange,
    filterOption,
    handleDateChange,
    handlePresetChange,
    handleApply,
  } = useModalTanggalFilter({ isOpen, onClose, onApplyFilter });

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-xl p-4 w-[750px] max-w-[90vw]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="overflow-auto">
            <DateRangePicker
              ranges={dateRange}
              onChange={handleDateChange}
              months={1}
              direction="horizontal"
              rangeColors={["#5932EA"]}
            />
        </div>

        <div className="flex flex-col space-y-4 w-full">
          <h3 className="text-lg font-semibold text-center md:text-left">
            Select Date Range:
          </h3>
          <select
            value={filterOption}
            onChange={handlePresetChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5932EA] cursor-pointer"
          >
            <option value="Custom">Custom</option>
            <option value="Hari Ini">Hari Ini</option>
            <option value="Minggu Ini">Minggu Ini</option>
            <option value="Bulan Ini">Bulan Ini</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start:
            </label>
            <input
              type="text"
              readOnly
              value={
                dateRange[0].startDate
                  ? formatDateForDisplay(dateRange[0].startDate)
                  : ""
              }
              className="w-full border border-[#5932EA] rounded-md shadow-sm p-2 text-gray-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End:
            </label>
            <input
              type="text"
              readOnly
              value={
                dateRange[0].endDate
                  ? formatDateForDisplay(dateRange[0].endDate)
                  : ""
              }
              className="w-full border border-[#5932EA] rounded-md shadow-sm p-2 text-gray-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleApply}
          className="px-6 py-2 rounded-md font-medium text-white bg-[#5932EA] hover:bg-[#4823d1] transition-colors duration-200"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ModalTanggalFilter;
