import React, { useState, useRef, useEffect } from "react";

import {
  Plus,
  Upload,
  FileText,
  FileSpreadsheet,
  FileDown,
  UserPlus,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function ClientPageHeader({
  showCreateButton = true,
  showExportButton = true,
  createType = "client",
  onExport,
}) {
  const navigate = useNavigate();

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const exportBtnRef = useRef(null);
  const createBtnRef = useRef(null);

  /* ───────────────── CLOSE OUTSIDE ───────────────── */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportBtnRef.current &&
        !exportBtnRef.current.contains(event.target)
      ) {
        setShowExportModal(false);
      }
    };

    if (showExportModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportModal]);

  /* CREATE DROPDOWN CLOSE OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        createBtnRef.current &&
        !createBtnRef.current.contains(event.target)
      ) {
        setShowCreateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ───────────────── BUTTON TEXT ───────────────── */
  const buttonText =
    createType === "vendor"
      ? "Create Vendor"
      : createType === "hr"
        ? "Create HR"
        : createType === "candidate"
          ? "Create Candidate"
          : "Create Client";

  /* ───────────────── CREATE ───────────────── */
  const handleCreate = () => {
    if (createType === "vendor") {
      navigate("/super-admin/create-vendor");
    } else if (createType === "hr") {
      navigate("/super-admin/create-hr");
    } else if (createType === "candidate") {
      navigate("/super-admin/create-candidate");
    } else {
      navigate("/super-admin/create-client");
    }
  };

  /* ───────────────── DOWNLOAD ───────────────── */
  const handleDownload = () => {
    if (onExport && selectedType) {
      onExport(selectedType);
    }
    setShowExportModal(false);
  };

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = storedUser.name || storedUser.first_name || "Admin";

  return (
    <div className="flex items-start justify-between mb-6">
      {/* ───────────────── LEFT ───────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Welcome Back, {adminName}! 👋
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Manage Platform Operations Seamlessly.
        </p>
      </div>

      {/* ───────────────── RIGHT ───────────────── */}
      {(showCreateButton || showExportButton) && (
        <div className="flex items-center gap-3">
          {/* CREATE BUTTON */}
          {showCreateButton && (
            <div className="relative" ref={createBtnRef}>
              {/* DROPDOWN */}

              {showCreateButton && (
                <div className="relative" ref={createBtnRef}>
                  <button
                    type="button"
                    onClick={() => {
                      if (createType === "candidate") {
                        setShowCreateDropdown(!showCreateDropdown);
                      } else {
                        handleCreate();
                      }
                    }}
                    className="flex items-center gap-2 bg-[#0A0F8F] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#090d75] transition"
                  >
                    <Plus size={18} />
                    {buttonText}
                  </button>

                  {/* DROPDOWN */}
                  {showCreateDropdown && createType === "candidate" && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-3xl shadow-xl z-50 p-2">
                      
                      {/* SINGLE */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/super-admin/create-candidate");
                          setShowCreateDropdown(false);
                        }}
                        className="w-full flex items-center gap-4 px-3 py-3 text-left hover:bg-gray-50 rounded-2xl transition"
                      >
                        <div className="w-10 h-10 bg-[#f4f5fa] text-[#01026E] flex items-center justify-center rounded-[14px] shrink-0">
                          <UserPlus size={18} strokeWidth={2} />
                        </div>
                        <span className="text-[#01026E] font-medium text-base">
                          Add Single
                        </span>
                      </button>

                      <div className="h-px bg-gray-100 my-1 mx-3" />

                      {/* BULK */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/super-admin/create-candidate-bulk");
                          setShowCreateDropdown(false);
                        }}
                        className="w-full flex items-center gap-4 px-3 py-3 text-left hover:bg-gray-50 rounded-2xl transition"
                      >
                        <div className="w-10 h-10 bg-[#f4f5fa] text-[#01026E] flex items-center justify-center rounded-[14px] shrink-0">
                          <Users size={18} strokeWidth={2} />
                        </div>
                        <span className="text-[#01026E] font-medium text-base">
                          Add in Bulk
                        </span>
                      </button>
                      
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* EXPORT */}
          {showExportButton && (
            <div className="relative" ref={exportBtnRef}>
              {/* EXPORT BUTTON */}
              <button
                type="button"
                onClick={() => setShowExportModal(!showExportModal)}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition shadow-sm"
              >
                <Upload size={16} />
                Export
              </button>

              {/* ───────────────── EXPORT MODAL ───────────────── */}
              {showExportModal && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-62.5 z-50"
                >
                  {/* TITLE */}
                  <h2 className="text-sm font-bold text-gray-900 mb-4">
                    Select File Type
                  </h2>

                  {/* FILE TYPES */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* PDF */}
                    <button
                      type="button"
                      onClick={() => setSelectedType("PDF")}
                      className={`flex flex-col items-center justify-center gap-1 border rounded-xl p-3 transition ${
                        selectedType === "PDF"
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <FileText size={22} className="text-indigo-600" />

                      <span className="text-xs font-medium text-gray-700">
                        PDF
                      </span>
                    </button>

                    {/* CSV */}
                    <button
                      type="button"
                      onClick={() => setSelectedType("CSV")}
                      className={`flex flex-col items-center justify-center gap-1 border rounded-xl p-3 transition ${
                        selectedType === "CSV"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <FileDown size={22} className="text-orange-500" />

                      <span className="text-xs font-medium text-gray-700">
                        CSV
                      </span>
                    </button>
                  </div>

                  {/* DOWNLOAD BUTTON */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!selectedType}
                    className={`w-full py-2.5 rounded-lg text-sm text-white font-semibold transition ${
                      selectedType
                        ? "bg-indigo-700 hover:bg-indigo-800"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}