import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ClientPagination({
  total = 40,
  perPage = 9,
  currentPage = 1,
  onPageChange,
  onPerPageChange,
}) {
  const [page, setPage] = useState(currentPage);
  const [limit, setLimit] = useState(perPage);

  /* TOTAL PAGES */
  const totalPages = Math.ceil(total / limit);

  /* SYNC EXTERNAL PAGE */
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  /* PAGE CHANGE */
  const handlePage = (p) => {
    if (isNaN(p) || p < 1 || p > totalPages) return;
    setPage(p);
    if (onPageChange) onPageChange(p);
  };

  /* LIMIT CHANGE */
  const handleLimitChange = (e) => {
    const val = Number(e.target.value);
    if (isNaN(val) || val <= 0) return;
    setLimit(val);
    setPage(1);
    if (onPerPageChange) onPerPageChange(val);
  };

  /* PAGE LIST */
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-2">
      
      {/* LEFT SIDE: Showing Text with Dropdown-like active page box */}
      <div className="flex items-center gap-3 text-sm text-[#8A92A6]">
        <span>Showing</span>
        <div className="relative">
          <select
            value={limit}
            onChange={handleLimitChange}
            className="appearance-none flex items-center justify-between w-14 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition outline-none"
          >
            {[9, 15, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <span>out of {total}</span>
      </div>

      {/* RIGHT SIDE: Pagination Buttons */}
      <div className="flex items-center gap-1">
        
        {/* Previous */}
        <button
          disabled={page === 1}
          onClick={() => handlePage(page - 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8A92A6] rounded-xl hover:text-[#01026E] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Pages */}
        <div className="flex items-center gap-1">
          {getPages().map((p, index) =>
            p === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => handlePage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  page === p
                    ? "bg-[#5E3BEE] text-white shadow-md hover:bg-[#4d30c4]"
                    : "text-gray-500 bg-transparent hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => handlePage(page + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8A92A6] rounded-xl hover:text-[#01026E] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}