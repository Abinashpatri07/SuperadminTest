import {
  Maximize2,
  BadgeCheck,
  FileClock,
  ClipboardCheck,
  ClipboardList,
  PauseCircle,
} from "lucide-react";

function CandidateOverviewSection({ stats }) {
  const cards = [
    {
      title: "Awaiting Input",
      value: String(stats?.awaiting || 0).padStart(2, "0"),
      icon: <ClipboardList size={18} className="text-indigo-500" />,
      color: "bg-indigo-100",
    },
    {
      title: "Profile Complete",
      value: String(stats?.profileComplete || 0).padStart(2, "0"),
      icon: <ClipboardCheck size={18} className="text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Verification In Progress",
      value: String(stats?.inProgress || 0).padStart(2, "0"),
      icon: <FileClock size={18} className="text-orange-500" />,
      color: "bg-orange-100",
    },
    {
      title: "Verified",
      value: String(stats?.verified || 0).padStart(2, "0"),
      icon: <BadgeCheck size={18} className="text-teal-600" />,
      color: "bg-teal-100",
    },
    {
      title: "On Hold",
      value: String(stats?.onHold || 0).padStart(2, "0"),
      icon: <PauseCircle size={18} className="text-yellow-600" />,
      color: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between min-h-27.5"
        >
          {/* TOP */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800 leading-5">
              {card.title}
            </h3>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${card.color}`}>
              {card.icon}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex items-end justify-between mt-3">
            <h1 className="text-4xl font-bold text-gray-900 leading-none">
              {card.value}
            </h1>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Maximize2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CandidateOverviewSection;
