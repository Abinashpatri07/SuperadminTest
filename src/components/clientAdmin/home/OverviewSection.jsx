

import { Maximize2 } from "lucide-react";

const StatCard = ({ label, value, icon, iconBg }) => (
  <div className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${iconBg}`}>
        {icon}
      </div>
    </div>
    <div className="flex items-end justify-between mt-3">
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <Maximize2 size={14} className="text-gray-300" />
    </div>
  </div>
);

export default function OverviewSection() {
  const hrStats = [
    { label: "Total (HR)", value: "20", icon: "👥", iconBg: "bg-indigo-50" },
    { label: "Active",     value: "10", icon: "✅", iconBg: "bg-green-50"  },
    { label: "Inactive",   value: "09", icon: "⏸️", iconBg: "bg-orange-50" },
    { label: "Terminated", value: "18", icon: "🚫", iconBg: "bg-red-50"    },
  ];

  const candidateStats = [
    { label: "In Progress",             value: "20", icon: "📋", iconBg: "bg-indigo-50" },
    { label: "Complete",                value: "10", icon: "✅", iconBg: "bg-green-50"  },
    { label: "On Hold",                 value: "10", icon: "⏸️", iconBg: "bg-yellow-50" },
    { label: "Verification In Progress",value: "09", icon: "🔄", iconBg: "bg-orange-50" },
    { label: "Verified",                value: "18", icon: "🪪", iconBg: "bg-teal-50"   },
    { label: "Reject",                  value: "18", icon: "🚫", iconBg: "bg-red-50"    },
  ];

  return (
    <div className="space-y-5">

      {/* HR OVERVIEW */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-3">Hr overview</h2>
        <div className="grid grid-cols-2 gap-3">
          {hrStats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* CANDIDATE OVERVIEW */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-3">Candidate overview</h2>
        <div className="grid grid-cols-3 gap-3">
          {candidateStats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

    </div>
  );
}