import { useState, useEffect } from "react";
import { getPostsByCategory } from "../helpers/apiClient";

export const usePostsByCategory = (categoryName) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPostsByCategory(categoryName);
        setPosts(response.data);
      } catch (err) {
        setError("Gagal memuat postingan.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [categoryName]);

  return { posts, loading, error };
};
