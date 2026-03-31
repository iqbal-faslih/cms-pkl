import React from "react";
import usePost from "../../hooks/usePost";
import PostCard from "../cards/PostCard";

const PostList = ({ searchTerm }) => {
  const {
    currentPosts,
    loading,
    error,
    pageNumbers,
    currentPage,
    totalPages,
    paginate,
  } = usePost(searchTerm); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-xl text-gray-500">Memuat data postingan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <PostCard key={post.id || post.slug} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Tidak ada postingan yang cocok dengan pencarian Anda.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-start items-center mt-12 space-x-2">
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded-md transition duration-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            &larr;
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md transition duration-300 ${
                currentPage === number
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded-md transition duration-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            &rarr;
          </button>
        </div>
      )}
    </>
  );
};

export default PostList;
