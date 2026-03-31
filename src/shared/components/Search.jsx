import React, { useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { debounce } from "@/shared/utils/debounce";

const Search = ({
  placeholder = "Search Here...",
  value = "",
  onChange = () => {},
  iconPosition = "left",
  showDivider = true,
  className = "",
  inputClass = "",
  iconClass = "",
}) => {
  const debouncedChange = useMemo(
    () =>
      debounce((text) => {
        onChange(text);
      }, 300),
    [onChange]
  );

  const handleChange = (e) => {
    debouncedChange(e.target.value);
  };

  return (
    <div className={`flex-1 min-w-0`}>
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md
          bg-[#f7f9fa] hover:bg-gray-100
          focus-within:ring-2 focus-within:ring-indigo-300
          focus-within:border focus-within:border-indigo-400
          transition-all duration-200
          ${className}
        `}
      >
        {iconPosition === "left" && (
          <FiSearch className={`text-lg shrink-0 text-[#3E80F8] ${iconClass}`} />
        )}

        <input
          type="text"
          placeholder={placeholder}
          defaultValue={value}
          onChange={handleChange}
          className={`flex-1 min-w-0 bg-transparent text-sm outline-none ${inputClass}`}
        />

        {iconPosition === "right" && (
          <>
            {showDivider && <span className="h-5 w-px bg-gray-300 mx-1" />}
            <FiSearch className={`text-lg shrink-0 ${iconClass}`} />
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
