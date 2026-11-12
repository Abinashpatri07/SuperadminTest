import { Search, Download } from "lucide-react";

export default function AnalyticsToolbar({ search, onSearch, onDownload }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-800">Analytics & Insights</h2>
        <p className="text-xs text-gray-400">Track Insights And Verification Performance.</p>
      </div>

      <div className="flex items-center gap-3">
        {/* SEARCH */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-52">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search"
            className="text-sm text-gray-700 outline-none w-full placeholder-gray-400"
          />
        </div>

        {/* DOWNLOAD */}
        <button
          onClick={onDownload}
          className="flex items-center gap-2 border border-[#02027A] text-[#02027A] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
}