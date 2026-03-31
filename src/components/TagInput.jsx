import React from 'react';

export default function TagInput({ tags, onTagsChange }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
        e.target.value = '';
      }
    }
  };

  const handleRemoveTag = (index) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span key={index} className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
            {tag}
            <button
              onClick={() => handleRemoveTag(index)}
              className="ml-2 text-blue-500 hover:text-blue-700"
              aria-label={`Hapus tag ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Tekan Enter untuk menambah tag"
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Input tag" 
      />
    </div>
  );
}