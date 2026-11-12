import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  Mail,
  Ban,
  X,
  MailCheck,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";


const statusStyle = {
  Active: "bg-green-100 text-green-600",
  "In Active": "bg-orange-100 text-orange-500",
  Suspended: "bg-red-100 text-red-500",
};

function ActionMenu({ onView, onEdit, onEmail, onSuspend, isPasswordSet }) {
  return (
    <div className="absolute right-8 top-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 w-36 overflow-hidden">
      <button
        onClick={onView}
        className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <Eye size={13} className="text-gray-400" /> View
      </button>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <Pencil size={13} className="text-gray-400" /> Edit
      </button>
      {!isPasswordSet && (
        <button
          onClick={onEmail}
          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <Mail size={13} className="text-gray-400" /> Send Email
        </button>
      )}
      <button
        onClick={onSuspend}
        className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition cursor-pointer"
      >
        <Ban size={13} className="text-red-400" /> Suspend
      </button>
    </div>
  );
}

export default function ClientTable({
  data = [],
  isLoading = false,
  onView,
  onEdit,
  onEmail,
  onSuspend,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showSuspendSuccess, setShowSuspendSuccess] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [suspendError, setSuspendError] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClientName, setSelectedClientName] = useState("");
  const menuRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInside = menuRefs.current.some(
        (ref) => ref && ref.contains(e.target),
      );
      if (!clickedInside) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? data.map((d) => d.id) : []);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  /* ── SUSPEND HANDLER ── */
  const handleSuspendConfirm = async () => {
    try {
      setIsSuspending(true);
      setSuspendError("");
      await axiosInstance.patch(
        `/api/client/suspend-client/${selectedClientId}`,
        { reason: suspendReason.trim() }
      );
      setShowSuspendModal(false);
      setShowSuspendSuccess(true);
      // Notify parent to refresh the list
      onSuspend && onSuspend({ id: selectedClientId, name: selectedClientName });
    } catch (err) {
      setSuspendError(
        err.response?.data?.message || "Failed to suspend client. Please try again."
      );
    } finally {
      setIsSuspending(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-visible shadow-sm">
      <table className="w-full border-collapse">
        {/* HEADER */}
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {["Client ID", "Client Name", "GST", "POC Name", "POC Phone", "Status", "Action"].map(
              (col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-sm font-semibold text-gray-700 text-left whitespace-nowrap"
                >
                  {col}
                </th>
              ),
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7" className="px-5 py-10 text-center text-gray-500 font-medium">
                Loading clients...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-5 py-10 text-center text-gray-500 font-medium">
                No clients found.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
              key={row.id}
              className={`hover:bg-gray-50 transition-colors duration-100 ${index < data.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              {/* CLIENT ID */}
              <td className="px-5 py-3 text-sm text-gray-700 font-medium">
                {row.displayId || row.id}
              </td>

              {/* CLIENT NAME */}
              <td className="px-5 py-3 text-sm text-gray-900 font-semibold">
                {row.name}
              </td>

              {/* GST */}
              <td className="px-5 py-3 text-sm text-gray-700">{row.gst}</td>

              {/* POC NAME + EMAIL */}
              <td className="px-5 py-3">
                <div className="text-sm text-gray-900 font-semibold">{row.pocName}</div>
                <div className="text-xs text-gray-400 mt-0.5">{row.pocEmail}</div>
              </td>

              {/* POC PHONE */}
              <td className="px-5 py-3 text-sm text-gray-700">{row.pocPhone}</td>

              {/* STATUS */}
              <td className="px-5 py-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[row.status] || "bg-gray-100 text-gray-500"}`}
                >
                  {row.status}
                </span>
              </td>

              {/* ACTION */}
              <td className="px-5 py-3">
                <div
                  className="relative inline-block"
                  ref={(el) => (menuRefs.current[index] = el)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === index ? null : index);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <MoreVertical size={16} className="text-gray-500" />
                  </button>

                  {openMenu === index && (
                    <ActionMenu
                      isPasswordSet={row.is_password_set}
                      onView={() => {
                        onView && onView(row);
                        setOpenMenu(null);
                      }}
                      onEdit={() => {
                        onEdit && onEdit(row);
                        setOpenMenu(null);
                      }}
                      onEmail={() => {
                        onEmail && onEmail(row);
                        setShowEmailModal(true);
                        setOpenMenu(null);
                      }}
                      onSuspend={() => {
                        setSelectedClientId(row.id);
                        setSelectedClientName(row.name || row.displayId || `CLT${row.id}`);
                        setSuspendReason("");
                        setSuspendError("");
                        setShowSuspendModal(true);
                        setOpenMenu(null);
                      }}
                    />
                  )}
                </div>
              </td>
            </tr>
          )))}
        </tbody>
      </table>
      {/* EMAIL SUCCESS MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
          <div className="bg-white rounded-2xl w-120 overflow-hidden shadow-xl text-center">
            <div className="relative bg-purple-600 h-40 flex items-center justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
              <div className="relative z-10 mb-2">
                <Mail size={56} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

            <div className="px-8 py-6">
              <h2 className="text-lg font-bold text-purple-600 mb-2">
                The Email Has Been Successfully Sent To The Client.
              </h2>
              <p className="text-sm text-gray-500">
                We've Sent You An Email — Check Your Inbox.
              </p>
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
      {/* SUSPEND MODAL */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-155 bg-white rounded-2xl shadow-2xl p-10">
            {/* Heading */}
            <h2 className="text-[24px] font-semibold text-center leading-snug text-gray-900">
              “Are You Sure You Want To
              <br />
              Suspend{" "}
              <span className="text-orange-500">{selectedClientName || `CLT${selectedClientId}`}</span>”
            </h2>

            {/* Textarea */}
            <div className="mt-8">
              <label className="text-sm font-medium text-gray-700">
                “Reason For Suspend” <span className="text-red-500">*</span>
              </label>

              <textarea
                rows={5}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Please describe the reason for suspend this candidate."
                className="w-full mt-3 border border-orange-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-6 mt-10">
              {/* CANCEL */}
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendReason("");
                  setSuspendError("");
                }}
                disabled={isSuspending}
                className="bg-orange-500 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-60"
              >
                Cancel
              </button>

              {/* SUSPEND */}
              <button
                disabled={suspendReason.trim() === "" || isSuspending}
                onClick={handleSuspendConfirm}
                className={`px-8 py-2.5 rounded-lg font-medium transition border flex items-center gap-2 ${
                  suspendReason.trim() === "" || isSuspending
                    ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "border-orange-400 text-orange-500 hover:bg-orange-50"
                }`}
              >
                {isSuspending && <Loader2 size={14} className="animate-spin" />}
                {isSuspending ? "Suspending..." : "Suspend"}
              </button>
            </div>

            {/* Error */}
            {suspendError && (
              <p className="text-center text-sm text-red-500 mt-4">{suspendError}</p>
            )}
          </div>
        </div>
      )}

      {/* SUSPEND SUCCESS MODAL */}
      {showSuspendSuccess && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-140 bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* TOP ORANGE SECTION */}
            <div className="relative h-37.5 bg-orange-500 rounded-b-[220px] flex items-center justify-center">
              {/* ICON */}
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                <Ban size={34} className="text-orange-500" />
              </div>
            </div>

            {/* CONTENT */}
            <div className="px-8 pt-7 pb-8 text-center">
              <h2 className="text-[24px] font-bold text-orange-500 leading-snug">
                "{selectedClientName || `CLT${selectedClientId}`}"
                <br />
                Suspended Successfully
              </h2>

              {/* BUTTON */}
              <button
                onClick={() => {
                  setShowSuspendSuccess(false);
                  setSuspendReason("");
                  // Re-fetch to guarantee stats cards are up-to-date
                  onSuspend && onSuspend({ id: selectedClientId, name: selectedClientName });
                }}
                className="mt-8 border border-orange-400 text-orange-500 px-10 py-2.5 rounded-xl font-medium hover:bg-orange-50 transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
