import {
  Eye,
  Pencil,
  Mail,
  Ban,
  PauseCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TableToolbar from "./TableToolbar";
import { tableData } from "../data/tableData";
import HRActionDropdown from "../hr/HRActionDropdown";

function TableSection({ isToolBarRequired, data, onAction }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const navigate = useNavigate();

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  // SELECT ALL
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(
        data.map((item) => item.cand_id)
      );
    } else {
      setSelectedRows([]);
    }
  };

  // SELECT SINGLE ROW
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-visible relative">

      {/* TOOLBAR */}
      {isToolBarRequired && <TableToolbar />}

      {/* TABLE */}
      <table className="w-full text-sm border-collapse">

        {/* HEADER */}
        <thead className="bg-[#F7F7F7] text-gray-700">
          <tr className="border-b border-gray-200">

            <th className="px-4 py-4 text-left font-semibold">
              Employee ID
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Name
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              E-Mail
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Phone
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Role
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Status
            </th>

            <th className="px-4 py-4 text-center font-semibold">
              Action
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F4F4F4]/30"
                }`}
              >

                <td className="px-4 py-4 font-medium text-gray-900">
                  {row.empId}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800">
                      {row.firstName} {row.lastName}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-gray-600">{row.email}</td>
                <td className="px-4 py-4 text-gray-600">{row.phone}</td>
                
                <td className="px-4 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {row.role}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      row.isActive === 3
                        ? "bg-red-50 text-red-600"
                        : "bg-[#E6F9EE] text-[#00A843]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        row.isActive === 3 ? "bg-red-500" : "bg-[#00A843]"
                      }`}
                    ></span>
                    {row.isActive === 3 ? "Suspended" : "Active"}
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-4 text-center relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === row.id ? null : row.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-500"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* ACTION DROPDOWN */}
                  {openMenu === row.id && (
                    <div className="absolute right-10 top-0 z-10">
                      <HRActionDropdown
                        hrId={row.id}
                        isPasswordSet={Boolean(row.is_password_set)}
                        hrName={`${row.firstName} ${row.lastName}`}
                        onView={() => { navigate(`/admin/view-hr/${row.id}`); setOpenMenu(null); }}
                        onEdit={() => { navigate(`/admin/edit-hr/${row.id}`); setOpenMenu(null); }}
                        onTerminate={() => { onAction && onAction("terminate", row.id); setOpenMenu(null); }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-10 text-gray-500">
                No HRs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableSection;