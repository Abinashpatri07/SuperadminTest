import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import Pagination from "../home/Pagination";
import { downloadSingleInvoicePDF } from "../../../utils/exportPdf";

const COLUMNS = ["Invoice", "Date", "Description", "Status", "Amount", "Download Invoice"];

function TableRow({ row, isLast }) {
  return (
    <tr className={`hover:bg-blue-50/40 transition-colors duration-100 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <td className="px-4 py-3.5 text-sm text-gray-700 font-medium">{row.invoice}</td>
      <td className="px-4 py-3.5 text-sm text-gray-500">{row.date}</td>
      <td className="px-4 py-3.5">
        <div className="text-sm text-gray-900 font-medium">{row.description}</div>
        <div className="text-xs text-gray-400 mt-0.5">{row.subdescription}</div>
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-900 font-semibold">{row.amount}</td>
      <td className="px-4 py-3.5 text-center">
        <button
          title="Download PDF Invoice"
          onClick={() => downloadSingleInvoicePDF(row)}
          className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer bg-transparent"
        >
          📄
        </button>
      </td>
    </tr>
  );
}

export default function InvoiceTable({ rows = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  
  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F3F4F6] border-b border-gray-200">
            {COLUMNS.map((col, idx) => (
              <th
                key={`${col}-${idx}`}
                className={`px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap ${idx === COLUMNS.length - 1 ? 'text-center' : 'text-left'}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No invoices found.</td>
            </tr>
          ) : (
            currentRows.map((row, i) => (
              <TableRow key={i} row={row} isLast={i === currentRows.length - 1} />
            ))
          )}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-white border-t border-gray-200">
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