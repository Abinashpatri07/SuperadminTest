import { API_BASE_URL } from "../../../API/config.js";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../API/axiosInstance";
import HRActionDropdown from "../hr/HRActionDropdown";

const BASE_URL = `${API_BASE_URL}`;

function TableSection({ page = 1, limit = 10, onDataLoaded }) {
  const [data, setData]           = useState([]);
  const [openMenu, setOpenMenu]   = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading]     = useState(false);

  const navigate = useNavigate();

  /* ── FETCH HRs ── */
  const fetchHRs = async () => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(`${BASE_URL}/api/hr/get-all`, {
        params: { page, limit },
      });
      if (res.success) {
        setData(res.data);
        if (onDataLoaded) {
          onDataLoaded({
            stats:      res.stats,
            pagination: res.pagination,
          });
        }
      }
    } catch (err) {
      console.error("fetch-hrs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRs();
    setSelectedRows([]);
  }, [page, limit]);

  /* ── CLOSE DROPDOWN ON OUTSIDE CLICK ── */
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ── SELECT ALL ── */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  /* ── SELECT SINGLE ── */
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  /* ── STATUS BADGE ── */
  const getStatusBadge = (isActive) => {
    if (isActive === 1) return { label: "Active",     cls: "bg-green-100 text-green-600" };
    if (isActive === 2) return { label: "Inactive",   cls: "bg-orange-100 text-orange-500" };
    if (isActive === 3) return { label: "Terminated", cls: "bg-red-100 text-red-500" };
    return { label: "Unknown", cls: "bg-gray-100 text-gray-500" };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
        Loading HR data...
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
        No HR records found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-visible relative">
      {/* TABLE */}
      <table className="w-full text-sm border-collapse">
        {/* HEADER */}
        <thead className="bg-[#F7F7F7] text-gray-700">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-4 text-left font-semibold">Employee ID</th>
            <th className="px-4 py-4 text-left font-semibold">Name</th>
            <th className="px-4 py-4 text-left font-semibold">E-Mail</th>
            <th className="px-4 py-4 text-left font-semibold">Phone</th>
            <th className="px-4 py-4 text-left font-semibold">Role</th>
            <th className="px-4 py-4 text-left font-semibold">Status</th>
            <th className="px-4 py-4 text-center font-semibold">Action</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((item, index) => {
            const { label, cls } = getStatusBadge(item.isActive);
            return (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >

                {/* EMPLOYEE ID */}
                <td className="px-4 py-5 text-gray-700 font-medium">{item.empId}</td>

                {/* NAME */}
                <td className="px-4 py-5 font-semibold text-gray-900">
                  {item.firstName} {item.lastName}
                </td>

                {/* EMAIL */}
                <td className="px-4 py-5 text-gray-600">
                  {item.email ? item.email.replace(/\[(.*?)\]\(.*?\)/, '$1') : ''}
                </td>

                {/* PHONE */}
                <td className="px-4 py-5 text-gray-700">{item.phone}</td>

                {/* ROLE */}
                <td className="px-4 py-5 text-gray-700">{item.role}</td>

                {/* STATUS */}
                <td className="px-4 py-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-medium ${cls}`}>
                    {label}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-4 py-5 text-center relative overflow-visible">
                  <div
                    className="relative inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 3 DOT MENU */}
                    <button
                      onClick={() => setOpenMenu(openMenu === index ? null : index)}
                      className="text-gray-500 hover:text-black transition"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* DROPDOWN */}
                    {openMenu === index && (
                      <div className="absolute right-10 top-0 z-50">
                        <HRActionDropdown
                          onView={() => {
                            setOpenMenu(null);
                            navigate(`/super-admin/view-hr/${item.id}`);
                          }}
                          onEdit={() => {
                            setOpenMenu(null);
                            navigate(`/super-admin/edit-hr/${item.id}`);
                          }}
                          candidateId={item.empId}
                          hrId={item.id}
                          isPasswordSet={Boolean(item.is_password_set)}
                          onTerminateSuccess={() => {
                            setOpenMenu(null);
                            fetchHRs();
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableSection;
