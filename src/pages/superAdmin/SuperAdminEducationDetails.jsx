import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Eye,
  CheckCircle2,
  FileBadge,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  X,
  ExternalLink
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
  if (typeof d === "number" || (/^\d{4}$/).test(String(d).trim())) return String(d).trim();
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(d);
  }
};

const fmtYear = (d) => {
  if (!d) return "—";
  if (typeof d === "number" || (/^\d{4}$/).test(String(d).trim())) return String(d).trim();
  try {
    const dt = new Date(d);
    if (!isNaN(dt.getTime())) return String(dt.getFullYear());
    return String(d);
  } catch {
    return String(d);
  }
};

const getDocUrl = (path) => {
  if (!path) return null;
  let clean = path.replace(/\\/g, "/");
  if (clean.includes("bgvplatform-backend.onrender.com")) {
    clean = clean.replace("https://bgvplatform-backend.onrender.com", API_BASE)
                 .replace("http://bgvplatform-backend.onrender.com", API_BASE);
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

function SuperAdminEducationDetails() {
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedEduIndex, setSelectedEduIndex] = useState(0);
  const [activeDocType, setActiveDocType] = useState("certificate");
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
        console.error("Error fetching education case details:", err);
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
      {/* Personal / Case Header Section */}
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
              {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Education Details")}
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
          <Field label="Tag / Function" value={candidate?.department} />
          {candidate?.experience && <Field label="Experience" value={`${candidate.experience} yrs`} />}
        </div>
      </div>

      {/* Education Header with Qualification Pills */}
      <div className="flex items-center justify-between ml-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
            <GraduationCap size={20} />
          </div>
          <h2 className="text-xl font-semibold text-indigo-900">
            Education Details
            {records.length > 0 && (
              <span className="ml-2 text-sm font-medium text-indigo-400">
                ({records.length})
              </span>
            )}
          </h2>
        </div>

        {/* Qualification Selector Pills if multiple */}
        {records.length > 1 && (
          <div className="flex gap-2">
            {records.map((edu, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedEduIndex(idx);
                  if (!edu.cand_edu_certificate && edu.cand_edu_marksheet) {
                    setActiveDocType("marksheet");
                  } else {
                    setActiveDocType("certificate");
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedEduIndex === idx
                    ? "bg-[#05058D] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {edu.cand_edu_type || edu.cand_edu_dgree || `Education ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE EDUCATION RECORD & PREVIEW */}
      <div className="space-y-6 ml-2">
        {records.length > 0 && records[selectedEduIndex] ? (
          (() => {
            const activeEdu = records[selectedEduIndex] || records[0];
            const hasCertificate = Boolean(activeEdu.cand_edu_certificate);
            const hasMarksheet = Boolean(activeEdu.cand_edu_marksheet);

            return (
              <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Qualification Details */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                      <div>
                        <h3 className="text-base font-bold text-indigo-950">
                          {activeEdu.cand_edu_type || activeEdu.cand_edu_dgree || `Education Qualification`}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          {activeEdu.cand_edu_institute || "Institute Details"}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                        {activeEdu.cand_edu_dgree || "Completed"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                      <div className="sm:col-span-2">
                        <Field label="Institute Name" value={activeEdu.cand_edu_institute} />
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Degree / Course" value={activeEdu.cand_edu_dgree} />
                      </div>
                      <Field label="Start Date" value={fmtDate(activeEdu.cand_edu_from_date)} />
                      <Field 
                        label="End Date / Passing Year" 
                        value={fmtYear(activeEdu.cand_edu_to_date) !== "—" ? `${fmtDate(activeEdu.cand_edu_to_date)} (Year: ${fmtYear(activeEdu.cand_edu_to_date)})` : fmtDate(activeEdu.cand_edu_to_date)} 
                      />
                      <Field label="Specialization" value={activeEdu.cand_specialization} />
                      <Field label="Percentage / CGPA" value={activeEdu.cand_edu_grade} />
                    </div>
                  </div>

                  {/* Right: Supporting Document with Pill Switcher */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h3 className="text-sm font-bold text-indigo-950">Supporting Documents</h3>
                      
                      {/* Document Switcher Pills */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveDocType("certificate")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeDocType === "certificate"
                              ? "bg-[#05058D] text-white shadow-xs"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Certificate
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDocType("marksheet")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeDocType === "marksheet"
                              ? "bg-[#05058D] text-white shadow-xs"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Marksheet
                        </button>
                      </div>
                    </div>

                    {activeDocType === "certificate" ? (
                      <CaseDocumentViewer
                        url={activeEdu.cand_edu_certificate}
                        title={`${activeEdu.cand_edu_type || "Degree"} Certificate`}
                        tag={activeEdu.cand_edu_type || "Certificate"}
                        headerTitle="CANDIDATE UPLOADED CERTIFICATE"
                        noDocMessage="No certificate attached for this qualification."
                      />
                    ) : (
                      <CaseDocumentViewer
                        url={activeEdu.cand_edu_marksheet}
                        title={`${activeEdu.cand_edu_type || "Education"} Marksheet`}
                        tag="Marksheet"
                        headerTitle="CANDIDATE UPLOADED MARKSHEET"
                        noDocMessage="No marksheet attached for this qualification."
                      />
                    )}
                  </div>

                </div>
              </div>
            );
          })()
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm text-gray-500">
            <GraduationCap size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700">No Education Records Found</p>
            <p className="text-xs text-gray-400 mt-1">This candidate has not submitted education records yet.</p>
          </div>
        )}

        {/* VERIFICATION DETAILS / STATUS INDICATOR SECTION */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm ml-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-700">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Verification Details &amp; Status
              </h2>
            </div>
            {getStatusBadge(caseData?.verificationStatus)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Verification Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  parseInt(caseData?.verificationStatus) === 4 ? "bg-emerald-500" :
                  parseInt(caseData?.verificationStatus) === 5 ? "bg-rose-500" :
                  parseInt(caseData?.verificationStatus) === 6 ? "bg-amber-500" :
                  parseInt(caseData?.verificationStatus) === 2 ? "bg-purple-500" :
                  parseInt(caseData?.verificationStatus) === 3 ? "bg-blue-500" : "bg-gray-400"
                }`} />
                <span className="text-sm font-semibold text-gray-800">
                  {getStatusName(caseData?.verificationStatus)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Assigned Vendor</p>
              <p className="text-sm font-semibold text-gray-900">
                {caseData?.vendorName || "Not Assigned"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Assigned Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {fmtDate(caseData?.assignedDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Verification Completed Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {fmtDate(caseData?.completedDate)}
              </p>
            </div>
          </div>

          {caseData?.verificationComment && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1.5">Verification Remarks / Notes</p>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700">
                {caseData.verificationComment}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#05058D] hover:bg-blue-800 rounded-xl transition shadow-sm"
            >
              Back to Cases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminEducationDetails;
