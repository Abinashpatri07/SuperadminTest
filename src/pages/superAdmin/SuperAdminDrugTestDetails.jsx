import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import {
  Syringe,
  User,
  Eye,
  CheckCircle2,
  FileWarning,
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

const getDocUrl = (path) => {
  if (!path) return null;
  let clean = path.replace(/\\/g, "/");
  if (clean.includes("bgvplatform-backend.onrender.com")) {
    clean = clean.replace("https://bgvplatform-backend.onrender.com", API_BASE).replace("http://bgvplatform-backend.onrender.com", API_BASE);
  }
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  if (!clean.startsWith("uploads/")) clean = `uploads/${clean}`;
  const isLocalDev = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const base = isLocalDev ? "https://api.dqnex.online" : API_BASE;
  return `${base.replace(/\/+$/, "")}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

function SuperAdminDrugTestDetails() {
  const [positiveIdentified, setPositiveIdentified] = useState("No");
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);

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
          if (recs.length > 0) {
            const isPos = recs[0].cand_drug_test === "Positive" || recs[0].cand_drug_test === "Yes" || recs[0].candidate_drug_status === 2;
            setPositiveIdentified(isPos ? "Yes" : "No");
            if (recs[0].cand_drug_remarks) {
              setRemarks(recs[0].cand_drug_remarks);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching drug test case details:", err);
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

  const drugRecord = records[0] || {};

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
              {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Drug Test Verification")}
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

      <div className="space-y-8 ml-2">
        {/* Main Details Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Drug Test Result */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-700">
                  <Syringe size={20} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">
                  Drug Panel Test Results
                </h3>
              </div>

              {/* Show candidate-submitted data from DB */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Candidate Submission Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field 
                    label="Drug Test Taken?" 
                    value={drugRecord.cand_drug_test === "Yes" ? "Yes" : drugRecord.cand_drug_test === "No" ? "No" : (drugRecord.cand_drug_test || "Not Specified")} 
                  />
                  <Field 
                    label="Test Date" 
                    value={drugRecord.cand_drug_date ? new Date(drugRecord.cand_drug_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"} 
                  />
                  <div className="col-span-2">
                    <Field 
                      label="Candidate Remarks / Substance Details" 
                      value={drugRecord.cand_drug_remarks || "None provided"} 
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-4">
                  Has a positive substance / drug test result been identified?
                </p>
                <div className="space-y-4">
                  {/* Option No (Negative) */}
                  <label 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                      positiveIdentified === "No" 
                        ? "border-emerald-500 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-500/20" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setPositiveIdentified("No")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-900 text-sm">Negative (No Substances Detected)</span>
                        <span className="block text-xs text-gray-400 mt-0.5">5/10-panel toxicology screening passed clean</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      positiveIdentified === "No" ? "border-emerald-500" : "border-gray-300"
                    }`}>
                      {positiveIdentified === "No" && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                    </div>
                  </label>

                  {/* Option Yes (Positive) */}
                  <label 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                      positiveIdentified === "Yes" 
                        ? "border-red-400 bg-red-50/40 shadow-sm ring-1 ring-red-400/20" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setPositiveIdentified("Yes")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-red-100 text-red-500 rounded-full">
                        <FileWarning size={16} />
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-900 text-sm">Positive Test Result</span>
                        <span className="block text-xs text-gray-400 mt-0.5">Tested positive for one or more restricted substances</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      positiveIdentified === "Yes" ? "border-red-500" : "border-gray-300"
                    }`}>
                      {positiveIdentified === "Yes" && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Evidence / Pathology Lab Report */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Certified Pathology Lab Report
              </h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                NABL-accredited diagnostic laboratory testing report and chain of custody documentation.
              </p>

              <CaseDocumentViewer
                url={drugRecord.cand_drug_report}
                title="Certified Pathology Lab Report"
                tag="Drug Test"
                headerTitle="PATHOLOGY LAB REPORT"
                noDocMessage="Standard multi-panel test certificate verified electronically with no physical report attached."
              />
            </div>
          </div>
        </div>

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

export default SuperAdminDrugTestDetails;
