import React from "react";

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b-2 border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-2.5 text-sm font-medium transition-all duration-150 border-b-[2.5px] -mb-0.5 cursor-pointer bg-transparent
            ${activeTab === tab
              ? "text-blue-700 border-blue-700 font-semibold"
              : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}