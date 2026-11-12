import React, { useState } from "react";
import { Search, SlidersHorizontal, Calendar, ChevronDown } from "lucide-react";

export default function AuditFilters({ onSearch, onModuleChange, onDateChange }) {
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("All Modules");
  const [date, setDate] = useState("Today");

  const modules = ["All Modules", "Verifications", "Billing", "Security", "Settings"];
  const dates = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Custom Range"];

  return (
    <div className="flex items-center justify-between bg-gray-100  gap-3 mb-0">

      {/* LEFT: Search */}
      <div className="flex items-center gap-2 w-96 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
        <Search size={16} className="text-gray-600 shrink-0" />
        <input
          type="text"
          placeholder="Search by user, action and IP Address..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch && onSearch(e.target.value);
          }}
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
      </div>

      {/* RIGHT: Dropdowns */}
      <div className="flex items-center gap-3">
        {/* Module Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm hover:border-gray-300 transition">
            <SlidersHorizontal size={15} className="text-gray-700" />
            <select
              value={module}
              onChange={(e) => {
                setModule(e.target.value);
                onModuleChange && onModuleChange(e.target.value);
              }}
              className="text-sm text-gray-700 outline-none bg-white cursor-pointer pr-6 appearance-none"
            >
              {modules.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={14} className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Date Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm hover:border-gray-300 transition">
            <Calendar size={15} className="text-gray-500" />
            <select
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                onDateChange && onDateChange(e.target.value);
              }}
              className="text-sm text-gray-700 outline-none bg-white cursor-pointer pr-6 appearance-none"
            >
              {dates.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <ChevronDown size={14} className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
