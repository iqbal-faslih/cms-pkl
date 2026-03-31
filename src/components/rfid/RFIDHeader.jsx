import React from "react";
import { CalendarDays, Download } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";

const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
  <button
    className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm"
    onClick={onClick}
    ref={ref}
    type="button"
  >
    <CalendarDays size={16} />
    {value
      ? new Date(value).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Pilih Tanggal"}
  </button>
));

const RFIDHeader = ({ selectedDate, setSelectedDate, filteredData, activeTab }) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-[#1D2939]">Pendataan RFID</h2>
          <p className="text-[#667085] text-sm mt-1">Kelola data RFID siswa magang dengan maksimal!</p>
        </div>

        <div className="flex items-center gap-3">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            customInput={<CustomButton />}
            dateFormat="dd MMMM yyyy"
            showPopperArrow={false}
          />
          <CSVLink
            data={filteredData}
            filename={`data_siswa_${activeTab === "dataSiswa" ? "dengan_rfid" : "belum_rfid"}.csv`}
            headers={[
              { label: "No", key: "id" },
              { label: "Nama Lengkap", key: "nama" },
              { label: "Email", key: "email" },
              { label: "Masa Magang", key: "masaMagang" },
              { label: "Sekolah", key: "sekolah" },
            ]}
          >
            <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
              <Download size={16} />
              Export
            </button>
          </CSVLink>
        </div>
      </div>

      <div className="border-b border-gray-200 my-5" />
    </div>
  );
};

export default RFIDHeader;
