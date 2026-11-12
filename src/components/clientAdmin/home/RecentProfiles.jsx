import React from "react";
import { User } from "lucide-react";

function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day ago`;
  return date.toLocaleDateString();
}

function RecentProfiles({ data = [] }) {
  // Use dynamic data if available, otherwise fallback to empty array
  const displayProfiles = data && data.length > 0 ? data : [];

  return (
    <div className="bg-[#09004D] rounded-3xl p-4 h-full flex flex-col border border-indigo-900 shadow-xl">

      {/* HEADER */}
      <h2 className="text-[14px] font-semibold text-white mb-3">
        Recent Profiles
      </h2>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}>
        {displayProfiles.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-3"
          >
            {/* LEFT */}
            <div className="flex items-start gap-3 min-w-0">

              {/* USER ICON */}
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-200">
                <User size={16} />
              </div>

              {/* INFO */}
              <div className="min-w-0">
                <h4 className="text-[12px] font-medium text-white truncate leading-none">
                  {item.name}
                </h4>
                <div className="mt-1">
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium ${
                      item.role === "HR"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-white text-indigo-700"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>
              </div>

            </div>

            {/* TIME */}
            <span className="text-[9px] text-gray-400 whitespace-nowrap mt-0.5">
              {timeAgo(item.time)}
            </span>

          </div>
        ))}
        {displayProfiles.length === 0 && (
          <div className="text-[12px] text-gray-400 text-center py-4">No recent profiles</div>
        )}
      </div>

    </div>
  );
}

export default RecentProfiles;