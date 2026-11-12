import React from "react";
import { Maximize2 } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-orange-50",
  iconColor = "text-orange-500",
}) {

  return (
    <div className="flex-1 min-w-37.5 bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 relative">

      {/* TOP */}
      <div className="flex justify-between items-start">

        {/* TITLE */}
        <span className="text-sm text-gray-700 font-medium">
          {title}
        </span>

        {/* ICON */}
        <div
          className={`${iconBg} ${iconColor} w-9 h-9 rounded-lg flex items-center justify-center text-lg`}
        >
          {icon}
        </div>

      </div>

      {/* VALUE */}
      <div className="text-3xl font-extrabold text-gray-900 tracking-tight">

        {value}

      </div>

      {/* MAXIMIZE BUTTON */}
      <button className="absolute bottom-3 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors">

        <Maximize2 className="w-3.5 h-3.5" />

      </button>

    </div>
  );
}