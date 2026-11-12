import React from "react";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-base font-bold text-gray-900 m-0">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && action}
    </div>
  );
}