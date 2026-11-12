const StatusBadge = ({ status }) => {
  const styles = {
    Complete:  "bg-green-100 text-green-600",
    "On Hold": "bg-orange-100 text-orange-500",
    Rejected:  "bg-red-100 text-red-500",
    "On Track": "bg-green-100 text-green-600",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

export default function SLABreachTable({ data }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Horizontal + Vertical scrolling */}
      <div className="overflow-x-auto overflow-y-auto max-h-128">
        <table className="min-w-300 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {[
                "Cand ID",
                "Candidate Name",
                "Phone",
                "Assign HR",
                "Status",
                "Check ID",
                "Check Type",
                "Initiation Day",
                "SLA Date",
                "Breached Day",
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
                  colSpan={10}
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
                  {/* Cand ID forced to one line */}
                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                    {row.candId}
                  </td>

                  <td className="px-8 py-5">
                    <p className="font-medium text-gray-800">{row.name}</p>
                    <p className="text-xs text-gray-400">{row.email}</p>
                  </td>

                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{row.phone}</td>

                  <td className="px-8 py-5">
                    <p className="text-gray-800">{row.hr}</p>
                    <p className="text-xs text-gray-400">{row.hrEmail}</p>
                  </td>

                  <td className="px-8 py-5">
                    <StatusBadge status={row.status} />
                  </td>

                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{row.checkId}</td>

                  {/* Check Type styled as pill */}
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                        <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap">
                        {row.checkType}
                        </span>
                    </div>
                  </td>


                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{row.initiationDay}</td>

                  <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{row.slaDate}</td>

                  <td className="px-8 py-5 font-semibold text-orange-600 whitespace-nowrap">
                    {row.breachedDay}
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
