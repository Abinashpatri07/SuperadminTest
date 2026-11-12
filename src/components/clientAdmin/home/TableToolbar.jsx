import {
  RefreshCw,
  List,
  CalendarDays,
  Trash2,
  Search,
  Upload,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

function TableToolbar() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedType, setSelectedType] = useState("pdf");

  const dropdownRef = useRef();

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowExportModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
      {/* Left Side */}
      <div className="flex gap-2 flex-wrap">
        <button className="px-4 py-2 bg-gray-200 rounded-lg text-sm">
          All
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg text-sm">
          <RefreshCw size={16} />
          Refresh
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg text-sm">
          <List size={16} />
          Sort by Name
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg text-sm">
          <CalendarDays size={16} />
          Sort by Date
        </button>

        {/* <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg text-sm">
          <Trash2 size={16} />
          Trash
        </button> */}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center bg-gray-200 px-3 py-2 rounded-lg">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm"
          />
          <Search size={16} className="text-gray-500" />
        </div>

        {/* Export Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExportModal(!showExportModal);
            }}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            <Upload size={16} />
            Export
          </button>

          {/* Dropdown Panel */}
          {showExportModal && (
            <div className="absolute right-full mr-2 top-0 w-56 bg-white border rounded-xl shadow-lg z-50 p-4">
              {/* Title */}
              <h3 className="text-sm font-medium mb-3">Select file type</h3>

              {/* Options */}
              <div className="flex gap-2 mb-4">
                {/* PDF */}
                <div
                  onClick={() => setSelectedType("pdf")}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer flex-1 justify-center ${
                    selectedType === "pdf"
                      ? "border-[#01026E] bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <FileText size={16} className="text-red-500" />
                  <span className="text-xs">PDF</span>
                </div>

                {/* CSV */}
                <div
                  onClick={() => setSelectedType("csv")}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer flex-1 justify-center ${
                    selectedType === "csv"
                      ? "border-[#01026E] bg-blue-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FileText size={16} className="text-green-500" />
                  <span className="text-xs">CSV</span>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    console.log("Download:", selectedType);
                    setShowExportModal(false);
                  }}
                  className="bg-[#01026E] text-white px-4 py-1.5 rounded-lg text-sm hover:opacity-90"
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

export default TableToolbar;
