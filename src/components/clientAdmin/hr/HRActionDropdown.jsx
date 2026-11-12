import { useState } from "react";
import { Eye, Pencil, Mail, Ban, Loader2 } from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";
import TerminateModal from "./TerminateModal";

function HRActionDropdown({ onView, onEdit, onTerminate, hrId, hrName = "this HR", isPasswordSet }) {
  const [showTerminate, setShowTerminate] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const handleEmail = async (e) => {
    e.stopPropagation();
    if (!hrId) return;
    try {
      setSendingEmail(true);
      const res = await axiosInstance.post(`/api/client-admin/hr/send-email/${hrId}`);
      if (res.data.success) {
        setEmailMessage(res.data.message || "Invitation & password setup email sent successfully.");
        setShowEmailSuccess(true);
      } else {
        alert(res.data.message || "Failed to send email");
      }
    } catch (err) {
      console.error("send-hr-email error:", err);
      const msg = err.response?.data?.message || "Failed to send email. Please check server settings.";
      alert(msg);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleTerminateSuccess = () => {
    setShowTerminate(false);
    onTerminate && onTerminate(hrId); // refresh table
  };

  return (
    <>
      {/* TERMINATE MODAL */}
      {showTerminate && (
        <TerminateModal
          hrId={hrId}
          candidateId={hrName}
          onCancel={() => setShowTerminate(false)}
          onSuccess={handleTerminateSuccess}
        />
      )}

      {/* EMAIL SUCCESS MODAL */}
      {showEmailSuccess && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            setShowEmailSuccess(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl w-120 overflow-hidden shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-purple-600 h-44 flex items-center justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
              <div className="relative z-10 mb-2">
                <Mail size={52} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="px-10 py-7">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                E-Mail Has Been Sent Successfully
              </h2>
              <p className="text-sm text-gray-500">
                {emailMessage || "Take a look in the inbox for setup instructions."}
              </p>
              <button
                onClick={() => setShowEmailSuccess(false)}
                className="mt-7 border border-purple-600 text-purple-600 hover:bg-purple-50 px-10 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DROPDOWN */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-52 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView?.();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition"
        >
          <Eye size={17} className="text-gray-600" />
          View
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition"
        >
          <Pencil size={17} className="text-gray-600" />
          Edit
        </button>

        {!isPasswordSet && (
          <button
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowTerminate(true);
          }}
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