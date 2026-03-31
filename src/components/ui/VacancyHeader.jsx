import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";

export default function VacancyHeader({ 
  divisions, 
  selected, 
  setSelected, 
  filteredCount 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get selected division names for display
  const selectedDivisions = divisions.filter(div => selected.includes(div.id));

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center md:justify-start mb-6">
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} />
            <span className="text-xl font-medium flex items-center">
              Filter Divisi
              {selected.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {selected.length}
                </span>
              )}
            </span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Filter by Divisi</h3>
                  {selected.length > 0 && (
                    <button
                      onClick={() => setSelected([])}
                      className="text-sm text-[#0D5EF4] hover:text-[#0D42EF] font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {divisions.map((div) => {
                    const checked = selected.includes(div.id);
                    return (
                      <label 
                        key={div.id} 
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelected((prev) =>
                              checked 
                                ? prev.filter((id) => id !== div.id) 
                                : [...prev, div.id]
                            )
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          {div.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Filters Display */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 font-medium">Filtered by:</span>
          {selectedDivisions.map((div) => (
            <span
              key={div.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-[#0D5EF4] text-sm rounded-full"
            >
              {div.name}
              <button
                onClick={() => setSelected(prev => prev.filter(id => id !== div.id))}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}