import { Download, Plus, FileText, UserPlus, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({
  title,
  subtitle = "Let's Customize Your Workspace",
  showExport = true,
  showCreateHR = false,
  showCreateCandidate = false,
  onExport,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayTitle = title || `Welcome Back ${user.name || "User"} 👋🏻`;
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState("pdf");

  const navigate = useNavigate();
  const exportRef = useRef(null);
  const candidateRef = useRef(null);

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportModal(false);
      }
      if (candidateRef.current && !candidateRef.current.contains(e.target)) {
        setShowCandidateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-start justify-between mb-3">

      {/* LEFT */}
      <div>
        <h1 className="text-[24px] font-bold text-black leading-tight">{displayTitle}</h1>
        <p className="text-[14px] text-gray-600 mt-0.5">{subtitle}</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* CREATE HR BUTTON */}
        {showCreateHR && (
          <button
            onClick={() => navigate("/admin/create-hr")}
            className="flex items-center gap-2 bg-[#02027A] hover:bg-[#00005E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Plus size={18} />
            Create HR
          </button>
        )}

        {/* CREATE CANDIDATE BUTTON + DROPDOWN */}
        {showCreateCandidate && (
          <div className="relative" ref={candidateRef}>
            <button
              onClick={() => setShowCandidateDropdown((p) => !p)}
              className="flex items-center gap-2 bg-[#02027A] hover:bg-[#00005E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Plus size={18} />
              Create Candidate
            </button>

            {/* DROPDOWN */}
            {showCandidateDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">

                {/* ADD SINGLE */}
                <button
                  onClick={() => {
                    setShowCandidateDropdown(false);
                    navigate("/admin/create-candidate");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-[#02027A] transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <UserPlus size={15} className="text-[#02027A]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Add Single</p>
                  </div>
                </button>

                <div className="mx-3 border-t border-gray-100" />

                {/* ADD IN BULK */}
                <button
                  onClick={() => {
                    setShowCandidateDropdown(false);
                    navigate("/admin/create-candidate-bulk");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-[#02027A] transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Users size={15} className="text-[#02027A]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Add in Bulk</p>
                  </div>
                </button>

              </div>
            )}
          </div>
        )}

        {/* EXPORT BUTTON */}
        {showExport && (
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setShowExportModal(!showExportModal)}
              className="flex items-center gap-2 border border-[#02027A] text-[#02027A] hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Download size={18} />
              Export
            </button>

            {/* EXPORT MODAL */}
            {showExportModal && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] z-50 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Select file type
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {/* PDF */}
                  <div
                    onClick={() => setSelectedType("pdf")}
                    className={`flex flex-col items-center justify-center gap-2 border rounded-xl px-3 py-4 cursor-pointer transition-all ${
                      selectedType === "pdf"
                        ? "border-[#01026E] bg-indigo-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={22} className="text-red-500" />
                    <span className="text-xs font-medium text-gray-700">PDF</span>
                  </div>

                  {/* CSV */}
                  <div
                    onClick={() => setSelectedType("csv")}
                    className={`flex flex-col items-center justify-center gap-2 border rounded-xl px-3 py-4 cursor-pointer transition-all ${
                      selectedType === "csv"
                        ? "border-[#01026E] bg-indigo-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={22} className="text-emerald-500" />
                    <span className="text-xs font-medium text-gray-700">CSV</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (onExport) onExport(selectedType);
                      setShowExportModal(false);
                    }}
                    className="bg-[#01026E] hover:bg-[#00005E] text-white px-5 py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileHeader;