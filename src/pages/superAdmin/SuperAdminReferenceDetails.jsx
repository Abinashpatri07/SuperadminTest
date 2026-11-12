import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import {
  Users,
  User,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Building2,
  Phone,
  Mail,
  HeartHandshake,
  ShieldCheck,
  Clock
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

const API_BASE = API_BASE_URL;

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

function SuperAdminReferenceDetails() {
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedRefIndex, setSelectedRefIndex] = useState(0);

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
          const recs = res.data.records || [];
          setRecords(recs);
          if (recs.length > 0 && recs[0].ref_verification_comment) {
            setRemarks(recs[0].ref_verification_comment);
          }
        }
      } catch (err) {
        console.error("Error fetching reference check case details:", err);
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
              {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Reference Check Verification")}
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

      {/* Reference Header with Selector Pills */}
      <div className="flex items-center justify-between ml-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-semibold text-indigo-900">
            Reference Check Details
            {records.length > 0 && (
              <span className="ml-2 text-sm font-medium text-indigo-400">
                ({records.length})
              </span>
            )}
          </h2>
        </div>

        {/* Reference Selector Pills if multiple */}
        {records.length > 1 && (
          <div className="flex gap-2">
            {records.map((ref, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedRefIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedRefIndex === idx
                    ? "bg-[#05058D] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {ref.cand_ref_name || `Reference ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE REFERENCE RECORD */}
      <div className="space-y-6 ml-2">
        {records.length > 0 && records[selectedRefIndex] ? (
          (() => {
            const ref = records[selectedRefIndex] || records[0];
            return (
              <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                      {ref.cand_ref_type === "Organization" ? <Building2 size={20} /> : <HeartHandshake size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {ref.cand_ref_name || `Reference Person`}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {ref.cand_ref_type || "Professional"} Reference
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold">
                    {ref.cand_ref_relation || "Verified Reference"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                  <Field label="Reference Name" value={ref.cand_ref_name} />
                  <Field label="Reference Type" value={ref.cand_ref_type} />
                  <Field label="Relationship / Role" value={ref.cand_ref_relation} />
                  <Field label="Designation" value={ref.cand_ref_designation} />
                  <Field label="Phone Number" value={ref.cand_ref_phone ? `+91 ${ref.cand_ref_phone}` : null} />
                  <Field label="Email Address" value={ref.cand_ref_email} />
                  <div className="md:col-span-2 lg:col-span-3">
                    <Field 
                      label={ref.cand_ref_type === "Organization" ? "Company / Institution" : "Associated Org"} 
                      value={ref.cand_ref_org} 
                    />
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm text-gray-500">
            <Users size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700">No Reference Records Found</p>
            <p className="text-xs text-gray-400 mt-1">This candidate has not submitted reference check details yet.</p>
          </div>
        )}

        {/* Case Verification Status */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="p-1.5 bg-indigo-50 rounded text-indigo-700"><ShieldCheck size={20} /></div>
            <h2 className="text-lg font-bold text-indigo-900">Case Verification Status</h2>
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
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition">
              ← Back to Cases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminReferenceDetails;
