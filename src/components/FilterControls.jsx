import React from 'react';
import useFilterStore from '../stores/useFilterStore';

export default function FilterControls({ allCategories }) {
  const { selectedCategory, setSelectedCategory } = useFilterStore();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-by"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="">All</option>
        {allCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
