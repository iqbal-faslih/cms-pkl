import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Eye, EyeOff } from 'lucide-react';
import { GoImage } from "react-icons/go";
import { FaRegCalendarDays } from "react-icons/fa6";
import usePostForm from '../../hooks/usePostForm';
import PostEditor from '../../components/PostEditor';
import TagInput from '../../components/TagInput';
import Notifikasi from '../../shared/components/modal/NotifikasiModal';

export default function PostForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const {
    postData,
    handleChange,
    handleContentChange,
    handleTagChange,
    handleSubmit,
    isSubmitting,
    wordCount,
    readingTime,
    isLoading,
    setPostData
  } = usePostForm(isEdit ? id : null);

  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddMediaClick = () => fileInputRef.current.click();

  const handleMediaSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setPostData((prev) => ({ ...prev, featuredImage: reader.result }));
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="p-6 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  /* =======================================================
   * PREVIEW INLINE DISPLAY
   * ======================================================= */
  const PostPreviewInline = () => (
    <div className="space-y-5">

      {/* 1️⃣ GAMBAR + TANGGAL */}
      {postData.featuredImage && (
        <div className="space-y-2">
          <img
            src={postData.featuredImage}
            className="w-full rounded-xl shadow-md object-cover"
            alt="featured"
          />

          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
            <FaRegCalendarDays size={18} className="text-blue-600" />
            <span>
              {new Date(postData.createdAt || new Date()).toLocaleDateString(
                "id-ID",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>
          </div>
        </div>
      )}

      {/* 2️⃣ JUDUL */}
      <h1 className="text-3xl font-bold text-gray-900 break-words">
        {postData.judul || "Tanpa Judul"}
      </h1>

      {/* 3️⃣ KONTEN */}
      <div
        className="prose max-w-none text-gray-800 leading-relaxed break-words prose-img:rounded-xl prose-img:shadow"
        dangerouslySetInnerHTML={{ __html: postData.konten || "" }}
      />

      {/* 4️⃣ TAG */}
      {postData.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3">
          {postData.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>

      {/* Preview button mobile */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 w-full justify-center bg-gray-100 text-gray-700 rounded-xl border hover:bg-gray-200"
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          {showPreview ? "Sembunyikan Preview" : "Lihat Preview"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* =================== PANEL FORM =================== */}
        <div className={`${showPreview ? "hidden lg:flex" : "flex"} flex-1`}>
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 lg:p-7 flex flex-col gap-6">

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                  {isEdit ? "Edit Postingan" : "Tambah Postingan Baru"}
                </h1>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-10 px-5 flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg text-sm"
                >
                  {isSubmitting ? "Menyimpan..." : isEdit ? "Update Post" : "Post"}
                </button>
              </div>

              {/* Add Media */}
              <button
                onClick={handleAddMediaClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 w-fit"
              >
                <GoImage className="w-5 h-5" />
                Add Media
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleMediaSelected}
              />

              {/* ================= INPUT JUDUL ================= */}
              <div className="relative">
                <textarea
                  name="judul"
                  value={postData.judul}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Judul Postingan"
                  className="
                    w-full 
                    text-2xl lg:text-3xl 
                    font-bold 
                    text-gray-900 
                    placeholder-gray-400 
                    border-b border-gray-200 
                    pb-2 
                    focus:outline-none 
                    resize-none 
                    overflow-hidden 
                    leading-tight 
                    break-words
                  "
                  rows={1}
                />
                <Edit2 size={20} className="absolute right-0 top-2 text-gray-400" />
              </div>

              {/* Editor */}
              <PostEditor
                content={postData.konten}
                onContentChange={handleContentChange}
              />

              {/* Info Word */}
              <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                <span>Jumlah Kata: {wordCount}</span>
                <span>Waktu Baca: ~{readingTime} min</span>
              </div>

              {/* Tag */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tag</h3>
                <TagInput
                  tags={postData.tags}
                  onTagsChange={handleTagChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================== PANEL PREVIEW =================== */}
        <div className={`${!showPreview ? "hidden lg:block" : "block"} w-full lg:w-1/2`}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:p-7">
            <PostPreviewInline />
          </div>
        </div>

      </div>
    </>
  );
}
