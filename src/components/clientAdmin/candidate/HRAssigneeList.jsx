import { User } from "lucide-react";
import { useState } from "react";

function HRAssigneeList({ totalCases }) {
  const [selectedHR, setSelectedHR] = useState(1);

  const hrList = [
    { id: 1, name: "Sarah Jenkins", load: 45 },
    { id: 2, name: "Michael Chen", load: 40 },
    { id: 3, name: "Aisha Patel", load: 47 },
    { id: 4, name: "David Rodriguez", load: 41 },
    // Add more HRs here to test scrolling
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-4 flex flex-col">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <User size={20} />
          Select Assignee
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Choose an HR officer to handle the selected cases.
        </p>
      </div>

      {/* HR CARDS with scrolling */}
      <div className="space-y-4 flex-1 overflow-y-auto max-h-80 pr-1">
        {hrList.map((hr) => {
          const isSelected = selectedHR === hr.id;
          return (
            <div
              key={hr.id}
              onClick={() => setSelectedHR(hr.id)}
              className={`border rounded-2xl p-4 cursor-pointer transition ${
                isSelected ? "border-[#02027A]" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                {/* LEFT */}
                <div className="flex gap-3">
                  {/* ICON */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={18} className="text-gray-500" />
                  </div>

                  {/* INFO */}
                  <div>
                    <h3 className="font-semibold text-gray-900">{hr.name}</h3>
                    {/* LOAD */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#02027A]"
                          style={{ width: `${hr.load}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{hr.load}</span>
                    </div>
                  </div>
                </div>

                {/* RADIO */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                    isSelected ? "border-[#02027A]" : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#02027A]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUTTON */}
      <button className="w-full bg-[#02027A] hover:bg-[#00005E] text-white py-3 rounded-lg font-semibold mt-6 transition">
        Assign {totalCases} cases
      </button>
    </div>
  );
}

export default HRAssigneeList;
