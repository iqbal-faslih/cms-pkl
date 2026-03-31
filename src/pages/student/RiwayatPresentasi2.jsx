import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Search, Filter } from "lucide-react";
import { useRiwayatPresentasi } from "../../hooks/useRiwayatPresentasi";
import { isValidUrl } from "../../helpers/riwayatPresentasiHelper";
import { useProjectFilter, useStatusFilter, useSearch, usePagination, useFilteredMeetings } from "../../hooks/riwayatPresentasiHooks";
import { highlightSearchTerm, getStatusStyle } from "../../helpers/riwayatPresentasiUtils";

export default function MeetingScheduleTable() {
  const { allMeetings, availableProjects, isLoading, error, refetch } = useRiwayatPresentasi();


  const availableStatuses = [...new Set(allMeetings.map(m => m.status))];

  const statusFilter = useStatusFilter(availableStatuses);
  const projectFilter = useProjectFilter(availableProjects);

  const search = useSearch();

  
  const filteredMeetings = useFilteredMeetings(allMeetings, projectFilter, statusFilter, search);
  
  const pagination = usePagination(filteredMeetings);

  const handleFilterChange = (callback) => {
    callback();
    pagination.resetToFirstPage();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="text-red-500 mb-4">
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
          </div>
          <div className="text-red-500 text-center">
            <p className="font-semibold mb-2">Terjadi Kesalahan</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-[#0069AB] text-white rounded-lg hover:bg-[#0069AB]/90 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg">
            <div className="relative">
              <button 
                className="flex items-center gap-2 border-r border-gray-300 p-3 hover:bg-gray-50"
                onClick={() => projectFilter.setMainFilterOpen(!projectFilter.mainFilterOpen)}
              >
                <span className="text-gray-500"><Filter size={18} /></span>
                <span><ChevronDown size={18} /></span>
              </button>
              
              {projectFilter.mainFilterOpen && (
                <div className="absolute left-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg z-20">
                  <div className="p-1">
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={projectFilter.selectAll}
                        onChange={() => handleFilterChange(projectFilter.handleSelectAll)}
                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">Select all</span>
                    </label>
                    
                    {/* Project Options */}
                    {availableProjects.map((project) => (
                      <label 
                        key={project} 
                        className="flex items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={projectFilter.selectAll || projectFilter.selectedProjects.includes(project)}
                          onChange={() => handleFilterChange(() => projectFilter.handleProjectToggle(project))}
                          className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{project}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Search Input */}
            <div className="flex items-center flex-1">
              <span className="pl-3 text-gray-500"><Search size={18} /></span>
              <input
                type="text"
                value={search.searchQuery}
                onChange={(e) => {
                  search.handleSearchChange(e);
                  pagination.resetToFirstPage();
                }}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none rounded-md"
                placeholder="Search"
              />
              {search.searchQuery && (
                <button
                  onClick={() => {
                    search.clearSearch();
                    pagination.resetToFirstPage();
                  }}
                  className="pr-3 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  ×
                </button>
              )}
              <span className="bg-gray-200 py-1 px-2 opacity-80 text-xs rounded-sm mr-1">/</span>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex justify-center items-center gap-2">
          <p className="text-sm">Filter by:</p>
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm"
              onClick={() => statusFilter.setStatusFilterOpen(!statusFilter.statusFilterOpen)}
            >
              Status<ChevronDown className="ml-2 h-4 w-4" />
            </button>
            {statusFilter.statusFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-20">
                <div className="p-1">
                  {/* Select All Status */}
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={statusFilter.selectAllStatus}
                      onChange={() => handleFilterChange(statusFilter.handleSelectAllStatus)}
                      className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Select all</span>
                  </label>
                  
                  {/* Status Options */}
                  {statusFilter.availableStatuses.map((status) => (
                    <label 
                      key={status} 
                      className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilter.selectAllStatus || statusFilter.selectedStatuses.includes(status)}
                        onChange={() => handleFilterChange(() => statusFilter.handleStatusToggle(status))}
                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Project</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Hari dan Tanggal</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Jam</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Metode</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Lokasi/Link Zoom</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.currentItems.length > 0 ? (
                pagination.currentItems.map((meeting) => {
                  const statusStyle = getStatusStyle(meeting.status);
                  return (
                    <tr key={meeting.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                        {highlightSearchTerm(meeting.project, search.searchQuery)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-center">
                        {highlightSearchTerm(meeting.date, search.searchQuery)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-center">
                        {highlightSearchTerm(meeting.time, search.searchQuery)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-center">
                        {highlightSearchTerm(meeting.method, search.searchQuery)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        {meeting.method === "Online" ? (
                          isValidUrl(meeting.location) ? (
                            <a href={meeting.location} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                              Join Zoom Meeting
                            </a>
                          ) : (
                            <span className="text-blue-500">{highlightSearchTerm(meeting.location, search.searchQuery)}</span>
                          )
                        ) : (
                          <span className="text-gray-500">{highlightSearchTerm(meeting.location, search.searchQuery)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center">
                          <span className={`h-2 w-2 ${statusStyle.dot} rounded-full mr-2`}></span>
                          <span className={`text-sm ${statusStyle.text}`}>
                            {highlightSearchTerm(meeting.status, search.searchQuery)}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {search.searchQuery ? (
                      <>
                        Tidak ada data yang cocok dengan pencarian "<strong>{search.searchQuery}</strong>"
                        <button 
                          onClick={() => {
                            search.clearSearch();
                            pagination.resetToFirstPage();
                          }}
                          className="ml-2 text-blue-500 hover:underline"
                        >
                          Clear search
                        </button>
                      </>
                    ) : !projectFilter.selectAll && projectFilter.selectedProjects.length > 0 ? (
                      `Tidak ada data presentasi untuk project yang dipilih`
                    ) : !statusFilter.selectAllStatus && statusFilter.selectedStatuses.length > 0 ? (
                      `Tidak ada data presentasi untuk status yang dipilih`
                    ) : (
                      "Belum ada riwayat presentasi"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {pagination.indexOfFirstItem + 1} to {Math.min(pagination.indexOfLastItem, filteredMeetings.length)} of {filteredMeetings.length} entries
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={pagination.prevPage} 
                disabled={pagination.currentPage === 1} 
                className={`px-2 py-2 rounded-md ${pagination.currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(pagination.totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (pageNumber === 1 || pageNumber === pagination.totalPages || (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => pagination.paginate(pageNumber)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        pagination.currentPage === pageNumber ? "bg-blue-50 text-blue-600" : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (pageNumber === pagination.currentPage - 2 || pageNumber === pagination.currentPage + 2) {
                  return <span key={pageNumber} className="px-4 py-2 text-sm text-gray-700">...</span>;
                }
                return null;
              })}
              <button 
                onClick={pagination.nextPage} 
                disabled={pagination.currentPage === pagination.totalPages} 
                className={`px-2 py-2 rounded-md ${pagination.currentPage === pagination.totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdowns */}
      {(projectFilter.mainFilterOpen || statusFilter.statusFilterOpen) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            projectFilter.setMainFilterOpen(false);
            statusFilter.setStatusFilterOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}