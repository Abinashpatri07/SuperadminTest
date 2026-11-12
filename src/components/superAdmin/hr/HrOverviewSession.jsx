import { Maximize2 } from "lucide-react";
import { Users, UserCheck, UserMinus, UserX } from "lucide-react";

function HrOverviewSection({ stats = {} }) {

  const cards = [
    {
      title: "Total (HR)",
      value: stats.total ?? "—",
      icon: <Users size={18} className="text-indigo-600" />,
      color: "bg-indigo-100",
    },
    {
      title: "Active",
      value: stats.active ?? "—",
      icon: <UserCheck size={18} className="text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Inactive",
      value: stats.inactive ?? "—",
      icon: <UserMinus size={18} className="text-orange-500" />,
      color: "bg-orange-100",
    },
    {
      title: "Terminated",
      value: stats.terminated ?? "—",
      icon: <UserX size={18} className="text-red-500" />,
      color: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between min-h-30"
        >
          {/* TOP */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800 leading-5">{card.title}</h3>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${card.color}`}>
              {card.icon}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex items-end justify-between mt-3">
            <h1 className="text-4xl font-bold text-gray-900 leading-none">{card.value}</h1>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Maximize2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HrOverviewSection;