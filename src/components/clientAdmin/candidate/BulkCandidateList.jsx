function BulkCandidateList({ candidates }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-orange-100 text-orange-500";
      case "Verify":
        return "bg-indigo-100 text-indigo-600";
      case "Verified":
        return "bg-teal-100 text-teal-600";
      case "Complete":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
      {/* TITLE */}
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold">Candidate List</h2>
      </div>

      {/* TABLE WRAPPER WITH SCROLL */}
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#FAFAFA] border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-4 w-12">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold">Candidate ID</th>
              <th className="px-4 py-4 text-left text-sm font-semibold">Case ID</th>
              <th className="px-4 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-4 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-4 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="accent-indigo-600"
                  />
                </td>
                <td className="px-4 py-4 text-sm">{item.candidateId}</td>
                <td className="px-4 py-4 text-sm">CASE-6567FAFB</td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.email}</div>
                </td>
                <td className="px-4 py-4 text-sm">{item.phone}</td>
                <td className="px-4 py-4">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BulkCandidateList;
