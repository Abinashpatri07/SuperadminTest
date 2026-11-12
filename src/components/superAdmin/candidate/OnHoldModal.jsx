import { API_BASE_URL } from "../../../API/config.js";
import { useState } from "react";
import { Square } from "lucide-react";

function OnHoldModal({ candidate, onClose, onSuccess }) {
  const [reason, setReason]     = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError]   = useState("");

  // ── HANDLE SUBMIT ───────────────────────────────────
  const handleSubmit = async () => {
    if (!reason.trim()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/candidate/on-hold/${candidate?.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: reason.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Something went wrong. Please try again.");
        return;
      }

      // Notify parent table to update status in local state
      onSuccess && onSuccess(candidate?.id, "On Hold");
      setIsSuccess(true);

    } catch {
      setApiError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── SUCCESS SCREEN ─────────────────────────────────
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
        <div className="bg-white rounded-2xl w-120 overflow-hidden shadow-2xl text-center">

          {/* ORANGE WAVE TOP */}
          <div className="relative bg-orange-500 h-44 flex items-center justify-center">
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
            {/* PAUSE ICON BOX */}
            <div className="relative z-10 mb-2 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Square size={26} className="text-orange-500 fill-orange-500" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-8 py-6">
            <h2 className="text-orange-500 text-lg font-bold mb-3 leading-7">
              Candidate {candidate?.candidateId} Has Been
              <br />
              Successfully Placed On Hold.
            </h2>
            <p className="text-sm text-gray-500 leading-6">
              This Will Pause The Candidate's Progress In The
              <br />
              Hiring Process. You Can Resume It Anytime.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-10 py-2.5 border border-orange-400 text-orange-500 hover:bg-orange-50 rounded-xl text-sm font-medium transition"
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
      <div className="bg-white rounded-2xl shadow-2xl w-155 px-12 py-10">

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center mb-6 leading-9">
          Are You Sure You Want To Place
          <br />
          Candidate{" "}
          <span className="font-bold">{candidate?.candidateId}</span>{" "}
          <span className="text-orange-500 font-bold">On Hold</span>
        </h2>

        {/* REASON FIELD */}
        <label className="block text-sm font-medium mb-2">
          Reason For Putting On Hold <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={5}
          value={reason}
          onChange={(e) => { setReason(e.target.value); setApiError(""); }}
          placeholder="Please describe the reason for placing this candidate on hold."
          className="w-full border border-orange-300 rounded-xl p-4 text-sm outline-none resize-none focus:ring-2 focus:ring-orange-200 placeholder:text-gray-400"
        />

        {!reason.trim() && (
          <p className="text-xs text-red-500 mt-2">Reason is required</p>
        )}

        {/* API ERROR */}
        {apiError && (
          <p className="text-xs text-red-600 mt-2 text-center">{apiError}</p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim() || isLoading}
            onClick={handleSubmit}
            className={`px-8 py-2.5 border rounded-xl text-sm font-medium transition ${
              reason.trim() && !isLoading
                ? "border-orange-400 text-orange-500 hover:bg-orange-50"
                : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Saving…" : "Place On Hold"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default OnHoldModal;