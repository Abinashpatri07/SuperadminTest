import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import {
  IdCard,
  User,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Calendar,
  CreditCard,
  ShieldCheck,
  Building,
  Loader2,
  FileText,
  ShieldCheck as ShieldCheckIcon,
  Clock,
  Building2,
  X,
  ExternalLink,
  Maximize2
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

import CaseDocumentViewer from "../../components/common/CaseDocumentViewer";

export default function SuperAdminIdentificationDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseIdParam = searchParams.get("caseId");
  const mode = searchParams.get("mode") || "view";

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [activeSide, setActiveSide] = useState("front");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!caseIdParam) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const API_BASE = API_BASE_URL;
        const res = await axiosInstance.get(`${API_BASE}/api/superadmin/cases/details/${caseIdParam}`);
        if (res.data.success) {
          setCaseData(res.data.case);
          setCandidate(res.data.candidate);
          setRecords(res.data.records || []);
        }
      } catch (err) {
        console.error("Error fetching identification case details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [caseIdParam]);

  const activeDoc = records[selectedDocIndex] || records[0] || null;

  const getIdNumber = (doc) => {
    if (!doc) return "N/A";
    return doc.pan_number || doc.driving_number || doc.voter_number || doc.passport_number || doc.uan_number || doc.cand_ident_number || "N/A";
  };

  const getIssueDate = (doc) => {
    if (!doc) return "N/A";
    const d = doc.driv_issue_date || doc.pass_issue_date || doc.voter_issue_date;
    return d ? new Date(d).toLocaleDateString() : "N/A";
  };

  const getExpiryDate = (doc) => {
    if (!doc) return "N/A";
    const d = doc.pass_expiry_date || doc.driv_expiry_date;
    return d ? new Date(d).toLocaleDateString() : "N/A";
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in pb-12 px-4 mt-2">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-700 border border-indigo-100">
            <IdCard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-950">
              Identification Verification Details
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {caseData?.caseId || `Case #${caseIdParam || "N/A"}`} • {candidate?.fullName || "Candidate Details"}
            </p>
          </div>
        </div>

        {caseData && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {caseData.vendorName ? `Assigned to: ${caseData.vendorName}` : "Unassigned Vendor"}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-600">Loading identification case records...</p>
        </div>
      ) : (
        <>
          {/* CANDIDATE INFO OVERVIEW */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700">
                <User size={18} />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Candidate Profile
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">First Name</p>
                <p className="text-sm font-semibold text-gray-900">{candidate?.firstName || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Last Name</p>
                <p className="text-sm font-semibold text-gray-900">{candidate?.lastName || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Candidate ID</p>
                <p className="text-sm font-mono font-semibold text-indigo-700">{candidate?.candidateId || `CAND-${candidate?.candId || "N/A"}`}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">+91 {candidate?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Email Address</p>
                <p className="text-sm font-semibold text-gray-900 truncate" title={candidate?.email}>{candidate?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Function / Dept</p>
                <p className="text-sm font-semibold text-gray-900">{candidate?.department || "General"}</p>
              </div>
            </div>
          </div>

          {/* MAIN IDENTIFICATION DETAILS & PREVIEW */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-indigo-950">
                  Uploaded Identity Documents ({records.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  National identification documents submitted for verification.
                </p>
              </div>

              {/* Document Selector Pills if multiple */}
              {records.length > 1 && (
                <div className="flex gap-2">
                  {records.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDocIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedDocIndex === idx
                          ? "bg-[#05058D] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {doc.cand_iden_type || `Document ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {records.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No identity documents uploaded for this candidate yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Extracted Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <div>
                      <h4 className="text-base font-bold text-indigo-950">
                        {activeDoc?.cand_iden_type || "Identity Document"}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        ID: {getIdNumber(activeDoc)}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} /> {activeDoc?.iden_verification_status === 2 ? "Verified" : "Submitted"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Full Name on Card</p>
                      <p className="text-sm font-semibold text-gray-900">{activeDoc?.cand_full_name || `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim() || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Document Number</p>
                      <p className="text-sm font-mono font-bold text-indigo-700">{getIdNumber(activeDoc)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Date of Birth</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {activeDoc?.cand_dob ? new Date(activeDoc.cand_dob).toLocaleDateString() : candidate?.dob ? new Date(candidate.dob).toLocaleDateString() : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Gender</p>
                      <p className="text-sm font-semibold text-gray-900">{activeDoc?.cand_gender || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Issue Date</p>
                      <p className="text-sm font-semibold text-gray-900">{getIssueDate(activeDoc)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Expiry Date</p>
                      <p className="text-sm font-semibold text-gray-900">{getExpiryDate(activeDoc)}</p>
                    </div>

                    {activeDoc?.cand_father_name && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-400 font-medium mb-1">Father's Name</p>
                        <p className="text-sm font-semibold text-gray-900">{activeDoc.cand_father_name}</p>
                      </div>
                    )}

                    {activeDoc?.cand_address && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-400 font-medium mb-1">Address on Document</p>
                        <p className="text-sm font-semibold text-gray-900">{activeDoc.cand_address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Candidate Uploaded Document Viewer */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  {(() => {
                    const hasFrontBack = Boolean(activeDoc?.cand_ident_front_file || activeDoc?.cand_ident_back_file);
                    const mainDoc = activeDoc?.cand_iden_docu || activeDoc?.cand_iden_doc || activeDoc?.doc_file_path;

                    if (hasFrontBack) {
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h4 className="text-sm font-bold text-indigo-950">Identity Proof</h4>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setActiveSide("front")}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                  activeSide === "front"
                                    ? "bg-[#05058D] text-white shadow-xs"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                Front Side
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveSide("back")}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                  activeSide === "back"
                                    ? "bg-[#05058D] text-white shadow-xs"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                Back Side
                              </button>
                            </div>
                          </div>

                          {activeSide === "front" ? (
                            <CaseDocumentViewer
                              url={activeDoc.cand_ident_front_file}
                              title={`${activeDoc?.cand_iden_type || "ID"} (Front Side)`}
                              tag="Front Side"
                              headerTitle="CANDIDATE UPLOADED DOCUMENT (FRONT)"
                              noDocMessage="No front side document uploaded."
                            />
                          ) : (
                            <CaseDocumentViewer
                              url={activeDoc.cand_ident_back_file}
                              title={`${activeDoc?.cand_iden_type || "ID"} (Back Side)`}
                              tag="Back Side"
                              headerTitle="CANDIDATE UPLOADED DOCUMENT (BACK)"
                              noDocMessage="No back side document uploaded."
                            />
                          )}
                        </div>
                      );
                    }

                    return (
                      <CaseDocumentViewer
                        url={mainDoc || null}
                        title={activeDoc?.cand_iden_type || "Identity Document"}
                        tag={activeDoc?.cand_iden_type}
                        headerTitle="CANDIDATE UPLOADED DOCUMENT"
                        noDocMessage={`Candidate submitted ${activeDoc?.cand_iden_type || "identification"} details, but no document image was attached.`}
                      />
                    );
                  })()}
                </div>

              </div>
            )}
          </div>

          {/* CASE STATUS & VENDOR INFO PANEL */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700">
                <ShieldCheckIcon size={18} />
              </div>
              <h2 className="text-base font-bold text-indigo-950">
                Case Verification Status
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Current Status */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-1">Current Status</p>
                {(() => {
                  const s = parseInt(caseData?.verificationStatus);
                  const labels = { 1: "Pending", 2: "Assigned", 3: "In Progress", 4: "Verified", 5: "Refuted", 6: "On Hold" };
                  const colors = {
                    1: "bg-blue-50 text-blue-700",
                    2: "bg-purple-50 text-purple-700",
                    3: "bg-blue-50 text-blue-700",
                    4: "bg-emerald-50 text-emerald-700",
                    5: "bg-red-50 text-red-700",
                    6: "bg-amber-50 text-amber-700"
                  };
                  return (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors[s] || "bg-gray-100 text-gray-700"}`}>
                      {labels[s] || "Unverified"}
                    </span>
                  );
                })()}
              </div>

              {/* Assigned Vendor */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-1">Assigned Vendor</p>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-indigo-500 shrink-0" />
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {caseData?.vendorName || "Not Assigned"}
                  </p>
                </div>
              </div>

              {/* Assigned Date */}
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

            {/* Verification Remarks if available */}
            {caseData?.verificationComment && (
              <div className="mb-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <p className="text-xs text-indigo-600 font-semibold mb-1">Verification Remarks (by Vendor)</p>
                <p className="text-sm text-gray-700">{caseData.verificationComment}</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                ← Back to Cases
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
