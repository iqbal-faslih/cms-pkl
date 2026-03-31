import React from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight  } from 'lucide-react';

export default function TablePostingan({ 
  data, 
  handleEditClick, 
  handleDeleteClick,
  currentPage, 
  totalPages, 
  goToPage,
  filteredDataLength, 
  dataPostinganLength 
}) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Postingan</h3>
        <p className="text-gray-500">Mulai dengan membuat postingan pertama Anda.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTags = (tags) => {
    if (!tags) return '-';
    
    let tagArray = [];
    if (Array.isArray(tags)) {
      tagArray = tags;
    } else if (typeof tags === 'string') {
      tagArray = tags.split(',').map(t => t.trim());
    }
    
    if (tagArray.length === 0) return '-';
    
    return tagArray.slice(0, 2).map((tag, index) => (
      <span
        key={index}
        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-1 mb-1"
      >
        {tag}
      </span>
    ));
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const start = (currentPage - 1) * filteredDataLength + 1;
  const end = Math.min(start + filteredDataLength - 1, dataPostinganLength);


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">
              Nomer
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">
              Judul Postingan
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">
              Tanggal Publikasi
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">
              Tag
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{String((currentPage - 1) * 10 + index + 1).padStart(3, '0')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs">
                  <div className="font-medium">
                    {truncateText(item.judul || item.title || item.name, 60)}
                  </div>
                  {item.konten || item.content ? (
                    <div className="text-gray-500 text-xs mt-1">
                      {truncateText(item.konten || item.content, 80)}
                    </div>
                  ) : null}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.created_at || item.tanggal_publikasi || item.date)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="flex flex-wrap">
                  {formatTags(item.tags || item.tag || item.category)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditClick(item.id)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-yellow-50"
                    title="Edit postingan"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Hapus postingan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
     <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of <span className="font-medium">{dataPostinganLength}</span> entries
        </div>

        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 text-sm rounded ${
            currentPage === i + 1 
            ? "bg-[#5932EA] text-white" 
            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
          ))}
        </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}