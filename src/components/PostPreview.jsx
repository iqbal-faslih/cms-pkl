import React from 'react';

export default function PostPreview({ postData }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
      <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
        <h3 className="text-2xl font-bold mb-2">{postData.judul || "Judul Postingan"}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
       <div
          className="prose prose-sm max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: postData?.konten || "" }}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.isArray(postData.tags) && postData.tags.length > 0 ? (
            postData.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">Belum ada tag</span>
          )}
        </div>
      </div>
    </div>
  );
}