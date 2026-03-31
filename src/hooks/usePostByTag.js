import { useState, useEffect } from "react";
import { getPostsByTag } from "../helpers/apiClient";

export const usePostsByTag = (tagName) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tagName) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPostsByTag(tagName);
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts by tag:", err);
        setError("Gagal memuat postingan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tagName]);

  return { posts, loading, error };
};