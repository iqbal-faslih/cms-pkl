import { useState, useCallback, useMemo, useEffect } from "react";
import { createPost, updatePost, getPostById } from "../helpers/apiClient";

const usePostForm = (postId = null) => {
  const [postData, setPostData] = useState({
    judul: "",
    konten: "",
    tags: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      setIsLoading(true);
      const fetchPostData = async () => {
        try {
          const response = await getPostById(postId);
          setPostData({
            judul: response.data.judul,
            konten: response.data.konten,
            tags: response.data.tags || [],
          });
        } catch (err) {
          setError("Gagal memuat data postingan. Silakan coba lagi.");
          console.error("Error fetching post data:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPostData();
    } else {
      setPostData({ judul: "", konten: "", tags: [] });
    }
  }, [postId]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({ ...prevData, [name]: value }));
    clearMessages();
  }, []);

  const handleContentChange = useCallback((content) => {
    setPostData((prevData) => ({ ...prevData, konten: content }));
    clearMessages();
  }, []);

  const handleTagChange = useCallback((newTags) => {
    setPostData((prevData) => ({ ...prevData, tags: newTags }));
    clearMessages();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      if (!postData.judul.trim()) {
        setError("Judul postingan tidak boleh kosong.");
        return;
      }
      if (!postData.konten.trim() || postData.konten === "<p></p>") {
        setError("Konten postingan tidak boleh kosong.");
        return;
      }

      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        if (postId) {
          await updatePost(postId, postData);
          setSuccess(true);
          console.log("Postingan berhasil diperbarui.");
        } else {
          await createPost(postData);
          setPostData({ judul: "", konten: "", tags: [] });
          setSuccess(true);
          console.log("Postingan berhasil dibuat.");
        }

        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setError("Anda tidak memiliki izin.");
        } else if (status === 404) {
          setError("Postingan tidak ditemukan.");
        } else {
          setError(
            err.response?.data?.message ||
              "Gagal menyimpan postingan. Silakan coba lagi."
          );
        }
        console.error("Error submitting post:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [postData, postId]
  );

  const wordCount = useMemo(() => {
    if (!postData.konten) return 0;
    const strippedContent = postData.konten
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&[a-zA-Z0-9#]+;/g, "")
      .trim();
    if (!strippedContent) return 0;
    const words = strippedContent
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  }, [postData.konten]);

  const readingTime = useMemo(() => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes || 1;
  }, [wordCount]);

  const resetForm = useCallback(() => {
    setPostData({ judul: "", konten: "", tags: [] });
    setError(null);
    setSuccess(false);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    postData,
    handleChange,
    handleContentChange,
    handleTagChange,
    handleSubmit,
    isSubmitting,
    error,
    success,
    wordCount,
    readingTime,
    setPostData,
    resetForm,
    clearMessages,
    isLoading,
  };
};

export default usePostForm;
