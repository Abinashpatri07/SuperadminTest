import React from "react";
import {
  UsersRound,
  UserCheck,
  UserX,
  UserMinus,
  Maximize2,
} from "lucide-react";

const STATS = [
  {
    title: "Total",
    value: "20",
    icon: UsersRound,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Active",
    value: "10",
    icon: UserCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    title: "Inactive",
    value: "09",
    icon: UserX,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    title: "Suspended",
    value: "18",
    icon: UserMinus,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
];

export default function ClientStatCards({ stats = STATS }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between min-h-[110px]"
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-800 leading-5">
                {card.title}
              </h3>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon size={18} className={card.iconColor} />
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
        );
      })}
    </div>
  );
}