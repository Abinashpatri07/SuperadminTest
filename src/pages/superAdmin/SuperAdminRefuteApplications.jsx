import React, { useState } from "react";
import {
  RefreshCw,
  ListFilter,
  Calendar,
  Search,
  Upload,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightSmall
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const tableData = [
  {
    id: 1,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Employment Verification",
    name: "Arjun Sharma",
    email: "arjun.sharma@email.com",
    phone: "1234567890",
    tat: "2 Days",
    status: "Refute",
  },
  {
    id: 2,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Education Verification",
    name: "Ananya Iyer",
    email: "ananya.iyer@email.com",
    phone: "1234567890",
    tat: "5 Days",
    status: "Refute",
  },
  {
    id: 3,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Address Verification",
    name: "Rohan Malhotra",
    email: "rohan.m@workspace.in",
    phone: "1234567890",
    tat: "1 Day",
    status: "Refute",
  },
  {
    id: 4,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Criminal Check",
    name: "Meera Deshmukh",
    email: "meera.d@talent.io",
    phone: "1234567890",
    tat: "3 Days",
    status: "Refute",
  },
  {
    id: 5,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Education Verification",
    name: "Niten Sharma",
    email: "nitenkumar34@gmail.com",
    phone: "1234567890",
    tat: "2 Days",
    status: "Refute",
  },
  {
    id: 6,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Address Verification",
    name: "Kavya Patel",
    email: "k.patel@company.com",
    phone: "1234567890",
    tat: "1 Day",
    status: "Refute",
  },
  {
    id: 7,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Drug Test",
    name: "Ishaan Verma",
    email: "ishaan.verma@talent.io",
    phone: "1234567890",
    tat: "4 Days",
    status: "Refute",
  },
  {
    id: 8,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Address Verification",
    name: "Niten Sharma",
    email: "nitenkumar34@gmail.com",
    phone: "1234567890",
    tat: "5 Days",
    status: "Refute",
  },
  {
    id: 9,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Education Verification",
    name: "Ishaan Verma",
    email: "ishaan.verma@talent.io",
    phone: "1234567890",
    tat: "3 Days",
    status: "Refute",
  },
];

const getStatusBadge = (status) => {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C]">
      {status}
    </span>
  );
};

const getDetailsLink = (caseType) => {
  switch (caseType) {
    case "Employment Verification": return "/super-admin/cases/employment-details";
    case "Education Verification": return "/super-admin/cases/education-details";
    case "Address Verification": return "/super-admin/cases/address-details";
    case "Criminal Check": return "/super-admin/cases/criminal-details";
    case "Drug Test": return "/super-admin/cases/drug-test-details";
    default: return "#";
  }
};

function SuperAdminRefuteApplications() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAll = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map((row) => row.id));
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-5 pb-10 px-4 mt-4">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E1B4B] mb-2">
          Refute Application
        </h1>
        <div className="flex items-center text-sm text-gray-600 font-medium">
          <Link to="/super-admin/cases/dashboard" className="hover:text-[#4338CA] transition">Dashboard</Link>
          <ChevronRightSmall size={16} className="mx-1 text-gray-400" />
          <span>Refute Application</span>
        </div>
      </div>

      {/* CONTROLS SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition shadow-sm">
            All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <ListFilter size={16} />
            Short by Name
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <Calendar size={16} />
            Short by Date
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 bg-gray-50/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30 w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#4338CA] text-[#4338CA] bg-white rounded-lg text-sm font-medium hover:bg-indigo-50 transition shadow-sm">
            <Upload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-sm mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 w-12 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                    checked={
                      selectedRows.length === tableData.length &&
                      tableData.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Case ID</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Candidate ID</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Case Type</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Name</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Phone</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">TAT</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Status</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-[#FAFAFA] transition-all duration-150"
                >
                  <td className="px-5 py-2.5">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="px-5 py-2.5 text-sm text-gray-700 font-mono">
                    {row.caseId}
                  </td>
                  <td className="px-5 py-2.5 text-sm text-gray-700">{row.candidateId}</td>
                  <td className="px-5 py-2.5">
                    <div className="text-sm text-gray-800 font-medium">
                      {row.caseType.split(" ")[0]}
                    </div>
                    {row.caseType.split(" ")[1] && (
                      <div className="text-gray-500 text-xs">
                        {row.caseType.split(" ").slice(1).join(" ")}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="font-semibold text-[15px] text-gray-900 leading-5">{row.name}</div>
                    <div className="text-gray-500 text-xs">{row.email}</div>
                  </td>
                  <td className="px-5 py-2.5 text-sm text-gray-700">+91 {row.phone}</td>
                  <td className="px-5 py-2.5 text-sm text-gray-700">{row.tat}</td>
                  <td className="px-5 py-2.5">{getStatusBadge(row.status)}</td>
                  <td className="px-5 py-2.5 text-center w-20">
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-100 transition inline-flex justify-center items-center"
                      onClick={() => {
                        const mode = "view";
                        if (row.caseType.includes("Employment Verification")) {
                          navigate(`/super-admin/cases/employment-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Address Verification")) {
                          navigate(`/super-admin/cases/address-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Drug Test")) {
                          navigate(`/super-admin/cases/drug-test-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Education Verification")) {
                          navigate(`/super-admin/cases/education-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Criminal Check")) {
                          navigate(`/super-admin/cases/criminal-details?mode=${mode}&caseId=${row.id}`);
                        }
                      }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600 bg-white">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4338CA]">
              <option>9</option>
              <option>10</option>
              <option>20</option>
            </select>
            <span>out of 40</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded transition font-medium text-gray-700">
              <ChevronLeft size={16} />
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#EEF2FF] text-[#4338CA] font-semibold border border-[#C7D2FE]">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              4
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              5
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              8
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              9
            </button>
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded transition font-medium text-gray-700">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminRefuteApplications;
