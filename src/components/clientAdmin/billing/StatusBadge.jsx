import React from "react";

const statusStyles = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-600",
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || "bg-gray-100 text-gray-500";
  return (
    <span className={`${style} text-xs font-semibold px-3 py-1 rounded-full inline-block`}>
      {status}
    </span>
  );
}