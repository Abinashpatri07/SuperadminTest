import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../../API/axiosInstance";
import {
  MoreVertical,
  Mail,
  Eye,
  Pencil,
  Trash2,
  X,
  MinusCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientPagination from "../client/ClientPagination";

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-green-100 text-green-600",
    "In Active": "bg-orange-100 text-orange-500",
    Suspended: "bg-red-100 text-red-500",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
};

// ── Backdrop Modal ─────────────────────────────────────────
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  </div>
);

// ── Terminate Modal ────────────────────────────────────────
const TerminateModal = ({ vendor, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  return (
    <Modal onClose={onClose}>
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 leading-snug mb-6">
          "Are You Sure You Want To{" "}
          <span className="text-red-600">Suspend {vendor.id}"</span>
        </h2>

        <div className="text-left mb-5">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Reason For Suspend <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Please describe the reason for terminate this candidate."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              reason.trim()
                ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                : "bg-red-100 text-red-300 cursor-not-allowed pointer-events-none"
            }`}
          >
            Suspend
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ── Terminate Success Modal ────────────────────────────────
const TerminateSuccessModal = ({ vendor, onClose }) => (
  <Modal onClose={onClose}>
    <div className="text-center">
      {/* Red wave top */}
      <div className="bg-red-700 h-28 flex items-center justify-center rounded-t-2xl">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <MinusCircle size={32} className="text-white" />
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-1">"{vendor.id}"</h2>
        <p className="text-base font-semibold text-gray-600 mb-6">
          Suspended Successfully
        </p>
        <button
          onClick={onClose}
          className="px-8 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Okay
        </button>
      </div>
    </div>
  </Modal>
);

const SendEmailModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-2xl w-120 overflow-hidden shadow-xl text-center">
      {/* Purple wave top */}
      <div className="relative bg-purple-600 h-40 flex items-center justify-center">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
        <div className="relative z-10 mb-2">
          <Mail size={56} className="text-white" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <h2 className="text-lg font-bold text-purple-600 mb-2">
          The Email Has Been Successfully Sent To The Client.
        </h2>
        <p className="text-sm text-gray-500">
          We've Sent You An Email — Check Your Inbox.
        </p>
        <button
          onClick={onClose}
          className="mt-6 border border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-2.5 rounded-xl text-sm font-medium transition"
        >
          Okay
        </button>
      </div>
    </div>
  </div>
);

// ── Action Menu ────────────────────────────────────────────
const ActionMenu = ({ vendor, onView, onEdit, onSendEmail, onTerminate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    {
      label: "View",
      icon: <Eye size={13} />,
      onClick: onView,
      className: "text-gray-700",
    },
    {
      label: "Edit",
      icon: <Pencil size={13} />,
      onClick: onEdit,
      className: "text-gray-700",
    },
    {
      label: "Send Email",
      icon: <Mail size={13} />,
      onClick: onSendEmail,
      className: "text-gray-700",
    },
    {
      label: "Terminate",
      icon: <Trash2 size={13} />,
      onClick: onTerminate,
      className: "text-red-500",
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical size={16} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50">
          {actions
            .filter(({ label }) => !(label === "Send Email" && vendor?.is_password_set))
            .map(({ label, icon, onClick, className }) => (
            <button
              key={label}
              onClick={() => {
                onClick();
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 transition ${className}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Table ─────────────────────────────────────────────
export default function VendorTable({ onStatsFetched }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [totalVendors, setTotalVendors] = useState(0);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const [terminateTarget, setTerminateTarget] = useState(null);
  const [terminateSuccess, setTerminateSuccess] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axiosInstance.get(`/api/vendor?page=${currentPage}&limit=${perPage}`);
        const mapped = response.data.vendors.map(v => {
          let status = "Active";
          if (v.is_suspend === 1) status = "Suspended";
          else if (v.is_active === 2) status = "In Active";

          return {
            id: `VND${v.vendor_id.toString().padStart(4, '0')}`,
            dbId: v.vendor_id,
            vendorName: v.company_name,
            poc: `${v.poc_first_name} ${v.poc_last_name}`,
            email: v.poc_email,
            gst: v.gst_number || "N/A",
            status: status,
            is_password_set: Boolean(v.is_password_set),
          };
        });
        setVendors(mapped);
        if (response.data.pagination) {
          setTotalVendors(response.data.pagination.total);
        }
        if (response.data.stats && onStatsFetched) {
          onStatsFetched(response.data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [currentPage, perPage, refreshToggle]);

  const toggleAll = (e) =>
    setSelected(e.target.checked ? vendors.map((v) => v.id) : []);

  const toggleOne = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const handleTerminateConfirm = async (reason) => {
    try {
      const res = await axiosInstance.patch(`/api/vendor/suspend/${terminateTarget.dbId}`, { reason });
      if (res.data.success) {
        // Trigger a re-fetch so that the table and the dashboard stats cards update automatically
        setRefreshToggle(prev => !prev);
      }
    } catch (error) {
      console.error("Failed to suspend vendor:", error);
    } finally {
      setTerminateSuccess(terminateTarget);
      setTerminateTarget(null);
    }
  };

  const handleSendEmail = async (v) => {
    try {
      const res = await axiosInstance.post(`/api/vendor/send-welcome-email/${v.dbId}`);
      if (res.data.success) {
        setEmailSuccess(true);
      }
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {[
                "Vendor ID",
                "Vendor Name",
                "Poc Name",
                "GST Number",
                "Status",
                "Action",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-4 text-left text-sm font-medium text-gray-600 ${
                    i === 0 ? "first:rounded-tl-2xl" : ""
                  } last:rounded-tr-2xl`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Loading vendors...
                </td>
              </tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No vendors found.
                </td>
              </tr>
            ) : (
              vendors.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4 text-sm text-gray-700">{v.id}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                    {v.vendorName}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-gray-900">{v.poc}</p>
                    <p className="text-xs text-indigo-400">{v.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{v.gst}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-4 py-4">
                    <ActionMenu
                      vendor={v}
                      onView={() => navigate(`/super-admin/view-vendor/${v.dbId}`)}
                      onEdit={() => navigate(`/super-admin/edit-vendor/${v.dbId}`)}
                      onSendEmail={() => handleSendEmail(v)}
                      onTerminate={() => setTerminateTarget(v)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalVendors > 0 && (
        <ClientPagination
          total={totalVendors}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPerPageChange={(val) => {
            setPerPage(val);
            setCurrentPage(1);
          }}
        />
      )}

      {/* TERMINATE CONFIRM MODAL */}
      {terminateTarget && (
        <TerminateModal
          vendor={terminateTarget}
          onClose={() => setTerminateTarget(null)}
          onConfirm={handleTerminateConfirm}
        />
      )}

      {/* TERMINATE SUCCESS MODAL */}
      {terminateSuccess && (
        <TerminateSuccessModal
          vendor={terminateSuccess}
          onClose={() => setTerminateSuccess(null)}
        />
      )}

      {/* SEND EMAIL SUCCESS MODAL */}
      {emailSuccess && (
        <SendEmailModal onClose={() => setEmailSuccess(false)} />
      )}
    </>
  );
}
