import { useRef, useState, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";

const MitraFilterBar = ({
  selectedCategory,
  onSelectCategory,
  onAddClick,
  categories,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Mitra Terdaftar</h2>
        <div className="flex items-center space-x-2">
          <button
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm flex items-center transition duration-200"
            onClick={onAddClick}
          >
            <Plus size={14} className="mr-1" /> Tambah Mitra
          </button>

          <div className="relative" ref={categoryDropdownRef}>
            <button
              className="bg-white px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center transition duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowCategoryDropdown((v) => !v);
              }}
            >
              <span className="mr-1">Kategori:</span>
              <span className="font-medium">{selectedCategory}</span>
              <ChevronDown
                size={14}
                className={`ml-1 transition-transform duration-200 ${
                  showCategoryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showCategoryDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 overflow-hidden">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      onSelectCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat}
                    {selectedCategory === cat && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitraFilterBar;