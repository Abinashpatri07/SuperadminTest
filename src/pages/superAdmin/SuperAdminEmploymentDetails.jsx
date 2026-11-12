import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Eye,
  Trash2,
  CloudUpload,
  CheckCircle2,
  FileText,
  FileBadge,
  ChevronLeft,
  Loader2,
  Building2,
  ShieldCheck,
  Clock
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import CaseDocumentViewer from "../../components/common/CaseDocumentViewer";

const API_BASE = API_BASE_URL;

const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return String(d); }
};

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



function SuperAdminEmploymentDetails() {
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedEmpIndex, setSelectedEmpIndex] = useState(0);
  const [activeDocType, setActiveDocType] = useState("service");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isView = searchParams.get("mode") === "view";
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
        console.error("Error fetching employment case details:", err);
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

      {/* HEADER */}
      {isView ? (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition">
                <ChevronLeft size={20} />
              </button>
              <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700"><User size={20} /></div>
              <h2 className="text-xl font-semibold text-indigo-900">
                {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Employment Details")}
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-wrap gap-10 lg:gap-14 items-start ml-2">
              <Field label="First Name" value={candidate?.firstName} />
              <Field label="Last Name" value={candidate?.lastName} />
              <Field label="Phone Number" value={candidate?.phone} />
              <Field label="Email Id" value={candidate?.email} />
              <Field label="Department / Function" value={candidate?.department} />
              {candidate?.experience && <Field label="Experience" value={`${candidate.experience} yrs`} />}
            </div>
          </div>
          <div className="flex items-center justify-between ml-2">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700"><Briefcase size={20} /></div>
              <h2 className="text-xl font-semibold text-indigo-900">
                Employment Details
                {records.length > 0 && <span className="ml-2 text-sm font-medium text-indigo-400">({records.length})</span>}
              </h2>
            </div>

            {/* Employer Selector Pills if multiple */}
            {records.length > 1 && (
              <div className="flex gap-2">
                {records.map((emp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedEmpIndex(idx);
                      if (emp.cand_emp_service) setActiveDocType("service");
                      else if (emp.cand_emp_joining) setActiveDocType("joining");
                      else if (emp.cand_emp_payslip) setActiveDocType("payslip");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedEmpIndex === idx
                        ? "bg-[#05058D] text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {emp.cand_emp_company || `Employer ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
              <ChevronLeft size={20} />
            </button>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100"><Briefcase size={24} /></div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">Employment Details</h1>
              {caseData && <p className="text-xs text-gray-500">{caseData.caseId} • {candidate?.fullName}</p>}
            </div>
          </div>

          {/* Employer Selector Pills if multiple in non-view mode */}
          {records.length > 1 && (
            <div className="flex gap-2">
              {records.map((emp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedEmpIndex(idx);
                    if (emp.cand_emp_service) setActiveDocType("service");
                    else if (emp.cand_emp_joining) setActiveDocType("joining");
                    else if (emp.cand_emp_payslip) setActiveDocType("payslip");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedEmpIndex === idx
                      ? "bg-[#05058D] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {emp.cand_emp_company || `Employer ${idx + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIVE EMPLOYMENT RECORD & PREVIEW */}
      <div className="space-y-6 mt-4 ml-2">
        {records.length > 0 && records[selectedEmpIndex] ? (
          (() => {
            const emp = records[selectedEmpIndex] || records[0];

            return (
              <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Employment Details */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700"><Building2 size={18} /></div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{emp.cand_emp_company || `Employer`}</h3>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">Emp ID: {emp.cand_emp_empid || "N/A"}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100">
                        {emp.cand_emp_type || "Employment"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                      <Field label="Employee ID" value={emp.cand_emp_empid} />
                      <Field label="Company Name" value={emp.cand_emp_company} />
                      <Field label="First Name" value={emp.cand_first_name || candidate?.firstName} />
                      <Field label="Last Name" value={emp.cand_last_name || candidate?.lastName} />
                      <Field label="From Date" value={fmtDate(emp.cand_emp_from_date)} />
                      <Field label="To Date" value={fmtDate(emp.cand_emp_to_date)} />
                      <Field label="Designation" value={emp.cand_emp_designation} />
                      <Field label="UAN Number" value={emp.cand_emp_uan_number} />
                    </div>
                  </div>

                  {/* Right: Company Documents with Switcher Pills */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h3 className="text-sm font-bold text-indigo-950">Company Documents</h3>
                      
                      {/* Document Switcher Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setActiveDocType("service")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeDocType === "service"
                              ? "bg-[#05058D] text-white shadow-xs"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Service Letter
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDocType("joining")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeDocType === "joining"
                              ? "bg-[#05058D] text-white shadow-xs"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Offer Letter
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDocType("payslip")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeDocType === "payslip"
                              ? "bg-[#05058D] text-white shadow-xs"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Pay Slip
                        </button>
                      </div>
                    </div>

                    {activeDocType === "service" && (
                      <CaseDocumentViewer
                        url={emp.cand_emp_service}
                        title="Service / Relieving Letter"
                        tag="Service Letter"
                        headerTitle="CANDIDATE UPLOADED DOCUMENT"
                        noDocMessage="No service or relieving letter uploaded for this employer."
                      />
                    )}
                    {activeDocType === "joining" && (
                      <CaseDocumentViewer
                        url={emp.cand_emp_joining}
                        title="Joining / Offer Letter"
                        tag="Joining Letter"
                        headerTitle="CANDIDATE UPLOADED DOCUMENT"
                        noDocMessage="No joining or offer letter uploaded for this employer."
                      />
                    )}
                    {activeDocType === "payslip" && (
                      <CaseDocumentViewer
                        url={emp.cand_emp_payslip}
                        title="Salary Slip / Pay Slip"
                        tag="Pay Slip"
                        headerTitle="CANDIDATE UPLOADED DOCUMENT"
                        noDocMessage="No salary slip or pay slip uploaded for this employer."
                      />
                    )}
                  </div>

                </div>
              </div>
            );
          })()
        ) : (
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center py-16">
            <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400 font-medium">
              {caseIdParam ? "No employment records found for this case." : "No case selected."}
            </p>
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

export default SuperAdminEmploymentDetails;
