import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  label = "data",
}) {
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages + 1) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }

      if (currentPage > maxVisiblePages + 1) {
        pages.push("ellipsis-1");
      }

      if (currentPage > maxVisiblePages && currentPage < totalPages) {
        pages.push(currentPage);
      }

      if (currentPage < totalPages - 1) {
        pages.push("ellipsis-2");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between py-4">
      <small className="text-[#B5B7C0] text-sm">
        Menampilkan {end} dari {totalItems} {label}
      </small>

      <nav>
        <ul className="flex gap-2 items-center">
          <li>
            <button
              className={`flex h-[35px] hover:text-[#306bff] hover:border-[#306bff] border border-[#EEEEEE] items-center px-3 rounded py-2 text-sm bg-[#F5F5F5] transition-colors ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </li>

          {pageNumbers.map((page) => {
            if (typeof page === "string" && page.startsWith("ellipsis")) {
              return (
                <li key={page}>
                  <span className="px-3 py-2 h-[32px] flex items-center text-gray-400">
                    ...
                  </span>
                </li>
              );
            }

            return (
              <li key={page}>
                <button
                  className={`px-4 py-2 h-[35px] cursor-pointer transition-colors border duration-200 rounded flex items-center text-sm justify-center ${
                    page === currentPage
                      ? "bg-[#306bff] border-[#306bff] text-white"
                      : "bg-[#F5F5F5] text-black hover:text-[#306bff] hover:border-[#306bff] border-[#EEEEEE]"
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}

          <li>
            <button
              className={`flex h-[35px] hover:text-[#306bff] hover:border-[#306bff] border border-[#EEEEEE] items-center px-3 rounded py-2 text-xs bg-[#F5F5F5] transition-colors ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
