import { API_BASE_URL } from "../../../API/config.js";
import { useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";

function RejectModal({ candidate, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Candidate name — HR data (first_name/last_name) ya Client Admin data (name) dono handle karo
  const candidateName =
    candidate?.first_name
      ? `${candidate.first_name} ${candidate.last_name}`
      : candidate?.name || "";

  const handleReject = async () => {
    if (!reason.trim()) return;
    try {
      setIsLoading(true);
      const candId = candidate?.id || candidate?.cand_id;
      const res = await axiosInstance.patch(
        `${API_BASE_URL}/api/client-admin/candidate/reject/${candId}`,
        { reason }
      );
      if (res.data.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        alert(res.data.message || "Failed to reject candidate.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // ── SUCCESS SCREEN ─────────────────────────────────
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-105 overflow-hidden shadow-2xl text-center">

          {/* RED WAVE TOP */}
          <div className="relative bg-red-500 h-44 flex items-center justify-center">
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
            <div className="relative z-10 mb-2 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <X size={28} className="text-red-500" strokeWidth={3} />
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-8 py-6">
            <h2 className="text-red-500 text-lg font-bold mb-3 leading-7">
              Candidate{" "}
              <span className="font-bold">{candidateName}</span>{" "}
              Has Been Successfully Rejected.
            </h2>
            <p className="text-sm text-gray-500 leading-6">
              This Will Mark The Application As Rejected
              <br />
              And Remove It From The Active Hiring Process.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-10 py-2.5 border border-red-400 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition"
            >
              Okay
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── CONFIRM SCREEN ─────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-145 p-10">

        <h2 className="text-2xl font-semibold text-center mb-6 leading-8">
          Reject Candidate
          <br />
          <span className="text-red-500">{candidateName}</span>?
        </h2>

        <label className="block text-sm font-medium mb-2">
          Reason For Rejection <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full border border-gray-300 rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-red-200"
        />

        {!reason.trim() && (
          <p className="text-xs text-red-500 mt-2">Rejection reason is required</p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim() || isLoading}
            onClick={handleReject}
            className={`px-8 py-2.5 border rounded-lg transition ${
              reason.trim() && !isLoading
                ? "border-red-400 text-red-500 hover:bg-red-50"
                : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processing..." : "Reject Application"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default RejectModal;
