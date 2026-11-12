import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import {
  RefreshCw,
  ListFilter,
  Calendar,
  Search,
  Upload,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MoreVertical,
  UserPlus,
  CheckCircle,
  SlidersHorizontal,
  X,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkAssignVendorModal from "../../components/superAdmin/cases/BulkAssignVendorModal";
import ClientPageHeader from "../../components/superAdmin/client/ClientPageHeader";
import ClientPagination from "../../components/superAdmin/client/ClientPagination";

// Exact custom SVG Icons matching the design
const AssignedIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <circle cx="12" cy="11" r="2.5"></circle>
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0"></path>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#8b5cf6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M12 7v5l3 3"></path>
      </svg>
    </div>
  </div>
);

const VerifiedIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <circle cx="12" cy="11" r="2.5"></circle>
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0"></path>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#22c55e" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M8 12l3 3 5-5"></path>
      </svg>
    </div>
  </div>
);

const RefuteIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="14" x2="15" y2="14"></line>
      <line x1="9" y1="18" x2="15" y2="18"></line>
      <line x1="9" y1="10" x2="11" y2="10"></line>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M15 9l-6 6"></path>
        <path d="M9 9l6 6"></path>
      </svg>
    </div>
  </div>
);

const UnverifiedIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="14" x2="15" y2="14"></line>
      <line x1="9" y1="18" x2="15" y2="18"></line>
      <line x1="9" y1="10" x2="11" y2="10"></line>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </div>
  </div>
);

const PendingIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <circle cx="12" cy="11" r="2.5"></circle>
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0"></path>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <circle cx="8" cy="12" r="1.5" fill="white" stroke="none"></circle>
        <circle cx="12" cy="12" r="1.5" fill="white" stroke="none"></circle>
        <circle cx="16" cy="12" r="1.5" fill="white" stroke="none"></circle>
      </svg>
    </div>
  </div>
);

 

const getStatusBadge = (status) => {
  switch (status) {
    case "Assigned":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F3E8FF] text-[#7E22CE]">
          {status}
        </span>
      );
    case "Verified":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D]">
          {status}
        </span>
      );
    case "Refute":
    case "Rejected":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C]">
          {status}
        </span>
      );
    case "Hold":
    case "On Hold":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          {status}
        </span>
      );
    case "Unverified":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748B]">
          {status}
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};

