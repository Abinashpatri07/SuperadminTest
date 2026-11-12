import { useState } from "react";
import axiosInstance from "../../../API/axiosInstance";
import { Eye, Pencil, Mail, Ban, Loader2 } from "lucide-react";

import TerminateModal from "./TerminateModal";

function HRActionDropdown({ onView, onEdit, candidateId = "EMP-0002", hrId, onTerminateSuccess, isPasswordSet }) {
  const [showTerminate, setShowTerminate] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  /* EMAIL */
  const handleEmail = async (e) => {
    e?.stopPropagation();
    if (!hrId) return;

    try {
      setSendingEmail(true);
      const res = await axiosInstance.post(`/api/hr/send-email/${hrId}`);
      if (res.data.success) {
        setEmailMessage(res.data.message || "Invitation & Password Setup email has been sent successfully.");
        setShowEmailSuccess(true);
      } else {
        alert(res.data.message || "Failed to send email");
      }
    } catch (err) {
      console.error("send-email error:", err);
      const msg = err.response?.data?.message || "Failed to send email. Please check server settings.";
      alert(msg);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <>
      {/* ───────────────── TERMINATE MODAL ───────────────── */}
      {showTerminate && (
        <TerminateModal
          candidateId={candidateId}
          hrId={hrId}
          onCancel={() => setShowTerminate(false)}
          onSuccess={() => {
            setShowTerminate(false);
            if (onTerminateSuccess) onTerminateSuccess();
          }}
        />
      )}

      {/* ───────────────── EMAIL SUCCESS MODAL ───────────────── */}
      {showEmailSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-120 overflow-hidden shadow-xl text-center">
            {/* TOP */}
            <div className="relative bg-purple-600 h-44 flex items-center justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />

              <div className="relative z-10 mb-2">
                <Mail size={52} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

            {/* CONTENT */}
            <div className="px-10 py-7">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                E-Mail Has Been Sent Successfully
              </h2>

              <p className="text-sm text-gray-500">
                {emailMessage || "We've sent an invitation & password setup link to the HR's email address."}
              </p>

              <button
                type="button"
                onClick={() => setShowEmailSuccess(false)}
                className="mt-7 border border-purple-600 text-purple-600 hover:bg-purple-50 px-10 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── DROPDOWN ───────────────── */}
      <div className="w-52 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2">
        {/* VIEW */}
        <button
          type="button"
          onClick={onView}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition"
        >
          <Eye size={17} className="text-gray-600" />
          View
        </button>

        {/* EDIT */}
        <button
          type="button"
          onClick={onEdit}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition"
        >
          <Pencil size={17} className="text-gray-600" />
          Edit
        </button>

        {/* EMAIL */}
        {!isPasswordSet && (
          <button
            type="button"
            disabled={sendingEmail}
            onClick={handleEmail}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition disabled:opacity-50"
          >
            {sendingEmail ? (
              <Loader2 size={17} className="text-blue-500 animate-spin" />
            ) : (
              <Mail size={17} className="text-blue-500" />
            )}
            {sendingEmail ? "Sending..." : "Send Email"}
          </button>
        )}

        {/* TERMINATE */}
        <button
          type="button"
          onClick={() => setShowTerminate(true)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-500 transition"
        >
          <Ban size={17} />
          Terminate
        </button>
      </div>
    </>
  );
}

export default HRActionDropdown;
