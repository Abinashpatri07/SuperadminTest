import { API_BASE_URL } from "../../../API/config.js";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../../API/axiosInstance";
import {
  User,
  MapPin,
  IdCard,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Activity,
  Users,
  CheckCircle,
  Eye,
  ArrowLeft,
  Download,
} from "lucide-react";
import { exportCandidateCompleteReport } from "../../../utils/exportCandidatePdf";
import CaseDocumentViewer from "../../common/CaseDocumentViewer";

const Label = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-800 break-words">{value || "Not Available"}</p>
  </div>
);

function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Personal");
  const [activeAddressTab, setActiveAddressTab] = useState("present");
  const [showEducationView, setShowEducationView] = useState(null);
  const [selectedEduDocType, setSelectedEduDocType] = useState("certificate");
  const [showEmploymentView, setShowEmploymentView] = useState(null);
  const [selectedEmpDocType, setSelectedEmpDocType] = useState("service");
  const [criminalView, setCriminalView] = useState(null);
  const [drugView, setDrugView] = useState(null);
  const [identityView, setIdentityView] = useState(null);
  const [selectedIdSide, setSelectedIdSide] = useState("front");

  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/api/client-admin/candidate/get-candidate/${id}`);
        if (response.data.success) {
          setCandidateData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const tabs = [
    { name: "Personal", icon: User },
    { name: "Address", icon: MapPin },
    { name: "Identity", icon: IdCard },
    { name: "Education", icon: GraduationCap },
    { name: "Employment", icon: Briefcase },
    { name: "Criminal", icon: ShieldAlert },
    { name: "Drug", icon: Activity },
    { name: "Reference", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FE]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02027A]"></div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FE]">
        <div className="text-xl text-gray-500 font-medium">Candidate Not Found</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#F4F7FE] min-h-screen">
      {/* TOP */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#02027A] transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* TITLE + STATUS BADGE */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#02027A]">
            Candidate Details
          </h1>
          <p className="text-gray-500 mt-1">
            View Complete Candidate Verification Information
          </p>
        </div>

        {/* ACCOUNT STATUS & EXPORT BUTTON - RIGHT SIDE */}
        <div className="flex flex-col items-end gap-3">
          {/* EXPORT BUTTON - Enabled when status is Complete (4) or Verified (1) */}
          {candidateData && (candidateData.verification_status === 1 || candidateData.verification_status === 4) && (
            <button
              onClick={() => exportCandidateCompleteReport(candidateData, id)}
              className="flex items-center gap-2 px-4 py-2 bg-[#02027A] hover:bg-[#010156] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Download complete verified candidate report as PDF"
            >
              <Download size={16} />
              Export Report
            </button>
          )}

          <div className={`flex items-center gap-3 border rounded-2xl px-5 py-3 ${
            candidateData.verification_status === 1 || candidateData.verification_status === 4 ? 'bg-[#e8fce8] border-green-200' : 
            candidateData.verification_status === 3 ? 'bg-red-50 border-red-200' : 
            'bg-yellow-50 border-yellow-200'
          }`}>
            {candidateData.verification_status === 1 ? (
              <>
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-[#00cc00] text-base font-bold tracking-wide">
                  Account Status: Verified
                </span>
              </>
            ) : candidateData.verification_status === 4 ? (
              <>
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-[#00cc00] text-base font-bold tracking-wide">
                  Account Status: Complete
                </span>
              </>
            ) : candidateData.verification_status === 3 ? (
              <>
                <ShieldAlert size={20} className="text-red-500" />
                <span className="text-red-600 text-base font-bold tracking-wide">
                  Account Status: Rejected
                </span>
              </>
            ) : (
              <>
                <Activity size={20} className="text-yellow-600" />
                <span className="text-yellow-700 text-base font-bold tracking-wide">
                  Account Status: Pending
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CANDIDATE ID */}
      <div className="mb-6">
        <span className="bg-indigo-50 text-[#02027A] px-4 py-2 rounded-xl text-sm font-medium">
          Candidate ID: {id}
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 text-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setShowEducationView(null);
                  setShowEmploymentView(null);
                  setCriminalView(null);
                  setDrugView(null);
                  setIdentityView(null);
                  setSelectedEduDocType("certificate");
                  setSelectedEmpDocType("service");
                  setSelectedIdSide("front");
                  setActiveAddressTab("present");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-medium text-xs transition cursor-pointer ${
                  isActive
                    ? "bg-[#01026E] text-white shadow-sm"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                <Icon size={15} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* PERSONAL TAB */}
          {activeTab === "Personal" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Personal Information
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  General profile details and contact information.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Label label="Name" value={`${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                <Label label="Phone no" value={candidateData.candidate_mobile} />
                <Label label="Email" value={candidateData.candidate_email} />
                <Label label="Date Of Birth" value={candidateData.candidate_dob ? new Date(candidateData.candidate_dob).toLocaleDateString() : "Not Available"} />
                <Label label="Function" value={candidateData.candidate_function} />
                <Label label="Tag" value={candidateData.candidate_tag} />
              </div>
            </div>
          )}

          {/* ADDRESS TAB */}
          {activeTab === "Address" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {activeAddressTab === "present" ? "Present Address" : "Permanent Address"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activeAddressTab === "present" ? "Current residential address details." : "Permanent residential address details."}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveAddressTab("present")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeAddressTab === "present"
                        ? "bg-[#05058D] text-white shadow-xs"
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
                        ? "bg-[#05058D] text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Permanent Address
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                {activeAddressTab === "present" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <Label label="Address Line 1" value={candidateData.address?.cand_curr_add_line1} />
                    <Label label="Address Line 2" value={candidateData.address?.cand_curr_add_line2} />
                    <Label label="City" value={candidateData.address?.cand_curr_city} />
                    <Label label="State" value={candidateData.address?.cand_curr_state} />
                    <Label label="Pin Code" value={candidateData.address?.cand_curr_pincode} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <Label label="Address Line 1" value={candidateData.address?.cand_perm_add_line1} />
                    <Label label="Address Line 2" value={candidateData.address?.cand_perm_add_line2} />
                    <Label label="City" value={candidateData.address?.cand_perm_city} />
                    <Label label="State" value={candidateData.address?.cand_perm_state} />
                    <Label label="Pin Code" value={candidateData.address?.cand_perm_pincode} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IDENTITY TAB */}
          {activeTab === "Identity" && (
            <>
              {!identityView ? (
                <>
                  <div className="border-b border-gray-100 pb-3 mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      Identity Information
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Verification details and submitted national ID documents.
                    </p>
                  </div>

                  {candidateData.identity && candidateData.identity.length > 0 ? (
                    <div className="space-y-4">
                      {candidateData.identity.map((item, idx) => {
                        const docType = item.cand_iden_type || item.cand_ident_type || `Identity Document ${idx + 1}`;
                        const docNumber = item.pan_number || item.driving_number || item.voter_number || item.passport_number || item.uan_number || item.cand_ident_number || "N/A";
                        return (
                          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-indigo-200 transition">
                            <div>
                              <h4 className="font-bold text-[#01026E] text-base mb-1">{docType}</h4>
                              <p className="text-xs font-mono text-gray-500">ID Number: <span className="font-semibold text-gray-800">{docNumber}</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                                <CheckCircle size={13} /> Verified
                              </span>
                              <button 
                                type="button"
                                onClick={() => {
                                  setIdentityView(item);
                                  setSelectedIdSide("front");
                                }}
                                className="flex items-center gap-1.5 text-white cursor-pointer bg-[#01026E] hover:bg-indigo-900 px-3.5 py-1.5 rounded-xl transition font-semibold text-xs shadow-sm"
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-gray-500">
                      <IdCard size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="font-semibold text-gray-700">No Identity Records Found</p>
                      <p className="text-xs text-gray-400 mt-1">This candidate has not submitted identity documents yet.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Identity Details — {identityView.cand_iden_type || identityView.cand_ident_type || "National ID"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Verification details for {identityView.cand_iden_type || identityView.cand_ident_type || "National ID"}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setIdentityView(null);
                        setSelectedIdSide("front");
                      }}
                      className="text-xs font-semibold text-[#01026E] border border-[#01026E] px-3.5 py-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Info Card */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                        <div>
                          <h4 className="text-base font-bold text-gray-900">
                            {identityView.cand_iden_type || identityView.cand_ident_type || "National ID"}
                          </h4>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            ID: {identityView.pan_number || identityView.driving_number || identityView.voter_number || identityView.passport_number || identityView.uan_number || identityView.cand_ident_number || "N/A"}
                          </p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                          <CheckCircle size={13} /> Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Label label="Cardholder Name" value={identityView.cand_full_name || `${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                        <Label label="Document Type" value={identityView.cand_iden_type || identityView.cand_ident_type || "National ID"} />
                        <Label label="ID Number" value={identityView.pan_number || identityView.driving_number || identityView.voter_number || identityView.passport_number || identityView.uan_number || identityView.cand_ident_number || "N/A"} />
                        <Label label="Father / Guardian Name" value={identityView.cand_father_name || "N/A"} />
                        <Label label="Date of Birth" value={identityView.cand_dob ? new Date(identityView.cand_dob).toLocaleDateString() : "N/A"} />
                        <Label label="Gender" value={identityView.cand_gender || "N/A"} />
                        <Label label="Issue Date" value={(identityView.driv_issue_date || identityView.pass_issue_date || identityView.voter_issue_date || identityView.cand_ident_issue_date) ? new Date(identityView.driv_issue_date || identityView.pass_issue_date || identityView.voter_issue_date || identityView.cand_ident_issue_date).toLocaleDateString() : "N/A"} />
                        <Label label="Expiry Date" value={(identityView.pass_expiry_date || identityView.driv_expiry_date || identityView.cand_ident_expiry_date) ? new Date(identityView.pass_expiry_date || identityView.driv_expiry_date || identityView.cand_ident_expiry_date).toLocaleDateString() : "N/A"} />
                        <div className="sm:col-span-2">
                          <Label label="Address on ID" value={identityView.cand_address || "N/A"} />
                        </div>
                      </div>
                    </div>

                    {/* Right: Candidate Uploaded Document Viewer */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                      {(() => {
                        const hasFrontBack = Boolean(identityView.cand_ident_front_file || identityView.cand_ident_back_file);
                        const mainDoc = identityView.cand_iden_docu || identityView.cand_iden_doc || identityView.doc_file_path;

                        if (hasFrontBack) {
                          return (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h4 className="text-sm font-bold text-indigo-950">Identity Proof</h4>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedIdSide("front")}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                      selectedIdSide === "front"
                                        ? "bg-[#05058D] text-white shadow-xs"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    Front Side
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedIdSide("back")}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                      selectedIdSide === "back"
                                        ? "bg-[#05058D] text-white shadow-xs"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    Back Side
                                  </button>
                                </div>
                              </div>

                              {selectedIdSide === "front" ? (
                                <CaseDocumentViewer
                                  url={identityView.cand_ident_front_file}
                                  title={`${identityView.cand_iden_type || "ID"} (Front Side)`}
                                  tag="Front Side"
                                  headerTitle="CANDIDATE UPLOADED DOCUMENT (FRONT)"
                                  noDocMessage="No front side document uploaded."
                                />
                              ) : (
                                <CaseDocumentViewer
                                  url={identityView.cand_ident_back_file}
                                  title={`${identityView.cand_iden_type || "ID"} (Back Side)`}
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
                            title={`${identityView.cand_iden_type || identityView.cand_ident_type || "Identity"} Document`}
                            tag={identityView.cand_iden_type || identityView.cand_ident_type}
                            headerTitle="CANDIDATE UPLOADED DOCUMENT"
                            noDocMessage="No Identity Document Uploaded"
                          />
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* EDUCATION TAB */}
          {activeTab === "Education" && (
            <>
              {!showEducationView ? (
                <>
                  <div className="border-b border-gray-100 pb-3 mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      Education Details
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Candidate qualification records and certificates.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {candidateData.education && candidateData.education.length > 0 ? (
                      candidateData.education.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-indigo-200 transition"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-emerald-500" />
                            <div>
                              <span className="text-sm font-bold text-[#01026E] block">
                                {item.cand_edu_type || item.cand_edu_dgree || `Education Record ${idx + 1}`}
                              </span>
                              <span className="text-xs text-gray-400">
                                {item.cand_edu_institute || "Institute Name N/A"}
                              </span>
                            </div>
                          </div>

                          <button 
                            type="button"
                            className="flex items-center gap-1.5 text-white cursor-pointer bg-[#01026E] hover:bg-indigo-900 px-3.5 py-1.5 rounded-xl transition font-semibold text-xs shadow-sm"
                            onClick={() => {
                              setShowEducationView(item);
                              setSelectedEduDocType("certificate");
                            }}
                          >
                            <Eye size={14} /> <span>View</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-gray-500">
                        <GraduationCap size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-semibold text-gray-700">No Education Records Found</p>
                        <p className="text-xs text-gray-400 mt-1">This candidate has not submitted education records yet.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Education Details — {showEducationView.cand_edu_type || showEducationView.cand_edu_dgree || "Qualification"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Academic credentials and verification documents
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowEducationView(null);
                        setSelectedEduDocType("certificate");
                      }}
                      className="text-xs font-semibold text-[#01026E] border border-[#01026E] px-3.5 py-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Info Card */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                        <div>
                          <h4 className="text-base font-bold text-gray-900">
                            {showEducationView.cand_edu_institute || "Institute Name"}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {showEducationView.cand_edu_type || showEducationView.cand_edu_dgree || "Degree / Course"}
                          </p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                          <CheckCircle size={13} /> Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Label label="Institute Name" value={showEducationView.cand_edu_institute} />
                        <Label label="Degree / Course" value={showEducationView.cand_edu_type || showEducationView.cand_edu_dgree} />
                        <Label label="Start Date" value={showEducationView.cand_edu_from_date ? new Date(showEducationView.cand_edu_from_date).toLocaleDateString() : "N/A"} />
                        <Label label="End Date / Passing Year" value={showEducationView.cand_edu_to_date ? new Date(showEducationView.cand_edu_to_date).toLocaleDateString() : "N/A"} />
                        <Label label="Course / Specialization" value={showEducationView.cand_specialization || showEducationView.cand_edu_course} />
                        <Label label="Percentage / CGPA" value={showEducationView.cand_edu_grade} />
                      </div>
                    </div>

                    {/* Right: Supporting Documents with Pill Switcher */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h3 className="text-sm font-bold text-indigo-950">Supporting Documents</h3>
                        
                        {/* Document Switcher Pills */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedEduDocType("certificate")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              selectedEduDocType === "certificate"
                                ? "bg-[#05058D] text-white shadow-xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Certificate
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedEduDocType("marksheet")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              selectedEduDocType === "marksheet"
                                ? "bg-[#05058D] text-white shadow-xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Marksheet
                          </button>
                        </div>
                      </div>

                      {selectedEduDocType === "certificate" ? (
                        <CaseDocumentViewer
                          url={showEducationView.cand_edu_certificate}
                          title={`${showEducationView.cand_edu_type || "Degree"} Certificate`}
                          tag={showEducationView.cand_edu_type || "Certificate"}
                          headerTitle="CANDIDATE UPLOADED CERTIFICATE"
                          noDocMessage="No certificate attached for this qualification."
                        />
                      ) : (
                        <CaseDocumentViewer
                          url={showEducationView.cand_edu_marksheet}
                          title={`${showEducationView.cand_edu_type || "Education"} Marksheet`}
                          tag="Marksheet"
                          headerTitle="CANDIDATE UPLOADED MARKSHEET"
                          noDocMessage="No marksheet attached for this qualification."
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* EMPLOYMENT TAB */}
          {activeTab === "Employment" && (
            <>
              {!showEmploymentView ? (
                <>
                  <div className="border-b border-gray-100 pb-3 mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      Employment Details
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Past employment and organization history.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {candidateData.employment && candidateData.employment.length > 0 ? (
                      candidateData.employment.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex justify-between items-center hover:border-indigo-200 transition">
                          <div>
                            <h4 className="text-base font-bold text-[#01026E]">
                              {item.cand_emp_designation || "Designation Not Available"}
                            </h4>
                            <p className="text-sm font-semibold text-gray-700 mt-0.5">{item.cand_emp_company || "Company Not Available"}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {item.cand_emp_from_date ? new Date(item.cand_emp_from_date).toLocaleDateString() : "N/A"} - {item.cand_emp_to_date ? new Date(item.cand_emp_to_date).toLocaleDateString() : "Present"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setShowEmploymentView(item);
                              setSelectedEmpDocType("service");
                            }}
                            className="flex items-center gap-1.5 text-white cursor-pointer bg-[#01026E] hover:bg-indigo-900 px-3.5 py-1.5 rounded-xl transition font-semibold text-xs shadow-sm"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-gray-500">
                        <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-semibold text-gray-700">No Employment Records Found</p>
                        <p className="text-xs text-gray-400 mt-1">This candidate has not submitted employment records yet.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Employment Details — {showEmploymentView.cand_emp_company || "Employer"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Work history and employment proof documents
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowEmploymentView(null);
                        setSelectedEmpDocType("service");
                      }}
                      className="text-xs font-semibold text-[#01026E] border border-[#01026E] px-3.5 py-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Info Card */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                        <div>
                          <h4 className="text-base font-bold text-gray-900">
                            {showEmploymentView.cand_emp_designation || "Designation"}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {showEmploymentView.cand_emp_company || "Company"}
                          </p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                          <CheckCircle size={13} /> Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Label label="Employee ID" value={showEmploymentView.cand_emp_empid} />
                        <Label label="Company Name" value={showEmploymentView.cand_emp_company} />
                        <Label label="From Date" value={showEmploymentView.cand_emp_from_date ? new Date(showEmploymentView.cand_emp_from_date).toLocaleDateString() : "N/A"} />
                        <Label label="To Date" value={showEmploymentView.cand_emp_to_date ? new Date(showEmploymentView.cand_emp_to_date).toLocaleDateString() : "Present"} />
                        <Label label="Designation" value={showEmploymentView.cand_emp_designation} />
                        <Label label="Employment Type" value={showEmploymentView.cand_emp_type} />
                        {showEmploymentView.cand_emp_uan_number && (
                          <Label label="UAN Number" value={showEmploymentView.cand_emp_uan_number} />
                        )}
                      </div>
                    </div>

                    {/* Right: Supporting Documents with Pill Switcher */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h3 className="text-sm font-bold text-indigo-950">Supporting Documents</h3>
                        
                        {/* Document Switcher Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setSelectedEmpDocType("service")}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              selectedEmpDocType === "service"
                                ? "bg-[#05058D] text-white shadow-xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Service Letter
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedEmpDocType("joining")}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              selectedEmpDocType === "joining"
                                ? "bg-[#05058D] text-white shadow-xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Offer Letter
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedEmpDocType("payslip")}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              selectedEmpDocType === "payslip"
                                ? "bg-[#05058D] text-white shadow-xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Pay Slip
                          </button>
                        </div>
                      </div>

                      {selectedEmpDocType === "service" && (
                        <CaseDocumentViewer
                          url={showEmploymentView.cand_emp_service}
                          title="Service / Relieving Letter"
                          tag="Service Letter"
                          headerTitle="CANDIDATE UPLOADED DOCUMENT"
                          noDocMessage="No service or relieving letter uploaded for this employer."
                        />
                      )}
                      {selectedEmpDocType === "joining" && (
                        <CaseDocumentViewer
                          url={showEmploymentView.cand_emp_joining}
                          title="Joining / Offer Letter"
                          tag="Joining Letter"
                          headerTitle="CANDIDATE UPLOADED DOCUMENT"
                          noDocMessage="No joining or offer letter uploaded for this employer."
                        />
                      )}
                      {selectedEmpDocType === "payslip" && (
                        <CaseDocumentViewer
                          url={showEmploymentView.cand_emp_payslip}
                          title="Salary Slip / Pay Slip"
                          tag="Pay Slip"
                          headerTitle="CANDIDATE UPLOADED DOCUMENT"
                          noDocMessage="No salary slip or pay slip uploaded for this employer."
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* CRIMINAL TAB */}
          {activeTab === "Criminal" && (
            <>
              {!criminalView ? (
                <>
                  <div className="border-b border-gray-100 pb-3 mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      Criminal Record
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Court records and police verification background check.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {candidateData.criminal && candidateData.criminal.length > 0 ? (
                      candidateData.criminal.map((item, idx) => {
                        const hasCriminal = item.cand_crim_record === "Yes" || !!item.cand_crim_report;
                        return (
                          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex justify-between items-center hover:border-indigo-200 transition">
                            <div>
                              <p className={`text-sm font-bold ${hasCriminal ? "text-red-700" : "text-emerald-700"}`}>
                                {hasCriminal ? "Criminal Record Report Exists" : "No Criminal Record"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Case / Record: <span className="font-semibold text-gray-700">{item.cand_crim_record || "None"}</span>
                              </p>
                              {item.cand_crim_remarks && (
                                <p className="text-xs text-gray-400 mt-0.5">Remarks: {item.cand_crim_remarks}</p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => setCriminalView(item)}
                              className="flex items-center gap-1.5 text-white cursor-pointer bg-[#01026E] hover:bg-indigo-900 px-3.5 py-1.5 rounded-xl transition font-semibold text-xs shadow-sm"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-gray-500">
                        <CheckCircle size={40} className="mx-auto mb-3 text-emerald-400" />
                        <p className="font-semibold text-emerald-700">No Criminal Records Found</p>
                        <p className="text-xs text-gray-400 mt-1">No police or court records flagged for this candidate.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Criminal Verification Details
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Law enforcement & court verification records
                      </p>
                    </div>
                    <button 
                      onClick={() => setCriminalView(null)}
                      className="text-xs font-semibold text-[#01026E] border border-[#01026E] px-3.5 py-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                        <div>
                          <h4 className="text-base font-bold text-gray-900">Criminal Check</h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Record: {criminalView.cand_crim_record || "None"}
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold border ${
                          criminalView.cand_crim_record === "Yes" || criminalView.cand_crim_report
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {criminalView.cand_crim_record === "Yes" || criminalView.cand_crim_report ? "Record Exists" : "Verified Clean"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Label label="Candidate Name" value={`${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                        <Label label="Case No / Record" value={criminalView.cand_crim_record} />
                        <Label label="Record Date" value={criminalView.cand_crim_date ? new Date(criminalView.cand_crim_date).toLocaleDateString() : "N/A"} />
                        <div className="sm:col-span-2">
                          <Label label="Case Details / Remarks" value={criminalView.cand_crim_remarks} />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <CaseDocumentViewer
                        url={criminalView.cand_crim_report}
                        title="Criminal Record Report"
                        tag="Criminal Report"
                        headerTitle="CANDIDATE UPLOADED DOCUMENT"
                        noDocMessage="No criminal report document uploaded."
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* DRUG TAB */}
          {activeTab === "Drug" && (
            <>
              {!drugView ? (
                <>
                  <div className="border-b border-gray-100 pb-3 mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      Drug Test Report
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Medical laboratory panel screening results.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {candidateData.drug && candidateData.drug.length > 0 ? (
                      candidateData.drug.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex justify-between items-center hover:border-indigo-200 transition">
                          <div>
                            <p className="text-sm font-bold text-gray-800">Drug Screening Test</p>
                            <p className="text-xs text-gray-500 mt-1">Test ID: <span className="font-semibold text-gray-700">{item.cand_drug_test || "N/A"}</span></p>
                            {item.cand_drug_remarks && (
                              <p className="text-xs text-gray-400 mt-0.5">Remarks: {item.cand_drug_remarks}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setDrugView(item)}
                            className="flex items-center gap-1.5 text-white cursor-pointer bg-[#01026E] hover:bg-indigo-900 px-3.5 py-1.5 rounded-xl transition font-semibold text-xs shadow-sm"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-gray-500">
                        <Activity size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-semibold text-gray-700">No Drug Test Records Found</p>
                        <p className="text-xs text-gray-400 mt-1">No drug screening reports have been submitted for this candidate.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Drug Test Verification Details
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Panel drug test screening laboratory report
                      </p>
                    </div>
                    <button 
                      onClick={() => setDrugView(null)}
                      className="text-xs font-semibold text-[#01026E] border border-[#01026E] px-3.5 py-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                        <div>
                          <h4 className="text-base font-bold text-gray-900">Drug Screening Test</h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Test ID: {drugView.cand_drug_test || "N/A"}
                          </p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                          <CheckCircle size={13} /> Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Label label="Candidate Name" value={`${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                        <Label label="Test ID / Reference" value={drugView.cand_drug_test} />
                        <Label label="Test Date" value={drugView.cand_drug_date ? new Date(drugView.cand_drug_date).toLocaleDateString() : "N/A"} />
                        <div className="sm:col-span-2">
                          <Label label="Test Remarks / Panel" value={drugView.cand_drug_remarks} />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <CaseDocumentViewer
                        url={drugView.cand_drug_report}
                        title="Drug Screening Report"
                        tag="Drug Report"
                        headerTitle="CANDIDATE UPLOADED DOCUMENT"
                        noDocMessage="No drug test report document uploaded."
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* REFERENCE TAB */}
          {activeTab === "Reference" && (
            <>
              <div className="border-b border-gray-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Reference Details
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Professional and academic reference contacts.
                </p>
              </div>

              {candidateData.reference && candidateData.reference.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidateData.reference.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                        <h4 className="font-bold text-[#01026E] text-base">Reference #{idx + 1}</h4>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {item.cand_ref_designation || item.cand_ref_relation || "Referee"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label label="Name" value={item.cand_ref_name} />
                        <Label label="Phone no" value={item.cand_ref_phone || item.cand_ref_contact} />
                        <Label label="Email" value={item.cand_ref_email} />
                        <Label label="Relationship / Gender" value={item.cand_ref_relation || item.cand_ref_relationship || item.cand_ref_gender} />
                        <Label label="Organization / Institute" value={item.cand_ref_org || item.cand_ref_institute} />
                        <Label label="Designation / Role" value={item.cand_ref_designation} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-gray-500">
                  <Users size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold text-gray-700">No Reference Records Found</p>
                  <p className="text-xs text-gray-400 mt-1">No references have been provided for this candidate.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default View;
