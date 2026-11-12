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
} from "lucide-react";

// ── DATA ─────────────────────────────────────────────────────────────────────
export const auditData = [
  {
    initials: "AU",
    name: "Admin User",
    role: "Super Admin",
    badgeLabel: "Assigned HR Officer",
    badgeColor: "bg-blue-100 text-blue-600",
    badgeIcon: <UserCheck size={11} />,
    detail: "Assigned Sarah Jenkins To Candidate Alex Mercer (VER-2026-892)",
    module: "Verifications",
    moduleColor: "text-indigo-600",
    moduleIcon: <ShieldCheck size={14} className="text-indigo-500" />,
    datetime: "May 11, 2026, 05:45 PM",
    ip: "192.168.1.42",
    status: "success",
  },
  {
    initials: "SY",
    name: "Surya Kumar",
    role: "Client Admin",
    badgeLabel: "Wallet Recharge",
    badgeColor: "bg-green-100 text-green-600",
    badgeIcon: <RefreshCw size={11} />,
    detail: "Auto-Recharged ₹50,000 To Primary Wallet Via Registered Credit Card.",
    module: "Billing",
    moduleColor: "text-green-600",
    moduleIcon: <CreditCard size={14} className="text-green-500" />,
    datetime: "May 11, 2026, 02:30 PM",
    ip: "48.32.17.102",
    status: "success",
  },
  {
    initials: "AU",
    name: "Unknown",
    role: "Unauthenticated",
    badgeLabel: "Failed Login Attempt",
    badgeColor: "bg-red-100 text-red-500",
    badgeIcon: <AlertTriangle size={11} />,
    detail: "3 Consecutive Failed Login Attempts For Account HrManager@Company.Com",
    module: "Security",
    moduleColor: "text-red-500",
    moduleIcon: <ShieldX size={14} className="text-red-400" />,
    datetime: "May 11, 2026, 11:15 AM",
    ip: "45.22.19.112",
    status: "failed",
  },
  {
    initials: "MC",
    name: "Michael Chen",
    role: "HR Specialist",
    badgeLabel: "Report Downloaded",
    badgeColor: "bg-purple-100 text-purple-600",
    badgeIcon: <FileDown size={11} />,
    detail: 'Downloaded Final Verification Report For Candidate "Vanshika Ref".',
    module: "Verifications",
    moduleColor: "text-indigo-600",
    moduleIcon: <ShieldCheck size={14} className="text-indigo-500" />,
    datetime: "May 10, 2026, 04:20 PM",
    ip: "10.0.0.105",
    status: "success",
  },
  {
    initials: "AU",
    name: "Admin User",
    role: "Super Admin",
    badgeLabel: "Package Purchased",
    badgeColor: "bg-orange-100 text-orange-600",
    badgeIcon: <ShoppingBag size={11} />,
    detail: 'Purchased "Standard Employment" Tier (500 Units).',
    module: "Billing",
    moduleColor: "text-green-600",
    moduleIcon: <CreditCard size={14} className="text-green-500" />,
    datetime: "May 09, 2026, 09:00 AM",
    ip: "192.168.1.42",
    status: "success",
  },
  {
    initials: "AU",
    name: "Admin User",
    role: "Super Admin",
    badgeLabel: "Deleted User",
    badgeColor: "bg-red-100 text-red-500",
    badgeIcon: <Trash2 size={11} />,
    detail: 'Removed Legacy API Key "Test-Env-Key-2025".',
    module: "Settings",
    moduleColor: "text-gray-600",
    moduleIcon: <Settings size={14} className="text-gray-500" />,
    datetime: "May 08, 2026, 06:15 PM",
    ip: "192.168.1.42",
    status: "success",
  },
];

// ── AVATAR ────────────────────────────────────────────────────────────────────
const avatarColors = {
  AU: "bg-indigo-100 text-indigo-700",
  SY: "bg-gray-200 text-gray-600",
  MC: "bg-teal-100 text-teal-700",
};

function Avatar({ initials }) {
  const color = avatarColors[initials] || "bg-gray-100 text-gray-600";
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

// ── STATUS ICON ───────────────────────────────────────────────────────────────
function StatusIcon({ status }) {
  if (status === "success") {
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
export default function AuditTable({ rows = auditData }) {
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
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-gray-50 transition-colors duration-100 ${
                  i < rows.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* USER / ACTOR */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={row.initials} />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{row.name}</div>
                      <div className="text-xs text-gray-400">{row.role}</div>
                    </div>
                  </div>
                </td>

                {/* ACTION & DETAILS */}
                <td className="px-5 py-4 max-w-xs">
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-1.5 ${row.badgeColor}`}
                  >
                    {row.badgeIcon}
                    {row.badgeLabel}
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">{row.detail}</div>
                </td>

                {/* MODULE */}
                <td className="px-5 py-4">
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${row.moduleColor}`}>
                    {row.moduleIcon}
                    {row.module}
                  </div>
                </td>

                {/* DATE & TIME */}
                <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{row.datetime}</td>

                {/* IP ADDRESS */}
                <td className="px-5 py-4 text-sm text-gray-700 font-medium whitespace-nowrap">{row.ip}</td>

                {/* STATUS */}
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center">
                    <StatusIcon status={row.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
