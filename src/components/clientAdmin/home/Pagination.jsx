import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    let pages = [];

    if (totalPages <= 7) {
      return [...Array(totalPages).keys()].map((i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    // ✅ REMOVE DUPLICATES
    return [...new Set(pages)];
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-between pt-2">
      
      {/* LEFT SIDE: Showing Text with Dropdown-like active page box */}
      <div className="flex items-center gap-3 text-sm text-[#8A92A6]">
        <span>Showing</span>
        <div className="flex items-center justify-between w-14 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition">
          {currentPage}
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <span>out of {totalPages}</span>
      </div>

      {/* RIGHT SIDE: Pagination Buttons */}
      <div className="flex items-center gap-1">
        
        {/* Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8A92A6] rounded-xl hover:text-[#01026E] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Pages */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  currentPage === page
                    ? "bg-[#5E3BEE] text-white shadow-md hover:bg-[#4d30c4]"
                    : "text-gray-500 bg-transparent hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8A92A6] rounded-xl hover:text-[#01026E] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;