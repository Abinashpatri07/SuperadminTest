import {
  RefreshCw,
  List,
  CalendarDays,
  Search,
  Upload,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

function CandidateTableToolbar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  onRefresh,
  onExport,
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedType, setSelectedType]       = useState("PDF");
  const exportRef = useRef(null);

  // Close export dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = (type) => {
    onSortChange(sortBy === type ? "" : type);
  };

  const handleDownload = () => {
    setShowExportModal(false);
    onExport && onExport(selectedType);
  };

  return (
    <div className="flex justify-between items-center mb-4 flex-wrap gap-3">

      {/* ── LEFT SIDE ── */}
      <div className="flex gap-2 flex-wrap">

        {/* All */}
        <button
          onClick={() => onFilterChange("All")}
          className={`px-4 py-2 rounded-lg text-sm transition ${
            activeFilter === "All"
              ? "bg-[#02027A] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

        {/* Sort by Name */}
        <button
          onClick={() => handleSort("name")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            sortBy === "name"
              ? "bg-[#02027A] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <List size={16} />
          Sort by Name
        </button>

        {/* Sort by Date */}
        <button
          onClick={() => handleSort("date")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            sortBy === "date"
              ? "bg-[#02027A] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <CalendarDays size={16} />
          Sort by Date
        </button>

      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="flex items-center bg-gray-200 px-3 py-2 rounded-lg gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-36 placeholder:text-gray-500"
          />
          <Search size={16} className="text-gray-500 shrink-0" />
        </div>

        {/* Export */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExportModal((v) => !v);
            }}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            <Upload size={16} />
            Export
          </button>

          {showExportModal && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 p-4">
              <h3 className="text-sm font-medium mb-3">Select file type</h3>

              <div className="flex gap-2 mb-4">
                {/* PDF */}
                <div
                  onClick={() => setSelectedType("PDF")}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer flex-1 justify-center transition ${
                    selectedType === "PDF"
                      ? "border-[#01026E] bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <FileText size={16} className="text-red-500" />
                  <span className="text-xs">PDF</span>
                </div>

                {/* CSV */}
                <div
                  onClick={() => setSelectedType("CSV")}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer flex-1 justify-center transition ${
                    selectedType === "CSV"
                      ? "border-[#01026E] bg-blue-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FileSpreadsheet size={16} className="text-green-500" />
                  <span className="text-xs">CSV</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDownload}
                  className="bg-[#01026E] text-white px-4 py-1.5 rounded-lg text-sm hover:opacity-90 transition"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CandidateTableToolbar;
