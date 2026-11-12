import React from "react";

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    // VERIFIED
    if (status?.includes("Verified")) {
      return "text-green-600";
    }

    // PENDING / UNDER REVIEW
    if (status?.includes("Pending") || status?.includes("Under Review")) {
      return "text-orange-500";
    }

    // FAILED / REJECTED
    if (status?.includes("Failed") || status?.includes("Rejected")) {
      return "text-red-500";
    }

    // YES
    if (status === "Yes") {
      return "bg-red-100 text-red-500 px-3 py-1 rounded-full inline-flex";
    }

    // NO
    if (status === "No") {
      return "bg-green-100 text-green-500 px-3 py-1 rounded-full inline-flex";
    }

    // NA
    if (status === "NA") {
      return "text-gray-400";
    }

    return "text-gray-600";
  };

  return (
    <span className={`text-sm font-medium whitespace-nowrap ${getStyles()}`}>
      {status}
    </span>
  );
};

export default function MISTable({ data }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-128">
        <table className="min-w-650 w-full text-sm">
          {/* HEADER */}
          <thead>
            <tr className=" bg-gray-50">
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
                "Employment - 1",
                "Employment - 2",
                "Last Education",
                "Criminal Record",
                "Drug Test",
              ].map((h) => (
                <th
                  key={h}
                  className="px-8 py-5 text-left text-sm font-semibold text-black whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
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
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  {/* CAND ID */}
                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                    {row.candId}
                  </td>

                  {/* CANDIDATE */}
                  <td className="px-8 py-5">
                    <p className="font-medium text-gray-800">{row.name}</p>

                    <p className="text-xs text-gray-400">{row.email}</p>
                  </td>

                  {/* PHONE */}
                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                    {row.phone}
                  </td>

                  {/* HR */}
                  <td className="px-8 py-5">
                    <p className="text-gray-800">{row.hr}</p>

                    <p className="text-xs text-gray-400">{row.hrEmail}</p>
                  </td>

                  {/* STATUS */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* PERMANENT ADDRESS */}
                  <td className="px-8 py-5 max-w-45">
                    <span
                      className="block truncate text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
                      title={row.permanentAddress}
                    >
                      {row.permanentAddress}
                    </span>
                  </td>

                  {/* PRESENT ADDRESS */}
                  <td className="px-8 py-5 max-w-45">
                    <span
                      className="block truncate text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
                      title={row.presentAddress}
                    >
                      {row.presentAddress}
                    </span>
                  </td>

                  {/* DRIVING LICENSE */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.drivingLicense} />
                  </td>

                  {/* PASSPORT */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.passport} />
                  </td>

                  {/* PAN CARD */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.panCard} />
                  </td>

                  {/* VOTER ID */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.voterId} />
                  </td>

                  {/* EMPLOYMENT 1 */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.employment1} />
                  </td>

                  {/* EMPLOYMENT 2 */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.employment2} />
                  </td>

                  {/* EDUCATION */}
                  <td className="px-8 py-5 whitespace-nowrap text-gray-800">
                    {row.lastEducation}
                  </td>

                  {/* CRIMINAL */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={row.criminalRecord} />
                  </td>

                  {/* DRUG TEST */}
                  <td className="px-8 py-5 whitespace-nowrap">
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
