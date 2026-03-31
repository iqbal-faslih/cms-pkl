import { getCardColor, getMemberCardColor } from "../../../helpers/piketHelpers";

export default function DayCard({ dayName, members, searchQuery }) {
  // Get day icon based on day name
  const getDayIcon = (day) => {
    const icons = {
      "senin": "S",
      "selasa": "S", 
      "rabu": "R",
      "kamis": "K",
      "jumat": "J"
    };
    return icons[day.toLowerCase()];
  };

  const highlightText = (text, query) => {
    if (!query || !query.trim()) {
      return text;
    }

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <span key={index} className="bg-yellow-200 font-semibold text-yellow-800 px-1 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const filteredMembers = members?.filter(member => {
    if (!member || !member.nama) return false;
    return member.nama.toLowerCase().includes(searchQuery?.toLowerCase() || "");
  }) || [];

  const displayMembers = searchQuery ? filteredMembers : (members || []);
  const hasData = displayMembers.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with day name and icon */}
      <div className="p-4 pb-5 flex flex-col gap-3">

        <div className="flex items-center gap-2 text-gray-800">
          <span className={`text-sm font-bold py-1 px-2 rounded-md ${getMemberCardColor(dayName)}`}>
            {getDayIcon(dayName)}
          </span>
          <div>
            <h3 className="font-semibold capitalize text-lg">
              {dayName}
            </h3>
          </div>
        </div>
      
      {/* Members list */}
      <div className={`p-4 min-h-[120px] ${getCardColor(dayName)} rounded-lg`}>
        {hasData ? (
          <div className="space-y-2">
            {displayMembers.map((member, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-3 transition-all duration-200 ${getMemberCardColor(dayName)} border border-opacity-20`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {highlightText(member.nama || member, searchQuery)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <div className="text-gray-400 text-sm">
              {searchQuery ? (
                <>
                  <div className="mb-1">🔍</div>
                  <div>Tidak ada siswa dengan nama</div>
                  <div className="font-medium">"{searchQuery}"</div>
                </>
              ) : (
                <>
                  <div className="mb-1">📅</div>
                  <div>Tidak ada jadwal piket</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search result indicator */}
      {searchQuery && hasData && (
        <div className="px-4 pb-4">
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
            {filteredMembers.length} dari {members?.length || 0} siswa
          </div>
        </div>
      )}
      </div>
    </div>
  );
}