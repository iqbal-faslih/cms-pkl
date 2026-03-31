import React from "react";
import { Link } from 'react-router-dom';
import { Plus, Search } from "lucide-react";
import TablePostingan from "../../components/TablePostingan";
import FilterControls from "../../components/FilterControls";
import usePostManagement from "../../hooks/usePostManagement";

export default function ManajemenPost() {
  const {
    dataPostingan,
    filteredData, 
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allCategories,
    clearFilters,
    handleEditClick,
    handleDeleteClick,
    isLoading,
    error
  } = usePostManagement();

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Memuat data postingan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gagal Memuat Data</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Semua Postingan</h1>
              <p className="text-sm font-medium text-[#16C098] mt-1">
                Seluruh postingan yang aktif
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <Link to="/superadmin/create-post">
              <button 
                className="flex items-center gap-2 h-9 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Buat Postingan Baru"
              >
                <Plus size={16} />
                Buat Postingan
              </button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <label htmlFor="search-input" className="sr-only">Cari postingan</label>
                <Search size={16} className="absolute left-3 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Cari disini..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    pl-9 pr-3 py-2 text-sm 
                    border border-gray-300 rounded-lg w-full md:w-64 
                    focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent 
                    transition-colors
                  "
                />
              </div>

              <FilterControls
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                allCategories={allCategories}
              />

              {selectedCategory && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <TablePostingan
            data={paginatedData}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            currentPage={currentPage}
            totalPages={totalPages} 
            goToPage={goToPage}
            filteredDataLength={filteredData.length}
            dataPostinganLength={dataPostingan.length}
          />
        </div>
      </div>
    </div>
  );
}