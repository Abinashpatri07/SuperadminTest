import { useState } from "react";
import { PlayCircle, CheckCircle } from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";

function RemoveHoldModal({ candidate, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      const res = await axiosInstance.patch(
        `/api/candidate/remove-hold/${candidate?.id}`
      );

      if (res.data.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setApiError(res.data.message || "Failed to remove hold.");
      }
    } catch (err) {
      console.error("Remove hold error:", err);
      setApiError(err.response?.data?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-3xl w-100 overflow-hidden shadow-2xl text-center">
          <div className="relative bg-green-500" style={{ height: "180px" }}>
            <div style={{ position:"absolute", bottom:"-1px", left:"-10%", width:"120%", height:"60px", backgroundColor:"white", borderRadius:"50% 50% 0 0 / 100% 100% 0 0" }} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom:"30px" }}>
              <div className="flex items-center justify-center" style={{ width:"72px", height:"72px", backgroundColor:"rgba(255,255,255,0.25)", borderRadius:"18px" }}>
                <CheckCircle size={42} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="px-10 pt-2 pb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Hold Removed Successfully</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Candidate {candidate?.candidateId} has been successfully<br />restored to In Progress status.
            </p>
            <button onClick={onClose} className="border border-green-500 text-green-600 hover:bg-green-50 px-14 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer">
              Okay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-130 p-10">
        
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <PlayCircle size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2 leading-8">
          Remove Hold
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Are you sure you want to remove the hold for candidate <span className="font-bold text-green-600">{candidate?.candidateId}</span>?
        </p>

        {apiError && (
          <p className="text-xs text-red-600 mt-2 text-center">{apiError}</p>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className={`px-8 py-2.5 border rounded-xl font-medium transition ${
              !isLoading
                ? "bg-green-600 text-white hover:bg-green-700 border-green-600"
                : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Removing..." : "Remove Hold"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default RemoveHoldModal;
