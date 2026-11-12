import { useState } from "react";
import axiosInstance from "../../../API/axiosInstance";

function TerminateModal({ candidateId = "EMP-008", hrId, onCancel, onSuccess }) {
  const [step, setStep] = useState("confirm"); // "confirm" | "success"
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTerminate = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch(`/api/hr/terminate/${hrId}`, { reason });
      if (res.data.success) {
        setStep("success");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to terminate HR.");
    } finally {
      setLoading(false);
    }
  };

  const handleOkay = () => {
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* ── STEP 1: CONFIRM ─────────────────────────── */}
      {step === "confirm" && (
        <div className="bg-white rounded-2xl w-130 px-10 py-8 shadow-xl">

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-gray-900 text-center leading-9">
  Are You Sure You Want To{" "}
  
  <span className="text-red-700">
    Terminate
  </span>{" "}
  
  "{candidateId}"?
</h2>

          {/* REASON FIELD */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-800 mb-1.5 block">
              "Reason For Terminating The HR" <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe the reason for terminate this candidate."
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none resize-none focus:border-gray-400 transition"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onCancel}
              className="bg-red-800 hover:bg-red-900 text-white px-8 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Cancel
            </button>
              <button
                onClick={handleTerminate}
                disabled={!reason.trim() || loading}
                className={`px-8 py-2.5 rounded-xl text-sm font-medium transition border ${
                    reason.trim() && !loading
                    ? "border-red-800 text-red-800 hover:bg-red-50 cursor-pointer"
                    : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                }`}
              >
                {loading ? "Terminating..." : "Terminate To HR"}
              </button>
          </div>

        </div>
      )}

      {/* ── STEP 2: SUCCESS ─────────────────────────── */}
      {step === "success" && (
        <div className="bg-white rounded-2xl w-105 overflow-hidden shadow-xl text-center">

          {/* RED WAVE TOP */}
          <div className="relative bg-red-900 h-36 flex items-center justify-center">
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
            <div className="relative z-10 w-12 h-12 rounded-full bg-red-900 border-4 border-white flex items-center justify-center mb-2">
              <div className="w-5 h-0.5 bg-white rounded-full" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-8 py-6">
            <p className="text-red-800 font-semibold text-lg leading-7">
              "{candidateId}"<br />
              Profile Terminated Successfully
            </p>
            <button
              onClick={handleOkay}
              className="mt-6 border border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Okay
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default TerminateModal;