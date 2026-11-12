import { useState } from "react";
import axiosInstance from "../../API/axiosInstance";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import ClientPageHeader from "../../components/superAdmin/client/ClientPageHeader";
import HrOverviewSection from "../../components/superAdmin/hr/HrOverviewSession";
import TableSection from "../../components/superAdmin/hr/TableSection";
import Pagination from "../../components/superAdmin/client/ClientPagination";

const Hr = () => {
  const [page, setPage]   = useState(1);
  const [limit, setLimit] = useState(10);

  const [stats, setStats]           = useState({});
  const [totalCount, setTotalCount] = useState(0);

  // Modal State for Export: idle, loading, success, error
  const [exportState, setExportState] = useState({ status: "idle", message: "" });

  /* Called by TableSection whenever it fetches fresh data */
  const handleDataLoaded = ({ stats: s, pagination: p }) => {
    setStats(s);
    setTotalCount(p.total);
  };

  /* Handle Export (CSV or PDF) */
  const handleExport = async (type) => {
    setExportState({ status: "loading", message: `Preparing ${type} export...` });

    try {
      // Fetch all records for export by sending a very large limit
      const { data: res } = await axiosInstance.get("/api/hr/get-all?limit=100000");
      
      if (!res.success || !res.data || res.data.length === 0) {
        setExportState({ status: "error", message: "No data available to export." });
        return;
      }

      // Format data
      const formattedData = res.data.map((hr) => {
        let cleanEmail = hr.email || "";
        if (typeof cleanEmail === "string" && cleanEmail.startsWith("[")) {
          cleanEmail = cleanEmail.replace(/\[(.*?)\]\(.*?\)/, "$1");
        }
        
        let statusText = "Unknown";
        if (hr.isActive === 1) statusText = "Active";
        else if (hr.isActive === 2) statusText = "Inactive";
        else if (hr.isActive === 3) statusText = "Terminated";

        return {
          "EMP ID": hr.empId,
          "Name": `${hr.firstName} ${hr.lastName}`,
          "Email": cleanEmail,
          "Phone": hr.phone,
          "Role": hr.role,
          "Status": statusText,
          "Created At": new Date(hr.createdAt).toLocaleDateString(),
        };
      });

      if (type === "CSV") {
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "HR Data");
        XLSX.writeFile(workbook, "HR_Export.csv");
      } else if (type === "PDF") {
        const doc = new jsPDF();
        doc.text("Platform HR Directory", 14, 15);
        
        const tableColumn = ["EMP ID", "Name", "Email", "Phone", "Role", "Status"];
        const tableRows = formattedData.map((hr) => [
          hr["EMP ID"],
          hr["Name"],
          hr["Email"],
          hr["Phone"],
          hr["Role"],
          hr["Status"],
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 20,
          styles: { fontSize: 8 },
        });

        doc.save("HR_Export.pdf");
      }

      setExportState({ status: "idle", message: "" });
    } catch (error) {
      console.error("Export error:", error);
      setExportState({ status: "error", message: "Failed to export data. Please try again." });
    }
  };

  return (
    <div className="p-4 flex flex-col relative">

      {/* HEADER */}
      <ClientPageHeader
        createType="hr"
        showCreateButton={true}
        showExportButton={true}
        onExport={handleExport}
      />

      {/* HR OVERVIEW */}
      <div className="mt-6">
        <HrOverviewSection stats={stats} />
      </div>

      {/* TABLE */}
      <div className="mt-6">
        <TableSection
          page={page}
          limit={limit}
          onDataLoaded={handleDataLoaded}
        />
      </div>

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination
          total={totalCount}
          perPage={limit}
          currentPage={page}
          onPageChange={(p) => setPage(p)}
          onPerPageChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      {/* EXPORT MODAL POPUP */}
      {exportState.status !== "idle" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center relative">
            
            {/* CLOSE BUTTON (ONLY IF NOT LOADING) */}
            {exportState.status !== "loading" && (
              <button 
                onClick={() => setExportState({ status: "idle", message: "" })}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            {/* ICONS */}
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

            {/* MESSAGE */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {exportState.status === "loading" ? "Exporting..." : 
               exportState.status === "success" ? "Success!" : "Error"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {exportState.message}
            </p>

            {/* OKAY BUTTON (ONLY IF NOT LOADING) */}
            {exportState.status !== "loading" && (
              <button
                onClick={() => setExportState({ status: "idle", message: "" })}
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

export default Hr;