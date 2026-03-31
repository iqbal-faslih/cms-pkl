import { useEffect, useState } from "react";
import { getPostDetail } from "../helpers/apiClient";

export const usePostDetail = (id) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostDetail(id);
        setPost(response.data);
      } catch (err) {
        setError("Gagal memuat detail artikel.");
        console.error("Error fetching post detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return { post, loading, error };
};
