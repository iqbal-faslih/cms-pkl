import { useState, useEffect } from "react";
import { getPosts } from "../helpers/apiClient";


const usePost = (searchTerm) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;


  useEffect(() => {
    const fetchPosts = async () => {
    try {
      const response = await getPosts();
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        setError("Data yang diterima dari server tidak valid.");
        setPosts([]);
      }
    } catch (err) {
      setError("Gagal memuat data postingan.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, []);

const filteredPosts = posts.filter((post) =>
  (post.title || "").toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
  (post.excerpt || "").toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
  (post.content || "").toLowerCase().includes(searchTerm?.toLowerCase() || "")
);

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

return {
  currentPosts,
  loading,
  error,
  pageNumbers,
  currentPage,
  totalPages,
  paginate,
  setPosts,
};
};


export default usePost;