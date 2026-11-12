const StatusBadge = ({ status }) => {

  const styles = {
    Complete: "bg-green-100 text-green-600",
    "On Hold": "bg-orange-100 text-orange-500",
    Rejected: "bg-red-100 text-red-500",
  };

  return (

    <span
      className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
        styles[status] ||
        "bg-gray-100 text-gray-500"
      }`}
    >

      {status}

    </span>
  );
};

const CheckTypeBadge = ({ type }) => (

  <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap">

    {type}

  </span>
);

export default function TATTable({
  data = [],
}) {

  return (

    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto overflow-y-auto max-h-162.5">

        <table className="min-w-375 w-full text-sm">

          {/* ───────────── TABLE HEAD ───────────── */}
          <thead className="sticky top-0 bg-gray-50 z-10">

            <tr className="border-b border-gray-100">

              {[
                "Cand ID",
                "Candidate Name",
                "Phone",
                "Assigned HR",
                "Status",
                "Check ID",
                "Check Type",
                "Initiation Day",
                "Turnaround Time (TAT)",
              ].map((heading) => (

                <th
                  key={heading}
                  className="px-8 py-5 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >

                  {heading}

                </th>

              ))}

            </tr>

          </thead>

          {/* ───────────── TABLE BODY ───────────── */}
          <tbody>

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  className="text-center py-12 text-sm text-gray-400"
                >

                  No records found.

                </td>

              </tr>

            ) : (

              data.map((row, index) => {

                const actualNum =
                  Number(row.actual);

                const targetNum =
                  Number(row.target);

                const isOverTarget =
                  actualNum > targetNum;

                return (

                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >

                    {/* CAND ID */}
                    <td className="px-8 py-5 text-gray-700 font-medium whitespace-nowrap">

                      {row.candId}

                    </td>

                    {/* CANDIDATE */}
                    <td className="px-8 py-5">

                      <p className="font-medium text-gray-800">

                        {row.name}

                      </p>

                      <p className="text-xs text-gray-400 mt-1">

                        {row.email}

                      </p>

                    </td>

                    {/* PHONE */}
                    <td className="px-8 py-5 text-gray-700 whitespace-nowrap">

                      {row.phone}

                    </td>

                    {/* HR */}
                    <td className="px-8 py-5">

                      <p className="text-gray-800 font-medium">

                        {row.hr}

                      </p>

                      <p className="text-xs text-gray-400 mt-1">

                        {row.hrEmail}

                      </p>

                    </td>

                    {/* STATUS */}
                    <td className="px-8 py-5">

                      <StatusBadge
                        status={row.status}
                      />

                    </td>

                    {/* CHECK ID */}
                    <td className="px-8 py-5 text-gray-700 whitespace-nowrap">

                      {row.checkId}

                    </td>

                    {/* CHECK TYPE */}
                    <td className="px-8 py-5">

                      <CheckTypeBadge
                        type={row.checkType}
                      />

                    </td>

                    {/* INITIATION DAY */}
                    <td className="px-8 py-5 text-gray-700 whitespace-nowrap">

                      {row.initiationDay}

                    </td>

                    {/* TAT */}
                    <td className="px-8 py-5 whitespace-nowrap">

                      <p
                        className={`text-sm font-semibold ${
                          isOverTarget
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >

                        {row.actual} Days (Actual)

                      </p>

                      <p className="text-xs text-gray-400 mt-1">

                        Target: {row.target} Days

                      </p>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}