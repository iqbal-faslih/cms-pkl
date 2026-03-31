import React from "react";
import { Link } from "react-router-dom";
import useUiStore from "../../stores/useUiStore";


const ExpandableSection = ({ title, sectionName, children }) => {
  const isOpen = useUiStore((state) => state.isSectionOpen[sectionName]);
  const toggleSection = useUiStore((state) => state.toggleSection);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div
        className="flex justify-between items-center cursor-pointer mb-6"
        onClick={() => toggleSection(sectionName)}
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const SidebarPost = ({ searchTerm, setSearchTerm, posts }) => {
  const safePosts = posts || [];
  const filteredPosts = safePosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(
     filteredPosts.reduce(
      (map, post) => map.set(post.category, (map.get(post.category) || 0) + 1),
      new Map()
    )
  ).map(([name, count]) => ({ name, count }));

  const popularTags = Array.from(new Set(filteredPosts.flatMap(post => post.tags || [])));

  return (
    <aside className="space-y-10">
      {/* Search box */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Post..."
            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15.5 14.5L22 21" />
            <circle cx="10" cy="10" r="8" />
          </svg>
 
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <ExpandableSection title="Categories" sectionName="categories">
        {categories.length > 0 ? (
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li key={cat.name} className="flex justify-between items-center text-gray-700">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <Link to={`/category/${cat.name.toLowerCase()}`} className="hover:text-blue-600 transition text-sm">
                    {cat.name}
                  </Link>
                </div>
                <span className="text-sm text-gray-500">({cat.count})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No categories found</p>
        )}
      </ExpandableSection>

      {/* Popular Tags */}
      <ExpandableSection title="Popular Tags" sectionName="tags">
        {popularTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag.toLowerCase()}`}
                className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No tags available</p>
        )}
      </ExpandableSection>
    </aside>
  );
};

export default SidebarPost;
