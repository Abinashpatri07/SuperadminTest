import {
  Search,
  Filter,
} from "lucide-react";

import {
  useLocation,
} from "react-router-dom";

import BulkCandidateList from "../../components/clientAdmin/candidate/BulkCandidateList";

import HRAssigneeList from "../../components/clientAdmin/candidate/HRAssigneeList";

function BulkAssignPage() {

  const location = useLocation();

  const candidates =
    location.state?.selectedCandidates || [];

  return (

    <div className="min-h-screen bg-[#F8F8F8] p-6">

      {/* TITLE */}
      <div className="mb-6">

        <h1 className="text-4xl font-bold text-black">

          Bulk Case Assignment

        </h1>

        <p className="text-gray-600 mt-2 text-lg">

          Select Multiple Pending Cases And Assign Them To An Available HR Verification Officer In One Go.

        </p>

      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between mb-5">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div className="relative w-85">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name and Candidate id"
              className="w-full bg-[#F5F5F5] rounded-xl pl-11 pr-4 py-3 outline-none text-sm"
            />

          </div>

          {/* FILTER */}
          <button className="flex items-center gap-2 bg-[#F5F5F5] px-5 py-3 rounded-xl text-sm font-medium">

            <Filter size={16} />

            Filter

          </button>

        </div>

        {/* SELECTED */}
        <div className="bg-indigo-100 text-indigo-700 px-5 py-3 rounded-xl font-semibold whitespace-nowrap">

          {candidates.length} selected

        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-5">

        {/* LEFT */}
        <div className="col-span-8">

          <BulkCandidateList
            candidates={candidates}
          />

        </div>

        {/* RIGHT */}
        <div className="col-span-4">

          <HRAssigneeList
            totalCases={candidates.length}
          />

        </div>

      </div>

    </div>
  );
}

export default BulkAssignPage;