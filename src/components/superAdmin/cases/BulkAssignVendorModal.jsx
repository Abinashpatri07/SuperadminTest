import { useState, useEffect } from "react";
import { UserPlus, Loader2, CheckCircle } from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";

function BulkAssignVendorModal({ caseIds, onClose, onSuccess }) {
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axiosInstance.get("/api/vendor?limit=1000");
        if (res.data.success) {
          setVendors(res.data.vendors || []);
        }
      } catch (err) {
        console.error("Fetch Vendors error:", err);
        setApiError("Failed to load Vendors. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchVendors();
  }, []);

  const handleSubmit = async () => {
    if (!selectedVendorId || caseIds.length === 0) return;

    setIsLoading(true);
    setApiError("");

    try {
      const res = await axiosInstance.post(
        "/api/superadmin/cases/assign-vendor",
        { caseIds, vendorId: selectedVendorId }
      );
      
      if (res.data.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setApiError(res.data.message || "Failed to assign vendor.");
      }
      
    } catch (err) {
      console.error("Bulk Assign Vendor error:", err);
      setApiError(err.response?.data?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-3xl w-100 overflow-hidden shadow-2xl text-center">
          <div className="relative bg-indigo-500" style={{ height: "180px" }}>
            <div style={{ position:"absolute", bottom:"-1px", left:"-10%", width:"120%", height:"60px", backgroundColor:"white", borderRadius:"50% 50% 0 0 / 100% 100% 0 0" }} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom:"30px" }}>
              <div className="flex items-center justify-center" style={{ width:"72px", height:"72px", backgroundColor:"rgba(255,255,255,0.25)", borderRadius:"18px" }}>
                <CheckCircle size={42} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="px-10 pt-2 pb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Bulk Assignment Successful</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Vendor has been successfully assigned to<br />
              <span className="font-bold text-indigo-600">{caseIds.length}</span> cases.
            </p>
            <button onClick={onClose} className="border border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-14 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer">
              Okay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-145 p-10">
        
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <UserPlus size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2 leading-8">
          Bulk Assign Vendor
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          You are about to assign a Vendor to <span className="font-bold text-indigo-600">{caseIds.length}</span> selected cases.
        </p>

        {isFetching ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Vendor <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedVendorId}
              onChange={(e) => { setSelectedVendorId(e.target.value); setApiError(""); }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            >
              <option value="" disabled>-- Select a Vendor --</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.company_name} ({vendor.poc_email})
                </option>
              ))}
            </select>
          </div>
        )}

        {apiError && (
          <p className="text-xs text-red-600 mt-2 text-center">{apiError}</p>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!selectedVendorId || isLoading}
            onClick={handleSubmit}
            className={`px-8 py-2.5 border rounded-xl font-medium transition cursor-pointer ${
              selectedVendorId && !isLoading
                ? "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
                : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Assigning..." : "Bulk Assign"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default BulkAssignVendorModal;
