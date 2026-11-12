import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import {
  UsersRound,
  UserCheck,
  UserX,
  UserMinus,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ClientPageHeader from "../../components/superAdmin/client/ClientPageHeader";
import ClientStatCards from "../../components/superAdmin/client/ClientStatCards";
import ClientTable from "../../components/superAdmin/client/ClientTable";
import ClientPagination from "../../components/superAdmin/client/ClientPagination";

export default function ClientListPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [statsData, setStatsData] = useState([
    { title: "Total",     value: "0", icon: UsersRound, iconBg: "bg-indigo-100",  iconColor: "text-indigo-600" },
    { title: "Active",    value: "0", icon: UserCheck,  iconBg: "bg-green-100",   iconColor: "text-green-500" },
    { title: "Inactive",  value: "0", icon: UserX,      iconBg: "bg-orange-100",  iconColor: "text-orange-500" },
    { title: "Suspended", value: "0", icon: UserMinus,  iconBg: "bg-red-100",     iconColor: "text-red-500" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);

  useEffect(() => {
    fetchClients();
  }, [currentPage, perPage]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/api/client/get-all-clients?page=${currentPage}&limit=${perPage}`);
      if (res.data.success) {
        // Map backend data to match ClientTable expected format
        const formattedData = res.data.data.map(client => ({
          id: client.id,                          // raw cm_id (numeric)
          displayId: `CLT${client.id}`,           // formatted for display
          name: client.name,
          gst: client.gst,
          pocName: client.contactPersonName || "—",
          pocEmail: client.contactEmail || "—",
          pocPhone: client.contactPhone || "—",
          city: client.city || "—",
          state: client.state || "—",
          status:
            Number(client.is_suspend) === 1 ? "Suspended" :
            Number(client.is_active) === 1 ? "Active" :
            "In Active",
          is_password_set: Boolean(client.is_password_set),
        }));
        setClients(formattedData);
        setTotalClients(res.data.pagination.total);

        // Update stats
        if (res.data.stats) {
          setStatsData([
            { title: "Total",     value: res.data.stats.total.toString().padStart(2, '0'),     icon: UsersRound, iconBg: "bg-indigo-100",  iconColor: "text-indigo-600" },
            { title: "Active",    value: res.data.stats.active.toString().padStart(2, '0'),    icon: UserCheck,  iconBg: "bg-green-100",   iconColor: "text-green-500" },
            { title: "Inactive",  value: res.data.stats.inactive.toString().padStart(2, '0'),  icon: UserX,      iconBg: "bg-orange-100",  iconColor: "text-orange-500" },
            { title: "Suspended", value: res.data.stats.suspended.toString().padStart(2, '0'), icon: UserMinus,  iconBg: "bg-red-100",     iconColor: "text-red-500" },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───────────────── SEND EMAIL ───────────────── */
  const handleSendEmail = async (clientId) => {
    try {
      setPopupMessage(null); // Clear previous popup
      const res = await axiosInstance.post(`/api/client/send-welcome-email/${clientId}`);
      if (res.data.success) {
        setPopupMessage({ type: "success", text: "Welcome email sent successfully." });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setPopupMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to send email." 
      });
    }
    setTimeout(() => setPopupMessage(null), 3000);
  };

  /* ───────────────── EXPORT ───────────────── */
  const handleExport = (type) => {
    if (clients.length === 0) {
      setPopupMessage({ type: "error", text: "No data to export" });
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    const exportData = clients.map((client) => ({
      "Display ID": client.displayId,
      "Name": client.name,
      "GST": client.gst,
      "POC Name": client.pocName,
      "POC Email": client.pocEmail,
      "POC Phone": client.pocPhone,
      "City": client.city,
      "State": client.state,
      "Status": client.status,
    }));

    if (type === "CSV") {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
      XLSX.writeFile(workbook, "ClientsData.csv");
    } else if (type === "PDF") {
      const doc = new jsPDF();
      doc.text("Clients Data", 14, 10);

      const tableColumn = Object.keys(exportData[0]);
      const tableRows = exportData.map(obj => Object.values(obj));

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 15,
        styles: { fontSize: 8 },
      });

      doc.save("ClientsData.pdf");
    }
  };

  return (
    <div className="p-4 flex flex-col relative">

      {/* Toast Popup */}
      {popupMessage && (
        <div className="fixed top-6 right-6 z-[9999] animate-[fadeIn_0.3s_ease-out]">
          <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg border-l-4 ${
            popupMessage.type === "success" ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
          }`}>
            {popupMessage.type === "success" ? (
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <div className="flex flex-col">
              <span className="font-bold">{popupMessage.type === "success" ? "Success!" : "Action Failed"}</span>
              <span className="text-sm">{popupMessage.text}</span>
            </div>
            <button onClick={() => setPopupMessage(null)} className="ml-4 text-gray-400 hover:text-gray-600 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <ClientPageHeader onExport={handleExport} />

      {/* Stat Cards */}
      <div className="mt-5">
        <ClientStatCards stats={statsData} />
      </div>

      {/* Table */}
      <ClientTable
        data={clients}
        isLoading={isLoading}
        onView={(row) => navigate(`/super-admin/clients/view/${row.id}`)}
        onEdit={(row) => navigate(`/super-admin/clients/edit/${row.id}`)}
        onEmail={(row) => handleSendEmail(row.id)}
        onSuspend={() => fetchClients()}
      />

      {/* Pagination */}
      {totalClients > 0 && (
        <ClientPagination
          total={totalClients}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPerPageChange={(val) => {
            setPerPage(val);
            setCurrentPage(1);
          }}
        />
      )}

    </div>
  );
}