import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    Complete: "bg-green-100 text-green-600",
    "On Hold": "bg-orange-100 text-orange-500",
    Rejected: "bg-red-100 text-red-500",
    Pending: "bg-yellow-100 text-yellow-600",
    Verified: "bg-green-100 text-green-600",
    Failed: "bg-red-100 text-red-500",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

export default function MISTable({ data }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-128">
        <table className="min-w-300 w-full text-sm">
          <thead>
            <tr className=" bg-gray-50/50">
              {[
                "Cand ID",
                "Candidate Name",
                "Phone",
                "Assign HR",
                "Status",
                "Permanent Address",
                "Present Address",
                "Driving License",
                "Passport",
                "PAN Card",
                "Voter ID",
                "Employment 1",
                "Employment 2",
                "Last Education",
                "Criminal Record",
                "Drug Test",
              ].map((h) => (
                <th
                  key={h}
                  className="px-8 py-5 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={16}
                  className="text-center py-12 text-sm text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                    {row.candId}
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-medium text-gray-800">{row.name}</p>
                    <p className="text-xs text-gray-400">{row.email}</p>
                  </td>
                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                    {row.phone}
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-gray-800">{row.hr}</p>
                    <p className="text-xs text-gray-400">{row.hrEmail}</p>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Permanent Address */}
                  <td className="px-8 py-5 max-w-50">
                    <span
                      className="block truncate"
                      title={row.permanentAddress}
                    >
                      {row.permanentAddress}
                    </span>
                  </td>

                  {/* Present Address */}
                  <td className="px-8 py-5 max-w-50">
                    <span
                      className="block truncate"
                      title={row.presentAddress}
                    >
                      {row.presentAddress}
                    </span>
                  </td>

                  <td className="px-8 py-5">
                    <StatusBadge status={row.drivingLicense} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.passport} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.panCard} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.voterId} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.employment1} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.employment2} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.lastEducation} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.criminalRecord} />
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={row.drugTest} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