function SuperAdminCases() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showBulkAssignVendorModal, setShowBulkAssignVendorModal] = useState(false);
  const [assignVendorCaseIds, setAssignVendorCaseIds] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [caseTypeFilter, setCaseTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = storedUser.name || storedUser.first_name || "Super Admin";

  const assignedCount = tableData.filter(c => c.status === "Assigned").length;
  const pendingCount = tableData.filter(c => c.status === "Pending").length;
  const verifiedCount = tableData.filter(c => c.status === "Verified").length;
  const refuteCount = tableData.filter(c => c.status === "Refute" || c.status === "Refuted").length;
  const unverifiedCount = tableData.filter(c => c.status === "Unverified" || c.status === "Un-Verified").length;

  const formatCount = (num) => (num < 10 ? `0${num}` : num);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const API_BASE = API_BASE_URL;
      const response = await axiosInstance.get(`${API_BASE}/api/superadmin/cases/get-all`);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();

    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter Data
  const filteredData = tableData.filter((row) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (row.caseId && row.caseId.toLowerCase().includes(q)) ||
      (row.candidateId && String(row.candidateId).toLowerCase().includes(q)) ||
      (row.name && row.name.toLowerCase().includes(q)) ||
      (row.email && row.email.toLowerCase().includes(q)) ||
      (row.phone && row.phone.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "All" ||
      row.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesCaseType =
      caseTypeFilter === "All" ||
      row.caseType?.toLowerCase().includes(caseTypeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCaseType;
  });

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedRows = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAll = () => {
    if (selectedRows.length === paginatedRows.length && paginatedRows.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedRows.map((row) => row.id));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCaseTypeFilter("All");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "All" || caseTypeFilter !== "All";

  return (
    <>
      {showBulkAssignVendorModal && (
        <BulkAssignVendorModal
          caseIds={assignVendorCaseIds}
          onClose={() => {
            setShowBulkAssignVendorModal(false);
            setAssignVendorCaseIds([]);
          }}
          onSuccess={() => {
            setShowBulkAssignVendorModal(false);
            setAssignVendorCaseIds([]);
            setSelectedRows([]);
            fetchCases();
          }}
        />
      )}

      {selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#02027A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-[9999]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
              <CheckCircle size={22} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-indigo-200">Selected Cases</p>
              <h3 className="text-lg font-semibold">{selectedRows.length} Cases Selected</h3>
            </div>
          </div>
          <button
            onClick={() => {
              setAssignVendorCaseIds(selectedRows);
              setShowBulkAssignVendorModal(true);
            }}
            className="bg-white text-[#02027A] hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer"
          >
            Assign Vendor
          </button>
        </div>
      )}

      <div className="p-4 flex flex-col gap-5 pb-6">
                {/* HEADER SECTION */}
        <ClientPageHeader
          showCreateButton={false}
          showExportButton={false}
        />

        {/* STATS CARDS SECTION - CLICK TO FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div 
            onClick={() => {
              setStatusFilter(prev => prev === "Assigned" ? "All" : "Assigned");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
              statusFilter === "Assigned"
                ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md"
                : "border-gray-100 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-800 leading-5">Assigned Application</h3>
              <div className="shrink-0"><AssignedIcon /></div>
            </div>
            <div className="flex items-end justify-between mt-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(assignedCount)}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusFilter === "Assigned" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {statusFilter === "Assigned" ? "Active Filter" : "Filter"}
              </span>
            </div>
          </div>

          <div 
            onClick={() => {
              setStatusFilter(prev => prev === "Pending" ? "All" : "Pending");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
              statusFilter === "Pending"
                ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20 shadow-md"
                : "border-gray-100 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-800 leading-5">Pending Application</h3>
              <div className="shrink-0"><PendingIcon /></div>
            </div>
            <div className="flex items-end justify-between mt-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(pendingCount)}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusFilter === "Pending" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {statusFilter === "Pending" ? "Active Filter" : "Filter"}
              </span>
            </div>
          </div>

          <div 
            onClick={() => {
              setStatusFilter(prev => prev === "Verified" ? "All" : "Verified");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
              statusFilter === "Verified"
                ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md"
                : "border-gray-100 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-800 leading-5">Verified Application</h3>
              <div className="shrink-0"><VerifiedIcon /></div>
            </div>
            <div className="flex items-end justify-between mt-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(verifiedCount)}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusFilter === "Verified" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {statusFilter === "Verified" ? "Active Filter" : "Filter"}
              </span>
            </div>
          </div>

          <div 
            onClick={() => {
              setStatusFilter(prev => prev === "Refute" ? "All" : "Refute");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
              statusFilter === "Refute"
                ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/20 shadow-md"
                : "border-gray-100 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-800 leading-5">Refute Application</h3>
              <div className="shrink-0"><RefuteIcon /></div>
            </div>
            <div className="flex items-end justify-between mt-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(refuteCount)}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusFilter === "Refute" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {statusFilter === "Refute" ? "Active Filter" : "Filter"}
              </span>
            </div>
          </div>

          <div 
            onClick={() => {
              setStatusFilter(prev => prev === "Unverified" ? "All" : "Unverified");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
              statusFilter === "Unverified"
                ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20 shadow-md"
                : "border-gray-100 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-800 leading-5">Un-Verified Application</h3>
              <div className="shrink-0"><UnverifiedIcon /></div>
            </div>
            <div className="flex items-end justify-between mt-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(unverifiedCount)}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusFilter === "Unverified" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {statusFilter === "Unverified" ? "Active Filter" : "Filter"}
              </span>
            </div>
          </div>
        </div>

        {/* ── FILTER & SEARCH TOOLBAR ── */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          {/* Left: Search Input */}
          <div className="flex items-center gap-2.5 w-full sm:w-80 md:w-96 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by Case ID, Candidate ID, Name, Phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 text-xs text-gray-800 placeholder-gray-400 bg-transparent outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right: Filter Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs">
              <span className="text-gray-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-gray-800 font-semibold outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Verified">Verified</option>
                <option value="Refute">Refute</option>
                <option value="Hold">Hold</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>

            {/* Case Type Filter */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs">
              <span className="text-gray-500 font-medium">Verification Type:</span>
              <select
                value={caseTypeFilter}
                onChange={(e) => {
                  setCaseTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-gray-800 font-semibold outline-none cursor-pointer max-w-[170px] truncate"
              >
                <option value="All">All Types</option>
                <option value="Identification">Identification</option>
                <option value="Address Verification">Address Verification</option>
                <option value="Education Verification">Education Verification</option>
                <option value="Employment Verification">Employment Verification</option>
                <option value="Drug Test">Drug Test</option>
                <option value="Criminal Check">Criminal Check</option>
                <option value="Reference Check">Reference Check</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition"
                title="Clear all filters"
              >
                <X size={14} /> Clear Filters
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={() => {
                fetchCases();
              }}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-gray-200 transition"
              title="Refresh Cases"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-indigo-600" : ""} />
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-sm flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse">
              <thead className="bg-[#FAFAFA] border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4 w-12 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                      checked={
                        selectedRows.length === paginatedRows.length &&
                        paginatedRows.length > 0
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
                  <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-16 text-center text-gray-500 text-sm">
                      {loading ? "Loading cases..." : "No cases found matching your filters."}
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
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
                      <td className="px-5 py-2.5 text-sm text-gray-700 font-mono font-medium">
                        {row.caseId}
                      </td>
                      <td className="px-5 py-2.5 text-sm text-gray-700">{row.candidateId}</td>
                      <td className="px-5 py-2.5">
                        <div className="text-sm text-gray-800 font-medium">
                          {row.caseType.split(" ")[0]}
                        </div>
                        {row.caseType.split(" ")[1] && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {row.caseType.split(" ").slice(1).join(" ")}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-2.5">
                        <div className="font-semibold text-[15px] text-gray-900 leading-5">{row.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{row.email}</div>
                      </td>
                      <td className="px-5 py-2.5 text-sm text-gray-700">+91 {row.phone}</td>
                      <td className="px-5 py-2.5 text-sm text-gray-700">{row.tat}</td>
                      <td className="px-5 py-2.5">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(row.status)}
                          {row.vendorName && (
                            <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                              {row.vendorName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-2.5 text-center w-20">
                        <div className="relative inline-block text-left">
                          <button 
                            className="p-2 rounded-lg hover:bg-gray-100 transition inline-flex justify-center items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === row.id ? null : row.id);
                            }}
                          >
                            <MoreVertical size={18} className="text-gray-500" />
                          </button>
                          
                          {openDropdownId === row.id && (
                            <div className="absolute right-8 top-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                              <button
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4338CA] transition-colors"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  const mode = "view";
                                  if (row.caseType.includes("Identification")) {
                                    navigate(`/super-admin/identification-details?mode=${mode}&caseId=${row.id}`);
                                  } else if (row.caseType.includes("Employment Verification") || row.caseType.includes("Internship")) {
                                    navigate(`/super-admin/employment-details?mode=${mode}&caseId=${row.id}`);
                                  } else if (row.caseType.includes("Address Verification")) {
                                    navigate(`/super-admin/address-details?mode=${mode}&caseId=${row.id}`);
                                  } else if (row.caseType.includes("Drug Test")) {
                                    navigate(`/super-admin/drug-test-details?mode=${mode}&caseId=${row.id}`);
                                  } else if (row.caseType.includes("Education Verification")) {
                                    navigate(`/super-admin/education-details?mode=${mode}&caseId=${row.id}`);
                                  } else if (row.caseType.includes("Criminal Check")) {
                                    navigate(`/super-admin/criminal-details?mode=${mode}&caseId=${row.id}`);
                                  } else if (row.caseType.includes("Reference Check")) {
                                    navigate(`/super-admin/reference-details?mode=${mode}&caseId=${row.id}`);
                                  } else {
                                    navigate(`/super-admin/view/${row.candId || row.candidateId}`);
                                  }
                                }}
                              >
                                <Eye size={15} />
                                View Details
                              </button>
                              {(!row.vendorId && !["Assigned", "In Progress", "Verified", "Refute", "Hold"].includes(row.status)) && (
                                <button
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4338CA] transition-colors border-t border-gray-100"
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    setAssignVendorCaseIds([row.id]);
                                    setShowBulkAssignVendorModal(true);
                                  }}
                                >
                                  <UserPlus size={15} />
                                  Assign Vendor
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <div className="mt-2">
            <ClientPagination
              total={filteredData.length}
              perPage={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPerPageChange={(val) => {
                setPageSize(val);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default SuperAdminCases;
