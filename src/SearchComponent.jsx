import React from 'react';
import { Search } from 'lucide-react';

const SearchComponent = ({
  placeholder = "Search...",
  onChange,
  className = "",
  inputClassName = "",
  iconClassName = ""
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full pl-10 pr-4 py-2 text-sm border-0 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClassName}`}
      />
      <Search
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 font-extrabold h-5 w-5 ${iconClassName}`}
      />
    </div>
  );
};

export default SearchComponent;
