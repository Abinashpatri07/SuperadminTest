import { API_BASE_URL } from "../../../API/config.js";
import {
  MoreVertical,
  Mail,
  CheckCircle,
  Loader2,
  Users,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import axiosInstance from "../../../API/axiosInstance";
import { useNavigate } from "react-router-dom";

import ActionDropdown from "../candidate/ActionDropdown";
import RejectModal    from "../candidate/RejectModal";
import OnHoldModal    from "../candidate/OnHoldModal";
import RemoveHoldModal from "../candidate/RemoveHoldModal";
import AssignHRModal  from "../candidate/AssignHRModal";
import BulkAssignHRModal from "../candidate/BulkAssignHRModal";
import Pagination     from "../../clientAdmin/home/Pagination";

const API = `${API_BASE_URL}/api/client-admin/candidate`;

// ── CANDIDATE TABLE ────────────────────────────────────────────────────────────
// onTotalPagesChange → parent ko totalPages batao
function CandidateTable({
  searchQuery = "",
  activeFilter = "All",
  sortBy = "",
  page = 1,
  onTotalPagesChange,
  totalPages = 1,
  onPageChange,
  onStatsChange,
}) {
  const navigate = useNavigate();

  // ── DATA STATE ──
  const [candidates, setCandidates]   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [fetchError, setFetchError]   = useState("");

  // ── MODAL STATE ──
  const [openMenu, setOpenMenu]                                     = useState(null);
  const [showRejectModal, setShowRejectModal]                       = useState(false);
  const [selectedCandidate, setSelectedCandidate]                   = useState(null);
  const [showEmailModal, setShowEmailModal]                         = useState(false);
  const [showOnHoldModal, setShowOnHoldModal]                       = useState(false);
  const [onHoldCandidate, setOnHoldCandidate]                       = useState(null);
  const [showRemoveHoldModal, setShowRemoveHoldModal]               = useState(false);
  const [removeHoldCandidate, setRemoveHoldCandidate]               = useState(null);
  const [selectedRows, setSelectedRows]                             = useState([]);
  const [showAssignHRModal, setShowAssignHRModal]                   = useState(false);
  const [assignHRCandidate, setAssignHRCandidate]                   = useState(null);
  const [showBulkAssignHRModal, setShowBulkAssignHRModal]           = useState(false);
  const [emailSending, setEmailSending]                             = useState(false);

  const menuRefs = useRef([]);

  // ── CLOSE DROPDOWN ON OUTSIDE CLICK ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideAny = menuRefs.current.some((ref) => ref && ref.contains(e.target));
      if (!clickedInsideAny) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── FETCH ──
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (activeFilter && activeFilter !== "All") params.append("status", activeFilter);

      const { data: res } = await axiosInstance.get(`${API}/list?${params.toString()}`);

      if (res.success) {
        let data = res.data || [];
        if (sortBy === "name") {
          data = [...data].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (sortBy === "date") {
          data = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        setCandidates(data);
        if (onTotalPagesChange && res.pagination) {
          onTotalPagesChange(res.pagination.totalPages || 1);
        }
        if (onStatsChange && res.stats) {
          onStatsChange(res.stats);
        }
      }
    } catch (err) {
      console.error("Fetch candidates error:", err);
      setFetchError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, activeFilter, sortBy]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // ── SEND EMAIL ──
  const handleSendEmail = async (candidate) => {
    setEmailSending(true);
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/api/client-admin/candidate/send-welcome-email/${candidate.id}`);
      if (response.data.success) {
        setShowEmailModal(true);
      } else {
        alert(response.data.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Send email error:", error);
      alert(error.response?.data?.message || "Error sending email");
    } finally {
      setEmailSending(false);
    }
  };

  // ── STATUS STYLE ──
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":  return "bg-orange-100 text-orange-500";
      case "Verified":     return "bg-teal-100 text-teal-600";
      case "Complete":     return "bg-green-100 text-green-600";
      case "On Hold":      return "bg-yellow-100 text-yellow-600";
      case "Rejected":     return "bg-red-100 text-red-500";
      case "Pending":      return "bg-gray-100 text-gray-500";
      default:             return "bg-gray-100 text-gray-500";
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(candidates.map((item) => item.id));
    else setSelectedRows([]);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* ── REJECT MODAL ── */}
      {showRejectModal && (
        <RejectModal
          candidate={selectedCandidate}
          onClose={() => { setShowRejectModal(false); setSelectedCandidate(null); }}
          onSuccess={() => fetchCandidates()}
        />
      )}

      {/* ── ON HOLD MODAL ── */}
      {showOnHoldModal && (
        <OnHoldModal
          candidate={onHoldCandidate}
          onClose={() => { setShowOnHoldModal(false); setOnHoldCandidate(null); }}
          onSuccess={() => fetchCandidates()}
        />
      )}

      {/* ── REMOVE HOLD MODAL ── */}
      {showRemoveHoldModal && (
        <RemoveHoldModal
          candidate={removeHoldCandidate}
          onClose={() => { setShowRemoveHoldModal(false); setRemoveHoldCandidate(null); }}
          onSuccess={() => fetchCandidates()}
        />
      )}

      {/* ── ASSIGN HR MODAL ── */}
      {showAssignHRModal && (
        <AssignHRModal
          candidate={assignHRCandidate}
          onClose={() => { setShowAssignHRModal(false); setAssignHRCandidate(null); }}
          onSuccess={() => fetchCandidates()}
        />
      )}

      {/* ── BULK ASSIGN HR MODAL ── */}
      {showBulkAssignHRModal && (
        <BulkAssignHRModal
          candidateIds={selectedRows}
          onClose={() => setShowBulkAssignHRModal(false)}
          onSuccess={() => {
            setShowBulkAssignHRModal(false);
            setSelectedRows([]);
            fetchCandidates();
          }}
        />
      )}

      {/* ── EMAIL SUCCESS MODAL ── */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl w-120 overflow-hidden shadow-xl text-center">
            <div className="relative bg-purple-600 h-40 flex items-center justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
              <div className="relative z-10 mb-2">
                <Mail size={56} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="px-8 py-6">
              <h2 className="text-lg font-bold text-purple-600 mb-2">E-Mail has been Sent Successfully</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="mt-6 border border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING BULK ACTION BAR ── */}
      {selectedRows.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#02027A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-[9999]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
              <CheckCircle size={22} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-indigo-200">Selected Candidates</p>
              <h3 className="text-lg font-semibold">{selectedRows.length} Candidates Selected</h3>
            </div>
          </div>
          <button
            onClick={() => setShowBulkAssignHRModal(true)}
            className="bg-white text-[#02027A] hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-semibold transition"
          >
            Bulk Assign
          </button>
        </div>
      )}

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#FAFAFA] border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.length === candidates.length && candidates.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-left whitespace-nowrap">Candidate ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-left">Date</th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-left">Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-left">Phone</th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-left">Assigned HR</th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-left">Function / Tag</th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-left">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-[#1F2937] text-center w-20">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={36} className="text-[#4338CA] animate-spin" />
                    <p className="text-sm text-gray-400">Loading candidates...</p>
                  </div>
                </td>
              </tr>
            ) : fetchError ? (
              <tr>
                <td colSpan="9">
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <p className="text-sm text-red-500">{fetchError}</p>
                    <button
                      onClick={fetchCandidates}
                      className="px-4 py-1.5 bg-[#02027A] text-white text-sm rounded-lg hover:opacity-90"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Users size={40} className="text-gray-300" />
                    <p className="text-sm text-gray-400">
                      {searchQuery
                        ? `No results for "${searchQuery}"`
                        : "No candidates found. Add one to get started!"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              candidates.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-[#FAFAFA] transition-all duration-150"
                >
                  <td className="px-4 py-1.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleRowSelect(item.id)}
                      className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-1.5 text-sm text-gray-700 font-mono">{item.candidateId}</td>

                  <td className="px-4 py-1.5">
                    <div className="text-sm text-gray-700 font-medium">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
                        : "—"}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true })
                        : ""}
                    </div>
                  </td>

                  <td className="px-4 py-1.5">
                    <div className="font-semibold text-sm text-gray-900 leading-tight">{item.name}</div>
                    <div className="text-[11px] text-gray-400">{item.email}</div>
                  </td>

                  <td className="px-4 py-1.5 text-sm text-gray-700">{item.phone}</td>

                  <td className="px-4 py-1.5">
                    {item.assigned_hr ? (
                      <>
                        <div className="text-sm text-gray-800 font-medium">{item.assigned_hr.name}</div>
                        <div className="text-[11px] text-gray-400">{item.assigned_hr.email}</div>
                      </>
                    ) : (
                      <span className="text-[11px] text-gray-300 italic">Not assigned</span>
                    )}
                  </td>

                  <td className="px-4 py-1.5">
                    <div className="text-sm text-gray-800 font-medium leading-tight">
                      {item.job_function || <span className="text-gray-300">—</span>}
                    </div>
                    {item.tag && (
                      <div className="text-[11px] text-gray-400">{item.tag}</div>
                    )}
                  </td>

                  <td className="px-4 py-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-1.5 text-center w-20">
                    <div className="relative inline-block" ref={(el) => (menuRefs.current[index] = el)}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === index ? null : index); }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        <MoreVertical size={18} className="text-gray-500" />
                      </button>

                      {openMenu === index && (
                        <div className={`absolute right-12 w-56 z-[9999] ${index >= candidates.length - 3 ? "bottom-10" : "top-10"}`}>
                          <ActionDropdown
                            candidateStatus={item.status}
                            onView={() => { navigate(`/admin/view/${item.id}`); setOpenMenu(null); }}
                            onEdit={() => { navigate(`/admin/edit-candidate/${item.id}`); setOpenMenu(null); }}
                            onEmail={() => { handleSendEmail(item); setOpenMenu(null); }}
                            onAssignHr={() => { setAssignHRCandidate(item); setShowAssignHRModal(true); setOpenMenu(null); }}
                            onAuditLog={() => { navigate("/admin/audit-log"); setOpenMenu(null); }}
                            onHold={() => { setOnHoldCandidate(item); setShowOnHoldModal(true); setOpenMenu(null); }}
                            onRemoveHold={() => { setRemoveHoldCandidate(item); setShowRemoveHoldModal(true); setOpenMenu(null); }}
                            onReject={() => { setSelectedCandidate(item); setShowRejectModal(true); setOpenMenu(null); }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION (Moved inside the table container) */}
        <div className="p-4 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}

export default CandidateTable;
