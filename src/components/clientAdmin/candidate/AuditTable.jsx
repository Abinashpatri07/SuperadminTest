import React from "react";
import {
  ShieldCheck,
  ShieldX,
  CreditCard,
  Settings,
  UserCheck,
  RefreshCw,
  AlertTriangle,
  FileDown,
  ShoppingBag,
  Trash2,
  Activity
} from "lucide-react";

// ── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

function getInitials(firstname, lastname) {
  if (!firstname && !lastname) return "AU";
  const f = firstname ? firstname.charAt(0).toUpperCase() : "";
  const l = lastname ? lastname.charAt(0).toUpperCase() : "";
  return `${f}${l}`;
}

const avatarColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
];

function getAvatarColor(initials) {
  if (!initials) return avatarColors[0];
  const charCode = initials.charCodeAt(0) || 0;
  return avatarColors[charCode % avatarColors.length];
}

function Avatar({ initials }) {
  const color = getAvatarColor(initials);
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

// Map module names to icons and colors
function getModuleInfo(moduleName) {
  switch (moduleName?.toLowerCase()) {
    case "billing":
      return { color: "text-green-600", icon: <CreditCard size={14} className="text-green-500" /> };
    case "security":
      return { color: "text-red-500", icon: <ShieldX size={14} className="text-red-400" /> };
    case "verifications":
      return { color: "text-indigo-600", icon: <ShieldCheck size={14} className="text-indigo-500" /> };
    case "settings":
      return { color: "text-gray-600", icon: <Settings size={14} className="text-gray-500" /> };
    default:
      return { color: "text-blue-600", icon: <Activity size={14} className="text-blue-500" /> };
  }
}

// ── STATUS ICON ───────────────────────────────────────────────────────────────
function StatusIcon({ status }) {
  if (status?.toUpperCase() === "SUCCESS") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-green-400 flex items-center justify-center">
        <ShieldCheck size={14} className="text-green-500" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-red-400 flex items-center justify-center">
      <ShieldX size={14} className="text-red-500" />
    </div>
  );
}

// ── TABLE ─────────────────────────────────────────────────────────────────────
export default function AuditTable({ rows = [] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Scrollable wrapper */}
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-collapse">
          {/* HEADER */}
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-200">
              <th className="px-5 py-3.5 text-sm font-semibold text-gray-700 text-left">User / Actor</th>
              <th className="px-5 py-3.5 text-sm font-semibold text-gray-700 text-left">Action & Details</th>
              <th className="px-5 py-3.5 text-sm font-semibold text-gray-700 text-left">Module</th>
              <th className="px-5 py-3.5 text-sm font-semibold text-gray-700 text-left">Date & Time</th>
              <th className="px-5 py-3.5 text-sm font-semibold text-gray-700 text-left">IP Address</th>
              <th className="px-5 py-3.5 text-sm font-semibold text-gray-700 text-center">Status</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {rows.map((row, i) => {
              const initials = getInitials(row.firstname, row.lastname);
              const name = row.firstname || row.lastname ? `${row.firstname || ''} ${row.lastname || ''}`.trim() : "Unknown";
              const role = row.role_name || "System User";
              const modInfo = getModuleInfo(row.module_type);
              
              const dateObj = new Date(row.created_at);
              const datetime = dateObj.toLocaleDateString("en-IN", {
                month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
              });

              return (
                <tr
                  key={i}
                  className={`hover:bg-gray-50 transition-colors duration-100 ${
                    i < rows.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  {/* USER / ACTOR */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials} />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{name}</div>
                        <div className="text-xs text-gray-400">{role}</div>
                      </div>
                    </div>
                  </td>

                  {/* ACTION & DETAILS */}
                  <td className="px-5 py-4 max-w-xs">
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-1.5 bg-blue-50 text-blue-600`}
                    >
                      <Activity size={11} />
                      {row.action || "System Event"}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed">{row.remarks || "No details provided"}</div>
                  </td>

                  {/* MODULE */}
                  <td className="px-5 py-4">
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${modInfo.color}`}>
                      {modInfo.icon}
                      {row.module_type || "General"}
                    </div>
                  </td>

                  {/* DATE & TIME */}
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{datetime}</td>

                  {/* IP ADDRESS */}
                  <td className="px-5 py-4 text-sm text-gray-700 font-medium whitespace-nowrap">{row.ip || "—"}</td>

                  {/* STATUS */}
                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={row.status} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
