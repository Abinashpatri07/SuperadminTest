import React, { useState, useEffect } from "react";
import { FileDown, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import * as XLSX from "xlsx";

import AuditFilters from "../../components/clientAdmin/candidate/AuditFilters";
import AuditTable from "../../components/clientAdmin/candidate/AuditTable";
import Pagination from "../../components/clientAdmin/home/Pagination";

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("All Modules");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exportState, setExportState] = useState({ status: "idle", message: "" });

  const rowsPerPage = 10;

  useEffect(() => {
    fetchAuditLogs();
  }, [page, search, module, dateFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/audit", {
        params: {
          page,
          limit: rowsPerPage,
          search,
          module,
          dateFilter,
        }
      });
      if (res.data.success) {
        setLogs(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExportState({ status: "loading", message: "Preparing CSV export..." });
    try {
      const res = await axiosInstance.get("/api/audit", {
        params: { page: 1, limit: 100000, search, module, dateFilter }
      });
      if (res.data.success && res.data.data.length > 0) {
        const formattedData = res.data.data.map(log => {
          const dateObj = new Date(log.created_at);
          const datetime = dateObj.toLocaleDateString("en-IN", {
            month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
          });
          const name = log.firstname || log.lastname ? `${log.firstname || ''} ${log.lastname || ''}`.trim() : "Unknown";
          
          return {
            "User": name,
            "Role": log.role_name || "System User",
            "Action": log.action || "System Event",
            "Module": log.module_type || "General",
            "IP Address": log.ip || "—",
            "Status": log.status || "—",
            "Details": log.remarks || "—",
            "Date": datetime,
          };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");
        XLSX.writeFile(workbook, `Audit_Logs_Export_${new Date().toISOString().slice(0,10)}.csv`);

        setExportState({ status: "idle", message: "" });
      } else {
        setExportState({ status: "error", message: "No data available to export." });
      }
    } catch (error) {
      console.error("Export error:", error);
      setExportState({ status: "error", message: "Failed to export data. Please try again." });
    }
  };

  return (
    <div className="min-h-screen px-10 py-9 font-sans">
      {/* PAGE HEADER */}
      <div className="flex items-start justify-between mb-6">
        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            System Audit Log
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            A Comprehensive, Immutable Record Of All Activities Across Your Organization.
          </p>
        </div>

        {/* EXPORT BUTTON */}
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition cursor-pointer shadow-sm"
        >
          <FileDown size={16} />
          Export CSV
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
        {/* FILTERS */}
        <AuditFilters 
          onSearch={(val) => { setSearch(val); setPage(1); }} 
          onModuleChange={(val) => { setModule(val); setPage(1); }} 
          onDateChange={(val) => { setDateFilter(val); setPage(1); }}
        />

        {/* DIVIDER */}
        <div className="border-b border-gray-200 my-5" />

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-16 text-indigo-500 font-medium">Loading Audit Logs...</div>
        ) : (
          <>
            <AuditTable rows={logs} />
            
            {/* EMPTY STATE */}
            {logs.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                No Audit Records Found.
              </div>
            )}
          </>
        )}

        {/* PAGINATION */}
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* ── EXPORT STATUS MODAL ── */}
      {exportState.status !== "idle" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center relative">

            {exportState.status !== "loading" && (
              <button
                onClick={() => setExportState({ status:"idle", message:"" })}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            {exportState.status === "loading" && (
              <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
            )}
            {exportState.status === "error" && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle size={32} className="text-red-500" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {exportState.status === "loading" ? "Exporting..."
                : "Error"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">{exportState.message}</p>

            {exportState.status !== "loading" && (
              <button
                onClick={() => setExportState({ status:"idle", message:"" })}
                className="w-full bg-[#02027A] text-white font-semibold py-3 rounded-xl hover:bg-[#01016a] transition cursor-pointer"
              >
                Okay
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
