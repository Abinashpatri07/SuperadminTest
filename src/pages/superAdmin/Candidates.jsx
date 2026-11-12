import { useState } from "react";
import axiosInstance from "../../API/axiosInstance";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import ClientPageHeader         from "../../components/superAdmin/client/ClientPageHeader";
import CandidateOverviewSection from "../../components/superAdmin/candidate/CandidateOverviewSection";
import CandidateTableToolbar    from "../../components/superAdmin/candidate/CandidateTableToolbar";
import CandidateTable           from "../../components/superAdmin/candidate/CandidateTable";
import Pagination               from "../../components/clientAdmin/home/Pagination";

const Candidates = () => {

  // ── PAGINATION STATE (same as HR Home.jsx) ───────────
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats]         = useState({
    awaiting: 0,
    profileComplete: 0,
    inProgress: 0,
    verified: 0,
    onHold: 0,
  });

  // ── TOOLBAR STATE ─────────────────────────────────────
  const [searchQuery, setSearchQuery]   = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy]             = useState("");
  const [refreshKey, setRefreshKey]     = useState(0);

  // ── EXPORT MODAL STATE ────────────────────────────────
  const [exportState, setExportState] = useState({ status: "idle", message: "" });

  const handleRefresh = () => {
    setSearchQuery("");
    setActiveFilter("All");
    setSortBy("");
    setPage(1);
    setRefreshKey((k) => k + 1);
  };

  // ── EXPORT HANDLER ─────────────────────────────────────
  const handleExport = async (type) => {
    setExportState({ status: "loading", message: `Preparing ${type} export...` });
    try {
      const { data: res } = await axiosInstance.get(
        "/api/candidate/get-all?limit=100000"
      );

      if (!res.success || !res.data || res.data.length === 0) {
        setExportState({ status: "error", message: "No data available to export." });
        return;
      }

      const formattedData = res.data.map((c) => ({
        "Candidate ID": c.candidateId ?? "",
        "Name":         c.name ?? "",
        "Email":        c.email ?? "",
        "Phone":        c.phone ?? "",
        "Assigned HR":  c.assigned_hr?.name ?? "—",
        "Function":     c.job_function ?? "",
        "Tag":          c.tag ?? "",
        "Status":       c.status ?? "",
        "Date":         c.created_at
          ? new Date(c.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
          : "",
      }));

      if (type === "CSV") {
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook  = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
        XLSX.writeFile(workbook, `Candidates_Export_${new Date().toISOString().slice(0,10)}.csv`);
      } else if (type === "PDF") {
        const doc     = new jsPDF();
        doc.text("Candidates Report", 14, 15);
        const columns = ["Candidate ID","Name","Email","Phone","Status","Function"];
        const rows    = formattedData.map((c) => [
          c["Candidate ID"], c["Name"], c["Email"], c["Phone"], c["Status"], c["Function"],
        ]);
        autoTable(doc, { head:[columns], body:rows, startY:20, styles:{ fontSize:8 } });
        doc.save(`Candidates_Export_${new Date().toISOString().slice(0,10)}.pdf`);
      }

      setExportState({ status:"idle", message:"" });
    } catch (error) {
      console.error("Export error:", error);
      setExportState({ status:"error", message:"Failed to export data. Please try again." });
    }
  };

  return (
    <div className="p-4 flex flex-col gap-5">

      {/* PROFILE HEADER */}
      <ClientPageHeader createType="candidate" showExportButton={false} />

      {/* CANDIDATE OVERVIEW CARDS */}
      <CandidateOverviewSection stats={stats} />

      {/* TOOLBAR */}
      <CandidateTableToolbar
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
        activeFilter={activeFilter}
        onFilterChange={(val) => { setActiveFilter(val); setPage(1); }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* TABLE — with integrated pagination */}
      <CandidateTable
        key={refreshKey}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        sortBy={sortBy}
        page={page}
        onTotalPagesChange={setTotalPages}
        totalPages={totalPages}
        onPageChange={setPage}
        onStatsChange={setStats}
      />

      {/* ── EXPORT STATUS MODAL ── */}
      {exportState.status !== "idle" && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-100 bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center relative">

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
            {exportState.status === "success" && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
            )}
            {exportState.status === "error" && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle size={32} className="text-red-500" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {exportState.status === "loading" ? "Exporting..."
                : exportState.status === "success" ? "Success!"
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
};

export default Candidates;
