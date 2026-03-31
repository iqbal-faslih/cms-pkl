import { useState, useEffect, } from "react";
import { Filter } from "lucide-react";
import { useJobs } from "../../hooks";
import JobsCard from "../cards/JobsCard";
import JobCardSkeleton from "../cards/JobCardSkeleton";
import VacancyHeader from "../ui/VacancyHeader";
import { isLowonganComingSoon } from "../../helpers/lowonganStatusHelper";

export default function JobListingPage() {
  const { jobs, divisions, loading } = useJobs();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = selected.length === 0
    ? jobs
    : jobs.filter((j) =>
        selected.some((id) => {
          const div = divisions.find((d) => d.id === id);
          return div && div.name.toLowerCase() === j.divisi.toLowerCase();
        })
      );
  const orderedFiltered = [...filtered].sort(
    (a, b) =>
      Number(isLowonganComingSoon(a)) - Number(isLowonganComingSoon(b))
  );

  const currentJobs = orderedFiltered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(orderedFiltered.length / perPage);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [selected]);

  return (
    <div className="px-5 xl:px-6 py-10 md:py-20 max-w-6xl ml-7 md:ml-10 lg:ml-10 xl:mx-auto">
      
      {/* Header with Filter Dropdown */}
       <VacancyHeader
        divisions={divisions}
        selected={selected}
        setSelected={setSelected}
        filteredCount={filtered.length}
      />

      {/* Job Listings */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: perPage }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : currentJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-gray-400 mb-4">
            <Filter size={48} />
          </div>
          <p className="text-xl text-gray-600 text-center">
            Tidak ada lowongan ditemukan
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Coba ubah filter atau hapus beberapa kriteria pencarian
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job) => (
            <JobsCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  n === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
