import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Home,
  User,
  Eye,
  CheckCircle2,
  FileBadge,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Building2,
  Clock
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import CaseDocumentViewer from "../../components/common/CaseDocumentViewer";

const API_BASE = API_BASE_URL;

const getStatusName = (status) => {
  switch (parseInt(status)) {
    case 1: return "Pending";
    case 2: return "Assigned";
    case 3: return "In Progress";
    case 4: return "Verified";
    case 5: return "Refute / Rejected";
    case 6: return "Hold";
    default: return "Unverified";
  }
};

const getStatusBadge = (status) => {
  const s = getStatusName(status);
  switch (parseInt(status)) {
    case 4:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
          {s}
        </span>
      );
    case 5:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C]">
          {s}
        </span>
      );
    case 6:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          {s}
        </span>
      );
    case 2:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#7E22CE]">
          {s}
        </span>
      );
    case 3:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          {s}
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {s}
        </span>
      );
  }
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(d);
  }
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

function SuperAdminAddressDetails() {
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);
  const [activeAddressTab, setActiveAddressTab] = useState("present");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseIdParam = searchParams.get("caseId");

  useEffect(() => {
    if (!caseIdParam) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${API_BASE}/api/superadmin/cases/details/${caseIdParam}`);
        if (res.data.success) {
          setCaseData(res.data.case);
          setCandidate(res.data.candidate);
          setRecords(res.data.records || []);
        }
      } catch (err) {
        console.error("Error fetching address case details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [caseIdParam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const addrRecord = records[0] || {};

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-10 px-4 mt-4">
      {/* Header Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
              <User size={20} />
            </div>
            <h2 className="text-xl font-semibold text-indigo-900">
              {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Address Verification")}
            </h2>
          </div>
          {caseData?.vendorName && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Assigned Vendor: {caseData.vendorName}
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-wrap gap-10 lg:gap-14 items-start ml-2">
          <Field label="First Name" value={candidate?.firstName} />
          <Field label="Last Name" value={candidate?.lastName} />
          <Field label="Phone Number" value={candidate?.phone ? `+91 ${candidate.phone}` : null} />
          <Field label="Email Id" value={candidate?.email} />
          <Field label="Function / Dept" value={candidate?.department} />
          {candidate?.dob && <Field label="Date of Birth" value={new Date(candidate.dob).toLocaleDateString()} />}
        </div>
      </div>

      {/* Address Header with Pills */}
      <div className="flex items-center justify-between ml-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
            <MapPin size={20} />
          </div>
          <h2 className="text-xl font-semibold text-indigo-900">
            Residential Address Verification
          </h2>
        </div>

        {/* Address Switcher Pills */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveAddressTab("present")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeAddressTab === "present"
                ? "bg-[#05058D] text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Present Address
          </button>
          <button
            type="button"
            onClick={() => setActiveAddressTab("permanent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeAddressTab === "permanent"
                ? "bg-[#05058D] text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Permanent Address {addrRecord.is_add_same === 1 && "(Same)"}
          </button>
        </div>
      </div>

      <div className="space-y-6 ml-2">
        {activeAddressTab === "present" ? (
          /* Present Address Card */
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-indigo-900">
                      Present Address Details
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {addrRecord.cand_curr_city || "City"}, {addrRecord.cand_curr_state || "State"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <div className="sm:col-span-2">
                    <Field label="Flat / House / Building" value={addrRecord.cand_curr_house} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Street / Road" value={addrRecord.cand_curr_street} />
                  </div>
                  <Field label="Landmark" value={addrRecord.cand_curr_landmark} />
                  <Field label="Locality" value={addrRecord.cand_curr_locality} />
                  <Field label="City" value={addrRecord.cand_curr_city} />
                  <Field label="District" value={addrRecord.cand_curr_district} />
                  <Field label="State" value={addrRecord.cand_curr_state} />
                  <Field label="PIN Code" value={addrRecord.cand_curr_pincode} />
                  <Field label="Country" value={addrRecord.cand_curr_country || "India"} />
                </div>
              </div>

              {/* Evidence & Verification Support */}
              <div className="lg:col-span-5 space-y-3">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-bold text-indigo-950">
                    Verification Proof & Evidence
                  </h3>
                </div>

                <div className="space-y-4">
                  {addrRecord.cand_masked_aadhar && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">DigiLocker / Aadhaar Source</p>
                        <p className="text-xs font-mono text-gray-500">Masked Aadhaar: {addrRecord.cand_masked_aadhar}</p>
                      </div>
                    </div>
                  )}

                  <CaseDocumentViewer
                    url={addrRecord.cand_photo}
                    title="Verified Photo / Address Proof"
                    tag="Address Proof"
                    headerTitle="VERIFIED ADDRESS EVIDENCE"
                    noDocMessage="Physical evidence verified electronically via candidate portal."
                  />

                  <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
                    <span>Address verified via DigiLocker / Aadhaar e-KYC service.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Permanent Address Card */
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                      <Home size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-indigo-900">
                        Permanent Address Details
                      </h3>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {addrRecord.cand_perm_city || addrRecord.cand_curr_city || "City"}, {addrRecord.cand_perm_state || addrRecord.cand_curr_state || "State"}
                      </p>
                    </div>
                  </div>
                  {addrRecord.is_add_same === 1 && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      Same as present address
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <div className="sm:col-span-2">
                    <Field label="Flat / House / Building" value={addrRecord.cand_perm_house || (addrRecord.is_add_same ? addrRecord.cand_curr_house : null)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Street / Road" value={addrRecord.cand_perm_street || (addrRecord.is_add_same ? addrRecord.cand_curr_street : null)} />
                  </div>
                  <Field label="Landmark" value={addrRecord.cand_perm_landmark || (addrRecord.is_add_same ? addrRecord.cand_curr_landmark : null)} />
                  <Field label="Locality" value={addrRecord.cand_perm_locality || (addrRecord.is_add_same ? addrRecord.cand_curr_locality : null)} />
                  <Field label="City" value={addrRecord.cand_perm_city || (addrRecord.is_add_same ? addrRecord.cand_curr_city : null)} />
                  <Field label="District" value={addrRecord.cand_perm_district || (addrRecord.is_add_same ? addrRecord.cand_curr_district : null)} />
                  <Field label="State" value={addrRecord.cand_perm_state || (addrRecord.is_add_same ? addrRecord.cand_curr_state : null)} />
                  <Field label="PIN Code" value={addrRecord.cand_perm_pincode || (addrRecord.is_add_same ? addrRecord.cand_curr_pincode : null)} />
                  <Field label="Country" value={addrRecord.cand_perm_country || "India"} />
                </div>
              </div>

              {/* Permanent Address Proof / Status */}
              <div className="lg:col-span-5 space-y-3">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-bold text-indigo-950">
                    Permanent Address Verification
                  </h3>
                </div>

                <div className="flex flex-col justify-center items-center p-8 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 text-center min-h-[220px]">
                  <MapPin size={36} className="text-indigo-600 mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-gray-800">
                    {addrRecord.is_add_same ? "Permanent Address Identical to Present" : "Separate Permanent Residence Registered"}
                  </p>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">
                    Candidate confirmed permanent residency records during profile verification submission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case Verification Status */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="p-1.5 bg-indigo-50 rounded text-indigo-700">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-bold text-indigo-900">
              Case Verification Status
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Current Status</p>
              {(() => {
                const s = parseInt(caseData?.verificationStatus);
                const labels = { 1: "Pending", 2: "Assigned", 3: "In Progress", 4: "Verified", 5: "Refuted", 6: "On Hold" };
                const colors = { 1: "bg-blue-50 text-blue-700", 2: "bg-purple-50 text-purple-700", 3: "bg-blue-50 text-blue-700", 4: "bg-emerald-50 text-emerald-700", 5: "bg-red-50 text-red-700", 6: "bg-amber-50 text-amber-700" };
                return <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors[s] || "bg-gray-100 text-gray-700"}`}>{labels[s] || "Unverified"}</span>;
              })()}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Assigned Vendor</p>
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-indigo-500 shrink-0" />
                <p className="text-sm font-semibold text-gray-900 truncate">{caseData?.vendorName || "Not Assigned"}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Assigned Date</p>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-500 shrink-0" />
                <p className="text-sm font-semibold text-gray-900">
                  {caseData?.assignedDate ? new Date(caseData.assignedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>
          </div>

          {caseData?.verificationComment && (
            <div className="mb-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Verification Remarks (by Vendor)</p>
              <p className="text-sm text-gray-700">{caseData.verificationComment}</p>
            </div>
          )}

          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              ← Back to Cases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminAddressDetails;
