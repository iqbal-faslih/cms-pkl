import { useState, useMemo } from "react";
import { Sun, Moon, Search, X } from "lucide-react";
import { FULL_DAY_LABELS } from "../../helpers/dateConstant";
import { useJadwalPiket } from "../../hooks/useJadwalPiket";
import { 
  createScheduleByDay, 
  getWorkingDays 
} from "../../helpers/piketHelpers";
import DayCard from "../../components/cards/student/DayCard";

export default function JadwalPiket() {
  const { shift, setShift, loading, error, scheduleData, refetch } = useJadwalPiket();
  const [searchQuery, setSearchQuery] = useState("");

  const allDays = getWorkingDays(FULL_DAY_LABELS);

  const scheduleByDay = createScheduleByDay(scheduleData[shift] || []);

  const filteredDays = useMemo(() => {
    if (!searchQuery.trim()) {
      return allDays;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return allDays.filter(dayName => {
      const dayLower = dayName.toLowerCase();
      const dayData = scheduleByDay[dayLower];
      
      if (!dayData?.members || dayData.members.length === 0) {
        return false;
      }

      return dayData.members.some(member => 
        member.nama && member.nama.toLowerCase().includes(query)
      );
    });
  }, [allDays, scheduleByDay, searchQuery]);

  const totalMatches = useMemo(() => {
    if (!searchQuery.trim()) {
      return 0;
    }

    const query = searchQuery.toLowerCase().trim();
    let count = 0;

    filteredDays.forEach(dayName => {
      const dayLower = dayName.toLowerCase();
      const dayData = scheduleByDay[dayLower];
      
      if (dayData?.members) {
        count += dayData.members.filter(member => 
          member.nama && member.nama.toLowerCase().includes(query)
        ).length;
      }
    });

    return count;
  }, [filteredDays, scheduleByDay, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden rounded-lg">
      {/* Header */}
      <div className="bg-[#0D5EF4] text-white px-6 pt-4 pb-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jadwal Piket Siswa</h1>
            <p className="opacity-80 text-sm">Mengetahui jadwal piket masing-masing</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-64 pl-10 pr-10 bg-white py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cari Nama Siswa..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Shift toggle buttons */}
        <div className="w-full p-3 rounded-lg bg-indigo-50 mb-6">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setShift("Pagi")}
              className={`px-6 w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                shift === "Pagi"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Sun className="w-4 h-4" />
              Pagi
            </button>

            <button
              onClick={() => setShift("Sore")}
              className={`px-6 w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                shift === "Sore"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Moon className="w-4 h-4" />
              Sore
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="max-w-6xl mx-auto mb-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  {filteredDays.length === 0 ? (
                    <>
                      Tidak ditemukan siswa dengan nama "<strong>{searchQuery}</strong>"
                    </>
                  ) : (
                    <>
                      Ditemukan <strong>{totalMatches}</strong> siswa dengan nama "<strong>{searchQuery}</strong>" 
                      di <strong>{filteredDays.length}</strong> hari
                    </>
                  )}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Hapus pencarian
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error: {error}</p>
            </div>
          </div>
        )}

        {/* Schedule grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {loading
            ? Array(allDays.length).fill(0).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md" >
                  <div className="p-4 pb-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-200 animate-pulse rounded-lg" />
                      <div className="w-20 h-7 bg-gray-200 animate-pulse rounded-lg" />
                    </div>
                    <div className="w-full h-50 bg-gray-200 animate-pulse rounded-lg" />

                  </div>
                </div>
              ))
            : filteredDays.length === 0 && searchQuery ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Search className="w-16 h-16 mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
                  <p className="text-sm">Coba gunakan kata kunci yang berbeda</p>
                </div>
              ) : (
                filteredDays.map((dayName) => {
                  const dayLower = dayName.toLowerCase();
                  const dayData = scheduleByDay[dayLower];
                  
                  return (
                    <DayCard
                      key={dayName}
                      dayName={dayName}
                      members={dayData?.members}
                      searchQuery={searchQuery}
                    />
                  );
                })
              )}
        </div>
      </div>
    </div>
  );
}