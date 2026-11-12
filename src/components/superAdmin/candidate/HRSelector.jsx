import React, { useState } from "react";
import { Search, Briefcase, User } from "lucide-react";

const HR_LIST = [
  { id: 1, name: "Meera Malhotra", role: "Senior Verifier", department: "Executive Screening", activeCases: "3 / 10 Active Cases" },
  { id: 2, name: "Aditi Singh", role: "Senior Verifier", department: "Executive Screening", activeCases: "4 / 10 Active Cases" },
  { id: 3, name: "Dev Khanna", role: "Senior Verifier", department: "Executive Screening", activeCases: "5 / 10 Active Cases" },
  // Add more HRs here to test scrolling
];

export default function HRSelector({ onCancel, onConfirm }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = HR_LIST.filter(
    (hr) =>
      hr.name.toLowerCase().includes(search.toLowerCase()) ||
      hr.department.toLowerCase().includes(search.toLowerCase())
  );

  const selectedHR = HR_LIST.find((hr) => hr.id === selected);

  return (
    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Select HR Representative</h3>
          <p className="text-xs text-gray-400 mt-0.5">Assign Based On Availability And Department Expertise.</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-48 shadow-sm">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
          <Search size={14} className="text-gray-400 shrink-0" />
        </div>
      </div>

      {/* HR List with scrolling */}
      <div className="flex flex-col gap-3 px-6 pb-4 flex-1 overflow-y-auto max-h-80">
        {filtered.map((hr) => {
          const isSelected = selected === hr.id;
          return (
            <div
              key={hr.id}
              onClick={() => setSelected(hr.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-150
                ${isSelected
                  ? "border-indigo-600 bg-white shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                <User size={22} className="text-indigo-300" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{hr.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{hr.role} • {hr.department}</p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                  <Briefcase size={11} />
                  {hr.activeCases}
                </div>
              </div>

              {/* Radio */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                ${isSelected ? "border-indigo-600" : "border-gray-300"}`}>
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-8">No HR representatives found.</div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-600">
          {selectedHR ? (
            <>Assigning To <span className="font-semibold text-gray-900">{selectedHR.name}</span></>
          ) : (
            <span className="text-gray-400">No HR selected</span>
          )}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm && onConfirm(selectedHR)}
            disabled={!selected}
            className="bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-800 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Assignment
          </button>
        </div>
      </div>

    </div>
  );
}
