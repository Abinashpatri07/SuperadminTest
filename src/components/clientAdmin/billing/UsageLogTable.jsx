import React, { useState, useRef, useEffect } from "react";
import Pagination from "../home/Pagination";
import { downloadCSV } from "../../../utils/exportCsv";
import { downloadPDF } from "../../../utils/exportPdf";
import { Upload, FileText, FileDown } from "lucide-react";

const COLUMNS = [
  "Transaction ID",
  "Date & Time",
  "Candidate Name",
  "Package",
  "Unit",
  "Status",
];

function getStatusStyle(status) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-orange-100 text-orange-500";
    case "Failed":
      return "bg-red-100 text-red-500";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

export default function UsageLogTable({ logs = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(logs.length / rowsPerPage);
  
  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLogs = logs.slice(indexOfFirstRow, indexOfLastRow);

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const exportBtnRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportBtnRef.current && !exportBtnRef.current.contains(event.target)) {
        setShowExportModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportLogs = () => {
    if (!logs.length) return alert("No usage logs to export.");
    const exportData = logs.map(log => ({
      "Transaction ID": log.transactionId,
      "Date & Time": log.date,
      "Candidate Name": log.candidate,
      "Package": log.package,
      "Units": log.unit,
      "Status": log.status
    }));
    downloadCSV(exportData, "Usage_Logs.csv");
  };

  const handleDownload = () => {
    if (selectedType === "CSV") {
      handleExportLogs();
    } else if (selectedType === "PDF") {
      if (!logs.length) return alert("No usage logs to export.");
      const exportData = logs.map(log => ({
        "Transaction ID": log.transactionId,
        "Date & Time": log.date,
        "Candidate Name": log.candidate,
        "Package": log.package,
        "Units": log.unit,
        "Status": log.status
      }));
      downloadPDF(exportData, "Usage Logs Report", "Usage_Logs.pdf");
    }
    setShowExportModal(false);
    setSelectedType("");
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            User Activity Overview
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Track Recent Platform Interactions And User Activities.
          </p>

        </div>

        <div className="relative" ref={exportBtnRef}>
          <button 
            onClick={() => setShowExportModal(!showExportModal)}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition shadow-sm"
          >
            <Upload size={16} />
            Export
          </button>
          
          {showExportModal && (
            <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-64 z-50">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Select File Type</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedType("PDF")}
                  className={`flex flex-col items-center justify-center gap-1 border rounded-xl p-3 transition ${
                    selectedType === "PDF"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FileText size={22} className="text-indigo-600" />
                  <span className="text-xs font-medium text-gray-700">PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("CSV")}
                  className={`flex flex-col items-center justify-center gap-1 border rounded-xl p-3 transition ${
                    selectedType === "CSV"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FileDown size={22} className="text-orange-500" />
                  <span className="text-xs font-medium text-gray-700">CSV</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!selectedType}
                className={`w-full py-2.5 rounded-lg text-sm text-white font-semibold transition ${
                  selectedType
                    ? "bg-[#5E3BEE] hover:bg-[#4d30c4] cursor-pointer"
                    : "bg-[#E6E8EA] text-[#A6ACBE] cursor-not-allowed"
                }`}
              >
                Download
              </button>
            </div>
          )}
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

        <table className="w-full border-collapse">

          {/* HEADER */}
          <thead>

            <tr className="bg-[#F3F4F6] border-b border-gray-200">

              {COLUMNS.map((col) => (

                <th
                  key={col}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {col}
                </th>

              ))}

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {currentLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No usage logs found.
                </td>
              </tr>
            ) : (
              currentLogs.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* TRANSACTION */}
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {item.transactionId}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.date}
                  </td>

                  {/* CANDIDATE */}
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {item.candidate}
                  </td>

                  {/* PACKAGE */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.package}
                  </td>

                  {/* UNIT */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.unit}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-white border-t border-gray-200 rounded-b-2xl">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}

    </div>
  );
}